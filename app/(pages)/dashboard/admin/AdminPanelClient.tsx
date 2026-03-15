'use client';

import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  HStack,
  Heading,
  Icon,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Progress,
  SimpleGrid,
  Spinner,
  Switch,
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
import { useRouter } from 'next/navigation'
import { FiCalendar, FiDollarSign, FiPlus, FiTrendingUp, FiUsers } from 'react-icons/fi';



import React, { useEffect, useState } from 'react';



import { uploadCampaignImage } from '../../../lib/firebase/storage';
import { ICampaign } from '../../../lib/models/campaign';


export default function AdminPanelClient() {
  const [campaigns, setCampaigns] = useState<ICampaign[]>([])
  const [loading, setLoading] = useState(true)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter()
  const toast = useToast()

  const [newCampaign, setNewCampaign] = useState<Partial<ICampaign>>({
    influencer: '',
    activity: '',
    budget: 0,
    perMillion: 0,
    maxEarnings: 0,
    maxEarningsPerPost: 0,
    maxSubmissions: 0,
    minViewsForPayout: 0,
    isActive: true,
    isPot: false,
    perMillionText: '',
    discordInvite: '',
    imageUrl: '', // Optional/Default
    progress: 0,
    moneySpent: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
  })

  const bgGradient = useColorModeValue(
    'linear(to-br, gray.50, white)',
    'linear(to-br, gray.900, gray.800)',
  )

  const sortedCampaigns = [...campaigns].sort((a, b) => {
    if (a.isActive !== b.isActive) return a.isActive ? -1 : 1
    return a.influencer.toLowerCase().localeCompare(b.influencer.toLowerCase())
  })

  useEffect(() => {
    getCampaigns()
  }, [])

  const getCampaigns = async () => {
    try {
      const response = await fetch('/api/campaign/get-all')
      const data: ICampaign[] = await response.json()
      setCampaigns(data)
    } catch (error) {
      console.error('Error fetching campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCampaign = async () => {
    try {
      const response = await fetch('/api/campaign/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCampaign),
      })

      if (response.ok) {
        toast({ title: 'Kampanja kreirana!', status: 'success' })
        onClose()
        getCampaigns()
      }
    } catch (error) {
      toast({ title: 'Greška pri kreiranju', status: 'error' })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      const url = await uploadCampaignImage(file)
      setNewCampaign((prev) => ({ ...prev, imageUrl: url }))

      toast({ title: 'Slika spremna!', status: 'success' })
    } catch (err) {
      toast({ title: 'Greška pri uploadu', status: 'error' })
    } finally {
      setIsUploading(false)
    }
  }

  const QuickStat = ({ label, icon, onClick, color }: any) => (
    <Box
      as="button"
      onClick={onClick}
      p={5}
      bg={useColorModeValue('white', 'gray.800')}
      shadow="sm"
      borderWidth="1px"
      borderRadius="xl"
      w="full"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-2px)',
        shadow: 'md',
        borderColor: color,
      }}
      display="flex"
      alignItems="center"
      gap={4}
    >
      <Center
        w={12}
        h={12}
        bg={`${color}.50`}
        color={`${color}.500`}
        borderRadius="lg"
      >
        <Icon as={icon} boxSize={6} />
      </Center>
      <VStack align="start" spacing={0}>
        <Text fontWeight="bold" fontSize="lg">
          {label}
        </Text>
        <Text fontSize="xs" color="gray.500">
          Manage System
        </Text>
      </VStack>
    </Box>
  )

  if (loading) {
    return (
      <Center minH="100vh">
        <VStack spacing={4}>
          <Spinner size="xl" thickness="4px" speed="0.65s" color="green.400" />
          <Text fontWeight="medium" color="gray.500">
            Loading Admin Data...
          </Text>
        </VStack>
      </Center>
    )
  }

  return (
    <Box minH="100vh" bgGradient={bgGradient} py={10} px={{ base: 4, md: 8 }}>
      <VStack spacing={10} maxW="1400px" mx="auto" align="stretch">
        <HStack justify="space-between" align="flex-end">
          <Box textAlign="left">
            <Heading size="lg" fontWeight="extrabold" letterSpacing="tight">
              Admin Dashboard
            </Heading>
            <Text color="gray.500">
              Overview of active campaigns and user management
            </Text>
          </Box>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="green"
            size="lg"
            onClick={onOpen}
          >
            Nova kampanja
          </Button>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <QuickStat
            label="Korisnici"
            icon={FiUsers}
            color="cyan"
            onClick={() => router.push('/dashboard/admin/users')}
          />
          <QuickStat
            label="Affiliates"
            icon={FiTrendingUp}
            color="orange"
            onClick={() => router.push('/dashboard/admin/affiliates')}
          />
        </SimpleGrid>

        <Box
          bg={useColorModeValue('white', 'gray.800')}
          shadow="xl"
          borderRadius="2xl"
          overflow="hidden"
          borderWidth="1px"
        >
          <Box p={6} borderBottomWidth="1px">
            <Heading size="md">Aktivne Kampanje</Heading>
          </Box>

          <TableContainer>
            <Table variant="simple" size="md">
              <Thead bg={useColorModeValue('gray.50', 'whiteAlpha.50')}>
                <Tr>
                  <Th>Influencer - Activity</Th>
                  <Th>Status</Th>
                  <Th>Budget</Th>
                  <Th>Progress</Th>
                  <Th>Last Updated</Th>
                </Tr>
              </Thead>
              <Tbody>
                {sortedCampaigns.map((campaign, index) => {
                  const isFirstInactive =
                    !campaign.isActive && sortedCampaigns[index - 1]?.isActive
                  const statusColor = campaign.isActive ? 'green' : 'red'

                  return (
                    <React.Fragment key={campaign.id}>
                      {isFirstInactive && (
                        <Tr bg={useColorModeValue('gray.100', 'gray.700')}>
                          <Td colSpan={5} py={2}>
                            <Text
                              fontSize="xs"
                              fontWeight="bold"
                              color="gray.500"
                              textTransform="uppercase"
                            >
                              Inactive Campaigns
                            </Text>
                          </Td>
                        </Tr>
                      )}
                      <Tr
                        onClick={() =>
                          router.push(
                            `/dashboard/admin/campaign/${campaign.id}`,
                          )
                        }
                        cursor="pointer"
                        transition="background 0.2s"
                        _hover={{
                          bg: useColorModeValue(
                            `${statusColor}.50`,
                            `${statusColor}.900`,
                          ),
                        }}
                        bg={
                          campaign.isActive
                            ? 'rgba(72, 187, 120, 0.05)'
                            : 'rgba(245, 101, 101, 0.05)'
                        }
                      >
                        <Td>
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="bold" fontSize="sm">
                              {campaign.influencer}
                            </Text>
                            <Text fontSize="xs" color="gray.500">
                              {campaign.activity}
                            </Text>
                          </VStack>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={statusColor}
                            variant="subtle"
                            px={3}
                            borderRadius="full"
                          >
                            {campaign.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </Td>
                        <Td>
                          <HStack spacing={1}>
                            <Text fontWeight="bold">${campaign.budget}</Text>
                            <Text fontSize="xs" color="gray.400">
                              / ${campaign.moneySpent?.toFixed(2)} spent
                            </Text>
                          </HStack>
                        </Td>
                        <Td minW="200px">
                          <VStack align="stretch" spacing={1}>
                            <HStack justify="space-between">
                              <Text fontSize="xs" fontWeight="bold">
                                {campaign.progress}%
                              </Text>
                              <Text fontSize="xs" color="gray.500">
                                {campaign.totalViews?.toLocaleString()} views
                              </Text>
                            </HStack>
                            <Progress
                              value={campaign.progress}
                              size="xs"
                              colorScheme={
                                campaign.progress > 80 ? 'orange' : 'green'
                              }
                              borderRadius="full"
                            />
                          </VStack>
                        </Td>
                        <Td>
                          <HStack color="gray.500" spacing={2}>
                            <Icon as={FiCalendar} />
                            <Text fontSize="sm">
                              {campaign.lastUpdatedAt
                                ? new Date(
                                    campaign.lastUpdatedAt,
                                  ).toLocaleDateString()
                                : 'N/A'}
                            </Text>
                          </HStack>
                        </Td>
                      </Tr>
                    </React.Fragment>
                  )
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </VStack>

      {/* CREATE MODAL WITH ALL FIELDS */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(5px)" />
        <ModalContent borderRadius="2xl">
          <ModalHeader borderBottomWidth="1px">
            Kreiraj novu kampanju
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <VStack spacing={6} align="stretch">
              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <GridItem colSpan={1}>
                  <FormControl isRequired>
                    <FormLabel fontSize="xs">Influencer</FormLabel>
                    <Input
                      placeholder="Ime"
                      onChange={(e) =>
                        setNewCampaign({
                          ...newCampaign,
                          influencer: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </GridItem>
                <GridItem colSpan={1}>
                  <FormControl isRequired>
                    <FormLabel fontSize="xs">Aktivnost</FormLabel>
                    <Input
                      placeholder="TikTok/Reels"
                      onChange={(e) =>
                        setNewCampaign({
                          ...newCampaign,
                          activity: e.target.value,
                        })
                      }
                    />
                  </FormControl>
                </GridItem>
              </Grid>
              <FormControl>
                <FormLabel fontSize="xs">Slika Kampanje (Cover Image)</FormLabel>
                <HStack spacing={4}>
                  {newCampaign.imageUrl && (
                    <Image
                      src={newCampaign.imageUrl}
                      boxSize="50px"
                      objectFit="cover"
                      borderRadius="md"
                      alt="Preview"
                    />
                  )}
                  <Box position="relative" w="full">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      p={1}
                      fontSize="sm"
                    />
                    {isUploading && (
                      <Spinner
                        size="xs"
                        position="absolute"
                        right="10px"
                        top="10px"
                        color="green.500"
                      />
                    )}
                  </Box>
                </HStack>
                <Text fontSize="10px" color="gray.500" mt={1}>
                  Ova slika će biti prikazana korisnicima na dashboardu.
                </Text>
              </FormControl>
              <Divider />

              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel fontSize="xs">Budžet ($)</FormLabel>
                  <NumberInput
                    min={0}
                    onChange={(_, val) =>
                      setNewCampaign({ ...newCampaign, budget: val })
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs">Per Million ($)</FormLabel>
                  <NumberInput
                    min={0}
                    onChange={(_, val) =>
                      setNewCampaign({ ...newCampaign, perMillion: val })
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs">Min Views/Payout</FormLabel>
                  <NumberInput
                    min={0}
                    onChange={(_, val) =>
                      setNewCampaign({ ...newCampaign, minViewsForPayout: val })
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </Grid>

              <Grid templateColumns="repeat(3, 1fr)" gap={4}>
                <FormControl>
                  <FormLabel fontSize="xs">Max Earnings ($)</FormLabel>
                  <NumberInput
                    min={0}
                    onChange={(_, val) =>
                      setNewCampaign({ ...newCampaign, maxEarnings: val })
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs">Max / Post ($)</FormLabel>
                  <NumberInput
                    min={0}
                    onChange={(_, val) =>
                      setNewCampaign({
                        ...newCampaign,
                        maxEarningsPerPost: val,
                      })
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                <FormControl>
                  <FormLabel fontSize="xs">Max Submissions</FormLabel>
                  <NumberInput
                    min={0}
                    onChange={(_, val) =>
                      setNewCampaign({ ...newCampaign, maxSubmissions: val })
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </Grid>

              <Divider />

              <FormControl>
                <FormLabel fontSize="xs">Discord Invite Link</FormLabel>
                <Input
                  placeholder="https://discord.gg/..."
                  onChange={(e) =>
                    setNewCampaign({
                      ...newCampaign,
                      discordInvite: e.target.value,
                    })
                  }
                />
              </FormControl>

              <HStack spacing={10}>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm">
                    Pot System?
                  </FormLabel>
                  <Switch
                    colorScheme="purple"
                    isChecked={newCampaign.isPot}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        isPot: e.target.checked,
                      })
                    }
                  />
                </FormControl>
                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0" fontSize="sm">
                    Aktivna?
                  </FormLabel>
                  <Switch
                    colorScheme="green"
                    isChecked={newCampaign.isActive}
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        isActive: e.target.checked,
                      })
                    }
                  />
                </FormControl>
              </HStack>

              {newCampaign.isPot && (
                <FormControl>
                  <FormLabel fontSize="xs" color="purple.500">
                    Pot System Text (Per Million Text)
                  </FormLabel>
                  <Input
                    placeholder="npr. $500 shared pot"
                    onChange={(e) =>
                      setNewCampaign({
                        ...newCampaign,
                        perMillionText: e.target.value,
                      })
                    }
                  />
                </FormControl>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter borderTopWidth="1px">
            <Button variant="ghost" mr={3} onClick={onClose}>
              Odustani
            </Button>
            <Button
              colorScheme="green"
              px={8}
              onClick={handleCreateCampaign}
              isLoading={isUploading}
              isDisabled={isUploading}
            >
              Kreiraj Kampanju
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
