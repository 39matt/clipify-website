import { AspectRatio, Badge, Box, Button, Card, CardBody, CardFooter, Flex, HStack, Heading, Icon, Image, Progress, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { FaBurn } from 'react-icons/fa';
import { FiArrowRight, FiTarget, FiTrendingUp } from 'react-icons/fi';



import { ICampaign } from '../../../app/lib/models/campaign';


interface CampaignCardProps {
  campaign: ICampaign
  router: AppRouterInstance
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, router }) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.100', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const headingColor = useColorModeValue('gray.900', 'white')
  const mutedBg = useColorModeValue('gray.50', 'gray.700')
  const accentColor = useColorModeValue('green.500', 'green.400')

  const formatBudget = (budget: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(budget)
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'red'
    if (progress >= 50) return 'orange'
    return 'green'
  }

  const roundedProgress = campaign.influencer.includes('Trajko') ? 0 : Math.round(campaign.progress * 100) / 100

  return (
    <Card
      w="full"
      maxW="340px"
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="2xl"
      overflow="hidden"
      shadow="sm"
      transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
      _hover={{
        shadow: '2xl',
        transform: 'translateY(-4px)',
        borderColor: accentColor,
      }}
      cursor="pointer"
      onClick={() => router.push(`/campaigns/${campaign.id}`)}
      display="flex"
      flexDirection="column"
    >
      {/* Image Section */}
      <Box position="relative" flexShrink={0}>
        <AspectRatio ratio={16 / 9}>
          <Box position="relative" w="full" h="full" overflow="hidden">
            <Image
              src={campaign.imageUrl}
              alt={`${campaign.influencer} campaign`}
              objectFit="cover"
              objectPosition="center"
              transition="transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              _groupHover={{ transform: 'scale(1.08)' }}
              w="full"
              h="full"
            />
            {/* Gradient overlay */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bgGradient="linear(to-b, transparent 0%, blackAlpha.400 100%)"
            />
          </Box>
        </AspectRatio>

        {/* Fire Badge */}
        <Badge
          position="absolute"
          top={4}
          right={4}
          bg="whiteAlpha.900"
          backdropFilter="blur(10px)"
          color="orange.500"
          borderRadius="full"
          px={3}
          py={1.5}
          fontSize="sm"
          fontWeight="bold"
          display="flex"
          alignItems="center"
          gap={1}
          shadow="lg"
        >
          <Icon as={FaBurn} />
        </Badge>
      </Box>

      {/* Content Section */}
      <CardBody p={6} flex="1" display="flex" flexDirection="column">
        <VStack align="stretch" spacing={5} flex="1">
          {/* Title */}
          <Heading
            fontSize={{ base: 'xl', md: '2xl' }}
            color={headingColor}
            fontWeight="bold"
            lineHeight="shorter"
            noOfLines={2}
          >
            {campaign.influencer}
          </Heading>

          {/* Activity Tag */}
          <HStack
            spacing={2}
            px={3}
            py={2}
            bg={mutedBg}
            borderRadius="lg"
            alignSelf="flex-start"
          >
            <Icon as={FiTarget} color={accentColor} boxSize={4} />
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
            <Flex justify="space-between" align="center" mb={2}>
              <HStack spacing={2}>
                <Icon as={FiTrendingUp} color={accentColor} boxSize={4} />
                <Text fontSize="sm" color={textColor} fontWeight="medium">
                  Napredak
                </Text>
              </HStack>
              <Badge
                colorScheme={getProgressColor(roundedProgress)}
                borderRadius="md"
                px={2}
                py={0.5}
                fontSize="xs"
                fontWeight="bold"
              >
                {roundedProgress}%
              </Badge>
            </Flex>
            <Progress
              value={roundedProgress}
              size="md"
              colorScheme={getProgressColor(roundedProgress)}
              borderRadius="full"
              bg={useColorModeValue('gray.100', 'gray.700')}
              sx={{
                '& > div': {
                  transition: 'width 0.6s ease',
                },
              }}
            />
          </Box>

          {/* Budget Section */}
          <Box
            mt="auto"
            p={4}
            bg={mutedBg}
            borderRadius="xl"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <HStack justify="space-between" align="center">
              <VStack align="flex-start" spacing={0}>
                <HStack spacing={1}>
                  <Text fontSize="xs" color={textColor} fontWeight="medium">
                    Budžet
                  </Text>
                </HStack>
                <Text
                  fontSize="3xl"
                  fontWeight="extrabold"
                  color={accentColor}
                  lineHeight="shorter"
                >
                  {formatBudget(campaign.budget)}
                </Text>
              </VStack>
            </HStack>
          </Box>
        </VStack>
      </CardBody>

      {/* Footer */}
      <CardFooter pt={0} pb={6} px={6} flexShrink={0}>
        <Button
          w="full"
          colorScheme="green"
          size="lg"
          borderRadius="xl"
          fontWeight="semibold"
          rightIcon={<Icon as={FiArrowRight} />}
          transition="all 0.2s"
          _hover={{
            transform: 'translateX(2px)',
          }}
          _active={{
            transform: 'translateX(0px)',
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