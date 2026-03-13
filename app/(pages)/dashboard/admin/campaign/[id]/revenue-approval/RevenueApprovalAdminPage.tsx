'use client'

import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Collapse,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
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
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronUp,
  FiDollarSign,
  FiExternalLink,
  FiInbox,
  FiX,
} from 'react-icons/fi'

import { useEffect, useMemo, useState } from 'react'

import { ICampaign } from '../../../../../../lib/models/campaign'
import { IVideo } from '../../../../../../lib/models/video'

interface RevenueApprovalProps {
  idToken: string
}

const RevenueApprovalAdminPage: React.FC<RevenueApprovalProps> = ({
  idToken,
}) => {
  const pathname = usePathname()
  const router = useRouter()
  const campaignId = pathname.split('/').slice(-2, -1)[0]

  const [campaign, setCampaign] = useState<ICampaign | null>(null)
  const [videos, setVideos] = useState<IVideo[] | null>(null)
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const bgGradient = useColorModeValue(
    'linear(to-br, gray.50, white)',
    'linear(to-br, gray.900, gray.800)',
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const userSectionBg = useColorModeValue('green.50', 'whiteAlpha.100')

  useEffect(() => {
    const fetchData = async () => {
      if (!campaignId) return
      try {
        setLoading(true)
        const res = await fetch(`/api/campaign/get?id=${campaignId}`).then(
          (r) => r.json(),
        )
        setCampaign(res.campaign)
        setVideos(res.videos as IVideo[])
      } catch (err) {
        toast({ title: 'Greška pri učitavanju', status: 'error' })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [campaignId, toast])

  const groupedVideos = useMemo(() => {
    const approved = videos?.filter((v) => v.approved === true) || []
    return approved.reduce(
      (acc, video) => {
        if (!video.uid) return acc
        if (!acc[video.uid]) acc[video.uid] = []
        acc[video.uid].push(video)
        return acc
      },
      {} as Record<string, IVideo[]>,
    )
  }, [videos])

  const stats = useMemo(() => {
    const pending =
      videos?.filter((v) => v.approved === true && !v.revenueStatus).length || 0
    const totalRevenue =
      videos?.filter((v) => v.revenueStatus === 'Approved').length || 0
    return { pending, totalRevenue }
  }, [videos])

  const handleRevenueAction = async (
    videoId: string,
    type: 'approve' | 'deny',
  ) => {
    try {
      const endpoint = type === 'approve' ? 'approve-revenue' : 'deny-revenue'
      const statusText = type === 'approve' ? 'Approved' : 'Denied'
      const res = await fetch(
        `/api/campaign/video/${endpoint}?campaignId=${campaignId}&videoId=${videoId}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${idToken}` },
        },
      )
      if (!res.ok) throw new Error()

      setVideos(
        (prev) =>
          prev?.map((v) =>
            v.id === videoId ? { ...v, revenueStatus: statusText } : v,
          ) || null,
      )
      toast({
        title: `Prihod ${type === 'approve' ? 'odobren' : 'odbijen'}`,
        status: 'success',
        position: 'top-right',
      })
    } catch (err) {
      toast({ title: 'Greška pri obradi', status: 'error' })
    }
  }

  if (loading)
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="green.400" thickness="4px" />
      </Center>
    )

  const userEntries = Object.entries(groupedVideos)

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      py={{ base: 4, md: 10 }}
      px={{ base: 3, md: 8 }}
    >
      <VStack
        w="full"
        spacing={{ base: 6, md: 8 }}
        maxW={{ base: '100%', lg: '1100px', xl: '1350px' }}
        mx="auto"
        align="stretch"
      >
        <Flex
          direction={{ base: 'column', sm: 'row' }}
          justify="space-between"
          align={{ base: 'start', sm: 'center' }}
          gap={4}
        >
          <VStack align="start" spacing={1} flex="1" overflow="hidden">
            <Button
              variant="ghost"
              leftIcon={<FiChevronLeft />}
              onClick={() => router.back()}
              size="sm"
              pl={0}
              _hover={{ bg: 'transparent', textDecoration: 'underline' }}
            >
              Nazad
            </Button>
            <Heading
              size={{ base: 'md', md: 'lg' }}
              fontWeight="extrabold"
              isTruncated
              w="full"
            >
              Revenue Approval
            </Heading>
            <Text fontSize="sm" color="gray.500" isTruncated w="full">
              {campaign?.influencer} — {campaign?.activity}
            </Text>
          </VStack>

          <HStack spacing={3} alignSelf={{ base: 'flex-start', sm: 'center' }}>
            <StatSmall
              label="Pending"
              value={stats.pending}
              color="orange"
              icon={FiDollarSign}
            />
            <StatSmall
              label="Processed"
              value={stats.totalRevenue}
              color="green"
              icon={FiCheck}
            />
          </HStack>
        </Flex>

        {userEntries.length === 0 ? (
          <Center
            py={20}
            bg={cardBg}
            borderRadius="2xl"
            shadow="sm"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.100', 'gray.700')}
          >
            <VStack spacing={3}>
              <Icon as={FiInbox} boxSize={10} color="gray.300" />
              <Text color="gray.500" fontWeight="medium">
                Nema odobrenih videa za isplatu.
              </Text>
            </VStack>
          </Center>
        ) : (
          userEntries.map(([uid, userVideos]) => (
            <UserRevenueSection
              key={uid}
              uid={uid}
              videos={userVideos}
              onApprove={handleRevenueAction}
              onDeny={handleRevenueAction}
              cardBg={cardBg}
              userSectionBg={userSectionBg}
            />
          ))
        )}
      </VStack>
    </Box>
  )
}

