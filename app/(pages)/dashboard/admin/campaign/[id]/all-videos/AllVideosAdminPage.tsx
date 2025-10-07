'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button,
  Center,
  Divider,
  Heading, SimpleGrid,
  Spinner,
  Text, useToast,
  VStack,
} from '@chakra-ui/react'
import AdminVideoCard from './components/AdminVideoCard'
import { ICampaign } from '../../../../../../lib/models/campaign'
import { IVideo } from '../../../../../../lib/models/video'

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
        setVideos((responseJson['videos'] as IVideo[]).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
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
        });
        return;
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

  const handleUpdateViews = async () => {
    try {
      const updatedVideos:IVideo[] = [];
      for (const video of videos || []) {
        const getVideoResponse = await fetch('/api/campaign/video/get-info',
          {
            method: "PUT",
            body: JSON.stringify({
              platform:video.link.includes("instagram") ? "Instagram" : "TikTok",
              videoId: video.link.split('/')[5],
              videoUrl: video.link,
              api_key:process.env.NEXT_PUBLIC_RAPIDAPI_KEY!
            })
          }
        );

        if (getVideoResponse.status !== 200) {
          console.log("Error getting video info for: ", video)
          toast({
            title: 'Error!',
            description: `Error getting video info for \n${video.name}`,
            status: 'error', // "success" | "error" | "warning" | "info"
            duration: 3000, // milliseconds
            isClosable: true,
            position: 'top-right', // "top", "top-right", "bottom-left", etc.
          });
          continue;
        }

        const getVideoResponseJson = await getVideoResponse.json();
        const newVideo = getVideoResponseJson['videoInfo'] as IVideo;

        // if(!newVideo) {
        //   const deleteVideoResponse = await fetch('/api/campaign/video/delete', {
        //     method: "DELETE",
        //     body: JSON.stringify({
        //       videoId: video.id,
        //       campaignId: campaign.id,
        //     })
        //   })
        //   if (deleteVideoResponse.status !== 200) {
        //     toast({
        //       title: 'Error',
        //       description: `Error deleting video \n${video.name}`,
        //       status: 'error', // "success" | "error" | "warning" | "info"
        //       duration: 3000, // milliseconds
        //       isClosable: true,
        //       position: 'top-right', // "top", "top-right", "bottom-left", etc.
        //     });
        //     continue;
        //   }
        //   toast({
        //     title: 'Success',
        //     description: `Successfully deleted video that doesn't exist! \n${video.name}`,
        //     status: 'info', // "success" | "error" | "warning" | "info"
        //     duration: 3000, // milliseconds
        //     isClosable: true,
        //     position: 'top-right', // "top", "top-right", "bottom-left", etc.
        //   });
        //   continue;
        // }


        if(!newVideo || !newVideo.accountName) {
          continue
        }
        const updateVideoResponse = await fetch('/api/campaign/video/update-info', {method: 'PUT',
          headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
          },
          body: JSON.stringify({video:newVideo, campaignId}) });
        if(updateVideoResponse.status !== 200) {
          console.error('Error updating video');
          continue
        }
        const matchingVideo = videos?.find((vid) =>  vid.link === newVideo.link );
        if (matchingVideo) {
          newVideo.userAccountRef = matchingVideo.userAccountRef;
          newVideo.uid = matchingVideo.uid;
          newVideo.id = matchingVideo.id;
        }
        updatedVideos.push(newVideo);
        toast({
          title: 'Success!',
          description: `Successfully updated video views for \n${video.name}`,
          status: 'success', // "success" | "error" | "warning" | "info"
          duration: 3000, // milliseconds
          isClosable: true,
          position: 'top-right', // "top", "top-right", "bottom-left", etc.
        });
      }

      const response = await fetch('/api/campaign/calculate-progress', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          campaignId: campaignId,
        }),
      })
      console.log(response)
      setVideos(updatedVideos);
    } catch(error) {
      console.error(error);
      toast({
        title: 'Error!',
        description: 'Error while updating video views.',
        status: 'error', // "success" | "error" | "warning" | "info"
        duration: 3000, // milliseconds
        isClosable: true,
        position: 'top-right', // "top", "top-right", "bottom-left", etc.
      });    }
  }

  return (
    <VStack spacing={6} width="90%" mx="auto" py={6}>
      <Heading textAlign="center" color="green.400">
        {campaign.influencer} - {campaign.activity}
      </Heading>

      <Button colorScheme={"green"} ml={"auto"} size={"lg"} onClick={handleUpdateViews}>Update views</Button>

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

export default AllVideosAdminPage;