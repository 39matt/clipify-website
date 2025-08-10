import {
  AspectRatio,
  Badge,
  Box,
  Card,
  CardBody,
  HStack,
  Image,
  SimpleGrid,
  Stat, StatLabel, StatNumber,
  Text,
  VStack,
} from '@chakra-ui/react'
import { IVideo } from '../../../app/lib/models/video'

const VideoCard = ({video, index}: {video:IVideo, index: number}) => {
  return (
    <Card key={video.id || index} bg="gray.700" borderRadius="md" overflow="hidden">
      <AspectRatio ratio={9/16} maxH="200px">
        <Image
          src={video.coverUrl}
          alt={video.name || 'Video'}
          objectFit="cover"
          fallback={
            <Box bg="gray.600" w="full" h="full" display="flex" alignItems="center" justifyContent="center">
              <Text color="gray.400">Nema slike</Text>
            </Box>
          }
        />
      </AspectRatio>
      <CardBody p={3}>
        <VStack spacing={2} align="stretch">
          <HStack justify="space-between" align="center">
            <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
              @{video.accountName}
            </Text>
            <Badge
              colorScheme={
                video.approved === true
                  ? "green"
                  : video.approved === false
                    ? "red"
                    : "yellow"
              }
              size="sm"
            >
              {video.approved === true
                ? "Odobreno"
                : video.approved === false
                  ? "Odbačeno"
                  : "Na čekanju"
              }
            </Badge>
          </HStack>

          <Text fontSize="xs" color="gray.400" noOfLines={2}>
            {video.name || 'Bez naziva'}
          </Text>

          <SimpleGrid columns={2} spacing={2} fontSize="xs">
            <Stat size="sm">
              <StatLabel color="blue.300">Pregledi</StatLabel>
              <StatNumber fontSize="sm">{(video.views || 0).toLocaleString()}</StatNumber>
            </Stat>
            <Stat size="sm">
              <StatLabel color="red.300">Lajkovi</StatLabel>
              <StatNumber fontSize="sm">{(video.likes || 0).toLocaleString()}</StatNumber>
            </Stat>
            <Stat size="sm">
              <StatLabel color="yellow.300">Komentari</StatLabel>
              <StatNumber fontSize="sm">{(video.comments || 0).toLocaleString()}</StatNumber>
            </Stat>
            <Stat size="sm">
              <StatLabel color="green.300">Deljenja</StatLabel>
              <StatNumber fontSize="sm">{(video.shares || 0).toLocaleString()}</StatNumber>
            </Stat>
          </SimpleGrid>

          <Text fontSize="xs" color="gray.500" textAlign="center">
            {video.createdAt
              ? new Date(video.createdAt).toLocaleDateString('sr-RS')
              : 'Nepoznat datum'
            }
          </Text>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default VideoCard