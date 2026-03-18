'use client';

import { Avatar, Badge, Box, Button, ButtonGroup, Center, Divider, Flex, HStack, Heading, Icon, IconButton, Image, Link, Progress, SimpleGrid, Spinner, Stat, StatLabel, StatNumber, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack, useColorModeValue, useToast } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { FiChevronLeft, FiClock, FiExternalLink, FiEye, FiHeart, FiImage, FiRefreshCw, FiTrash2, FiTrendingUp, FiVideo, FiZap } from 'react-icons/fi';



import React, { useEffect, useMemo, useState } from 'react';



import { ICampaign } from '../../../../../../lib/models/campaign';
import { IVideo } from '../../../../../../lib/models/video';


interface AdminCampaignPageProps {
  idToken: string
}

const AllVideosAdminPage: React.FC<AdminCampaignPageProps> = ({ idToken }) => {
  const pathname = usePathname()
  const router = useRouter()
  const campaignId = pathname.split('/')[pathname.split('/').length - 2]

  const [campaign, setCampaign] = useState<ICampaign | null>(null)
  const [videos, setVideos] = useState<IVideo[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [sortOption, setSortOption] = useState<'createdAt' | 'views'>(
    'createdAt',
  )

  const [isUpdating, setIsUpdating] = useState(false)
  const [updatedCount, setUpdatedCount] = useState(0)
  const [failedVideoIds, setFailedVideoIds] = useState<Set<string>>(new Set())

  const toast = useToast()
  const bgGradient = useColorModeValue(
    'linear(to-br, gray.50, white)',
    'linear(to-br, gray.900, gray.800)',
  )
  const cardBg = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (!campaignId) return
        const res = await fetch(`/api/campaign/get?id=${campaignId}`)
        const data = await res.json()
        setCampaign(data.campaign)
        setVideos(data.videos as IVideo[])
      } catch (err) {
        toast({ title: 'Greška pri učitavanju', status: 'error' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [campaignId, toast])

  const sortedVideos = useMemo(() => {
    if (!videos) return []
    return [...videos].sort((a, b) => {
      const aFailed = failedVideoIds.has(a.id!)
      const bFailed = failedVideoIds.has(b.id!)
      if (aFailed && !bFailed) return -1
      if (!aFailed && bFailed) return 1

      if (sortOption === 'views') return (b.views || 0) - (a.views || 0)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [videos, sortOption, failedVideoIds])

  const stats = useMemo(() => {
    if (!videos) return { totalViews: 0, totalLikes: 0, videoCount: 0 }
    return videos.reduce(
      (acc, v) => {
        acc.totalViews += v.views || 0
        acc.totalLikes += v.likes || 0
        return acc
      },
      { totalViews: 0, totalLikes: 0, videoCount: videos.length },
    )
  }, [videos])

  const handleDeleteVideo = async (videoId: string) => {
    if (!window.confirm('Da li ste sigurni da želite da obrišete ovaj video?'))
      return
    try {
      const res = await fetch(`/api/campaign/video/delete`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ videoId, campaignId }),
      })

      if (!res.ok) toast({ title: 'Greška pri brisanju', status: 'error' })

      toast({ title: 'Video obrisan', status: 'success' })
      setVideos((prev) => prev?.filter((v) => v.id !== videoId) || null)
    } catch (err) {
      toast({ title: 'Greška pri brisanju', status: 'error' })
    }
  }

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
      })

      if (!getVideoResponse.ok) {
        setFailedVideoIds((prev) => new Set(prev).add(video.id!))
        return toast({ title: 'Greška API-ja', status: 'error' })
      }

      const data = await getVideoResponse.json()
      const newVideo = data['videoInfo'] as IVideo

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
      })

      setVideos((prev) =>
        prev
          ? prev.map((v) => (v.id === video.id ? { ...v, ...newVideo } : v))
          : null,
      )
      setFailedVideoIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(video.id!)
        return newSet
      })

      toast({ title: `Ažuriran video ${video.name}`, status: 'success', duration: 2000 })
    } catch (error) {
      toast({ title: `Greska pri ažuriranju videa ${video.name}`, status: 'error' })
    }
  }

  const processInChunks = async <T, R>(
    items: T[],
    chunkSize: number,
    delayMs: number,
    fn: (item: T) => Promise<R>,
  ) => {
    const results: R[] = []
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize)
      const chunkResults = await Promise.all(chunk.map(fn))
      results.push(...chunkResults)
      if (i + chunkSize < items.length)
        await new Promise((res) => setTimeout(res, delayMs))
    }
    return results
  }

  const handleUpdateViewsParallel = async () => {
    if (!videos || videos.length === 0) return
    setIsUpdating(true)
    setUpdatedCount(0)
    setFailedVideoIds(new Set())

    const updateLogic = async (video: IVideo) => {
      try {
        const res = await fetch('/api/campaign/video/get-info', {
          method: 'PUT',
          body: JSON.stringify({
            platform: video.link.includes('instagram') ? 'Instagram' : 'TikTok',
            videoId: video.link.split('/')[5],
            videoUrl: video.link,
            api_key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          }),
        })
        if (!res.ok) return { success: false, videoId: video.id }

        const data = await res.json()
        const newVideo = data['videoInfo']

        await fetch('/api/campaign/video/update-info', {
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
        })

        return { success: true, videoId: video.id, newVideo }
      } catch (e) {
        return { success: false, videoId: video.id }
      } finally {
        setUpdatedCount((prev) => prev + 1)
      }
    }

    const results = await processInChunks(videos, 8, 200, updateLogic)

    const successfulUpdates = results
      .filter((r) => r.success)
      .map((r) => r.newVideo)
    const failedIds = new Set(
      results.filter((r) => !r.success).map((r) => r.videoId!),
    )

    if (successfulUpdates.length > 0) {
      setVideos(
        (prev) =>
          prev?.map((v) => successfulUpdates.find((u) => u.id === v.id) || v) ||
          null,
      )
    }
    setFailedVideoIds(failedIds)

    await fetch('/api/campaign/calculate-progress', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ campaignId }),
    })

    setIsUpdating(false)
    toast({
      title: 'Grupno ažuriranje završeno',
      status: failedIds.size > 0 ? 'warning' : 'success',
    })
  }

  const handleCalculateTotal = async () => {
    try {
      await fetch('/api/campaign/calculate-progress', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId }),
      })
      toast({ title: 'Progres preračunat', status: 'success' })
    } catch (e) {
      toast({ title: 'Greška', status: 'error' })
    }
  }

  if (loading)
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="green.400" />
      </Center>
    )

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      py={{ base: 4, md: 10 }}
      px={{ base: 2, md: 8 }}
    >
      <VStack spacing={6} maxW="1200px" mx="auto" align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
          <Box textAlign="left">
            <HStack>
              <IconButton
                icon={<FiChevronLeft />}
                variant="ghost"
                onClick={() => router.back()}
                size="sm"
                aria-label="nazad"
              />
              <VStack align="start" spacing={0}>
                <Heading size={{ base: 'md', md: 'lg' }}>
                  {campaign?.influencer}
                </Heading>
                <Text fontSize="xs" color="gray.500">
                  Poslednji update: {campaign?.lastUpdatedAt
                  ? new Date(campaign.lastUpdatedAt).toLocaleString('sr-RS')
                  : 'Nema podataka'}
                </Text>
              </VStack>
            </HStack>
          </Box>
          <HStack spacing={2}>
            <Button
              size="sm"
              leftIcon={<FiZap />}
              colorScheme="purple"
              onClick={handleUpdateViewsParallel}
              isLoading={isUpdating}
              loadingText={`${updatedCount}/${videos?.length}`}
            >
              Update views
            </Button>
            <Button
              size="sm"
              leftIcon={<FiRefreshCw />}
              colorScheme="green"
              onClick={handleCalculateTotal}
            >
              Calculate
            </Button>
          </HStack>
        </Flex>

        {/* Failed Banner */}
        {failedVideoIds.size > 0 && (
          <Badge colorScheme="red" p={2} borderRadius="md" textAlign="center">
            ⚠️ {failedVideoIds.size} videa nije uspešno ažurirano.
          </Badge>
        )}

        {/* Stats Row */}
        <SimpleGrid columns={3} spacing={3}>
          <StatBox
            icon={FiEye}
            label="Views"
            value={stats.totalViews}
            color="blue"
          />
          <StatBox
            icon={FiHeart}
            label="Likes"
            value={stats.totalLikes}
            color="red"
          />
          <StatBox
            icon={FiVideo}
            label="Videos"
            value={stats.videoCount}
            color="purple"
          />
        </SimpleGrid>

        {/* Sorting Toggle */}
        <HStack
          justify="space-between"
          bg={cardBg}
          p={2}
          borderRadius="xl"
          borderWidth="1px"
        >
          <Text fontSize="xs" fontWeight="bold" ml={2} color="gray.500">
            SORTIRANJE
          </Text>
          <ButtonGroup
            isAttached
            size="xs"
            variant="outline"
            colorScheme="blue"
          >
            <Button
              leftIcon={<FiClock />}
              onClick={() => setSortOption('createdAt')}
              isActive={sortOption === 'createdAt'}
            >
              Najnovije
            </Button>
            <Button
              leftIcon={<FiTrendingUp />}
              onClick={() => setSortOption('views')}
              isActive={sortOption === 'views'}
            >
              Pregledi
            </Button>
          </ButtonGroup>
        </HStack>

        {/* --- MOBILE VIEW: CARDS --- */}
        <VStack display={{ base: 'flex', md: 'none' }} spacing={4}>
          {sortedVideos.map((video) => (
            <Box
              key={video.id}
              bg={cardBg}
              w="full"
              p={4}
              borderRadius="2xl"
              shadow="md"
              borderWidth={failedVideoIds.has(video.id!) ? '2px' : '1px'}
              borderColor={
                failedVideoIds.has(video.id!) ? 'red.400' : 'transparent'
              }
            >
              <HStack spacing={4} align="start">
                <Box
                  as="a"
                  href={video.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  w="85px"
                  h="115px"
                  borderRadius="xl"
                  overflow="hidden"
                  flexShrink={0}
                  bg="gray.100"
                  cursor="pointer"
                  transition="transform 0.2s, filter 0.2s"
                  _hover={{
                    transform: 'scale(1.05)',
                    filter: 'brightness(0.8)',
                  }}
                  _active={{ transform: 'scale(0.95)' }}
                >
                  <Image
                    src={video.coverUrl}
                    objectFit="cover"
                    w="full"
                    h="full"
                    alt={video.accountName}
                  />
                </Box>
                <VStack align="start" spacing={2} flex={1}>
                  <HStack w="full" justify="space-between">
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold" fontSize="xs" noOfLines={1}>{video.accountName}</Text>
                      <HStack spacing={2} mt={1}>
                        <Text fontSize="9px" color="gray.400">
                          Postavljeno: {new Date(video.createdAt).toLocaleDateString('sr-RS')}
                        </Text>
                        {video.lastUpdatedAt && (
                          <>
                            <Text fontSize="9px" color="gray.500">•</Text>
                            <Text fontSize="9px" color="blue.400" fontWeight="medium">
                              Ažurirano: {new Date(video.lastUpdatedAt).toLocaleDateString('sr-RS')}
                            </Text>
                          </>
                        )}
                      </HStack>
                    </VStack>
                    <Badge
                      fontSize="9px"
                      borderRadius="full"
                      colorScheme={
                        video.approved
                          ? 'green'
                          : video.approved === false
                            ? 'red'
                            : 'orange'
                      }
                    >
                      {video.approved
                        ? 'Approved'
                        : video.approved === false
                          ? 'Denied'
                          : 'Pending'}
                    </Badge>
                  </HStack>
                  <HStack spacing={4}>
                    <HStack spacing={1}>
                      <Icon as={FiEye} color="blue.400" />
                      <Text fontSize="sm" fontWeight="bold">
                        {video.views?.toLocaleString()}
                      </Text>
                    </HStack>
                    <HStack spacing={1}>
                      <Icon as={FiHeart} color="red.400" />
                      <Text fontSize="sm" fontWeight="bold">
                        {video.likes?.toLocaleString()}
                      </Text>
                    </HStack>
                  </HStack>
                  <HStack w="full" mt={2}>
                    <Button
                      size="xs"
                      leftIcon={<FiRefreshCw />}
                      onClick={() => handleUpdateSingleVideo(video)}
                      variant="outline"
                      flex={1}
                    >
                      Refresh
                    </Button>
                    <IconButton
                      size="xs"
                      colorScheme="red"
                      variant="ghost"
                      icon={<FiTrash2 />}
                      onClick={() => handleDeleteVideo(video.id!)}
                      aria-label="delete"
                    />
                  </HStack>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>

        {/* --- DESKTOP VIEW: TABLE --- */}
        <Box
          display={{ base: 'none', md: 'block' }}
          bg={cardBg}
          shadow="xl"
          borderRadius="2xl"
          overflow="hidden"
          borderWidth="1px"
        >
          <TableContainer>
            <Table variant="simple" size="sm">
              <Thead bg={useColorModeValue('gray.50', 'whiteAlpha.50')}>
                <Tr>
                  <Th>Account</Th>
                  <Th>Preview</Th>
                  <Th isNumeric>Views</Th>
                  <Th isNumeric>Likes</Th>
                  <Th>Status</Th>
                  <Th>Last Updated</Th>
                  <Th textAlign="right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedVideos.map((video) => (
                  <Tr
                    key={video.id}
                    bg={
                      failedVideoIds.has(video.id!) ? 'red.50' : 'transparent'
                    }
                  >
                    <Td>
                      <HStack>
                        <Avatar size="xs" name={video.accountName} />
                        <Text fontWeight="bold" fontSize="sm">
                          {video.accountName}
                        </Text>
                      </HStack>
                    </Td>
                    <Td>
                      <Box
                        as="a"
                        href={video.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        display="block"
                        w="40px"
                        h="55px"
                        borderRadius="md"
                        overflow="hidden"
                        bg="gray.100"
                        cursor="pointer"
                        transition="all 0.2s"
                        _hover={{
                          transform: 'scale(1.1)',
                          shadow: 'lg',
                          filter: 'brightness(0.9)',
                        }}
                        _active={{ transform: 'scale(0.95)' }}
                      >
                        <Image
                          src={video.coverUrl}
                          w="full"
                          h="full"
                          objectFit="cover"
                          fallback={
                            <Center h="full">
                              <Icon as={FiImage} color="gray.400" />
                            </Center>
                          }
                        />
                      </Box>
                    </Td>
                    <Td isNumeric fontWeight="bold">
                      {video.views?.toLocaleString()}
                    </Td>
                    <Td isNumeric>{video.likes?.toLocaleString()}</Td>
                    <Td>
                      <Badge
                        colorScheme={
                          video.approved
                            ? 'green'
                            : video.approved === false
                              ? 'red'
                              : 'orange'
                        }
                      >
                        {video.approved
                          ? 'Approved'
                          : video.approved === false
                            ? 'Denied'
                            : 'Pending'}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={1} color="gray.500">
                        <Icon as={FiClock} boxSize={3} />
                        <Text fontSize="xs">
                          {video.lastUpdatedAt
                            ? new Date(video.lastUpdatedAt).toLocaleDateString('sr-RS')
                            : 'N/A'}
                        </Text>
                      </HStack>
                    </Td>
                    <Td textAlign="right">
                      <HStack justify="flex-end">
                        <IconButton
                          size="xs"
                          icon={<FiRefreshCw />}
                          onClick={() => handleUpdateSingleVideo(video)}
                          aria-label="refresh"
                          variant="ghost"
                        />
                        <IconButton
                          size="xs"
                          icon={<FiTrash2 />}
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => handleDeleteVideo(video.id!)}
                          aria-label="delete"
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </VStack>
    </Box>
  )
}

const StatBox = ({ label, value, icon, color }: any) => (
  <Box
    p={{ base: 3, md: 4 }}
    bg={useColorModeValue('white', 'gray.800')}
    shadow="sm"
    borderRadius="2xl"
    borderWidth="1px"
  >
    <VStack align="start" spacing={0}>
      <HStack color={`${color}.500`} mb={1} spacing={1}>
        <Icon as={icon} boxSize={{ base: 3, md: 4 }} />
        <Text
          fontSize={{ base: '8px', md: '10px' }}
          fontWeight="bold"
          textTransform="uppercase"
        >
          {label}
        </Text>
      </HStack>
      <Text fontSize={{ base: 'sm', md: 'xl' }} fontWeight="extrabold">
        {value.toLocaleString()}
      </Text>
    </VStack>
  </Box>
)

export default AllVideosAdminPage
