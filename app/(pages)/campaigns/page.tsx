'use client'
import {
  Box,
  Heading,
  VStack,
  Container,
  Spinner,
  Text,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import CampaignCard from '#components/app/CampaignCard/CampaignCard'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ICampaign } from '../../lib/models/campaign'

const Campaigns: NextPage = () => {
  const router = useRouter()
  const [campaignList, setCampaignList] = useState<ICampaign[]>()
  const [loading, setLoading] = useState(true)

  const bgGradient = useColorModeValue(
    'linear(to-br, gray.50, white)',
    'linear(to-br, gray.900, gray.800)'
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
        console.error('Error fetching campaigns:', error)
      } finally {
        setLoading(false)
      }
    }

    getCampaigns()
  }, [])

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="center" justify="center" minH="50vh">
          <Spinner size="xl" color="green.400" thickness="4px" />
          <Text fontSize="lg" color="gray.600">
            Učitavanje kampanja...
          </Text>
        </VStack>
      </Container>
    )
  }

  return (
    <Box minH="100vh" minW="full" bgGradient={bgGradient}>
      <Container maxW="container.xl" py={{ base: 6, md: 12 }}>
        <VStack spacing={{ base: 8, md: 12 }}>
          {/* Header Section */}
          <Box textAlign="center" maxW="2xl">
            <Heading
              fontSize={{ base: 28, lg: 36 }}
              fontWeight="bold"
              bgGradient="linear(to-r, green.400, teal.500)"
              // bg="white"
              bgClip="text"
              mb={4}
            >
              Aktivne kampanje
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.600"
              maxW="lg"
              mx="auto"
            >
              Pridružite se našim kampanjama i pomozite u ostvarivanju važnih
              ciljeva
            </Text>
          </Box>

          {/* Campaigns Grid */}
          {campaignList && campaignList.length > 0 ? (
            <Flex
              flexWrap="wrap"
              gap={12}
              w="full"
            >
              {campaignList.map((campaign, index) => (
                <Box
                  key={campaign.id || index}
                  maxW="320px"
                  w="full"
                  mx={{base:"auto", md: 0}}
                  transform="scale(1)"
                  transition="all 0.2s ease-in-out"
                  _hover={{
                    transform: 'translateY(-4px)',
                    shadow: 'xl',
                  }}
                >
                  <CampaignCard campaign={campaign} router={router} />
                </Box>
              ))}
            </Flex>
          ) : (
            <VStack spacing={4} py={12}>
              <Text fontSize="xl" color="gray.500" textAlign="center">
                Trenutno nema aktivnih kampanja
              </Text>
              <Text fontSize="md" color="gray.400" textAlign="center">
                Proverite ponovo uskoro za nove kampanje
              </Text>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default Campaigns