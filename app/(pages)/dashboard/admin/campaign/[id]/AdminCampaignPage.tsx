'use client';

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { ICampaign } from '../../../../../lib/models/campaign';
import { IVideo } from '../../../../../lib/models/video';
import { Button, ButtonGroup,
  Center,
  Heading,
  Spinner,
  Text, useToast,
  VStack,
} from '@chakra-ui/react'

interface AdminCampaignPageProps {
  idToken: string;
}

const AdminCampaignPage: React.FC<AdminCampaignPageProps> = ({ idToken }) => {
  const pathname = usePathname();
  const campaignId = pathname.split('/').pop();
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [videos, setVideos] = useState<IVideo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!campaignId) {
          setLoading(false);
          setError('Campaign ID is missing');
          return;
        }
        const responseJson = await fetch(`/api/campaign/get?id=${campaignId}`, {
          method: 'GET',
        }).then((res) => res.json());

        setCampaign(responseJson['campaign']);
        setVideos(responseJson['videos'] as IVideo[]);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error('Error fetching campaign:', err);
        setError('Došlo je do greške prilikom učitavanja kampanje.');
      }
    };

    fetchData();
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

  return (
    <VStack spacing={6} width="90%" mx="auto" py={6}>
      <Heading textAlign="center" color="green.400">
        {campaign.influencer} - {campaign.activity}
      </Heading>


    <ButtonGroup w="50%">
      <Button
        w="full"
        h="96px"
        onClick={()=> router.push(`/dashboard/admin/campaign/${campaignId}/all-videos`)}
      >Svi videi</Button>
      <Button
        w="full"
        h="96px"
        onClick={()=> router.push(`/dashboard/admin/campaign/${campaignId}/unapproved-videos`)}
      >Neodobreni videi</Button>

    </ButtonGroup>
      <Button
        w="50%"
        h="96px"
        onClick={()=> router.push(`/dashboard/admin/campaign/${campaignId}/revenue-approval`)}
      >Unovcavanje odobrenih videa</Button>
      <Button
        w="50%"
        h="96px"
        onClick={()=> router.push(`/client/dashboard/${campaignId}`)}
      >Klijent dashboard</Button>

    </VStack>
  );
};

export default AdminCampaignPage;