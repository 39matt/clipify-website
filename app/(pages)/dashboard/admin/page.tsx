'use client';

import { NextPage } from 'next';
import { Box, Heading, VStack, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'
import { getAllCampaigns } from '../../../lib/firebase/firestore/campaign'

interface CampaignData {
  id: string;
  name: string;
  videoNumber: number;
}

const AdminPanel: NextPage = () => {
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const router = useRouter()

  useEffect(() => {
    const getCampaigns = async () => {
      const response = await fetch('/api/campaigns/get-all', {method: 'GET'});
      if(!response.ok) {
        throw new Error("Failed to fetch campaigns!")
      }
      const campaigns:ICampaign[] = await response.json()
      // const campaignsData: CampaignData[] = campaigns.map((campaign) => {
      //   const campaignData: CampaignData = {
      //     id: campaign.id,
      //     name: `${campaign.influencer} - ${campaign.activity}`,
      //     videoNumber: 1, // Replace with actual video number if available
      //   };
      //   return campaignData;
      // });
      setCampaigns(campaigns);
    };

    getCampaigns();
  }, []);

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
      <Box w="full" overflowX="auto">
        <Table variant="striped" colorScheme="green">
          <Thead>
            <Tr>
              <Th>Ime</Th>
              <Th>Broj videa</Th>
            </Tr>
          </Thead>
          <Tbody>
            {campaigns.map((campaign, index) => (
              <Tr
                key={index}
              >
                <Td>
                  <Text
                  onClick={()=>{router.push(`/dashboard/admin/campaign/${campaign.id}`)}}
                  _hover={{cursor:"pointer"}}
                  >
                    {campaign.influencer} - {campaign.activity}
                  </Text>
                </Td>
                <Td>2</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </VStack>
  );
};

export default AdminPanel;