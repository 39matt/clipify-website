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
  CardFooter,
  Spacer,
  Button,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody, Input, useDisclosure, ModalFooter, Flex,
} from '@chakra-ui/react'
import { FaMeh, FaThumbsDown, FaThumbsUp } from 'react-icons/fa'
import { useLayoutContext } from '../../dashboard/context'
import { IVideo } from '../../../lib/models/video'
import { getCampaign } from '../../../lib/firebase/firestore/campaign'
import { userAccountExists } from '../../../lib/firebase/firestore/account'
import { accountVideoExists, addVideo, getVideoInfo } from '../../../lib/firebase/firestore/video'

interface ICampaign {
  id: string;
  influencer: string;
  activity: string;
  imageUrl: string;
  progress: number;
  budget: string;
  perMillion: number;
  createdAt: string;
  maxEarnings: number;
  maxEarningsPerPost: number;
  maxSubmissions: number;
  minViewsPerPayout: number;
}

const Page = () => {
  const pathname = usePathname();
  const campaignId = pathname.split('/').pop();
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, discordUsername } = useLayoutContext();
  const videoAgeInHours = 24;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [videoUrl, setVideoUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!campaignId || Array.isArray(campaignId)) return;

    const fetchCampaign = async () => {
      try {
        const camp = await getCampaign(campaignId);
        setCampaign(camp);
      } catch (err) {
        console.error('Greška prilikom učitavanja kampanje:', err);
        setError('Došlo je do greške prilikom učitavanja kampanje.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignId]);

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

  const handleAddVideo = async () => {
    if (!videoUrl) {
      setMessage('Molimo unesite URL videa.');
      return;
    }
    // validate link
    const instagramReelRegex = /^https:\/\/(www\.)?instagram\.com\/reelsq\/[a-zA-Z0-9_-]+\/?$/;
    const tiktokVideoRegex = /^https:\/\/(www\.)?tiktok\.com\/@?[a-zA-Z0-9_.]+\/video\/[0-9]+\/?$/;
    if (!instagramReelRegex.test(videoUrl) && !tiktokVideoRegex.test(videoUrl)) {
      setMessage('Molimo vas unesite validan Instagram/TikTok video URL.');
      return;
    }

    let accountName = ""
    let video: IVideo | null = null

    // tiktok or instagram
    if(videoUrl.includes('tiktok')) {
      accountName = videoUrl.split('/')[3].replace("@", '');
      const videoId = videoUrl.split('/')[5];

      // check if user has account
      const accExists = await userAccountExists(discordUsername!, accountName, "TikTok");
      if(!accExists) {
        setMessage("Nalog mora biti vaš!");
        return
      }

      // check if video is already added
      const videoExists = await accountVideoExists(discordUsername!, accountName, "TikTok", videoUrl);
      if(videoExists) {
        setMessage("Video je već dodat!");
        return
      }

      // fetch video information
      video = await getVideoInfo(videoId, "TikTok", process.env.NEXT_PUBLIC_RAPIDAPI_KEY!);
      if(!video) {
        setMessage("Greška pri pribavljanju videa!")
        return
      }
    }
    else if(videoUrl.includes('instagram')){
      const videoId = videoUrl.split('/')[4];

      // fetch video information
      video = await getVideoInfo(videoId, "Instagram", process.env.NEXT_PUBLIC_RAPIDAPI_KEY!);
      if(!video) {
        setMessage("Greška pri pribavljanju videa!")
        return
      }

      accountName = video.accountName;

      // check if user has account
      const accExists = await userAccountExists(discordUsername!, accountName, "Instagram");
      if(!accExists) {
        setMessage("Nalog mora biti vaš!");
        return
      }

      // check if user has already added video
      const videoExists = await accountVideoExists(discordUsername!, accountName, "Instagram", videoUrl);
      if(videoExists) {
        setMessage("Video je već dodat!");
        return
      }
    }

    const createdAt = new Date(video?.createdAt!)
    const currentTime = new Date()
    if(currentTime.getTime() - createdAt.getTime() > videoAgeInHours * 60 * 60 * 1000) {
      setMessage(`Video je stariji od ${videoAgeInHours}h`)
      return
    }

    await addVideo(discordUsername!, accountName, campaignId!, video as IVideo);

    setMessage('Video je uspešno dodat!');
    setVideoUrl('');
    setTimeout(() => {
      onClose()
    }, 2000)
  };

  return (
    <Box bg="gray.900" color="white" maxH="90vh" minW="60vw">
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
        <Card w={"full"} bg="gray.800" borderRadius="lg" boxShadow="lg" p={6}>
          <CardHeader textAlign="center">
            <Heading size="xl" color="green.400" mb={4}>
              Cena po milion pregleda
            </Heading>
          </CardHeader>
          <CardBody textAlign="center">
            <Text fontSize="6xl" fontWeight="bold" >
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
        <Flex justify="center" gap={4} width="full" flexDirection={{base:"column", md:"row"}}>
          <Card
            bg="gray.800"
            borderRadius="lg"
            boxShadow="lg"
            p={6}
            flex="1"
          >
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
                  <StatNumber>${campaign.progress.toFixed(2)}</StatNumber>
                </Stat>
              </StatGroup>
              <Progress
                value={campaign.progress}
                colorScheme="green"
                size="lg"
                mt={4}
              />
              <Text fontSize="sm" color="gray.400" mt={2} textAlign="center">
                {campaign.progress}% Završeno
              </Text>
            </CardBody>
          </Card>

          <Card
            bg="gray.800"
            borderRadius="lg"
            boxShadow="lg"
            p={6}
            flex="1"
          >
            <CardHeader textAlign="center">
              <Heading size="lg" color="green.400" mb={4}>
                Detalji kampanje
              </Heading>
            </CardHeader>
            <CardBody>
              <StatGroup>
                <Stat>
                  <StatLabel>Maksimalan broj prijava</StatLabel>
                  <StatNumber>{campaign.maxSubmissions} po nalogu</StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Maksimalna zarada</StatLabel>
                  <StatNumber>{campaign.maxEarnings}</StatNumber>
                </Stat>
              </StatGroup>
              <Divider my={4} />
              <StatGroup>
                <Stat>
                  <StatLabel>Maksimalna zarada po objavi</StatLabel>
                  <StatNumber>${campaign.maxEarningsPerPost}</StatNumber>
                </Stat>
              </StatGroup>
            </CardBody>
          </Card>
        </Flex>

      </VStack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Dodajte Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Unesite URL vašeg videa:</Text>
            <Input
              placeholder="https://tiktok.com/@username/video/12345"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              _placeholder={{ color: 'gray.400' }}
            />
            {message && (
              <Text mt={4} color={message.includes('uspešno') ? 'green.400' : 'red.400'}>
                {message}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleAddVideo}>
              Dodajte Video
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Otkaži
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Page;