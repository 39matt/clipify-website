'use client';

import { Avatar, Badge, Box, Button, ButtonGroup, Center, Divider, Flex, HStack, Heading, Icon, IconButton, Image, Link, Progress, SimpleGrid, Spinner, Stat, StatLabel, StatNumber, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr, VStack, useColorModeValue, useToast } from '@chakra-ui/react';
import { usePathname, useRouter } from 'next/navigation';
import { FiChevronLeft, FiClock, FiExternalLink, FiEye, FiHeart, FiImage, FiRefreshCw, FiTrash2, FiTrendingUp, FiVideo, FiZap } from 'react-icons/fi';



import React, { useEffect, useMemo, useState } from 'react';



import { ICampaign } from '../../../../../../lib/models/campaign';
import { IVideo } from '../../../../../../lib/models/video';


interface AdminCampaignPageProps { idToken: string }

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
        toast({ title: 'Greška', status: 'error' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [campaignId, toast])

  const sortedVideos = useMemo(() => {
    if (!videos) return []
    return [...videos].sort((a, b) => {
      if (sortOption === 'views') return (b.views || 0) - (a.views || 0)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [videos, sortOption])

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

  const handleUpdateSingleVideo = async (video: IVideo) => {
    /* logika */
  }
  const handleDeleteVideo = async (id: string) => {
    /* logika */
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
      <VStack spacing={6} maxW="98%" mx="auto" align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <HStack>
            <IconButton
              icon={<FiChevronLeft />}
              variant="ghost"
              onClick={() => router.back()}
              size="sm"
              aria-label="nazad"
            />
            <Heading size={{ base: 'md', md: 'lg' }}>
              {campaign?.influencer}
            </Heading>
          </HStack>
          <HStack spacing={2}>
            <Button
              size="sm"
              leftIcon={<FiZap />}
              colorScheme="purple"
              variant="subtle"
              onClick={() => {}}
            >
              Update views
            </Button>
            <Button
              size="sm"
              leftIcon={<FiRefreshCw />}
              colorScheme="green"
              onClick={() => {}}
            >
              Calculate
            </Button>
          </HStack>
        </Flex>
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
        /* --- MOBILE VIEW: CARDS --- */
        <VStack display={{ base: 'flex', md: 'none' }} spacing={4}>
          {sortedVideos.map((video) => (
            <Box
              key={video.id}
              bg={cardBg}
              w="full"
              p={4}
              borderRadius="2xl"
              shadow="md"
              borderWidth="1px"
            >
              <HStack spacing={4} align="start">
                {/* Preview slika je malo veća za bolji visual */}
                <Box
                  w="85px"
                  h="115px"
                  borderRadius="xl"
                  overflow="hidden"
                  flexShrink={0}
                  bg="gray.100"
                >
                  <Image
                    src={video.coverUrl}
                    objectFit="cover"
                    w="full"
                    h="full"
                    fallback={
                      <Center h="full">
                        <Icon as={FiImage} color="gray.300" />
                      </Center>
                    }
                  />
                </Box>

                <VStack align="start" spacing={2} flex={1}>
                  <HStack w="full" justify="space-between">
                    <VStack align="start" spacing={0}>
                      <HStack spacing={2}>
                        <Avatar size="xs" name={video.accountName} />
                        <Text fontWeight="bold" fontSize="xs" noOfLines={1}>
                          {video.accountName}
                        </Text>
                      </HStack>
                      <Text fontSize="9px" color="gray.400" mt={1}>
                        {new Date(video.createdAt).toLocaleDateString('sr-RS')}
                      </Text>
                    </VStack>
                    <Badge
                      fontSize="9px"
                      borderRadius="full"
                      px={2}
                      colorScheme={
                        video.approved == true
                          ? 'green'
                          : video.approved == false
                            ? 'red'
                            : 'orange'
                      }
                    >
                      {video.approved == true
                        ? 'Approved'
                        : video.approved == false
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

                  <Link
                    href={video.link}
                    isExternal
                    color="blue.500"
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    Pogledaj video{' '}
                    <Icon as={FiExternalLink} boxSize={3} ml={1} />
                  </Link>

                  <Divider my={1} />

                  {/* UVEĆANI DUGMIĆI ZA MOBILNI */}
                  <HStack w="full" justify="space-between">
                    <Button
                      size="sm"
                      leftIcon={<FiRefreshCw />}
                      onClick={() => handleUpdateSingleVideo(video)}
                      variant="outline"
                      flex={1}
                      h="40px" // Fiksna visina za lakši dodir
                    >
                      Refresh
                    </Button>
                    <IconButton
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      icon={<FiTrash2 />}
                      onClick={() => handleDeleteVideo(video.id!)}
                      aria-label="delete"
                      w="45px"
                      h="40px"
                    />
                  </HStack>
                </VStack>
              </HStack>
            </Box>
          ))}
        </VStack>
        {/* --- DESKTOP VIEW: TABLE --- */}
        /* --- DESKTOP VIEW: TABLE --- */
        <Box
          display={{ base: 'none', md: 'block' }}
          bg={cardBg}
          shadow="xl"
          borderRadius="2xl"
          overflow="hidden"
          borderWidth="1px"
        >
          <TableContainer>
            <Table variant="simple" size="sm" layout="fixed">
              {' '}
              {/* Dodat layout fixed */}
              <Thead bg={useColorModeValue('gray.50', 'whiteAlpha.50')}>
                <Tr>
                  <Th w="250px">Account</Th>
                  <Th w="100px">Preview</Th>
                  <Th isNumeric w="120px">
                    Views
                  </Th>
                  <Th isNumeric w="100px">
                    Likes
                  </Th>
                  <Th w="120px">Status</Th>
                  <Th w="100px" textAlign="right">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedVideos.map((video) => (
                  <Tr
                    key={video.id}
                    _hover={{
                      bg: useColorModeValue('gray.50', 'whiteAlpha.100'),
                    }}
                  >
                    <Td>
                      <HStack spacing={3}>
                        <Avatar size="sm" name={video.accountName} />
                        <VStack align="start" spacing={0}>
                          <Text
                            fontWeight="bold"
                            fontSize="sm"
                            noOfLines={1}
                            maxW="180px"
                          >
                            {video.accountName}
                          </Text>
                          <Link
                            href={video.link}
                            isExternal
                            color="blue.400"
                            fontSize="xs"
                          >
                            View Link <Icon as={FiExternalLink} ml={1} />
                          </Link>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <Box
                        w="50px"
                        h="70px"
                        borderRadius="md"
                        overflow="hidden"
                        bg="gray.100"
                        borderWidth="1px"
                      >
                        <Image
                          src={video.coverUrl}
                          objectFit="cover"
                          w="full"
                          h="full"
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
                      {/* ISPRAVLJENA LOGIKA ZA BADGE - radi za true, false i null */}
                      <Badge
                        fontSize="10px"
                        borderRadius="full"
                        px={2}
                        colorScheme={
                          video.approved === true
                            ? 'green'
                            : video.approved === false
                              ? 'red'
                              : 'orange'
                        }
                      >
                        {video.approved === true
                          ? 'Approved'
                          : video.approved === false
                            ? 'Denied'
                            : 'Pending'}
                      </Badge>
                    </Td>
                    <Td textAlign="right">
                      <HStack spacing={1} justify="flex-end">
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

export default AllVideosAdminPage;