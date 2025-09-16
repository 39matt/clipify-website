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
} from '@chakra-ui/react';
import { FaMeh, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import AllVideosSection from "./components/AllVideosSection/AllVideosSection";
import YourVideosSection from "./components/YourVideosSection/YourVideosSection";
import { ICampaign } from '../../../../lib/models/campaign'
import { IVideo } from '../../../../lib/models/video'
import { useLayoutContext } from '../../../dashboard/context'


const Page = () => {
  const pathname = usePathname();
  const campaignId = pathname.split('/').pop();
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVideos, setUserVideos] = useState<IVideo[]>([]);
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const { user, discordUsername } = useLayoutContext();


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
        setVideos(vids);
        setCampaign(!camp.isActive ? camp : null);
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

    return (
      <Center minH="100vh">
        <Text color="gray.500" fontSize="lg">
          Kampanja nije pronađena.
        </Text>
      </Center>
    );


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
        <Card w="full" maxW="1200px" mx="auto" bg="gray.800" borderRadius="lg" boxShadow="lg" p={6}>
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

        <YourVideosSection userVideos={userVideos} videosLoading={videosLoading} />
        <AllVideosSection videos={videos} videosLoading={loading} />
      </VStack>
    </Box>
  );
};

export default Page;