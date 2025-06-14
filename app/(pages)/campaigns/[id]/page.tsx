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
  CardFooter, Spacer,
} from '@chakra-ui/react';
import { getCampaign } from '../../../lib/firebase/firestore';

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

  useEffect(() => {
    if (!id || Array.isArray(id)) return;

    const fetchCampaign = async () => {
      try {
        const camp = await getCampaign(id);
        setCampaign(camp);
      } catch (err) {
        console.error('Error fetching campaign:', err);
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

  return (
      <Box maxW="900px" mx="auto" p={6}>
        <Card boxShadow="lg" borderRadius="lg">
          <CardHeader>
            <Heading as="h1" size="lg" textAlign="center" mb={4}>
              {campaign.influencer} - {campaign.activity}
            </Heading>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Kreirano: {new Date(campaign.createdAt).toLocaleDateString('sr-RS')}
            </Text>
          </CardHeader>
          <CardBody>
            <Image
                src={campaign.imageUrl}
                alt={`Slika kampanje ${campaign.activity}`}
                borderRadius="lg"
                mb={6}
                boxShadow="md"
            />
            <StatGroup mb={6}>
              <Stat>
                <StatLabel>Influenser</StatLabel>
                <StatNumber>{campaign.influencer}</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Budžet</StatLabel>
                <StatNumber>{campaign.budget} RSD</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Po milion pregleda</StatLabel>
                <StatNumber>{campaign.perMillion} RSD</StatNumber>
              </Stat>
            </StatGroup>
            <StatGroup mb={6}>
              <Stat>
                <StatLabel>Maksimalna zarada</StatLabel>
                <StatNumber>{campaign.maxEarnings} RSD</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Maksimalna zarada po objavi</StatLabel>
                <StatNumber>{campaign.maxEarningsPerPost} RSD</StatNumber>
              </Stat>
              <Stat>
                <StatLabel>Maksimalan broj prijava</StatLabel>
                <StatNumber>{campaign.maxSubmissions}</StatNumber>
              </Stat>
            </StatGroup>
            <StatGroup mb={6}>
              <Stat>
                <StatLabel>Minimalan broj pregleda za isplatu</StatLabel>
                <StatNumber>{campaign.minViewsPerPayout}</StatNumber>
              </Stat>
            </StatGroup>
            <Divider my={6} />
            <Text fontSize="lg" mb={2}>
              <strong>Napredak kampanje:</strong>
            </Text>
            <Progress value={campaign.progress} colorScheme="blue" size="lg" />
            <Text fontSize="sm" color="gray.500" mt={2}>
              {campaign.progress}% završen
            </Text>
          </CardBody>
          <CardFooter>
            <Center>
              <Text fontSize="sm" color="gray.400">
                {/*Kampanja ID: {campaign.id}*/}
              </Text>
            </Center>
          </CardFooter>
        </Card>
      </Box>
  );
};

export default Page;