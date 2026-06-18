'use client'

import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  IconButton,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { usePathname, useRouter } from 'next/navigation'
import {
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiEye,
  FiHeart,
  FiImage,
  FiPlus,
  FiRefreshCw,
  FiTrash2,
  FiTrendingUp,
  FiVideo,
  FiZap,
} from 'react-icons/fi'

import React, { useEffect, useMemo, useState } from 'react'

import { ICampaign } from '../../../../../../lib/models/campaign'
import { IVideo } from '../../../../../../lib/models/video'

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

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [newVideoLink, setNewVideoLink] = useState('')
  const [newVideoUid, setNewVideoUid] = useState('')
  const [isAddingVideo, setIsAddingVideo] = useState(false)

  const [users, setUsers] = useState<any[]>([])
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  const toast = useToast()
  const bgGradient = useColorModeValue(
    'linear(to-br, gray.50, white)',
    'linear(to-br, gray.900, gray.800)',
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const dropdownBg = useColorModeValue('white', 'gray.700')

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

  const fetchUsers = async () => {
    if (users.length > 0) return
    try {
      const res = await fetch('/api/user/get-all')
      if (res.ok) {
        const data = await res.json()
        setUsers(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleOpenModal = () => {
    fetchUsers()
    onOpen()
  }

  const filteredUsers = useMemo(() => {
    if (!userSearchTerm) return users.slice(0, 50)
    const term = userSearchTerm.toLowerCase()
    return users
      .filter(
        (u) =>
          u.id.toLowerCase().includes(term) ||
          (u.email && u.email.toLowerCase().includes(term)) ||
          (u.name && u.name.toLowerCase().includes(term)) ||
          (u.displayName && u.displayName.toLowerCase().includes(term)),
      )
      .slice(0, 50)
  }, [users, userSearchTerm])

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

  useEffect(() => {
    setCurrentPage(1)
  }, [sortOption])

  const totalPages = Math.ceil(sortedVideos.length / itemsPerPage)
  const paginatedVideos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedVideos.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedVideos, currentPage, itemsPerPage])

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
      setVideos((prev) => {
        const newVideos = prev?.filter((v) => v.id !== videoId) || null
        if (
          newVideos &&
          Math.ceil(newVideos.length / itemsPerPage) < currentPage
        ) {
          setCurrentPage(Math.max(1, currentPage - 1))
        }
        return newVideos
      })
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

      toast({
        title: `Ažuriran video ${video.name}`,
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: `Greska pri ažuriranju videa ${video.name}`,
        status: 'error',
      })
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

  const handleAddVideo = async () => {
    if (!newVideoLink.trim() || !newVideoUid) {
      toast({ title: 'Sva polja su obavezna', status: 'warning' })
      return
    }

    try {
      setIsAddingVideo(true)

      let rawVideoUrl = newVideoLink.split('?')[0]

      const instagramReelRegex =
        /^https:\/\/(www\.)?instagram\.com\/(reel|reels|p)\/[a-zA-Z0-9_-]+\/?$/
      const tiktokDesktopRegex =
        /^https:\/\/(www\.)?tiktok\.com\/@?[a-zA-Z0-9_.]+\/(?:video|photo)\/[0-9]+\/?$/
      const tiktokMobileRegex =
        /^https:\/\/[A-Za-z][A-Za-z]\.tiktok\.com\/[A-Za-z0-9]+\/?$/
      const youtubeShortsRegex =
        /^https:\/\/(www\.)?youtube\.com\/shorts\/[a-zA-Z0-9_-]+\/?(\?.*)?$/

      let platform: string
      if (instagramReelRegex.test(rawVideoUrl)) {
        platform = 'Instagram'
      } else if (
        tiktokDesktopRegex.test(rawVideoUrl) ||
        tiktokMobileRegex.test(rawVideoUrl)
      ) {
        platform = 'TikTok'
      } else if (youtubeShortsRegex.test(rawVideoUrl)) {
        platform = 'YouTube'
      } else {
        toast({
          title:
            'Molimo vas unesite validan Instagram/TikTok/YouTube video URL.',
          status: 'error',
        })
        return
      }

      let videoId = ''
      let video: any = null

      if (platform === 'TikTok') {
        let finalUrl = rawVideoUrl

        if (tiktokMobileRegex.test(rawVideoUrl)) {
          const res = await fetch(
            `/api/resolve-tiktok?url=${encodeURIComponent(rawVideoUrl)}`,
          )
          if (!res.ok) {
            toast({
              title: 'Greška pri pribavljanju videa! (TikTok Resolve)',
              status: 'error',
            })
            return
          }
          const data = await res.json()
          finalUrl = data.finalUrl
        }

        const match = finalUrl.match(
          /tiktok\.com\/@([^\/]+)\/(?:video|photo)\/(\d+)/,
        )
        if (!match) {
          toast({ title: 'Format linka je pogrešan!', status: 'error' })
          return
        }

        videoId = match[2]

        const response = await fetch('/api/campaign/video/get-info', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform: 'TikTok',
            videoId,
            api_key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          }),
        })

        const responseJson = await response.json()
        video = responseJson.videoInfo
      }

      if (platform === 'Instagram') {
        const response = await fetch('/api/campaign/video/get-info', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform: 'Instagram',
            videoUrl: rawVideoUrl,
            api_key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          }),
        })

        const responseJson = await response.json()
        video = responseJson.videoInfo
      }

      if (platform === 'YouTube') {
        const response = await fetch('/api/campaign/video/get-info', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform: 'YouTube',
            videoUrl: rawVideoUrl,
            videoId: rawVideoUrl.split('/')[4],
            api_key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY!,
          }),
        })

        const responseJson = await response.json()
        video = responseJson.videoInfo
      }

      if (!video) {
        toast({
          title: 'Greška pri pribavljanju videa sa mreže',
          status: 'error',
        })
        return
      }

      const addRes = await fetch('/api/campaign/video/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          video,
          campaignId,
          accId: video.accountName,
          uid: newVideoUid,
        }),
      })

      const addResJson = await addRes.json()

      if (!addRes.ok) {
        toast({
          title:
            addResJson.error === 'Video already exists'
              ? 'Video je već dodat!'
              : addResJson.error || 'Došlo je do greške',
          status: 'error',
        })
        return
      }

      toast({ title: 'Video uspešno dodat', status: 'success' })

      const resList = await fetch(`/api/campaign/get?id=${campaignId}`)
      const dataList = await resList.json()
      setVideos(dataList.videos as IVideo[])

      setNewVideoLink('')
      setNewVideoUid('')
      setUserSearchTerm('')
      onClose()
    } catch (error) {
      console.error('Error adding video:', error)
      toast({
        title: 'Došlo je do greške prilikom dodavanja videa.',
        status: 'error',
      })
    } finally {
      setIsAddingVideo(false)
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
                  Poslednji update:{' '}
                  {campaign?.lastUpdatedAt
                    ? new Date(campaign.lastUpdatedAt).toLocaleString('sr-RS')
                    : 'Nema podataka'}
                </Text>
              </VStack>
            </HStack>
          </Box>
          <HStack spacing={2}>
            <Button
              size="sm"
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={handleOpenModal}
            >
              Add Video
            </Button>
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

        {failedVideoIds.size > 0 && (
          <Badge colorScheme="red" p={2} borderRadius="md" textAlign="center">
            ⚠️ {failedVideoIds.size} videa nije uspešno ažurirano.
          </Badge>
        )}

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

        <VStack display={{ base: 'flex', md: 'none' }} spacing={4}>
          {paginatedVideos.map((video) => (
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
                      <Text fontWeight="bold" fontSize="xs" noOfLines={1}>
                        {video.accountName}
                      </Text>
                      <HStack spacing={2} mt={1}>
                        <Text fontSize="9px" color="gray.400">
                          Postavljeno:{' '}
                          {new Date(video.createdAt).toLocaleDateString(
                            'sr-RS',
                          )}
                        </Text>
                        {video.lastUpdatedAt && (
                          <>
                            <Text fontSize="9px" color="gray.500">
                              •
                            </Text>
                            <Text
                              fontSize="9px"
                              color="blue.400"
                              fontWeight="medium"
                            >
                              Ažurirano:{' '}
                              {new Date(video.lastUpdatedAt).toLocaleDateString(
                                'sr-RS',
                              )}
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
                  <Th>User</Th>
                  <Th>Account</Th>
                  <Th>Preview</Th>
                  <Th isNumeric>Views</Th>
                  <Th>Status</Th>
                  <Th>Last Updated</Th>
                  <Th textAlign="right">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedVideos.map((video) => (
                  <Tr
                    key={video.id}
                    bg={
                      failedVideoIds.has(video.id!) ? 'red.50' : 'transparent'
                    }
                  >
                    <Td>
                      <HStack>
                        <Avatar size="xs" name={video.uid} />
                        <Text fontWeight="bold" fontSize="sm">
                          {video.uid}
                        </Text>
                      </HStack>
                    </Td>
                    <Td>
                      <HStack>
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
                            ? new Date(video.lastUpdatedAt).toLocaleDateString(
                                'sr-RS',
                              )
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

        {totalPages > 1 && (
          <Flex justify="center" mt={4} align="center" gap={4}>
            <Button
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              isDisabled={currentPage === 1}
              leftIcon={<FiChevronLeft />}
              variant="outline"
            >
              Nazad
            </Button>

            <HStack>
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                Strana
              </Text>
              <Select
                size="sm"
                w="auto"
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                borderRadius="md"
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <option key={page} value={page}>
                      {page}
                    </option>
                  ),
                )}
              </Select>
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                od {totalPages}
              </Text>
            </HStack>

            <Button
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              isDisabled={currentPage === totalPages}
              rightIcon={<FiChevronRight />}
              variant="outline"
            >
              Napred
            </Button>
          </Flex>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent overflow="visible">
          <ModalHeader>Dodaj novi video</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isRequired position="relative">
                <FormLabel>Korisnik (Pretraga)</FormLabel>
                <Input
                  placeholder="Kucaj ime, email ili ID..."
                  value={userSearchTerm}
                  onChange={(e) => {
                    setUserSearchTerm(e.target.value)
                    setShowUserDropdown(true)
                    if (newVideoUid) {
                      setNewVideoUid('')
                    }
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowUserDropdown(false), 200)
                  }
                />

                {showUserDropdown && userSearchTerm && (
                  <Box
                    position="absolute"
                    zIndex={10}
                    w="full"
                    bg={dropdownBg}
                    shadow="xl"
                    borderWidth="1px"
                    maxH="200px"
                    overflowY="auto"
                    borderRadius="md"
                    mt={1}
                  >
                    {filteredUsers.length === 0 ? (
                      <Box p={3} textAlign="center">
                        <Text fontSize="sm" color="gray.500">
                          Nema rezultata
                        </Text>
                      </Box>
                    ) : (
                      filteredUsers.map((user) => (
                        <Box
                          key={user.id}
                          p={3}
                          _hover={{
                            bg: 'blue.500',
                            color: 'white',
                            cursor: 'pointer',
                          }}
                          onClick={() => {
                            setNewVideoUid(user.id)
                            setUserSearchTerm(
                              user.email || user.name || user.id,
                            )
                            setShowUserDropdown(false)
                          }}
                        >
                          <Text fontWeight="bold" fontSize="sm">
                            {user.name ||
                              user.displayName ||
                              user.email ||
                              'Nepoznato'}
                          </Text>
                          <Text fontSize="xs" opacity={0.8}>
                            {user.id}
                          </Text>
                        </Box>
                      ))
                    )}
                  </Box>
                )}
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Video Link</FormLabel>
                <Input
                  placeholder="TikTok, YouTube ili Instagram link"
                  value={newVideoLink}
                  onChange={(e) => setNewVideoLink(e.target.value)}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleAddVideo}
              isLoading={isAddingVideo}
              isDisabled={!newVideoUid || !newVideoLink}
            >
              Dodaj
            </Button>
            <Button onClick={onClose} variant="ghost">
              Otkaži
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
