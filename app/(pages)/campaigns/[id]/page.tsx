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
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { FaMeh, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { FaDiscord } from 'react-icons/fa';
import { useLayoutContext } from '../../dashboard/context';
import { IVideo } from '../../../lib/models/video';
import { userAccountExists } from '../../../lib/firebase/firestore/account';
import { ICampaign } from '../../../lib/models/campaign'
import AllVideosSection from "./components/AllVideosSection/AllVideosSection";
import YourVideosSection from "./components/YourVideosSection/YourVideosSection";


const Page = () => {
  const pathname = usePathname();
  const campaignId = pathname.split('/').pop();
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVideos, setUserVideos] = useState<IVideo[]>([]);
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [addingVideo, setAddingVideo] = useState(false);
  const { user, discordUsername } = useLayoutContext();
  const videoAgeInHours = 240;

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
        const vids = responseJson.videos as IVideo[]
        // setVideos(vids.sort((a, b) => b.views- a.views));
        setVideos(vids);

        setCampaign(camp.isActive ? camp : null);
        setLoading(false);

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

          if (Array.isArray(data)) {
            videos = data;
          } else if (data && Array.isArray(data.videos)) {
            videos = data.videos;
          } else if (data && data.message) {
            videos = [];
          } else if (data && typeof data === 'object') {
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
      setMessage("Molimo unesite URL videa.");
      return;
    }

    try {
      setAddingVideo(true);
      setMessage("");

      let rawVideoUrl = videoUrl.split("?")[0];

      const instagramReelRegex =
        /^https:\/\/(www\.)?instagram\.com\/(reel|reels|p)\/[a-zA-Z0-9_-]+\/?$/;
      const tiktokDesktopRegex =
        /^https:\/\/(www\.)?tiktok\.com\/@?[a-zA-Z0-9_.]+\/(?:video|photo)\/[0-9]+\/?$/
      const tiktokMobileRegex =
        /^https:\/\/[A-Za-z][A-Za-z]\.tiktok\.com\/[A-Za-z0-9]+\/?$/;

      let platform: string;
      if (instagramReelRegex.test(rawVideoUrl)) {
        platform = "Instagram";
      } else if (
        tiktokDesktopRegex.test(rawVideoUrl) ||
        tiktokMobileRegex.test(rawVideoUrl)
      ) {
        platform = "TikTok";
      } else {
        setMessage("Molimo vas unesite validan Instagram/TikTok video URL.");
        return;
      }

      const params = new URLSearchParams({
        campaignId: campaignId!,
        videoLink: rawVideoUrl,
      });

      // const existsRes = await fetch(
      //   `/api/campaign/video/exists?${params.toString()}`,
      //   {
      //     method: "GET",
      //     headers: { "Content-Type": "application/json" },
      //   }
      // );

      // if (!existsRes.ok) throw new Error("Failed to validate video");
      //
      // const existsData = await existsRes.json();
      // if (existsData.exists) {
      //   setMessage("Video je već dodat!");
      //   return;
      // }

      let accountName = "";
      let videoId = "";
      let video;

      if (platform === "TikTok") {
        let finalUrl = rawVideoUrl;

        if (tiktokMobileRegex.test(rawVideoUrl)) {
          const res = await fetch(
            `/api/resolve-tiktok?url=${encodeURIComponent(rawVideoUrl)}`
          );
          if (!res.ok) {
            setMessage("Greška pri pribavljanju videa!");
            return;
          }
          const data = await res.json();
          finalUrl = data.finalUrl;
        }

        const match = finalUrl.match(
          /tiktok\.com\/@([^\/]+)\/(?:video|photo)\/(\d+)/
        );
        if (!match) {
          setMessage("Format linka je pogrešan!");
          return;
        }

        accountName = match[1];
        videoId = match[2];

        const accExists = await userAccountExists(
          discordUsername!,
          accountName,
          "TikTok"
        );
        if (!accExists) {
          setMessage("Nalog mora biti vaš!");
          return;
        }

        const response = await fetch("/api/campaign/video/get-info", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform: "TikTok",
            videoId,
            api_key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          }),
        });

        const responseJson = await response.json();
        video = responseJson.videoInfo;
      }

      if (platform === "Instagram") {
        const response = await fetch("/api/campaign/video/get-info", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform: "Instagram",
            videoUrl: rawVideoUrl,
            api_key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          }),
        });

        const responseJson = await response.json();
        console.log(responseJson);
        video = responseJson.videoInfo;

        if (!video) {
          setMessage("Greška pri pribavljanju videa!");
          return;
        }

        accountName = video.accountName;

        // Check account ownership
        const accExists = await userAccountExists(
          discordUsername!,
          accountName,
          "Instagram"
        );
        if (!accExists) {
          setMessage("Nalog mora biti vaš!");
          return;
        }
      }

      // Validate video age
      if (!video) {
        setMessage("Greška pri pribavljanju videa");
        return;
      }

      const createdAt = new Date(video.createdAt);
      const currentTime = new Date();
      if (
        currentTime.getTime() - createdAt.getTime() >
        videoAgeInHours * 60 * 60 * 1000
      ) {
        setMessage(`Video je stariji od ${videoAgeInHours}h`);
        return;
      }

      const addRes = await fetch("/api/campaign/video/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          video,
          campaignId,
          accId: accountName,
          uid: discordUsername,
        }),
      });
      const addResJson = await addRes.json();
      if(!addRes.ok && addResJson["error"] == 'Video already exists') {
        setMessage("Video je već dodat!");
        return;
      }

      if (addRes.ok) {
        setMessage("Video je uspešno dodat!");
        setVideoUrl("");

        const videosResponse = await fetch(
          `/api/campaign/get-user-videos?campaignId=${campaignId}&userId=${discordUsername}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (videosResponse.ok) {
          const data = await videosResponse.json();
          const videos = Array.isArray(data) ? data : data.videos || [];
          setUserVideos(videos);
        }
      }
    } catch (error) {
      console.error("Error adding video:", error);
      setMessage("Došlo je do greške prilikom dodavanja videa.");
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
      // maxW="1200px"
      mx="auto"
      px={4}
      mt={16}
    >
      <Box
        position="relative"
        bg="gray.800"
        borderRadius="lg"
        maxW="1200px"
        mx="auto"
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
          bgPosition="center"
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
        <Card w="full" maxW="1200px" mx="auto" bg="gray.800" borderRadius="lg" boxShadow="lg" p={6}>
          <CardHeader textAlign="center">
            {!campaign.isPot &&
                <Heading size="xl" color="green.400" mb={4}>
                  Cena po milion pregleda
                </Heading>
            }
            {campaign.isPot &&
                <Heading size="xl" color="green.400" mb={4}>
                  POT sistem
                </Heading>
            }

          </CardHeader>
          <CardBody textAlign="center">
            {!campaign.isPot &&
                <Text fontSize="6xl" fontWeight="bold">
                  ${campaign.perMillion.toFixed(2)}
                </Text>
            }
            {campaign.isPot &&
                <Text fontSize="6xl" fontWeight="bold">
                  ${campaign.perMillionText}
                </Text>
            }

            {campaign.isPot &&
                <Text fontSize="sm" color="gray.400" mb={4}>
                  Budzet se deli medju kliperima tako da kliperi sa više pregleda dobijaju veći deo budzeta i obrnuto.
                </Text>
            }
            {!campaign.isPot &&
                <Text fontSize="sm" color="gray.400" mb={4}>
                  Po milion pregleda na svim podržanim platformama
                </Text>
            }

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
        <Flex w="full" maxW="1200px" mx="auto" justify="center" gap={4} width="full" flexDirection={{ base: "column", md: "row" }}>
          {!campaign.isPot &&
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

          }

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
        {campaign.discordInvite && (
          <Card
            w="full"
            maxW="1200px"
            mx="auto"
            bg="gray.800"
            borderRadius="lg"
            boxShadow="lg"
            p={6}
          >
            <CardHeader textAlign="center">
              <Heading size="lg" color="green.400" mb={2}>
                Opis kampanje
              </Heading>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <List spacing={3} mx="auto" >
                  <ListItem display="flex" alignItems="center">
                    <Text fontSize="xl" mr={3}>📋</Text>
                    <Text>Zatražite pristup kampanji na discord serveru!</Text>
                  </ListItem>
                </List>

                <Center pt={4}>
                  <Button
                    leftIcon={<FaDiscord />}
                    colorScheme="red"
                    bg="green.500"
                    _hover={{ bg: 'green.600' }}
                    size="lg"
                    onClick={() => window.open(campaign.discordInvite, '_blank')}
                  >
                    Pridruži se Discord serveru
                  </Button>
                </Center>
              </VStack>
            </CardBody>
          </Card>
        )}

        <YourVideosSection userVideos={userVideos} videosLoading={videosLoading} />
        <AllVideosSection videos={videos} videosLoading={loading} />


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