'use client';

import {
  Box,
  Heading,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Spinner,
  Center, Button, Flex, Card, HStack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ICampaign } from '../../../lib/models/campaign'

export default function AdminPanelClient() {
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      <Center minH="100vh">
        <Spinner />
        <Text ml={4}>Loading campaigns...</Text>
      </Center>
    );
  }

  return (
    <VStack minW="full">
      <Box my={{ base: 4, md: 8 }}>
        <Heading
          textAlign="center"
          fontSize={{ base: '32px', md: '48px' }}
          textColor="green.400"
        >
          Admin Panel
        </Heading>
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
        <Heading>Kampanje</Heading>
        <Box
          w="75%"
          overflowX="auto"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {campaigns.map((campaign) => (
            <Card
              w="320px"
              h="240px"
              key={campaign.id}
              display="flex"
              justifyContent="center"
              alignItems="center"
              bg="green.500"
              _hover={{cursor: "pointer"}}
              onClick={()=> router.push(`/dashboard/admin/campaign/${campaign.id}`)}
            >
              <Text>{campaign.influencer} - {campaign.activity}</Text>
            </Card>
          ))}
          {/*<Table variant="striped" colorScheme="green">*/}
          {/*  <Thead>*/}
          {/*    <Tr>*/}
          {/*      <Th>Ime</Th>*/}
          {/*      /!*<Th>Broj videa</Th>*!/*/}
          {/*    </Tr>*/}
          {/*  </Thead>*/}
          {/*  <Tbody>*/}
          {/*    {campaigns.map((campaign, index) => (*/}
          {/*      <Tr key={index}*/}
          {/*          _hover={{ cursor: 'pointer' }}>*/}
          {/*        <Td>*/}
          {/*          <Text>*/}
          {/*            {campaign.influencer} - {campaign.activity}*/}
          {/*          </Text>*/}

          {/*        </Td>*/}
          {/*        <Td>*/}
          {/*          <Flex justify="space-around" align="flex-end" w="100%">*/}
          {/*            <Button*/}
          {/*              onClick={() => {*/}
          {/*                router.push(`/dashboard/admin/campaign/${campaign.id}/all-videos`);*/}
          {/*              }}>*/}
          {/*              Svi</Button>*/}
          {/*            <Button*/}
          {/*              onClick={() => {*/}
          {/*              router.push(`/dashboard/admin/campaign/${campaign.id}/unapproved`);*/}
          {/*            }}>*/}
          {/*              Neodobreni</Button>*/}
          {/*          </Flex>*/}
          {/*        </Td>*/}
          {/*        /!*<Td>2</Td>*!/*/}
          {/*      </Tr>*/}
          {/*    ))}*/}
          {/*  </Tbody>*/}
          {/*</Table>*/}
        </Box>
      </Box>
      <VStack justifyContent="center" alignItems="center">
        <Heading>Korisnici</Heading>
        <HStack spacing={2}>
          <Card
            w="320px"
            h="64px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg="blue.500"
            _hover={{cursor: "pointer"}}
            onClick={()=> router.push(`/dashboard/admin/users`)}
          >
            <Text>Korisnici</Text>
          </Card>
          <Card
            w="320px"
            h="64px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg="blue.500"
            _hover={{cursor: "pointer"}}
            onClick={()=> router.push(`/dashboard/admin/payouts`)}
          >
            <Text>Isplate</Text>
          </Card>
          <Card
            w="320px"
            h="64px"
            display="flex"
            justifyContent="center"
            alignItems="center"
            bg="blue.500"
            _hover={{cursor: "pointer"}}
            onClick={()=> router.push(`/dashboard/admin/affiliates`)}
          >
            <Text>Affiliates</Text>
          </Card>
        </HStack>
      </VStack>
    </VStack>
  );
}