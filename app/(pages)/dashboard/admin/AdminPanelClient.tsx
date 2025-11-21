'use client';

import {
  Box,
  Heading,
  VStack,
  Text,
  Spinner,
  Center,
  Card,
  SimpleGrid,
  useBreakpointValue,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICampaign } from '../../../lib/models/campaign'

export default function AdminPanelClient() {
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Responsive values
  const cardWidth = useBreakpointValue({ base: "280px", md: "320px" });
  const campaignCardHeight = useBreakpointValue({ base: "200px", md: "240px" });
  const userCardHeight = useBreakpointValue({ base: "56px", md: "64px" });
  const containerWidth = useBreakpointValue({ base: "95%", md: "90%", lg: "75%" });

  useEffect(() => {
    const getCampaigns = async () => {
      try {
        const response = await fetch('/api/campaign/get-all', {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch campaigns!');
        }

        const campaigns: ICampaign[] = await response.json();
        setCampaigns(campaigns);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
      } finally {
        setLoading(false);
      }
    };

    getCampaigns();
  }, []);

  if (loading) {
    return (
      <Center minH="100vh" px={4}>
        <VStack spacing={4}>
          <Spinner size="xl" color="green.400" />
          <Text>Loading campaigns...</Text>
        </VStack>
      </Center>
    );
  }

  return (
    <VStack
      minW="full"
      spacing={{ base: 6, md: 8 }}
      px={{ base: 4, md: 6 }}
      py={{ base: 4, md: 8 }}
    >
      {/* Header */}
      <Box textAlign="center">
        <Heading
          fontSize={{ base: '28px', md: '36px', lg: '48px' }}
          color="green.400"
        >
          Admin Panel
        </Heading>
      </Box>

      {/* Campaigns Section */}
      <VStack spacing={{ base: 4, md: 6 }} w="full">
        <Heading
          fontSize={{ base: 'xl', md: '2xl' }}
          textAlign="center"
        >
          Kampanje
        </Heading>

        <Box w={containerWidth} maxW="1200px">
          {campaigns.length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, md: 2, lg: 3 }}
              spacing={{ base: 4, md: 6 }}
              justifyItems="center"
            >
              {campaigns.map((campaign) => (
                <Card
                  key={campaign.id}
                  w={cardWidth}
                  h={campaignCardHeight}
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  bg="green.500"
                  color="white"
                  cursor="pointer"
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-2px)',
                    shadow: 'lg',
                    bg: 'green.600'
                  }}
                  onClick={() => router.push(`/dashboard/admin/campaign/${campaign.id}`)}
                  p={4}
                >
                  <Text
                    textAlign="center"
                    fontSize={{ base: 'sm', md: 'md' }}
                    fontWeight="medium"
                  >
                    {campaign.influencer} {campaign.influencer == 'Cjuree' && campaign.budget == 2000 ? "2" : ""} - {campaign.activity}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Center py={8}>
              <Text color="gray.500">No campaigns found</Text>
            </Center>
          )}
        </Box>
      </VStack>

      {/* Users Section */}
      <VStack spacing={{ base: 4, md: 6 }} w="full">
        <Heading
          fontSize={{ base: 'xl', md: '2xl' }}
          textAlign="center"
        >
          Korisnici
        </Heading>

        <Box w={containerWidth} maxW="1200px">
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 3 }}
            spacing={{ base: 4, md: 6 }}
            justifyItems="center"
          >
            <Card
              w={cardWidth}
              h={userCardHeight}
              display="flex"
              justifyContent="center"
              alignItems="center"
              bg="blue.500"
              color="white"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
                bg: 'blue.600'
              }}
              onClick={() => router.push('/dashboard/admin/users')}
            >
              <Text fontWeight="medium" fontSize={{ base: 'sm', md: 'md' }}>
                Korisnici
              </Text>
            </Card>

            <Card
              w={cardWidth}
              h={userCardHeight}
              display="flex"
              justifyContent="center"
              alignItems="center"
              bg="blue.500"
              color="white"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
                bg: 'blue.600'
              }}
              onClick={() => router.push('/dashboard/admin/payouts')}
            >
              <Text fontWeight="medium" fontSize={{ base: 'sm', md: 'md' }}>
                Isplate
              </Text>
            </Card>

            <Card
              w={cardWidth}
              h={userCardHeight}
              display="flex"
              justifyContent="center"
              alignItems="center"
              bg="blue.500"
              color="white"
              cursor="pointer"
              transition="all 0.2s"
              _hover={{
                transform: 'translateY(-2px)',
                shadow: 'lg',
                bg: 'blue.600'
              }}
              onClick={() => router.push('/dashboard/admin/affiliates')}
            >
              <Text fontWeight="medium" fontSize={{ base: 'sm', md: 'md' }}>
                Affiliates
              </Text>
            </Card>
          </SimpleGrid>
        </Box>
      </VStack>
    </VStack>
  );
}