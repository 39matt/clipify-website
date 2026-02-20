'use client';

import { Box, Button, Center, Divider, HStack, Heading, SimpleGrid, Spinner, Stat, StatLabel, StatNumber, Text, VStack, useToast } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';



import { useEffect, useMemo, useState } from 'react';



import { ICampaign } from '../../../../../../lib/models/campaign';
import { IVideo } from '../../../../../../lib/models/video';
import AdminVideoCard from './components/AdminVideoCard';


interface AdminCampaignPageProps {
  idToken: string;
}

const AllVideosAdminPage: React.FC<AdminCampaignPageProps> = ({
                                                                idToken,
                                                              }) => {
  const pathname = usePathname();
  const campaignId = pathname.split('/')[pathname.split('/').length - 2];
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [videos, setVideos] = useState<IVideo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState<
    'createdAt' | 'lastUpdatedAt' | 'views'
  >('views');
  const [updatedCount, setUpdatedCount] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [failedVideoIds, setFailedVideoIds] = useState<Set<string>>(
    new Set()
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
        const responseJson = await fetch(
          `/api/campaign/get?id=${campaignId}`,
          {
            method: 'GET',
          }
        ).then((res) => res.json());

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

  const {
    totalViews,
    totalLikes,
    totalShares,
    totalComments,
    videoCount,
    sortedVideos,
  } = useMemo(() => {
    if (!videos || videos.length === 0) {
      return {
        totalViews: 0,
        totalLikes: 0,
        totalShares: 0,
        totalComments: 0,
        videoCount: 0,
        sortedVideos: [],
      };
    }

    const totals = videos.reduce(
      (acc, v) => {
        acc.totalViews += v.views || 0;
        acc.totalLikes += v.likes || 0;
        acc.totalShares += v.shares || 0;
        acc.totalComments += v.comments || 0;
        return acc;
      },
      { totalViews: 0, totalLikes: 0, totalShares: 0, totalComments: 0 }
    );

    const sorted = [...videos].sort((a, b) => {
      // Failed videos always come first
      const aFailed = failedVideoIds.has(a.id!);
      const bFailed = failedVideoIds.has(b.id!);

      if (aFailed && !bFailed) return -1;
      if (!aFailed && bFailed) return 1;

      // Then sort by selected option
      const field = sortOption;
      const aDate = new Date(a[field] || 0).getTime();
      const bDate = new Date(b[field] || 0).getTime();
      return bDate - aDate;
    });

    return {
      ...totals,
      videoCount: videos.length,
      sortedVideos: sorted,
    };
  }, [videos, sortOption, failedVideoIds]);

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
      setFailedVideoIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(videoId);
        return newSet;
      });
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
          platform: video.link.includes('instagram')
            ? 'Instagram'
            : 'TikTok',
          videoId: video.link.split('/')[5],
          videoUrl: video.link,
          api_key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
        }),
      });

      if (getVideoResponse.status !== 200) {
        setFailedVideoIds((prev) => new Set(prev).add(video.id!));
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
        setFailedVideoIds((prev) => new Set(prev).add(video.id!));
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
        body: JSON.stringify({
          video: newVideo,
          campaignId,
          videoId: video.id,
        }),
      });

      setVideos((prev) =>
        prev
          ? prev.map((v) => (v.id === video.id ? { ...v, ...newVideo } : v))
          : null
      );

      // Remove from failed list on success
      setFailedVideoIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(video.id!);
        return newSet;
      });

      await fetch('/api/campaign/calculate-progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      });

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
      setFailedVideoIds((prev) => new Set(prev).add(video.id!));
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
    if (!videos || videos.length === 0) return;

    try {
      setIsUpdating(true);
      setUpdatedCount(0);
      setFailedVideoIds(new Set());
      setSortOption('lastUpdatedAt');

      const newFailedIds = new Set<string>();

      for (const video of videos) {
        try {
          const getVideoResponse = await fetch(
            '/api/campaign/video/get-info',
            {
              method: 'PUT',
              body: JSON.stringify({
                platform: video.link.includes('instagram')
                  ? 'Instagram'
                  : 'TikTok',
                videoId: video.link.split('/')[5],
                videoUrl: video.link,
                api_key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
              }),
            }
          );

          if (getVideoResponse.status !== 200) {
            newFailedIds.add(video.id!);
            toast({
              title: 'Error!',
              description: `Error updating info for ${video.name}`,
              status: 'error',
              duration: 2000,
              isClosable: true,
              position: 'top-right',
            });
            continue;
          }

          const data = await getVideoResponse.json();
          const newVideo = data['videoInfo'] as IVideo;

          if (!newVideo || !newVideo.accountName) {
            newFailedIds.add(video.id!);
            continue;
          }

          await fetch('/api/campaign/video/update-info', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({ video: newVideo, campaignId, videoId: video.id! }),
          });

          setVideos((prev) =>
            prev
              ? prev.map((v) =>
                v.id === video.id ? { ...v, ...newVideo } : v
              )
              : [newVideo]
          );

          setUpdatedCount((c) => c + 1);

          toast({
            title: 'Updated!',
            description: `${newVideo.name} ažuriran.`,
            status: 'success',
            duration: 1500,
            isClosable: true,
            position: 'top-right',
          });
        } catch (error) {
          console.error(`Error updating video ${video.id}:`, error);
          newFailedIds.add(video.id!);
        }
      }

      setFailedVideoIds(newFailedIds);

      await fetch('/api/campaign/calculate-progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      });

      const successCount = videos.length - newFailedIds.size;
      toast({
        title: newFailedIds.size > 0 ? 'Partially done!' : 'All done!',
        description:
          newFailedIds.size > 0
            ? `${successCount} uspešno, ${newFailedIds.size} neuspešno.`
            : 'Svi video zapisi su uspešno ažurirani.',
        status: newFailedIds.size > 0 ? 'warning' : 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error!',
        description: 'Došlo je do greške pri ažuriranju videa.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  async function processInChunks<T, R>(
    items: T[],
    chunkSize: number,
    delayMs: number,
    fn: (item: T) => Promise<R>,
  ): Promise<R[]> {
    const results: R[] = []

    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize)

      // Run current chunk in parallel
      const chunkResults = await Promise.all(chunk.map(fn))
      results.push(...chunkResults)

      // Wait between chunks (skip delay after the last chunk)
      if (i + chunkSize < items.length) {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }

    return results
  }

  const handleUpdateViewsParallel = async () => {
    if (!videos || videos.length === 0) return

    setIsUpdating(true)
    setUpdatedCount(0)
    setFailedVideoIds(new Set())
    setSortOption('lastUpdatedAt')

    const newFailedIds = new Set<string>()
    const successfulUpdates: IVideo[] = []

    // The per-video update logic (same as before, extracted as a function)
    const updateSingleVideo = async (video: IVideo) => {
      try {
        const getVideoResponse = await fetch('/api/campaign/video/get-info', {
          method: 'PUT',
          body: JSON.stringify({
            platform: video.link.includes('instagram') ? 'Instagram' : 'TikTok',
            videoId: video.link.split('/')[5],
            videoUrl: video.link,
            api_key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          }),
        })

        if (!getVideoResponse.ok) {
          console.error(`Failed to fetch info for video ${video.id}`)
          return { success: false, videoId: video.id }
        }

        const data = await getVideoResponse.json()
        const newVideo = data['videoInfo'] as IVideo

        if (!newVideo || !newVideo.accountName) {
          console.error(`Invalid video data for video ${video.id}`)
          return { success: false, videoId: video.id }
        }

        const updateDbResponse = await fetch(
          '/api/campaign/video/update-info',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              video: newVideo,
              campaignId,
              videoId: video.id!,
            }),
          },
        )

        if (!updateDbResponse.ok) {
          console.error(`Failed to update DB for video ${video.id}`)
          return { success: false, videoId: video.id }
        }

        return { success: true, videoId: video.id, newVideo }
      } catch (error) {
        console.error(`Exception updating video ${video.id}:`, error)
        return { success: false, videoId: video.id }
      } finally {
        // Still updates counter in real-time, chunk by chunk
        setUpdatedCount((prev) => prev + 1)
      }
    }

    // 🔑 Process 3 videos at a time, with 1000ms between each batch
    const results = await processInChunks(videos, 3, 1000, updateSingleVideo)

    // Process results (same as before)
    results.forEach((result) => {
      if (result.success && result.newVideo) {
        successfulUpdates.push(result.newVideo)
      } else {
        if (result.videoId) newFailedIds.add(result.videoId)
      }
    })

    if (successfulUpdates.length > 0) {
      setVideos((prev) => {
        if (!prev) return successfulUpdates
        return prev.map((v) => {
          const updated = successfulUpdates.find((u) => u.id === v.id)
          return updated ? { ...v, ...updated } : v
        })
      })
    }

    setFailedVideoIds(newFailedIds)

    try {
      await fetch('/api/campaign/calculate-progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      })
    } catch (e) {
      console.error('Calc progress failed', e)
    }

    toast({
      title: newFailedIds.size > 0 ? 'Partially done!' : 'All done!',
      description:
        newFailedIds.size > 0
          ? `${successfulUpdates.length} uspešno, ${newFailedIds.size} neuspešno.`
          : 'Svi video zapisi su uspešno ažurirani.',
      status: newFailedIds.size > 0 ? 'warning' : 'success',
      duration: 3000,
      isClosable: true,
      position: 'top-right',
    })

    setIsUpdating(false)
  }

  const handleCalculateViews = async () => {
    try {
      const res = await fetch('/api/campaign/calculate-progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      })
      if (!res.ok) {
        toast({
          title: 'Failed!',
          description: 'Failed to calculate views for the campaign.',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top-right',
        })
        return
      }
      toast({
        title: 'Success!',
        description: 'Campaign views successfully updated.',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      })
    } catch (err) {
      console.error(err)
      setError('Error updating campaign views: ' + err)
    }
  }

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

      <HStack spacing={6} w="full" mx="auto" py={6} flexWrap="wrap">
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
          <HStack spacing={2}>
            <Button
              colorScheme="orange"
              size="lg"
              onClick={handleCalculateViews}
            >
              Calculate views
            </Button>
            <Button
              colorScheme="green"
              size="lg"
              onClick={handleUpdateViews}
              isDisabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update all views'}
            </Button>
            <Button
              colorScheme="purple"
              size="lg"
              onClick={handleUpdateViewsParallel}
              isDisabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update all views parallel'}
            </Button>
            {isUpdating && (
              <>
                <Text color="gray.400" fontSize="sm" textAlign="center">
                  {updatedCount} / {videos?.length || 0} videos updated
                </Text>
                <Box
                  w="200px"
                  bg="gray.600"
                  borderRadius="full"
                  overflow="hidden"
                >
                  <Box
                    h="6px"
                    bg="green.400"
                    width={`${(updatedCount / (videos?.length || 1)) * 100}%`}
                    transition="width 0.3s ease"
                  />
                </Box>
              </>
            )}
          </HStack>
        </Box>
      </HStack>

      {failedVideoIds.size > 0 && (
        <Box
          w="full"
          bg="red.900"
          p={4}
          borderRadius="md"
          borderWidth="1px"
          borderColor="red.600"
        >
          <Text color="red.200" fontWeight="bold" textAlign="center">
            ⚠️ {failedVideoIds.size} video(s) failed to update
          </Text>
        </Box>
      )}

      <Divider />

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
        <Button
          size="sm"
          colorScheme={sortOption === 'views' ? 'blue' : 'gray'}
          variant={sortOption === 'views' ? 'solid' : 'outline'}
          onClick={() => setSortOption('views')}
        >
          Views
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
              hasFailed={failedVideoIds.has(video.id!)}
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