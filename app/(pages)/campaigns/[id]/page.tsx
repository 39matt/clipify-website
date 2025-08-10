'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Box,
  Image,
  Text,
  VStack,
  Progress,
  Heading,
  Divider,
  Spinner,
  Center,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Card,
  CardBody,
  CardHeader,
  Button,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  useDisclosure,
  ModalFooter,
  Flex,
  SimpleGrid,
  AspectRatio,
  Badge,
} from '@chakra-ui/react';
import { FaMeh, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { useLayoutContext } from '../../dashboard/context';
import { IVideo } from '../../../lib/models/video';
import { userAccountExists } from '../../../lib/firebase/firestore/account';
import { accountVideoExists, addVideo } from '../../../lib/firebase/firestore/video';
import { ICampaign } from '../../../lib/models/campaign'
import VideosSection from '#components/app/VideosSection/VideosSection'


const Page = () => {
  const pathname = usePathname();
  const campaignId = pathname.split('/').pop();
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVideos, setUserVideos] = useState<IVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [addingVideo, setAddingVideo] = useState(false);
  const { user, discordUsername } = useLayoutContext();
  const videoAgeInHours = 24;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [videoUrl, setVideoUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!campaignId || Array.isArray(campaignId)) return;

    const fetchData = async () => {
      try {

        setLoading(true);
        const campaignResp = await fetch(`/api/campaign/get?id=${campaignId}`, {
          method: 'GET',
        });
        const responseJson =  await campaignResp.json();
        const camp = responseJson.campaign as ICampaign
        console.log(camp);
        setCampaign(camp);
        setLoading(false);

        // Fetch user videos
        setVideosLoading(true);
        const response = await fetch(
          `/api/campaign/get-user-videos?campaignId=${campaignId}&userId=${discordUsername}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }
        );

        if (response.ok) {
          const data = await response.json();
          let videos: IVideo[] = [];

          // Handle different response formats
          if (Array.isArray(data)) {
            videos = data;
          } else if (data && Array.isArray(data.videos)) {
            videos = data.videos;
          } else if (data && data.message) {
            // Handle the case where API returns {message: "No videos found!"}
            videos = [];
          } else if (data && typeof data === 'object') {
            // Make sure it's a valid video object, not just any object
            if (data.id || data.accountName || data.views !== undefined) {
              videos = [data];
            } else {
              videos = [];
            }
          } else {
            console.warn('Unexpected API response format:', data);
            videos = [];
          }

          console.log('Processed videos:', videos);
          setUserVideos(videos);
          setVideosLoading(false);
        } else {
          console.error('Failed to fetch videos');
          setUserVideos([]);
          setVideosLoading(false);
        }

      } catch (err) {
        console.error('Error loading data:', err);
        setError('Došlo je do greške prilikom učitavanja podataka.');
        setUserVideos([]);
      }
    };

    fetchData();
  }, [campaignId, discordUsername]);

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) {
      setMessage('Molimo unesite URL videa.');
      return;
    }

    try {
      setAddingVideo(true);
      setMessage('');

      const rawVideoUrl = videoUrl.split("?")[0]
      // Validate URL
      const instagramReelRegex = /^https:\/\/(www\.)?instagram\.com\/(reel|p)\/[a-zA-Z0-9_-]+\/?$/;
      const tiktokVideoRegex = /^https:\/\/(www\.)?tiktok\.com\/@?[a-zA-Z0-9_.]+\/video\/[0-9]+\/?$/;

      if (!instagramReelRegex.test(rawVideoUrl) && !tiktokVideoRegex.test(rawVideoUrl)) {
        setMessage('Molimo vas unesite validan Instagram/TikTok video URL.');
        return;
      }

      let accountName = "";
      let video: IVideo | null = null;

      if (rawVideoUrl.includes('tiktok')) {
        accountName = videoUrl.split('/')[3].replace("@", '');
        const videoId = rawVideoUrl.split('/')[5];

        // Check if user owns account
        const accExists = await userAccountExists(discordUsername!, accountName, "TikTok");
        if (!accExists) {
          setMessage("Nalog mora biti vaš!");
          return;
        }

        // Check if video already exists
        const videoExists = await accountVideoExists(discordUsername!, accountName, "TikTok", rawVideoUrl);
        if (videoExists) {
          setMessage("Video je već dodat!");
          return;
        }

        // Fetch video info
        const response = await fetch('/api/campaign/video/get-info', {
          method: "PUT",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform: "TikTok",
            videoId,
            api_key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY!
          })
        });

        const responseJson = await response.json();
        video = responseJson.videoInfo as IVideo;

      } else if (rawVideoUrl.includes('instagram')) {
        const videoId = rawVideoUrl.split('/')[4];

        // Fetch video info
        const response = await fetch('/api/campaign/video/get-info', {
          method: "PUT",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform: "Instagram",
            rawVideoUrl,
            api_key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY!
          })
        });

        const responseJson = await response.json();
        video = responseJson.videoInfo as IVideo;

        if (!video) {
          setMessage("Greška pri pribavljanju videa!");
          return;
        }

        accountName = video.accountName;

        // Check if user owns account
        const accExists = await userAccountExists(discordUsername!, accountName, "Instagram");
        if (!accExists) {
          setMessage("Nalog mora biti vaš!");
          return;
        }

        // Check if video already exists
        const videoExists = await accountVideoExists(discordUsername!, accountName, "Instagram", rawVideoUrl);
        if (videoExists) {
          setMessage("Video je već dodat!");
          return;
        }
      }

      if (!video) {
        setMessage("Greška pri pribavljanju videa!");
        return;
      }

      const createdAt = new Date(video?.createdAt!)
      const currentTime = new Date()
      if(currentTime.getTime() - createdAt.getTime() > videoAgeInHours * 60 * 60 * 1000) {
        setMessage(`Video je stariji od ${videoAgeInHours}h`)
        return
      }
      const response = await fetch('/api/campaign/video/add', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video: video,
          campaignId: campaignId,
          accId: accountName,
          uid: discordUsername,
        })
      });

      if (response.ok) {
        setMessage('Video je uspešno dodat!');
        setVideoUrl('');

        // Refresh videos from server instead of just adding to local state
        const videosResponse = await fetch(
          `/api/campaign/get-user-videos?campaignId=${campaignId}&userId=${discordUsername}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          }
        );

        if (videosResponse.ok) {
          const data = await videosResponse.json();
          const videos = Array.isArray(data) ? data : data.videos || [];
          setUserVideos(videos);
        }
      }
    } catch (error) {
      console.error('Error adding video:', error);
      setMessage('Došlo je do greške prilikom dodavanja videa.');
    } finally {
      setAddingVideo(false);
    }
  };

  if (loading) {
    return (
      <Center minH="100vh" flex={1} flexDirection="column">
        <Spinner size="xl" />
        <Text mt={4} fontSize="lg" color="gray.500">
          Učitavanje kampanje...
        </Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="100vh">
        <Text color="red.500" fontSize="lg">
          {error}
        </Text>
      </Center>
    );
  }

  if (!campaign) {
    return (
      <Center minH="100vh">
        <Text color="gray.500" fontSize="lg">
          Kampanja nije pronađena.
        </Text>
      </Center>
    );
  }

  return (
    <Box
      bg="gray.900"
      color="white"
      maxH="90vh"
      w="full"
      maxW="1200px"
      mx="auto"
      px={4}
    >
      <Box
        position="relative"
        bg="gray.800"
        borderRadius="lg"
        p={16}
        mb={6}
        textAlign="center"
        boxShadow="lg"
        overflow="hidden"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          bgImage={`url(${campaign.imageUrl})`}
          bgSize="cover"
          bgPosition="top"
          filter="blur(8px)"
          opacity={0.6}
        />
        <Heading size="4xl" mb={2} opacity={1}>
          {campaign.influencer}
        </Heading>
        <Text fontSize="lg" color="gray.300" opacity={1}>
          {campaign.activity}
        </Text>
      </Box>

      <VStack spacing={6}>
        <Card w="full" bg="gray.800" borderRadius="lg" boxShadow="lg" p={6}>
          <CardHeader textAlign="center">
            <Heading size="xl" color="green.400" mb={4}>
              Cena po milion pregleda
            </Heading>
          </CardHeader>
          <CardBody textAlign="center">
            <Text fontSize="6xl" fontWeight="bold">
              ${campaign.perMillion.toFixed(2)}
            </Text>
            <Text fontSize="sm" color="gray.400" mb={4}>
              Po milion pregleda na svim podržanim platformama
            </Text>
            <Button colorScheme="green" size="lg" onClick={onOpen}>
              Pošalji sadržaj
            </Button>
            <Divider my={4} />
            <Text fontSize="sm" color="gray.400" mb={2}>
              Kako ocenjujete ovu kampanju?
            </Text>
            <HStack justify="center" spacing={4}>
              <IconButton
                icon={<FaThumbsUp />}
                aria-label="Sviđa mi se"
                colorScheme="green"
                variant="outline"
              />
              <IconButton
                icon={<FaMeh />}
                aria-label="Neutralno"
                colorScheme="yellow"
                variant="outline"
              />
              <IconButton
                icon={<FaThumbsDown />}
                aria-label="Ne sviđa mi se"
                colorScheme="red"
                variant="outline"
              />
            </HStack>
          </CardBody>
        </Card>

        <Flex justify="center" gap={4} width="full" flexDirection={{ base: "column", md: "row" }}>
          <Card bg="gray.800" borderRadius="lg" boxShadow="lg" p={6} flex="1">
            <CardHeader textAlign="center">
              <Heading size="lg" color="green.400" mb={4}>
                Napredak kampanje
              </Heading>
            </CardHeader>
            <CardBody>
              <StatGroup>
                <Stat>
                  <StatLabel>Ukupan budžet</StatLabel>
                  <StatNumber>${campaign.budget}</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Iskorišćeno</StatLabel>
                  <StatNumber>${campaign.moneySpent?.toFixed(2)}</StatNumber>
                </Stat>
              </StatGroup>
              <Progress
                value={campaign.progress}
                colorScheme="green"
                size="lg"
                mt={4}
              />
              <Text fontSize="sm" color="gray.400" mt={2} textAlign="center">
                {campaign.progress.toFixed(2)}% Završeno
              </Text>
            </CardBody>
          </Card>

          <Card bg="gray.800" borderRadius="lg" boxShadow="lg" p={6} flex="1">
            <CardHeader textAlign="center">
              <Heading size="lg" color="green.400" mb={4}>
                Detalji kampanje
              </Heading>
            </CardHeader>
            <CardBody textAlign="center">
              <Stat>
                <StatLabel>Maksimalan broj prijava</StatLabel>
                <StatNumber>{campaign.maxSubmissions} po nalogu</StatNumber>
              </Stat>
              <Divider my={4} />
              <Stat>
                <StatLabel>Maksimalna zarada</StatLabel>
                <StatNumber>${campaign.maxEarnings}</StatNumber>
              </Stat>
              <Divider my={4} />
              <Stat>
                <StatLabel>Maksimalna zarada po objavi</StatLabel>
                <StatNumber>${campaign.maxEarningsPerPost}</StatNumber>
              </Stat>
            </CardBody>
          </Card>
        </Flex>

        <VideosSection userVideos={userVideos} videosLoading={videosLoading} />
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Dodajte Video</ModalHeader>
          <ModalCloseButton isDisabled={addingVideo} />
          <ModalBody>
            <Text mb={4}>Unesite URL vašeg videa:</Text>
            <Input
              placeholder="https://tiktok.com/@username/video/12345"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              _placeholder={{ color: 'gray.400' }}
              isDisabled={addingVideo}
            />
            {message && (
              <Text mt={4} color={message.includes('uspešno') ? 'green.400' : 'red.400'}>
                {message}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={handleAddVideo}
              isLoading={addingVideo}
              loadingText="Dodaje se..."
              isDisabled={addingVideo}
            >
              Dodajte Video
            </Button>
            <Button
              variant="ghost"
              onClick={onClose}
              isDisabled={addingVideo}
            >
              Otkaži
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Page;