import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  Progress,
  Stack,
  Text,
  Box,
  Badge,
  HStack,
  VStack,
  Icon,
  AspectRatio,
  useColorModeValue,
} from '@chakra-ui/react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'
import { FiUser, FiActivity, FiDollarSign, FiTrendingUp, FiTarget } from 'react-icons/fi'
import { ICampaign } from '../../../app/lib/models/campaign'
import { FaBurn } from 'react-icons/fa'
import { TargetIcon } from 'lucide-react'

interface CampaignCardProps {
  campaign: ICampaign
  router: AppRouterInstance
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, router }) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const headingColor = useColorModeValue('gray.800', 'white')

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(budget)
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'red'
    if (progress >= 50) return 'yellow'
    return 'green'
  }

  const roundedProgress = Math.round(campaign.progress * 100) / 100

  return (
    <Card
      w="full"
      maxW="320px"
      h="480px"
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="xl"
      overflow="hidden"
      shadow="md"
      transition="all 0.3s ease"
      _hover={{
        shadow: '2xl',
        transform: 'translateY(-2px)',
        borderColor: 'green.300',
      }}
      cursor="pointer"
      onClick={() => router.push(`/campaigns/${campaign.id}`)}
      display="flex"
      flexDirection="column"
    >
      <Box position="relative" flexShrink={0}>
        <AspectRatio ratio={16 / 9}>
          <Box position="relative" w="full" h="full">
            <Image
              backgroundPosition={"bottom"}
              src={campaign.imageUrl}
              alt={`${campaign.influencer} campaign`}
              objectFit="cover"
              transition="transform 0.3s ease"
              _hover={{ transform: 'scale(1.05)' }}
              w="full"
              h="full"
            />
            {/* Green tint overlay */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="black"
              opacity={0.15}
              transition="opacity 0.3s ease"
              _hover={{ opacity: 0.25 }}
            />
          </Box>
        </AspectRatio>

        {/* Progress Badge Overlay */}
        <Badge
          position="absolute"
          top={3}
          right={3}
          colorScheme={getProgressColor(100)}
          borderRadius="full"
          px={3}
          py={1}
          fontSize="xs"
          fontWeight="bold"
          zIndex={2}
        >
          <FaBurn/>
        </Badge>
      </Box>

      <CardBody p={6} flex="1" display="flex" flexDirection="column">
        <VStack align="stretch" spacing={4} flex="1">
          {/* Title */}
          <Heading
            size="md"
            color={headingColor}
            fontWeight="bold"
            lineHeight="1.3"
            noOfLines={2}
            minH="48px" // Fixed height for consistency
          >
            {campaign.influencer}
          </Heading>

          {/* Influencer Info */}
          <HStack spacing={2}>
            <Icon as={TargetIcon} color="green.500" />
            <Text
              fontSize="sm"
              color={textColor}
              fontWeight="medium"
              noOfLines={1}
            >
              {campaign.activity}
            </Text>
          </HStack>

          {/* Progress Section */}
          <Box>
            <HStack justify="space-between" mb={2}>
              <HStack spacing={1}>
                <Icon as={FiTrendingUp} color="green.500" size="sm" />
                <Text fontSize="xs" color={textColor} fontWeight="medium">
                  Napredak
                </Text>
              </HStack>
              <Text fontSize="xs" color={textColor} fontWeight="bold">
                {roundedProgress}%
              </Text>
            </HStack>
            <Progress
              value={roundedProgress}
              size="sm"
              colorScheme={getProgressColor(roundedProgress)}
              borderRadius="full"
              bg={useColorModeValue('gray.100', 'gray.700')}
            />
          </Box>

          {/* Budget */}
          <HStack justify="space-between" align="center" mt="auto">
            <HStack spacing={1}>
              <Icon as={FiDollarSign} color="green.500" />
              <Text fontSize="sm" color={textColor} fontWeight="medium">
                Budžet
              </Text>
            </HStack>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="green.500"
              letterSpacing="tight"
            >
              {formatBudget(campaign.budget)}
            </Text>
          </HStack>
        </VStack>
      </CardBody>

      <CardFooter pt={0} pb={6} px={6} flexShrink={0}>
        <Button
          w="full"
          colorScheme="green"
          size="md"
          borderRadius="lg"
          fontWeight="semibold"
          _hover={{
            transform: 'translateY(-1px)',
            shadow: 'lg',
          }}
          onClick={(e) => {
            e.stopPropagation()
            router.push(`/campaigns/${campaign.id}`)
          }}
        >
          Detalji
        </Button>
      </CardFooter>
    </Card>
  )
}

export default CampaignCard