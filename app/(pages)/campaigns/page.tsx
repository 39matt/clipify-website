'use client'

import {
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  Select,
  SimpleGrid,
  Skeleton,
  Text,
  VStack,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import { useRouter } from 'next/navigation'
import { FiGrid } from 'react-icons/fi'

import { useEffect, useState } from 'react'

import CampaignCard from '#components/app/CampaignCard/CampaignCard'

import { ICampaign } from '../../lib/models/campaign'

const normalizeActivity = (activity: string) =>
  activity.trim().replace(/\s+/g, ' ').toLocaleLowerCase()

const Campaigns: NextPage = () => {
  const router = useRouter()
  const [campaignList, setCampaignList] = useState<ICampaign[]>([])
  const [selectedActivity, setSelectedActivity] = useState('all')
  const [loading, setLoading] = useState(true)

  const availableActivities = Array.from(
    campaignList.reduce((activities, campaign) => {
      const label = campaign.activity.trim().replace(/\s+/g, ' ')

      if (label) activities.set(normalizeActivity(label), label)

      return activities
    }, new Map<string, string>()),
  ).sort(([, first], [, second]) => first.localeCompare(second))

  const filteredCampaigns =
    selectedActivity === 'all'
      ? campaignList
      : campaignList.filter(
          (campaign) =>
            normalizeActivity(campaign.activity) === selectedActivity,
        )

  useEffect(() => {
    const getCampaigns = async () => {
      try {
        const timestamp = Date.now()
        const response = await fetch(`/api/campaign/get-all?t=${timestamp}`, {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        })
        const campaigns = (await response.json()) as ICampaign[]

        setCampaignList(campaigns.filter((campaign) => campaign.isActive))
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    getCampaigns()
  }, [])

  return (
    <Box minH="100vh" w="full" bg="#090A0F">
      <Container
        maxW="8xl"
        px={{ base: 4, md: 8, lg: 12 }}
        pt={{ base: 20, md: 16 }}
        pb={{ base: 10, md: 16 }}
      >
        <VStack spacing={{ base: 7, md: 10 }} w="full" align="stretch">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'start', md: 'flex-end' }}
            gap={{ base: 6, md: 4 }}
            borderBottom="1px solid"
            borderColor="whiteAlpha.100"
            pb={{ base: 5, md: 6 }}
          >
            <VStack align="start" spacing={3} maxW="2xl">
              <HStack spacing={3}>
                <Flex
                  p={2}
                  bg="green.500"
                  borderRadius="lg"
                  boxShadow="0 0 20px rgba(72, 187, 120, 0.3)"
                >
                  <Icon as={FiGrid} color="white" boxSize={6} />
                </Flex>
                <Heading
                  fontSize={{ base: '3xl', lg: '4xl' }}
                  fontWeight="black"
                  color="white"
                  letterSpacing="tight"
                >
                  Aktivne kampanje
                </Heading>
              </HStack>
              <Text
                fontSize={{ base: 'md', md: 'lg' }}
                color="whiteAlpha.600"
                lineHeight="tall"
              >
                Pridružite se našim kampanjama, ispunite uslove za preglede i
                ostvarite zaradu na osnovu vaših rezultata.
              </Text>
            </VStack>

            {!loading && availableActivities.length > 1 && (
              <VStack
                align="start"
                spacing={2}
                w={{ base: 'full', md: 'auto' }}
              >
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="whiteAlpha.500"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Aktivnost
                </Text>
                <Select
                  aria-label="Filtriraj kampanje po aktivnosti"
                  value={selectedActivity}
                  onChange={(event) => setSelectedActivity(event.target.value)}
                  w={{ base: 'full', md: '260px' }}
                  h="44px"
                  bg="#111318"
                  color="white"
                  borderColor="whiteAlpha.200"
                  borderRadius="xl"
                  fontWeight="medium"
                  _hover={{ borderColor: 'whiteAlpha.400' }}
                  _focus={{
                    borderColor: 'green.400',
                    boxShadow: '0 0 0 1px var(--chakra-colors-green-400)',
                  }}
                  sx={{
                    '& option': {
                      bg: '#111318',
                      color: 'white',
                    },
                  }}
                >
                  <option value="all">Sve aktivnosti</option>
                  {availableActivities.map(([activity, label]) => (
                    <option key={activity} value={activity}>
                      {label}
                    </option>
                  ))}
                </Select>
              </VStack>
            )}
          </Flex>

          {loading ? (
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
              spacing={{ base: 4, md: 6 }}
              w="full"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton
                  key={i}
                  h={{ base: '390px', md: '420px' }}
                  w="full"
                  borderRadius="2xl"
                  startColor="#121418"
                  endColor="#1A1D24"
                />
              ))}
            </SimpleGrid>
          ) : filteredCampaigns.length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
              spacing={{ base: 4, md: 6 }}
              w="full"
            >
              {campaignList.map((campaign) => (
                <Box
                  key={campaign.id}
                  display={
                    selectedActivity === 'all' ||
                    normalizeActivity(campaign.activity) === selectedActivity
                      ? 'block'
                      : 'none'
                  }
                >
                  <CampaignCard campaign={campaign} router={router} />
                </Box>
              ))}
            </SimpleGrid>
          ) : (
            <Flex
              w="full"
              py={{ base: 16, md: 20 }}
              px={4}
              direction="column"
              align="center"
              justify="center"
              bg="#121418"
              borderRadius="2xl"
              border="1px dashed"
              borderColor="whiteAlpha.200"
            >
              <Icon as={FiGrid} boxSize={12} color="whiteAlpha.200" mb={4} />
              <Text
                fontSize="xl"
                fontWeight="semibold"
                color="whiteAlpha.800"
                mb={2}
                textAlign="center"
              >
                {selectedActivity === 'all'
                  ? 'Trenutno nema aktivnih kampanja'
                  : 'Nema kampanja za izabranu aktivnost'}
              </Text>
              <Text fontSize="md" color="whiteAlpha.500" textAlign="center">
                {selectedActivity === 'all'
                  ? 'Proverite ponovo uskoro za nove prilike za zaradu.'
                  : 'Izaberite drugu aktivnost da vidite dostupne kampanje.'}
              </Text>
            </Flex>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default Campaigns
