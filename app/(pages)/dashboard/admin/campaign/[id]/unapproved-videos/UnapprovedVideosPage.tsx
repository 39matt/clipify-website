'use client'

import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  Icon,
  Image,
  Link,
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
  useToast,
} from '@chakra-ui/react'
import { usePathname, useRouter } from 'next/navigation'
import {
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiExternalLink,
  FiImage,
  FiInbox,
  FiUser,
  FiX,
} from 'react-icons/fi'

import { useEffect, useMemo, useState } from 'react'
import React from 'react'

import { ICampaign } from '../../../../../../lib/models/campaign'
import { IVideo } from '../../../../../../lib/models/video'

interface UnapprovedVideosProps {
  idToken: string
}

interface PaginationProps {
  currentPage: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

const ITEMS_PER_PAGE = 50

const PaginationControls: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  if (totalPages <= 1) return null

  return (
    <HStack w="full" justify="center" pt={4} pb={2} spacing={2}>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={currentPage === 1}
        leftIcon={<FiChevronLeft />}
      >
        Prethodna
      </Button>
      <Text fontSize="sm" fontWeight="medium" color="gray.600" px={2}>
        Strana {currentPage} od {totalPages}
      </Text>
      <Button
        size="sm"
        variant="outline"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={currentPage === totalPages}
        rightIcon={<FiChevronRight />}
      >
        Sledeća
      </Button>
    </HStack>
  )
}

