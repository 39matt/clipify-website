import { IVideo } from '../../../../../lib/models/video'
import {
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  Select,
  HStack,
} from '@chakra-ui/react'
import { useState, useMemo } from 'react'
import AllVideosCard from '../AllVideosCard/AllVideosCard'

const AllVideosSection = ({
                            videos,
                            videosLoading,
                          }: {
  videos: IVideo[]
  videosLoading: boolean
}) => {
  const [sortBy, setSortBy] = useState<'date' | 'views'>('date')

  const sortedVideos = useMemo(() => {
    if (!videos.length) return videos

    return [...videos].sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else {
        return (b.views || 0) - (a.views || 0)
      }
    })
  }, [videos, sortBy])

  return (
    <Card
      bg="gray.800"
      borderRadius="lg"
      boxShadow="lg"
      p={6}
      w="full"
      maxW="1600px"
      mx="auto"
    >
      <CardHeader textAlign="center">
        <Heading size="lg" color="green.400" mb={4}>
          Svi videi u ovoj kampanji
        </Heading>
      </CardHeader>
      <CardBody>
        <Divider mb={6} />

        {!videosLoading && videos.length > 0 && (
          <HStack justify="flex-end" mb={4}>
            <Text color="gray.300" fontSize="sm">
              Sortiraj po:
            </Text>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'views')}
              size="sm"
              w="auto"
              bg="gray.700"
              borderColor="gray.600"
              color="white"
              _hover={{ borderColor: 'gray.500' }}
              _focus={{ borderColor: 'green.400' }}
            >
              <option value="date">Datum</option>
              <option value="views">Pregledi</option>
            </Select>
          </HStack>
        )}

        {videosLoading ? (
          <Center py={8}>
            <Spinner size="lg" />
            <Text ml={4}>Učitavanje videa...</Text>
          </Center>
        ) : videos.length === 0 ? (
          <Center py={8}>
            <Text color="gray.400" fontSize="lg">
              Još nema videa za ovu kampanju.
            </Text>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
            {sortedVideos.filter(video => video.approved).map((video, index) => (
              <AllVideosCard key={video.id || index} video={video} index={index} />
            ))}
          </SimpleGrid>
        )}
      </CardBody>
    </Card>
  )
}

export default AllVideosSection