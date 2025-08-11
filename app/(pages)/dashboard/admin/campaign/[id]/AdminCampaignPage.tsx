'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ICampaign } from '../../../../../lib/models/campaign';
import { IVideo } from '../../../../../lib/models/video';
import {
  Alert,
  AlertIcon,
  Box,
  Center,
  Divider,
  Heading, SimpleGrid,
  Spinner,
  Text, useToast,
  VStack,
} from '@chakra-ui/react'
import UnapprovedVideoCard from '#components/app/UnapprovedVideoCard/UnapprovedVideoCard'
import AdminVideoCard from '#components/app/AdminVideoCard/AdminVideoCard'

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

  const handleDeleteVideo = async (videoId: string) => {
    try {
      const res = await fetch(
        `/api/campaign/video/delete`,
        { method: 'DELETE',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: JSON.stringify({ videoId: videoId, campaignId: campaignId }),
        }
      );
      if (!res.ok) {
        toast({
          title: 'Failed!',
          description: 'Failed to remove the video.',
          status: 'error', // "success" | "error" | "warning" | "info"
          duration: 3000, // milliseconds
          isClosable: true,
          position: 'top-right', // "top", "top-right", "bottom-left", etc.
        });        return;
      }
      toast({
        title: 'Video deleted.',
        description: 'The video has been successfully removed.',
        status: 'success', // "success" | "error" | "warning" | "info"
        duration: 3000, // milliseconds
        isClosable: true,
        position: 'top-right', // "top", "top-right", "bottom-left", etc.
      });
      setVideos((prev) => prev?.filter((v) => v.id !== videoId) || null);
    } catch (err) {
      console.error(err);
      setError('Error deleting video: ' + err);
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

      <Divider />

      {videos && videos.length > 0 ? (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6} w="100%">
          {videos?.map((video) => (
            <AdminVideoCard
              key={video.id}
              video={video}
              onDelete={handleDeleteVideo}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Text color="gray.500">Nema videa u ovoj kampanji.</Text>
      )}
    </VStack>
  );
};

export default AdminCampaignPage;