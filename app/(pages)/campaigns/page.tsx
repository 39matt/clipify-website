'use client'
import {
  Box,
  Heading,
  VStack,
  Grid,
  Container,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import CampaignCard from '#components/app/CampaignCard/CampaignCard'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllCampaigns } from '../../lib/firebase/firestore/campaign'
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
        const response = await fetch('/api/campaign/get-all', {
          method:"GET"
        })
        const campaigns = await response.json() as ICampaign[]
        setCampaignList(campaigns)
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
    <Box minH="100vh" bgGradient={bgGradient}>
      <Container maxW="container.xl" py={{ base: 6, md: 12 }}>
        <VStack spacing={{ base: 8, md: 12 }}>
          {/* Header Section */}
          <Box textAlign="center" maxW="2xl">
            <Heading
              fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
              fontWeight="bold"
              bgGradient="linear(to-r, green.400, teal.500)"
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
            <Grid
              templateColumns={{
                base: '1fr',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(4, 1fr)',
              }}
              gap={{ base: 6, md: 8 }}
              w="full"
            >
              {campaignList.map((campaign, index) => (
                <Box
                  key={campaign.id || index}
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
            </Grid>
          ) : (
            <VStack spacing={4} py={12}>
              <Text fontSize="xl" color="gray.500" textAlign="center">
                Trenutno nema aktivnih kampanja
              </Text>
              <Text fontSize="md" color="gray.400" textAlign="center">
                Provjerite ponovo uskoro za nove kampanje
              </Text>
            </VStack>
          )}
        </VStack>
      </Container>
    </Box>
  )
}

export default Campaigns