const UnapprovedVideos: React.FC<UnapprovedVideosProps> = ({ idToken }) => {
  const pathname = usePathname()
  const router = useRouter()
  const segments = pathname.split('/')
  const campaignId = segments[segments.length - 2]

  const [campaign, setCampaign] = useState<ICampaign | null>(null)
  const [videos, setVideos] = useState<IVideo[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [openSection, setOpenSection] = useState<
    'pending' | 'declined' | 'approved' | null
  >('pending')

  const [pendingPage, setPendingPage] = useState(1)
  const [declinedPage, setDeclinedPage] = useState(1)
  const [approvedPage, setApprovedPage] = useState(1)

  const toast = useToast()

  const cardBg = useColorModeValue('white', 'gray.800')
  const userSectionBg = useColorModeValue('blue.50', 'whiteAlpha.50')
  const tableHeadBg = useColorModeValue('gray.50', 'whiteAlpha.50')
  const tableRowHoverBg = useColorModeValue('gray.50', 'whiteAlpha.50')
  const userRowBg = useColorModeValue('gray.100', 'whiteAlpha.100')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (!campaignId) return
        const response = await fetch(`/api/campaign/get?id=${campaignId}`)
        const data = await response.json()
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

  const pendingVideosAll = useMemo(
    () => videos?.filter((v) => v.approved == null) || [],
    [videos],
  )
  const declinedVideosAll = useMemo(
    () => videos?.filter((v) => v.approved === false) || [],
    [videos],
  )
  const approvedVideosAll = useMemo(
    () => videos?.filter((v) => v.approved === true) || [],
    [videos],
  )

  useEffect(() => {
    const maxPending = Math.ceil(pendingVideosAll.length) || 1
    if (pendingPage > maxPending) setPendingPage(maxPending)
  }, [pendingVideosAll.length, pendingPage])

  useEffect(() => {
    const maxDeclined =
      Math.ceil(declinedVideosAll.length / ITEMS_PER_PAGE) || 1
    if (declinedPage > maxDeclined) setDeclinedPage(maxDeclined)
  }, [declinedVideosAll.length, declinedPage])




  const paginatedDeclined = useMemo(() => {
    const start = (declinedPage - 1) * ITEMS_PER_PAGE
    return declinedVideosAll.slice(start, start + ITEMS_PER_PAGE)
  }, [declinedVideosAll, declinedPage])

  const paginatedApproved = useMemo(() => {
    const start = (approvedPage - 1) * ITEMS_PER_PAGE
    return approvedVideosAll.slice(start, start + ITEMS_PER_PAGE)
  }, [approvedVideosAll, approvedPage])

  const groupedPendingVideos = useMemo(() => {
    return pendingVideosAll.reduce(
      (acc, video) => {
        if (!video.uid) return acc
        if (!acc[video.uid]) acc[video.uid] = []
        acc[video.uid].push(video)
        return acc
      },
      {} as Record<string, IVideo[]>,
    )
  }, [pendingVideosAll])

  const handleAction = async (
    videoId: string,
    type: 'approve' | 'deny' | 'reset',
  ) => {
    try {
      const response = await fetch(
        `/api/campaign/video/${type}?campaignId=${campaignId}&videoId=${videoId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${idToken}` },
        },
      )
      if (!response.ok) throw new Error()

      setVideos(
        (prev) =>
          prev?.map((v) =>
            v.id === videoId
              ? {
                  ...v,
                  approved:
                    type === 'approve'
                      ? true
                      : type === 'deny'
                        ? false
                        : undefined,
                }
              : v,
          ) || null,
      )

      const titleMap = {
        approve: 'Odobreno',
        deny: 'Odbijeno',
        reset: 'Vraćeno na pregled',
      }

      toast({
        title: titleMap[type],
        status: type === 'approve' ? 'success' : 'info',
        duration: 2000,
        position: 'top-right',
      })
    } catch (err) {
      toast({ title: 'Greška', status: 'error' })
    }
  }

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" thickness="4px" color="green.400" />
      </Center>
    )
  }

  const userEntries = Object.entries(groupedPendingVideos)

  return (
    <Box
      minH="100vh"
      maxW="1400px"
      w="full"
      py={{ base: 4, md: 10 }}
      px={{ base: 2, md: 8 }}
    >
      <VStack
        spacing={{ base: 4, md: 8 }}
        maxW="1400px"
        mx="auto"
        align="stretch"
      >
        <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
          <VStack align="start" spacing={1}>
            <Button
              variant="ghost"
              leftIcon={<FiChevronLeft />}
              onClick={() => router.back()}
              size="sm"
            >
              Nazad
            </Button>
            <Heading size={{ base: 'md', md: 'lg' }} fontWeight="extrabold">
              Odobravanje Videa
            </Heading>
            <Text fontSize="sm" color="gray.500">
              {campaign?.influencer} — {campaign?.activity}
            </Text>
          </VStack>

          <Badge
            px={4}
            py={2}
            borderRadius="xl"
            colorScheme="orange"
            variant="subtle"
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Icon as={FiClock} />
            <Text fontWeight="bold">{pendingVideosAll.length} NA ČEKANJU</Text>
          </Badge>
        </Flex>

        <VStack spacing={4} w="full" align="stretch">
          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            overflow="hidden"
            mb={4}
            py={4}
            w="full"
            bg={cardBg}
            shadow="sm"
          >
            <Button
              variant="unstyled"
              w="full"
              display="flex"
              alignItems="center"
              px={5}
              py={2}
              onClick={() =>
                setOpenSection((section) =>
                  section === 'pending' ? null : 'pending',
                )
              }
            >
              <Box flex="1" textAlign="left">
                <Heading size="md">Video snimci na čekanju</Heading>
                <Text fontSize="sm" color="gray.500">
                  Pregledajte i odobrite ili odbijte nove video snimke.
                </Text>
              </Box>
              <Badge
                colorScheme="orange"
                mr={3}
                fontSize="sm"
                px={2}
                py={1}
                borderRadius="md"
              >
                {pendingVideosAll.length}
              </Badge>
              <Icon
                as={FiChevronDown}
                transform={
                  openSection === 'pending' ? 'rotate(180deg)' : undefined
                }
                transition="transform 0.2s"
              />
            </Button>

            {openSection === 'pending' && (
              <Box w="full" px={4} pt={4} pb={4}>
                {pendingVideosAll.length === 0 ? (
                  <Center
                    py={20}
                    bg={cardBg}
                    borderRadius="2xl"
                    shadow="sm"
                    borderWidth="1px"
                  >
                    <VStack spacing={3}>
                      <Icon as={FiInbox} boxSize={10} color="gray.300" />
                      <Text color="gray.500" fontWeight="medium">
                        Svi video snimci su obrađeni.
                      </Text>
                    </VStack>
                  </Center>
                ) : (
                  <>
                    <VStack display={{ base: 'flex', md: 'none' }} spacing={6}>
                      {userEntries.map(([uid, userVideos]) => (
                        <Box key={uid} w="full">
                          <HStack
                            bg={userSectionBg}
                            p={3}
                            borderRadius="xl"
                            mb={3}
                            borderLeft="4px solid"
                            borderLeftColor="blue.400"
                          >
                            <Avatar
                              size="sm"
                              name={userVideos[0]?.accountName}
                            />
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="bold" fontSize="sm">
                                {userVideos[0]?.accountName || 'Korisnik'}
                              </Text>
                              <Text fontSize="10px" color="gray.500">
                                ID: {uid.slice(-8).toUpperCase()}
                              </Text>
                            </VStack>
                            <Badge
                              ml="auto"
                              colorScheme="blue"
                              borderRadius="full"
                            >
                              {userVideos.length}
                            </Badge>
                          </HStack>

                          <VStack spacing={4}>
                            {userVideos.map((video) => (
                              <Box
                                key={video.id}
                                bg={cardBg}
                                w="full"
                                p={4}
                                borderRadius="2xl"
                                shadow="sm"
                                borderWidth="1px"
                              >
                                <HStack spacing={4} align="start" mb={4}>
                                  <Box
                                    w="80px"
                                    h="110px"
                                    borderRadius="xl"
                                    overflow="hidden"
                                    bg="gray.100"
                                    flexShrink={0}
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
                                  <VStack align="start" spacing={1} flex={1}>
                                    <Text
                                      fontSize="xs"
                                      fontWeight="bold"
                                      noOfLines={2}
                                    >
                                      {video.name || 'Bez naslova'}
                                    </Text>
                                    <HStack fontSize="xs" color="gray.400">
                                      <Icon as={FiCalendar} />
                                      <Text>
                                        {new Date(
                                          video.createdAt,
                                        ).toLocaleDateString('sr-RS')}
                                      </Text>
                                    </HStack>
                                    <Link
                                      href={video.link}
                                      isExternal
                                      color="blue.500"
                                      fontSize="xs"
                                      fontWeight="bold"
                                      mt={1}
                                    >
                                      Otvori Video{' '}
                                      <Icon as={FiExternalLink} ml={1} />
                                    </Link>
                                  </VStack>
                                </HStack>
                                <HStack spacing={3}>
                                  <Button
                                    leftIcon={<FiCheck />}
                                    colorScheme="green"
                                    flex={1}
                                    h="45px"
                                    onClick={() =>
                                      handleAction(video.id!, 'approve')
                                    }
                                  >
                                    Odobri
                                  </Button>
                                  <Button
                                    leftIcon={<FiX />}
                                    colorScheme="red"
                                    variant="outline"
                                    flex={1}
                                    h="45px"
                                    onClick={() =>
                                      handleAction(video.id!, 'deny')
                                    }
                                  >
                                    Odbij
                                  </Button>
                                </HStack>
                              </Box>
                            ))}
                          </VStack>
                        </Box>
                      ))}
                    </VStack>

                    <Box
                      display={{ base: 'none', md: 'block' }}
                      bg={cardBg}
                      shadow="sm"
                      borderRadius="2xl"
                      overflow="hidden"
                      borderWidth="1px"
                    >
                      <TableContainer>
                        <Table
                          variant="simple"
                          style={{ tableLayout: 'fixed' }}
                        >
                          <Thead bg={tableHeadBg}>
                            <Tr>
                              <Th w="100px">Preview</Th>
                              <Th>Korisnik / Video</Th>
                              <Th w="130px">Datum</Th>
                              <Th w="230px" textAlign="center">
                                Akcije
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {userEntries.map(([uid, userVideos]) => (
                              <React.Fragment key={uid}>
                                <Tr bg={userRowBg}>
                                  <Td colSpan={4} py={2}>
                                    <HStack spacing={3}>
                                      <Icon as={FiUser} color="blue.400" />
                                      <Text
                                        fontWeight="extrabold"
                                        fontSize="xs"
                                        color="gray.600"
                                      >
                                        {uid} (
                                        {userVideos.length} videa)
                                      </Text>
                                    </HStack>
                                  </Td>
                                </Tr>
                                {userVideos.map((video) => (
                                  <Tr
                                    key={video.id}
                                    _hover={{ bg: tableRowHoverBg }}
                                  >
                                    <Td>
                                      <Box
                                        w="64px"
                                        h="84px"
                                        borderRadius="lg"
                                        overflow="hidden"
                                        bg="gray.200"
                                        borderWidth="1px"
                                      >
                                        <Image
                                          src={video.coverUrl}
                                          objectFit="cover"
                                          w="full"
                                          h="full"
                                          fallback={
                                            <Center h="full">
                                              <Icon
                                                as={FiImage}
                                                color="gray.400"
                                              />
                                            </Center>
                                          }
                                        />
                                      </Box>
                                    </Td>
                                    <Td>
                                      <VStack align="start" spacing={0}>
                                        <Text
                                          fontWeight="bold"
                                          fontSize="sm"
                                          noOfLines={2}
                                          wordBreak="break-word"
                                        >
                                          {video.name || 'Bez naslova'}
                                        </Text>
                                        <Link
                                          href={video.link}
                                          isExternal
                                          color="blue.400"
                                          fontSize="xs"
                                          fontWeight="bold"
                                        >
                                          Link <Icon as={FiExternalLink} />
                                        </Link>
                                      </VStack>
                                    </Td>
                                    <Td fontSize="sm" color="gray.500">
                                      {new Date(
                                        video.createdAt,
                                      ).toLocaleDateString('sr-RS')}
                                    </Td>
                                    <Td>
                                      <HStack spacing={2} justify="center">
                                        <Button
                                          size="sm"
                                          colorScheme="green"
                                          leftIcon={<FiCheck />}
                                          w="100px"
                                          onClick={() =>
                                            handleAction(video.id!, 'approve')
                                          }
                                        >
                                          Odobri
                                        </Button>
                                        <Button
                                          size="sm"
                                          colorScheme="red"
                                          variant="outline"
                                          leftIcon={<FiX />}
                                          w="100px"
                                          onClick={() =>
                                            handleAction(video.id!, 'deny')
                                          }
                                        >
                                          Odbij
                                        </Button>
                                      </HStack>
                                    </Td>
                                  </Tr>
                                ))}
                              </React.Fragment>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Box>
                    <PaginationControls
                      currentPage={pendingPage}
                      totalItems={pendingVideosAll.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setPendingPage}
                    />
                  </>
                )}
              </Box>
            )}
          </Box>

          <Box
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            overflow="hidden"
            mb={4}
            py={4}
            w="full"
            bg={cardBg}
            shadow="sm"
          >
            <Button
              variant="unstyled"
              w="full"
              display="flex"
              alignItems="center"
              px={5}
              py={2}
              onClick={() =>
                setOpenSection((section) =>
                  section === 'declined' ? null : 'declined',
                )
              }
            >
              <Box flex="1" textAlign="left">
                <Heading size="md">Odbijeni video snimci</Heading>
                <Text fontSize="sm" color="gray.500">
                  Ponovo odobrite video ako je slučajno odbijen.
                </Text>
              </Box>
              <Badge
                colorScheme="red"
                mr={3}
                fontSize="sm"
                px={2}
                py={1}
                borderRadius="md"
              >
                {declinedVideosAll.length}
              </Badge>
              <Icon
                as={FiChevronDown}
                transform={
                  openSection === 'declined' ? 'rotate(180deg)' : undefined
                }
                transition="transform 0.2s"
              />
            </Button>

            {openSection === 'declined' && (
              <Box w="full" px={4} pt={4} pb={4}>
                {declinedVideosAll.length === 0 ? (
                  <Center
                    py={12}
                    bg={cardBg}
                    borderRadius="2xl"
                    borderWidth="1px"
                  >
                    <Text color="gray.500">Nema odbijenih video snimaka.</Text>
                  </Center>
                ) : (
                  <>
                    <VStack display={{ base: 'flex', md: 'none' }} spacing={4}>
                      {paginatedDeclined.map((video) => (
                        <Box
                          key={video.id}
                          bg={cardBg}
                          w="full"
                          p={4}
                          borderRadius="2xl"
                          shadow="sm"
                          borderWidth="1px"
                        >
                          <HStack spacing={4} align="start" mb={4}>
                            <Box
                              w="80px"
                              h="110px"
                              borderRadius="xl"
                              overflow="hidden"
                              bg="gray.100"
                              flexShrink={0}
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
                            <VStack align="start" spacing={1} flex={1}>
                              <Text
                                fontSize="xs"
                                fontWeight="bold"
                                noOfLines={2}
                              >
                                {video.name || 'Bez naslova'}
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {video.accountName || 'Korisnik'}
                              </Text>
                              <Link
                                href={video.link}
                                isExternal
                                color="blue.500"
                                fontSize="xs"
                                fontWeight="bold"
                              >
                                Otvori video <Icon as={FiExternalLink} ml={1} />
                              </Link>
                            </VStack>
                          </HStack>
                          <Button
                            leftIcon={<FiCheck />}
                            colorScheme="green"
                            w="full"
                            onClick={() => handleAction(video.id!, 'approve')}
                          >
                            Ponovo odobri
                          </Button>
                        </Box>
                      ))}
                    </VStack>

                    <Box
                      display={{ base: 'none', md: 'block' }}
                      bg={cardBg}
                      shadow="sm"
                      borderRadius="2xl"
                      overflow="hidden"
                      borderWidth="1px"
                    >
                      <TableContainer>
                        <Table
                          variant="simple"
                          style={{ tableLayout: 'fixed' }}
                        >
                          <Thead bg={tableHeadBg}>
                            <Tr>
                              <Th w="100px">Preview</Th>
                              <Th>Korisnik / Video</Th>
                              <Th w="130px">Datum</Th>
                              <Th w="180px" textAlign="center">
                                Akcija
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {paginatedDeclined.map((video) => (
                              <Tr key={video.id}>
                                <Td>
                                  <Box
                                    w="64px"
                                    h="84px"
                                    borderRadius="lg"
                                    overflow="hidden"
                                    bg="gray.200"
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
                                <Td>
                                  <VStack align="start" spacing={0}>
                                    <Text
                                      fontWeight="bold"
                                      fontSize="sm"
                                      noOfLines={2}
                                      wordBreak="break-word"
                                    >
                                      {video.name || 'Bez naslova'}
                                    </Text>
                                    <Text fontSize="xs" color="gray.500">
                                      {video.accountName || 'Korisnik'}
                                    </Text>
                                    <Link
                                      href={video.link}
                                      isExternal
                                      color="blue.400"
                                      fontSize="xs"
                                      fontWeight="bold"
                                    >
                                      Link <Icon as={FiExternalLink} />
                                    </Link>
                                  </VStack>
                                </Td>
                                <Td fontSize="sm" color="gray.500">
                                  {new Date(video.createdAt).toLocaleDateString(
                                    'sr-RS',
                                  )}
                                </Td>
                                <Td>
                                  <Button
                                    size="sm"
                                    colorScheme="green"
                                    leftIcon={<FiCheck />}
                                    w="150px"
                                    onClick={() =>
                                      handleAction(video.id!, 'approve')
                                    }
                                  >
                                    Ponovo odobri
                                  </Button>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Box>
                    <PaginationControls
                      currentPage={declinedPage}
                      totalItems={declinedVideosAll.length}
                      itemsPerPage={ITEMS_PER_PAGE}
                      onPageChange={setDeclinedPage}
                    />
                  </>
                )}
              </Box>
            )}
          </Box>
        </VStack>
      </VStack>
    </Box>
  )
}

export default UnapprovedVideos
