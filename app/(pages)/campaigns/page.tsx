'use client'

import {
  Box,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
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

const Campaigns: NextPage = () => {
  const router = useRouter()
  const [campaignList, setCampaignList] = useState<ICampaign[]>([])
  const [loading, setLoading] = useState(true)

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
        py={{ base: 8, md: 16 }}
      >
        <VStack spacing={10} w="full" align="stretch">
          <Flex
            direction={{ base: 'column', md: 'row' }}
            justify="space-between"
            align={{ base: 'start', md: 'flex-end' }}
            gap={4}
            borderBottom="1px solid"
            borderColor="whiteAlpha.100"
            pb={6}
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
          </Flex>

          {loading ? (
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
              spacing={6}
              w="full"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <Skeleton
                  key={i}
                  h="420px"
                  w="full"
                  borderRadius="2xl"
                  startColor="#121418"
                  endColor="#1A1D24"
                />
              ))}
            </SimpleGrid>
          ) : campaignList.length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, sm: 2, lg: 3, xl: 4 }}
              spacing={6}
              w="full"
            >
              {campaignList.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  router={router}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Flex
              w="full"
              py={20}
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
              >
                Trenutno nema aktivnih kampanja
              </Text>
              <Text fontSize="md" color="whiteAlpha.500">
                Proverite ponovo uskoro za nove prilike za zaradu.
              </Text>
            </Flex>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default Campaigns