interface UserRevenueSectionProps {
  uid: string
  videos: IVideo[]
  onApprove: (id: string, action: 'approve' | 'deny') => void
  onDeny: (id: string, action: 'approve' | 'deny') => void
  cardBg: string
  userSectionBg: string
}

const UserRevenueSection: React.FC<UserRevenueSectionProps> = ({
  uid,
  videos,
  onApprove,
  onDeny,
  cardBg,
  userSectionBg,
}) => {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <Box w="full">
      <Flex
        bg={userSectionBg}
        p={4}
        borderRadius="xl"
        mb={3}
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
        borderLeft="4px solid"
        borderLeftColor="green.400"
        w="full"
        align="center"
        justify="space-between"
        transition="background-color 0.2s"
        _hover={{ bg: useColorModeValue('green.100', 'whiteAlpha.200') }}
      >
        <HStack spacing={4} flex="1" overflow="hidden">
          <Avatar
            size="sm"
            name={videos[0]?.accountName}
          />
          <VStack align="start" spacing={0} flex="1" overflow="hidden">
            <Text fontWeight="bold" fontSize="sm" isTruncated w="full">
              {videos[0]?.accountName || 'Korisnik'}
            </Text>
            <Text fontSize="10px" color="gray.500">
              UID: {uid.slice(-8).toUpperCase()}
            </Text>
          </VStack>
        </HStack>

        <HStack spacing={4} ml={4} flexShrink={0}>
          <Badge
            colorScheme="green"
            borderRadius="full"
            px={3}
            display={{ base: 'none', sm: 'block' }}
          >
            {videos.length} Videa
          </Badge>
          <Icon as={isOpen ? FiChevronUp : FiChevronDown} />
        </HStack>
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ width: '100%' }}>
        <Box w="full" pb={2}>
          <VStack
            display={{ base: 'flex', md: 'none' }}
            spacing={4}
            w="full"
            align="stretch"
          >
            {videos.map((video: IVideo) => (
              <Box
                key={video.id}
                bg={cardBg}
                w="full"
                p={4}
                borderRadius="2xl"
                shadow="sm"
                borderWidth="1px"
                borderColor={useColorModeValue('gray.100', 'gray.700')}
              >
                <HStack spacing={4} align="start" mb={4}>
                  <Image
                    src={video.coverUrl}
                    fallbackSrc="https://via.placeholder.com/150"
                    w="70px"
                    h="95px"
                    borderRadius="lg"
                    objectFit="cover"
                    flexShrink={0}
                    alt={video.name}
                  />
                  <VStack align="start" spacing={1} flex={1} overflow="hidden">
                    <Badge
                      colorScheme={
                        video.revenueStatus === 'Approved'
                          ? 'green'
                          : video.revenueStatus === 'Denied'
                            ? 'red'
                            : 'orange'
                      }
                      fontSize="9px"
                    >
                      {video.revenueStatus || 'Pending'}
                    </Badge>
                    <Text fontSize="xs" fontWeight="bold" noOfLines={2}>
                      {video.name || 'Untitled Video'}
                    </Text>
                    <Text fontSize="10px" color="gray.500">
                      👁 {video.views?.toLocaleString() || 0} pregleda
                    </Text>
                    <Link
                      href={video.link}
                      isExternal
                      color="blue.500"
                      fontSize="xs"
                      fontWeight="bold"
                    >
                      Link <Icon as={FiExternalLink} boxSize={3} />
                    </Link>
                  </VStack>
                </HStack>
                <HStack spacing={3}>
                  <Button
                    flex={1}
                    size="sm"
                    colorScheme="green"
                    leftIcon={<FiCheck />}
                    onClick={() => onApprove(video.id!, 'approve')}
                    isDisabled={video.revenueStatus === 'Approved'}
                  >
                    Isplati
                  </Button>
                  <Button
                    flex={1}
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    leftIcon={<FiX />}
                    onClick={() => onDeny(video.id!, 'deny')}
                    isDisabled={video.revenueStatus === 'Denied'}
                  >
                    Odbij
                  </Button>
                </HStack>
              </Box>
            ))}
          </VStack>

          <Box
            display={{ base: 'none', md: 'block' }}
            bg={cardBg}
            borderRadius="2xl"
            shadow="sm"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.100', 'gray.700')}
            mb={6}
            overflow="hidden"
          >
            <TableContainer w="full">

            <Table
                variant="simple"
                size="md"
                style={{ tableLayout: 'fixed' }}
              >
                <Thead bg={useColorModeValue('gray.50', 'whiteAlpha.50')}>
                  <Tr>
                    <Th w="80px">Preview</Th>
                    <Th w="40%">Video Details</Th>
                    <Th isNumeric w="120px">
                      Views
                    </Th>
                    <Th w="140px">Status</Th>
                    <Th textAlign="right" w="120px">
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {videos.map((video: IVideo) => (
                    <Tr
                      key={video.id}
                      _hover={{
                        bg: useColorModeValue('gray.50', 'whiteAlpha.50'),
                      }}
                    >
                      <Td>
                        <Image
                          src={video.coverUrl}
                          fallbackSrc="https://via.placeholder.com/150"
                          w="45px"
                          h="60px"
                          borderRadius="md"
                          objectFit="cover"
                          alt={video.name}
                        />
                      </Td>
                      <Td>
                        <VStack
                          align="start"
                          spacing={0}
                          w="full"
                          overflow="hidden"
                        >
                          <Text
                            fontWeight="bold"
                            fontSize="sm"
                            isTruncated
                            w="full"
                          >
                            {video.name || 'Video bez naziva'}
                          </Text>
                          <Link
                            href={video.link}
                            isExternal
                            fontSize="xs"
                            color="blue.400"
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            Link <FiExternalLink size={10} />
                          </Link>
                        </VStack>
                      </Td>
                      <Td isNumeric fontWeight="bold" fontSize="sm">
                        {video.views?.toLocaleString()}
                      </Td>
                      <Td>
                        <Badge
                          colorScheme={
                            video.revenueStatus === 'Approved'
                              ? 'green'
                              : video.revenueStatus === 'Denied'
                                ? 'red'
                                : 'orange'
                          }
                          borderRadius="full"
                          px={2}
                        >
                          {video.revenueStatus || 'Waiting'}
                        </Badge>
                      </Td>
                      <Td textAlign="right">
                        <HStack justify="flex-end" spacing={2}>
                          <IconButton
                            aria-label="Approve"
                            icon={<FiCheck />}
                            colorScheme="green"
                            size="sm"
                            onClick={() => onApprove(video.id!, 'approve')}
                            isDisabled={video.revenueStatus === 'Approved'}
                          />
                          <IconButton
                            aria-label="Deny"
                            icon={<FiX />}
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            onClick={() => onDeny(video.id!, 'deny')}
                            isDisabled={video.revenueStatus === 'Denied'}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Collapse>
    </Box>
  )
}

const StatSmall = ({ label, value, color, icon }: any) => (
  <Flex
    bg={useColorModeValue('white', 'gray.700')}
    px={4}
    py={2}
    borderRadius="xl"
    shadow="sm"
    borderWidth="1px"
    borderColor={useColorModeValue('gray.100', 'gray.600')}
    align="center"
    gap={3}
  >
    <Center bg={`${color}.50`} p={2} borderRadius="lg">
      <Icon as={icon} color={`${color}.500`} boxSize={4} />
    </Center>
    <VStack align="start" spacing={0}>
      <Text
        fontSize="9px"
        fontWeight="bold"
        color="gray.500"
        textTransform="uppercase"
        letterSpacing="wider"
      >
        {label}
      </Text>
      <Text fontSize="md" fontWeight="extrabold" lineHeight="1">
        {value}
      </Text>
    </VStack>
  </Flex>
)

export default RevenueApprovalAdminPage
