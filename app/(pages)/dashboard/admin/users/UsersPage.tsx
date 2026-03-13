'use client'

import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Center,
  Collapse,
  Divider,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
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
import {
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiCopy,
  FiDollarSign,
  FiSearch,
  FiTrendingUp,
  FiUser,
} from 'react-icons/fi'

import React, { useEffect, useMemo, useState } from 'react'

import { IUser } from '../../../../lib/models/user'

interface UsersPageProps {
  idToken: string
}

const UsersPage: React.FC<UsersPageProps> = ({ idToken }) => {
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortType, setSortType] = useState<'date' | 'balance'>('date')
  const [isProcessing, setIsProcessing] = useState<string | null>(null)

  const toast = useToast()
  const bgGradient = useColorModeValue(
    'linear(to-br, gray.50, white)',
    'linear(to-br, gray.900, gray.800)',
  )
  const cardBg = useColorModeValue('white', 'gray.800')

  useEffect(() => {
    const getUsers = async () => {
      try {
        const response = await fetch(
          `/api/user/get-all-requested-payout?t=${Date.now()}`,
        )
        const data = await response.json()
        setUsers(data ?? [])
      } catch (error) {
        toast({ title: 'Greška pri učitavanju', status: 'error' })
      } finally {
        setLoading(false)
      }
    }
    getUsers()
  }, [toast])

  const totalUnpaid = useMemo(() => {
    return users.reduce((acc, user) => acc + (user.balance || 0), 0)
  }, [users])

  const filteredAndSortedUsers = useMemo(() => {
    if (!users) return []

    const filtered = users.filter((user) => {
      const searchLower = searchQuery.toLowerCase()
      return (
        user.email?.toLowerCase().includes(searchLower) ||
        user.id?.toLowerCase().includes(searchLower) ||
        user.walletAddress?.toLowerCase().includes(searchLower)
      )
    })

    return [...filtered].sort((a, b) => {
      if (sortType === 'balance') {
        return (b.balance || 0) - (a.balance || 0)
      } else {
        if (!a.payoutRequested) return 1
        if (!b.payoutRequested) return -1
        return (
          new Date(b.payoutRequested).getTime() -
          new Date(a.payoutRequested).getTime()
        )
      }
    })
  }, [users, searchQuery, sortType])

  const handleSetBalance = async (uid: string, customAmount?: number) => {
    const isReset = customAmount === undefined || customAmount === 0
    if (isReset && !confirm('Potvrdi isplatu i reset balansa na $0?')) return

    try {
      setIsProcessing(uid)
      const response = await fetch('/api/admin/set-user-balance', {
        method: 'POST',
        body: JSON.stringify({ uid, newBalance: customAmount }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      })

      if (!response.ok) throw new Error()

      setUsers((prev) =>
        prev.map((u) =>
          u.id === uid
            ? {
                ...u,
                balance: isReset ? 0 : (customAmount ?? 0),
                payoutRequested: isReset ? '' : u.payoutRequested,
              }
            : u,
        ),
      )
      toast({
        title: isReset ? 'Isplaćeno' : 'Balans ažuriran',
        status: 'success',
      })
    } catch (e) {
      toast({ title: 'Greška pri ažuriranju', status: 'error' })
    } finally {
      setIsProcessing(null)
    }
  }

  if (loading)
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )

  return (
    <Box
      minH="100vh"
      bgGradient={bgGradient}
      py={{ base: 4, md: 10 }}
      px={{ base: 2, md: 8 }}
    >
      <VStack
        spacing={6}
        maxW={{ base: '100%', lg: '1100px', xl: '1300px' }}
        mx="auto"
        align="stretch"
      >
        {/* Stats Section */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Box
            bg={cardBg}
            p={5}
            borderRadius="2xl"
            shadow="sm"
            borderWidth="1px"
          >
            <Stat>
              <StatLabel color="gray.500" fontWeight="bold">
                UKUPNO ZA ISPLATU
              </StatLabel>
              <StatNumber fontSize="3xl" color="green.500">
                ${totalUnpaid.toLocaleString()}
              </StatNumber>
              <Text fontSize="xs" color="gray.400">
                Suma svih aktivnih balansa
              </Text>
            </Stat>
          </Box>
          <Box
            bg={cardBg}
            p={5}
            borderRadius="2xl"
            shadow="sm"
            borderWidth="1px"
          >
            <Stat>
              <StatLabel color="gray.500" fontWeight="bold">
                AKTIVNI ZAHTEVI
              </StatLabel>
              <StatNumber fontSize="3xl" color="blue.500">
                {users.length}
              </StatNumber>
              <Text fontSize="xs" color="gray.400">
                Broj korisnika u listi
              </Text>
            </Stat>
          </Box>
        </SimpleGrid>

        {/* Search & Sort Controls */}
        <Flex
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <Heading size="lg" fontWeight="extrabold" color="blue.600">
            Korisnici & Isplate
          </Heading>

          <HStack spacing={3} wrap="wrap">
            <ButtonGroup isAttached size="sm" variant="outline">
              <Button
                leftIcon={<FiClock />}
                onClick={() => setSortType('date')}
                isActive={sortType === 'date'}
                _active={{ bg: 'blue.500', color: 'white' }}
              >
                Datum
              </Button>
              <Button
                leftIcon={<FiTrendingUp />}
                onClick={() => setSortType('balance')}
                isActive={sortType === 'balance'}
                _active={{ bg: 'blue.500', color: 'white' }}
              >
                Balans
              </Button>
            </ButtonGroup>

            <InputGroup maxW={{ base: 'full', md: '300px' }}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Pretraži..."
                bg={cardBg}
                borderRadius="xl"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </HStack>
        </Flex>

        {/* Main Table */}
        <Box
          bg={cardBg}
          shadow="xl"
          borderRadius="2xl"
          overflow="hidden"
          borderWidth="1px"
        >
          <TableContainer>
            <Table variant="simple" layout="fixed">
              <Thead bg={useColorModeValue('gray.50', 'whiteAlpha.50')}>
                <Tr>
                  <Th w={{ base: '150px', md: '350px' }}>Korisnik</Th>
                  <Th w="120px" isNumeric>
                    Balans
                  </Th>
                  <Th w={{ base: '120px', md: '180px' }}>Datum Zahteva</Th>
                  <Th w="60px"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredAndSortedUsers.length === 0 ? (
                  <Tr>
                    <Td colSpan={4} textAlign="center" py={10}>
                      Nema rezultata pretrage.
                    </Td>
                  </Tr>
                ) : (
                  filteredAndSortedUsers.map((user) => (
                    <UserPayoutRow
                      key={user.id}
                      user={user}
                      onSetBalance={handleSetBalance}
                      isProcessing={isProcessing === user.id}
                    />
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </VStack>
    </Box>
  )
}

const UserPayoutRow = ({ user, onSetBalance, isProcessing }: any) => {
  const [isOpen, setIsOpen] = useState(false)
  const [manualAmount, setManualAmount] = useState<number>(user.balance || 0)
  const toast = useToast()
  const expandedBg = useColorModeValue('blue.50', 'whiteAlpha.50')

  return (
    <>
      <Tr
        _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.50') }}
        cursor="pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Td>
          <HStack spacing={3}>
            <Avatar size="xs" name={user.email} />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="xs" noOfLines={1}>
                {user.email || user.id}
              </Text>
              <Text fontSize="9px" color="gray.400">
                ID: {user.id?.slice(-8).toUpperCase()}
              </Text>
            </VStack>
          </HStack>
        </Td>
        <Td isNumeric>
          <Text fontWeight="extrabold" color="green.500">
            ${user.balance?.toLocaleString()}
          </Text>
        </Td>
        <Td>
          <Badge
            fontSize="9px"
            colorScheme={user.payoutRequested ? 'orange' : 'gray'}
            variant="subtle"
          >
            {user.payoutRequested
              ? new Date(user.payoutRequested).toLocaleDateString('sr-RS')
              : 'Nema zahteva'}
          </Badge>
        </Td>
        <Td textAlign="right">
          <IconButton
            size="xs"
            variant="ghost"
            icon={isOpen ? <FiChevronUp /> : <FiChevronDown />}
            aria-label="toggle"
          />
        </Td>
      </Tr>

      <Tr>
        <Td colSpan={4} p={0} borderBottom={isOpen ? '1px solid' : 'none'}>
          <Collapse in={isOpen} animateOpacity>
            <Box p={5} bg={expandedBg}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                <VStack align="start" spacing={4}>
                  <Box w="full">
                    <Text
                      fontSize="9px"
                      fontWeight="bold"
                      color="gray.500"
                      mb={1}
                    >
                      WALLET ADRESA
                    </Text>
                    <HStack
                      p={2}
                      borderRadius="md"
                      borderWidth="1px"
                      w="full"
                    >
                      <Text
                        fontSize="xs"
                        fontFamily="mono"
                        noOfLines={1}
                        flex={1}
                      >
                        {user.walletAddress || 'Nije uneta'}
                      </Text>
                      <IconButton
                        size="xs"
                        icon={<FiCopy />}
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(user.walletAddress)
                          toast({
                            title: 'Kopirano',
                            status: 'info',
                            duration: 1000,
                          })
                        }}
                        aria-label="copy"
                      />
                    </HStack>
                  </Box>
                </VStack>

                <VStack
                  align={{ base: 'start', md: 'end' }}
                  justify="center"
                  spacing={4}
                >
                  <HStack w={{ base: 'full', md: '280px' }}>
                    <Text fontSize="xs" fontWeight="bold" whiteSpace="nowrap">
                      UPDATE BALANCE:
                    </Text>
                    <Input
                      size="sm"
                      type="number"
                      value={manualAmount}
                      onChange={(e) => setManualAmount(Number(e.target.value))}
                      borderRadius="md"
                      textAlign="right"
                    />
                    <IconButton
                      size="sm"
                      icon={<FiCheck />}
                      colorScheme="cyan"
                      isLoading={isProcessing}
                      onClick={(e) => {
                        e.stopPropagation()
                        onSetBalance(user.id, manualAmount)
                      }}
                      aria-label="Save manual"
                    />
                  </HStack>

                  <Button
                    leftIcon={<FiDollarSign />}
                    colorScheme="blue"
                    size="md"
                    w={{ base: 'full', md: '280px' }}
                    onClick={(e) => {
                      e.stopPropagation()
                      onSetBalance(user.id)
                    }}
                    isLoading={isProcessing}
                  >
                    Potvrdi isplatu (Reset na $0)
                  </Button>
                </VStack>
              </SimpleGrid>
            </Box>
          </Collapse>
        </Td>
      </Tr>
    </>
  )
}

export default UsersPage
