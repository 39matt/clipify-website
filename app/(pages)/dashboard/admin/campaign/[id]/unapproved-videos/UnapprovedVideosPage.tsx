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

const UnapprovedVideos: React.FC<UnapprovedVideosProps> = ({ idToken }) => {
  const pathname = usePathname()
  const router = useRouter()
  const campaignId = pathname.split('/')[pathname.split('/').length - 2]

  const [campaign, setCampaign] = useState<ICampaign | null>(null)
  const [videos, setVideos] = useState<IVideo[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [openSection, setOpenSection] = useState<
    'pending' | 'declined' | 'approved' | null
  >('pending')
  const toast = useToast()

  const bgGradient = useColorModeValue(
    'linear(to-br, gray.50, white)',
    'linear(to-br, gray.900, gray.800)',
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const userSectionBg = useColorModeValue('blue.50', 'whiteAlpha.50')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (!campaignId) return
        const response = await fetch(`/api/campaign/get?id=${campaignId}`).then(
          (res) => res.json(),
        )
        setCampaign(response.campaign)
        setVideos(response.videos as IVideo[])
      } catch (err) {
        toast({ title: 'Greška pri učitavanju', status: 'error' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [campaignId])

  // Grupisanje videa po UID-u (User ID)
  const groupedVideos = useMemo(() => {
    const pending = videos?.filter((v) => v.approved == null) || []
    return pending.reduce(
      (acc, video) => {
        if (!video.uid) return acc
        if (!acc[video.uid]) acc[video.uid] = []
        acc[video.uid].push(video)
        return acc
      },
      {} as Record<string, IVideo[]>,
    )
  }, [videos])

  const declinedVideos = useMemo(
    () => videos?.filter((v) => v.approved === false) || [],
    [videos],
  )

  const approvedVideos = useMemo(
    () => videos?.filter((v) => v.approved === true) || [],
    [videos],
  )

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
      toast({
        title:
          type === 'approve'
            ? 'Odobreno'
            : type === 'deny'
              ? 'Odbijeno'
              : 'Vraćeno na pregled',
        status: type === 'approve' ? 'success' : 'info',
        duration: 2000,
        position: 'top-right',
      })
    } catch (err) {
      toast({ title: 'Greška', status: 'error' })
    }
  }

  if (loading)
    return (
      <Center minH="100vh">
        <Spinner size="xl" thickness="4px" color="green.400" />
      </Center>
    )

  const userEntries = Object.entries(groupedVideos)

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
        {/* Header */}
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
            <Text fontWeight="bold">
              {userEntries.reduce((sum, [_, v]) => sum + v.length, 0)} NA
              ČEKANJU
            </Text>
          </Badge>
        </Flex>

        <VStack spacing={4} w="full" align="stretch">
          <Box
            border="1px solid"
            borderColor="gray.500"
            borderRadius="xl"
            overflow="hidden"
            mb={4}
            py={4}
            w="full"
          >
            <Button
              variant="unstyled"
              w="full"
              display="flex"
              alignItems="center"
              px={5}
              py={4}
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
              <Badge colorScheme="orange" mr={3}>
                {userEntries.reduce(
                  (sum, [_, videos]) => sum + videos.length,
                  0,
                )}
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
                {userEntries.length === 0 ? (
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
                    {/* --- MOBILE VIEW: GROUPED BY USER --- */}
                    <VStack display={{ base: 'flex', md: 'none' }} spacing={6}>
                      {userEntries.map(([uid, userVideos]) => (
                        <Box key={uid} w="full">
                          {/* User Section Header */}
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

                          {/* Videos for this user */}
                          <VStack spacing={4}>
                            {userVideos.map((video) => (
                              <Box
                                key={video.id}
                                bg={cardBg}
                                w="full"
                                p={4}
                                borderRadius="2xl"
                                shadow="md"
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

                    {/* --- DESKTOP VIEW: TABLE (GROUPED) --- */}
                    <Box
                      display={{ base: 'none', md: 'block' }}
                      bg={cardBg}
                      shadow="xl"
                      borderRadius="2xl"
                      overflow="hidden"
                      borderWidth="1px"
                    >
                      <TableContainer>
                        <Table
                          variant="simple"
                          style={{ tableLayout: 'fixed' }}
                        >
                          <Thead
                            bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                          >
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
                                {/* User Header Row */}
                                <Tr
                                  bg={useColorModeValue(
                                    'gray.100',
                                    'whiteAlpha.100',
                                  )}
                                >
                                  <Td colSpan={4} py={2}>
                                    <HStack spacing={3}>
                                      <Icon as={FiUser} color="blue.400" />
                                      <Text
                                        fontWeight="extrabold"
                                        fontSize="xs"
                                        color="gray.600"
                                      >
                                        KORISNIK:{' '}
                                        {userVideos[0]?.accountName || uid} (
                                        {userVideos.length} videa)
                                      </Text>
                                    </HStack>
                                  </Td>
                                </Tr>
                                {/* Individual Video Rows */}
                                {userVideos.map((video) => (
                                  <Tr
                                    key={video.id}
                                    _hover={{
                                      bg: useColorModeValue(
                                        'gray.50',
                                        'whiteAlpha.50',
                                      ),
                                    }}
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
                  </>
                )}
              </Box>
            )}
          </Box>

          <Box
            border="1px solid"
            borderColor="gray.500"
            borderRadius="xl"
            overflow="hidden"
            mb={4}
            py={4}
            w="full"
          >
            <Button
              variant="unstyled"
              w="full"
              display="flex"
              alignItems="center"
              px={5}
              py={4}
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
              <Badge colorScheme="red" mr={3}>
                {declinedVideos.length}
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
                <Box>
                  <Flex
                    justify="space-between"
                    align="center"
                    wrap="wrap"
                    gap={3}
                    mb={4}
                  >
                    <Text fontSize="sm" color="gray.500">
                      Video snimci koje ste prethodno odbili.
                    </Text>
                  </Flex>

                  {declinedVideos.length === 0 ? (
                    <Center
                      py={12}
                      bg={cardBg}
                      borderRadius="2xl"
                      borderWidth="1px"
                    >
                      <Text color="gray.500">
                        Nema odbijenih video snimaka.
                      </Text>
                    </Center>
                  ) : (
                    <>
                      <VStack
                        display={{ base: 'flex', md: 'none' }}
                        spacing={4}
                      >
                        {declinedVideos.map((video) => (
                          <Box
                            key={video.id}
                            bg={cardBg}
                            w="full"
                            p={4}
                            borderRadius="2xl"
                            shadow="md"
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
                                  Otvori video{' '}
                                  <Icon as={FiExternalLink} ml={1} />
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
                        shadow="xl"
                        borderRadius="2xl"
                        overflow="hidden"
                        borderWidth="1px"
                      >
                        <TableContainer>
                          <Table
                            variant="simple"
                            style={{ tableLayout: 'fixed' }}
                          >
                            <Thead
                              bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                            >
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
                              {declinedVideos.map((video) => (
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
                                    {new Date(
                                      video.createdAt,
                                    ).toLocaleDateString('sr-RS')}
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
                    </>
                  )}
                </Box>
              </Box>
            )}
          </Box>

          <Box
            border="1px solid"
            borderColor="gray.500"
            borderRadius="xl"
            overflow="hidden"
            w="full"
            py={4}
          >
            <Button
              variant="unstyled"
              w="full"
              display="flex"
              alignItems="center"
              px={5}
              py={4}
              onClick={() =>
                setOpenSection((section) =>
                  section === 'approved' ? null : 'approved',
                )
              }
            >
              <Box flex="1" textAlign="left">
                <Heading size="md">Odobreni video snimci</Heading>
                <Text fontSize="sm" color="gray.500">
                  Vratite slučajno odobren video na pregled.
                </Text>
              </Box>
              <Badge colorScheme="green" mr={3}>
                {approvedVideos.length}
              </Badge>
              <Icon
                as={FiChevronDown}
                transform={
                  openSection === 'approved' ? 'rotate(180deg)' : undefined
                }
                transition="transform 0.2s"
              />
            </Button>
            {openSection === 'approved' && (
              <Box w="full" px={4} pt={4} pb={4}>
                {approvedVideos.length === 0 ? (
                  <Center
                    py={12}
                    bg={cardBg}
                    borderRadius="2xl"
                    borderWidth="1px"
                  >
                    <Text color="gray.500">Nema odobrenih video snimaka.</Text>
                  </Center>
                ) : (
                  <>
                    <VStack display={{ base: 'flex', md: 'none' }} spacing={4}>
                      {approvedVideos.map((video) => (
                        <Box
                          key={video.id}
                          bg={cardBg}
                          w="full"
                          p={4}
                          borderRadius="2xl"
                          borderWidth="1px"
                        >
                          <Text
                            fontWeight="bold"
                            noOfLines={2}
                            wordBreak="break-word"
                          >
                            {video.name || 'Bez naslova'}
                          </Text>
                          <Text fontSize="xs" color="gray.500" mt={1}>
                            {video.accountName || 'Korisnik'}
                          </Text>
                          <Link
                            href={video.link}
                            isExternal
                            color="blue.500"
                            fontSize="xs"
                            fontWeight="bold"
                            display="block"
                            mt={2}
                          >
                            Otvori video <Icon as={FiExternalLink} ml={1} />
                          </Link>
                          <Button
                            mt={4}
                            leftIcon={<FiClock />}
                            colorScheme="orange"
                            variant="outline"
                            w="full"
                            onClick={() => handleAction(video.id!, 'reset')}
                          >
                            Vrati na pregled
                          </Button>
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
                        <Table
                          variant="simple"
                          style={{ tableLayout: 'fixed' }}
                        >
                          <Thead
                            bg={useColorModeValue('gray.50', 'whiteAlpha.50')}
                          >
                            <Tr>
                              <Th>Korisnik / Video</Th>
                              <Th w="130px">Datum</Th>
                              <Th w="190px" textAlign="center">
                                Akcija
                              </Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {approvedVideos.map((video) => (
                              <Tr key={video.id}>
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
                                    colorScheme="orange"
                                    variant="outline"
                                    leftIcon={<FiClock />}
                                    w="170px"
                                    onClick={() =>
                                      handleAction(video.id!, 'reset')
                                    }
                                  >
                                    Vrati na pregled
                                  </Button>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Box>
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
