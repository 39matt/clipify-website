
import {
  AspectRatio, Badge, Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Divider,
  Heading, HStack, Image, SimpleGrid, Spinner,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber, Text, VStack,
} from '@chakra-ui/react'
import VideoCard from '../YourVideoCard/YourVideoCard'
import YourVideoCard from '../YourVideoCard/YourVideoCard'
import { IVideo } from '../../../../../../lib/models/video'

const YourVideosSection = ({
                      userVideos,
                      videosLoading
                    }: {
  userVideos: IVideo[];
  videosLoading: boolean;
}) => {
  const totalViews = userVideos.reduce((sum, video) => sum + (video.views || 0), 0);
  const totalLikes = userVideos.reduce((sum, video) => sum + (video.likes || 0), 0);
  const totalComments = userVideos.reduce((sum, video) => sum + (video.comments || 0), 0);
  const totalShares = userVideos.reduce((sum, video) => sum + (video.shares || 0), 0);
  return (
    <Card w="full" maxW="1200px" mx="auto" bg="gray.800" borderRadius="lg" boxShadow="lg" p={6} >
      <CardHeader textAlign="center">
        <Heading size="lg" color="green.400" mb={4}>
          Vaša kampanja
        </Heading>
      </CardHeader>
      <CardBody>
        <StatGroup mb={6}>
          <Stat textAlign="center">
            <StatLabel>Ukupno pregleda</StatLabel>
            <StatNumber color="blue.400">{totalViews.toLocaleString()}</StatNumber>
          </Stat>
          <Stat textAlign="center">
            <StatLabel>Ukupno lajkova</StatLabel>
            <StatNumber color="red.400">{totalLikes.toLocaleString()}</StatNumber>
          </Stat>
          <Stat textAlign="center">
            <StatLabel>Ukupno komentara</StatLabel>
            <StatNumber color="yellow.400">{totalComments.toLocaleString()}</StatNumber>
          </Stat>
          <Stat textAlign="center">
            <StatLabel>Ukupno deljenja</StatLabel>
            <StatNumber color="green.400">{totalShares.toLocaleString()}</StatNumber>
          </Stat>
        </StatGroup>

        {/*<Divider mb={6} />*/}
        {/*<StatGroup mb={6}>*/}
        {/*  <Stat textAlign="center">*/}
        {/*    <StatLabel>Realizovana zarada</StatLabel>*/}
        {/*    <StatNumber color="blue.400">20</StatNumber>*/}
        {/*  </Stat>*/}
        {/*</StatGroup>*/}


        <Divider mb={6} />

        {videosLoading ? (
          <Center py={8}>
            <Spinner size="lg" />
            <Text ml={4}>Učitavanje videa...</Text>
          </Center>
        ) : userVideos.length === 0 ? (
          <Center py={8}>
            <Text color="gray.400" fontSize="lg">
              Niste još uvek poslali nijedan video za ovu kampanju.
            </Text>
          </Center>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {userVideos.map((video, index) => (
              <YourVideoCard video={video} index={index}/>
            ))}
          </SimpleGrid>
        )}
      </CardBody>
    </Card>
  );
};

export default YourVideosSection;