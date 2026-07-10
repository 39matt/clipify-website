'use client'

import {
  AspectRatio,
  Badge,
  Box,
  Divider,
  Flex,
  HStack,
  Icon,
  Image,
  Progress,
  Text,
  VStack,
} from '@chakra-ui/react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { FiDollarSign, FiEye, FiTrendingUp, FiVideo } from 'react-icons/fi'

import { ICampaign } from '../../../app/lib/models/campaign'

interface CampaignCardProps {
  campaign: ICampaign
  router: AppRouterInstance
}

const formatMoney = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatNumber = (num: number) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, router }) => {
  const moneySpent =
    campaign.moneySpent ??
    Math.round((campaign.budget * campaign.progress) / 100)
  const progressPercent = Math.min((moneySpent / campaign.budget) * 100, 100)

  return (
    <Box
      w="full"
      bg="#111318"
      border="1px solid"
      borderColor="whiteAlpha.100"
      borderRadius="2xl"
      overflow="hidden"
      position="relative"
      transition="all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
      _hover={{
        borderColor: 'brand.500',
        transform: 'translateY(-4px)',
        boxShadow:
          '0 12px 24px -10px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.05)',
      }}
      cursor="pointer"
      onClick={() => router.push(`/campaigns/${campaign.id}`)}
    >
      <Box position="relative">
        <AspectRatio ratio={16 / 9}>
          <Image
            src={campaign.imageUrl}
            alt={`Kampanja: ${campaign.activity}`}
            objectFit="cover"
            w="full"
            h="full"
            fallback={<Box bg="gray.800" w="full" h="full" />}
          />
        </AspectRatio>

        <HStack position="absolute" top={3} left={3} spacing={2}>
          <Badge
            bg={campaign.isActive ? 'green.500' : 'gray.500'}
            color="white"
            px={2.5}
            py={1}
            borderRadius="full"
            fontSize="xs"
            fontWeight="bold"
            textTransform="uppercase"
            boxShadow="0 4px 12px rgba(0,0,0,0.3)"
          >
            {campaign.isActive ? 'Aktivna' : 'Završena'}
          </Badge>
          {campaign.isPot && (
            <Badge
              bg="purple.500"
              color="white"
              px={2.5}
              py={1}
              borderRadius="full"
              fontSize="xs"
            >
              Pot
            </Badge>
          )}
        </HStack>

        {campaign.totalViews > 0 && (
          <Flex
            position="absolute"
            top={3}
            right={3}
            align="center"
            bg="blackAlpha.700"
            backdropFilter="blur(8px)"
            px={2.5}
            py={1}
            borderRadius="full"
            border="1px solid"
            borderColor="whiteAlpha.200"
          >
            <Icon as={FiEye} color="whiteAlpha.800" boxSize={3} mr={1.5} />
            <Text fontSize="xs" color="white" fontWeight="medium">
              {formatNumber(campaign.totalViews)}
            </Text>
          </Flex>
        )}

        <Box
          position="absolute"
          inset={0}
          bgGradient="linear(to-t, #111318 0%, transparent 40%)"
        />
      </Box>

      <VStack align="stretch" spacing={4} p={5} pt={2}>
        <VStack align="start" spacing={1}>
          <Text
            fontSize="xs"
            fontWeight="bold"
            color="blue.400"
            textTransform="uppercase"
            letterSpacing="wider"
          >
            {campaign.influencer}
          </Text>
          <Text
            fontSize="lg"
            fontWeight="bold"
            color="white"
            noOfLines={2}
            lineHeight="1.3"
          >
            {campaign.activity}
          </Text>
        </VStack>

        <Flex gap={3}>
          <Box
            flex={1}
            bg="whiteAlpha.50"
            p={3}
            borderRadius="xl"
            border="1px solid"
            borderColor="whiteAlpha.100"
          >
            <HStack spacing={1.5} mb={1}>
              <Icon as={FiTrendingUp} color="green.400" boxSize={3.5} />
              <Text fontSize="xs" color="whiteAlpha.600" fontWeight="medium">
                Rate
              </Text>
            </HStack>
            <Text fontSize="lg" color="white" fontWeight="bold">
              {campaign.perMillionText ||
                `${formatMoney(campaign.perMillion)} / 1M`}
            </Text>
          </Box>
        </Flex>

        <Divider borderColor="whiteAlpha.100" />

        <VStack align="stretch" spacing={2}>
          <HStack justify="space-between" align="baseline">
            <Text fontSize="xs" color="whiteAlpha.600" fontWeight="medium">
              Potrošen budžet
            </Text>
            <Text fontSize="sm" color="whiteAlpha.500" fontWeight="medium">
              {formatMoney(moneySpent)}{' '}
              <Text as="span" fontSize="lg" color="white" fontWeight="bold">
                / {formatMoney(campaign.budget)}
              </Text>
            </Text>
          </HStack>
          <Progress
            value={progressPercent}
            size="sm"
            borderRadius="full"
            bg="whiteAlpha.100"
            colorScheme={progressPercent > 90 ? 'red' : 'blue'}
          />
        </VStack>
      </VStack>
    </Box>
  )
}

export default CampaignCard
