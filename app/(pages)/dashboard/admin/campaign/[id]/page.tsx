'use client';

import {
  Box,
  Text,
  VStack,
  Heading,
  Divider,
  Spinner,
  Center,

} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLayoutContext } from '../../../context'
import { getCampaign } from '../../../../../lib/firebase/firestore/campaign'

const AccountPage = () => {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, loading, discordUsername } = useLayoutContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error('Campaign ID is missing');
        }
        const cmp = await getCampaign(id);
        setCampaign(cmp);


      } catch (err) {
        console.error('Error fetching campaign:', err);
        setError('Došlo je do greške prilikom učitavanja kampanje.');
      }
    };

    fetchData();
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
    <VStack minW="full">
      <Box my={{ base: 4, md: 8 }}>
        <Heading textAlign="center" fontSize={{ base: '32px', md: '48px' }} textColor="green.400">
          {campaign.influencer} - {campaign.activity}
        </Heading>
      </Box>

    </VStack>
  );
};

export default AccountPage;