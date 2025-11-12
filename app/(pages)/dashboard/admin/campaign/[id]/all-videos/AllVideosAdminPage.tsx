'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import AdminVideoCard from './components/AdminVideoCard';
import { ICampaign } from '../../../../../../lib/models/campaign';
import { IVideo } from '../../../../../../lib/models/video';
import { Share, Share2 } from 'lucide-react'

interface AdminCampaignPageProps {
  idToken: string;
}

const AllVideosAdminPage: React.FC<AdminCampaignPageProps> = ({ idToken }) => {
  const pathname = usePathname();
  const campaignId = pathname.split('/')[pathname.split('/').length - 2];
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [videos, setVideos] = useState<IVideo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState<'createdAt' | 'lastUpdatedAt'>(
    'createdAt'
  );
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
        setVideos(
          (responseJson['videos'] as IVideo[]).sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          )
        );
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
      const res = await fetch(`/api/campaign/video/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: JSON.stringify({ videoId: videoId, campaignId: campaignId }),
      });

      if (!res.ok) {
        toast({
          title: 'Failed!',
          description: 'Failed to remove the video.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      toast({
        title: 'Video deleted.',
        description: 'The video has been successfully removed.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });

      setVideos((prev) => prev?.filter((v) => v.id !== videoId) || null);
    } catch (err) {
      console.error(err);
      setError('Error deleting video: ' + err);
    }
  };

  const handleUpdateSingleVideo = async (video: IVideo) => {
    try {
      const getVideoResponse = await fetch('/api/campaign/video/get-info', {
        method: 'PUT',
        body: JSON.stringify({
          platform: video.link.includes('instagram') ? 'Instagram' : 'TikTok',
          videoId: video.link.split('/')[5],
          videoUrl: video.link,
          api_key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
        }),
      });

      if (getVideoResponse.status !== 200) {
        toast({
          title: 'Error!',
          description: `Error getting video info for \n${video.name}`,
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      const getVideoResponseJson = await getVideoResponse.json();
      const newVideo = getVideoResponseJson['videoInfo'] as IVideo;

      if (!newVideo || !newVideo.accountName) {
        toast({
          title: 'Skipped.',
          description: `No valid data for ${video.name}.`,
          status: 'info',
          duration: 2500,
          isClosable: true,
          position: 'top-right',
        });
        return;
      }

      await fetch('/api/campaign/video/update-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ video: newVideo, campaignId }),
      });

      setVideos((prev) =>
        prev
          ? prev.map((v) =>
            v.id === video.id ? { ...v, ...newVideo } : v
          )
          : null
      );

      toast({
        title: 'Updated!',
        description: `Successfully updated ${video.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error updating views!',
        description: `${video.name}`,
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleUpdateViews = async () => {
    try {
      const updatedVideos: IVideo[] = [];
      for (const video of videos || []) {
        const getVideoResponse = await fetch('/api/campaign/video/get-info', {
          method: 'PUT',
          body: JSON.stringify({
            platform: video.link.includes('instagram') ? 'Instagram' : 'TikTok',
            videoId: video.link.split('/')[5],
            videoUrl: video.link,
            api_key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          }),
        });

        if (getVideoResponse.status !== 200) {
          toast({
            title: 'Error!',
            description: `Error getting video info for \n${video.name}`,
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: 'top-right',
          });
          continue;
        }

        const getVideoResponseJson = await getVideoResponse.json();
        const newVideo = getVideoResponseJson['videoInfo'] as IVideo;

        if (!newVideo || !newVideo.accountName) continue;

        await fetch('/api/campaign/video/update-info', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ video: newVideo, campaignId }),
        });

        updatedVideos.push(newVideo);
        toast({
          title: 'Success!',
          description: `Successfully updated video views for \n${video.name}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        });
      }

      setVideos(updatedVideos);
      await fetch('/api/campaign/calculate-progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error!',
        description: 'Error while updating video views.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
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

  const sortedVideos = (videos || []).sort((a, b) => {
    const field = sortOption;
    const aDate = new Date(a[field] || 0).getTime();
    const bDate = new Date(b[field] || 0).getTime();
    return bDate - aDate;
  });

  const totalViews = campaign.totalViews ?? 0;
  const totalLikes =
    videos?.reduce((acc, v) => acc + (v.likes || 0), 0) ?? 0;
  const totalShares =
    videos?.reduce((acc, v) => acc + (v.shares || 0), 0) ?? 0;
  const totalComments =
    videos?.reduce((acc, v) => acc + (v.comments || 0), 0) ?? 0;
  const videoCount = videos?.length ?? 0;

  return (
    <VStack spacing={6} width="90%" mx="auto" py={6}>
      <Heading textAlign="center" color="green.400">
        {campaign.influencer} - {campaign.activity}
      </Heading>

      <HStack spacing={6} w="full" mx="auto" py={6} flexWrap="wrap">
        {/* Total Views */}
        <Box
          bg="gray.700"
          p={6}
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.900"
          flex="1"
          minW="200px"
        >
          <Stat textAlign="center">
            <StatLabel fontSize="lg" color="gray.400">
              Ukupno pregleda
            </StatLabel>
            👁
            <StatNumber fontSize="3xl" color="white" fontWeight="bold">
              {totalViews.toLocaleString()}
            </StatNumber>
          </Stat>
        </Box>

        <Box
          bg="gray.700"
          p={6}
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.900"
          flex="1"
          minW="200px"
        >
          <Stat textAlign="center">
            <StatLabel fontSize="lg" color="gray.400">
              Ukupno lajkova
            </StatLabel>
              ❤️
            <StatNumber fontSize="3xl" color="white" fontWeight="bold">
              {totalLikes.toLocaleString()}
            </StatNumber>
          </Stat>
        </Box>

        <Box
          bg="gray.700"
          p={6}
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.900"
          flex="1"
          minW="200px"
        >
          <Stat textAlign="center">
            <StatLabel fontSize="lg" color="gray.400">
              Ukupno deljenja
            </StatLabel>
            🔄
            <StatNumber fontSize="3xl" color="white" fontWeight="bold">
              {totalShares.toLocaleString()}
            </StatNumber>
          </Stat>
        </Box>

        <Box
          bg="gray.700"
          p={6}
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.900"
          flex="1"
          minW="200px"
        >
          <Stat textAlign="center">
            <StatLabel fontSize="lg" color="gray.400">
              Ukupno komentara
            </StatLabel>
            💬
            <StatNumber fontSize="3xl" color="white" fontWeight="bold">
              {totalComments.toLocaleString()}
            </StatNumber>
          </Stat>
        </Box>

        <Box
          bg="gray.700"
          p={6}
          borderRadius="md"
          borderWidth="1px"
          borderColor="gray.900"
          flex="1"
          minW="200px"
        >
          <Stat textAlign="center">
            <StatLabel fontSize="lg" color="gray.400">
              Broj videa
            </StatLabel>
            #️⃣
            <StatNumber fontSize="3xl" color="white" fontWeight="bold">
              {videoCount}
            </StatNumber>
          </Stat>
        </Box>

        <Box w="fit-content">
          <Button
            colorScheme={'green'}
            ml={'auto'}
            size={'lg'}
            onClick={handleUpdateViews}
          >
            Update all views
          </Button>
        </Box>
      </HStack>

      <Divider />

      {/* Sort Buttons */}
      <HStack spacing={4} justify="flex-end" w="full" mb={4}>
        <Text color="gray.400" fontSize="sm">
          Sort by:
        </Text>
        <Button
          size="sm"
          colorScheme={sortOption === 'createdAt' ? 'blue' : 'gray'}
          variant={sortOption === 'createdAt' ? 'solid' : 'outline'}
          onClick={() => setSortOption('createdAt')}
        >
          Upload Date
        </Button>
        <Button
          size="sm"
          colorScheme={sortOption === 'lastUpdatedAt' ? 'blue' : 'gray'}
          variant={sortOption === 'lastUpdatedAt' ? 'solid' : 'outline'}
          onClick={() => setSortOption('lastUpdatedAt')}
        >
          Last Updated
        </Button>
      </HStack>

      {sortedVideos && sortedVideos.length > 0 ? (
        <SimpleGrid
          columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
          spacing={6}
          w="100%"
        >
          {sortedVideos.map((video) => (
            <AdminVideoCard
              key={video.id}
              video={video}
              onDelete={handleDeleteVideo}
              onUpdate={handleUpdateSingleVideo}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Text color="gray.500">Nema videa u ovoj kampanji.</Text>
      )}
    </VStack>
  );
};

export default AllVideosAdminPage;