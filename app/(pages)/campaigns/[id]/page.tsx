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
  ModalBody, Input, useDisclosure, ModalFooter,
} from '@chakra-ui/react'
import { getCampaign } from '../../../lib/firebase/firestore';
import { FaMeh, FaThumbsDown, FaThumbsUp } from 'react-icons/fa'

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
  const id = pathname.split('/').pop();
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [videoUrl, setVideoUrl] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const fetchCampaign = async () => {
      try {
        const camp = await getCampaign(id);
        setCampaign(camp);
      } catch (err) {
        console.error('Greška prilikom učitavanja kampanje:', err);
        setError('Došlo je do greške prilikom učitavanja kampanje.');
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

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

  const handleAddVideo = () => {
    if (!videoUrl) {
      setMessage('Molimo unesite validan URL.');
      return;
    }
    // Logic to handle video URL submission (e.g., save to database)
    setMessage('Video URL je uspešno dodat!');
    setVideoUrl('');
    onClose();
  };

  return (
    <Box bg="gray.900" color="white" maxH="100vh" p={6} minW="80vw">
      {/* Sekcija zaglavlja */}
      <Box
        position="relative" // Omogućava slojevitost za pozadinu i sadržaj
        bg="gray.800"
        borderRadius="lg"
        p={16}
        mb={6}
        textAlign="center"
        boxShadow="lg"
        overflow="hidden" // Sprečava sadržaj da prelazi granice kutije
      >
        {/* Pozadinska slika */}
        <Box
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          bgImage={`url(${campaign.imageUrl})`} // Koristi sliku kampanje kao pozadinu
          bgSize="cover" // Osigurava da slika pokriva celu kutiju
          bgPosition="center" // Centriraj sliku
          filter="blur(8px)" // Primeni efekat zamućenja
          opacity={0.6} // Potamni sliku
        />

        {/* Sadržaj */}
        <Heading size="4xl" mb={2} opacity={1}>
          {campaign.influencer}
        </Heading>
        <Text fontSize="lg" color="gray.300" opacity={1}>
          {campaign.activity}
        </Text>
      </Box>

      {/* Sekcija detalja kampanje */}
      <VStack spacing={6}>
        {/* Kartica 1: Cena po milion pregleda */}
        <Card w={"full"} bg="gray.800" borderRadius="lg" boxShadow="lg" p={6}>
          <CardHeader textAlign="center">
            <Heading as="h2" size="md" color="green.400" mb={4}>
              Cena po milion pregleda
            </Heading>
          </CardHeader>
          <CardBody textAlign="center">
            <Text fontSize="4xl" fontWeight="bold" color="green.400">
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
        <HStack justify="center" spacing={4} width="full">
          {/* First Card: Campaign Progress */}
          <Card
            bg="gray.800"
            borderRadius="lg"
            boxShadow="lg"
            p={6}
            flex="1" // Makes this card larger
          >
            <CardHeader textAlign="center">
              <Heading as="h2" size="md" color="green.400" mb={4}>
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

          {/* Second Card: Campaign Details */}
          <Card
            bg="gray.800"
            borderRadius="lg"
            boxShadow="lg"
            p={6}
            flex="1" // Makes this card smaller
          >
            <CardHeader textAlign="center">
              <Heading as="h2" size="md" color="green.400" mb={4}>
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
        </HStack>

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