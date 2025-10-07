'use client';

import {
  Box,
  Image,
  Text,
  Link,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { IVideo } from '../../../../../../lib/models/video'

interface AdminVideoCardProps {
  video: IVideo;
  index: number
}

const AllVideosCard: React.FC<AdminVideoCardProps> = ({ video, index }) => {

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      overflow="hidden"
      shadow="sm"
      _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      bg="gray.800"
      color="white"
      display="flex"
      flexDirection="column"
      h="100%"
    >
      <Link href={video.link} target="_blank" rel="noopener noreferrer">
        <Image
          src={video.coverUrl}
          alt={video.name || ''}
          w="100%"
          h="200px"
          objectFit="cover"
          display="flex"
          alignItems="center"
          justifyContent="center"
        />
      </Link>

      <VStack align="start" spacing={3} p={4} flex="1">
        <Box display="flex" flexDirection="column" justifyContent="space-between" w="full">
          <Text fontWeight="light" fontSize="sm" noOfLines={1}>
            {video.name || ''}
          </Text>
          <Box p={1}/>

        </Box>


        <Text fontWeight="light" color="gray.500" fontSize="md" noOfLines={1}>
          {new Date(video.createdAt).toDateString() || ''}
        </Text>

        <HStack spacing={6} justify="center" w="full">
          <VStack spacing={0}>
            <Text fontSize="2xl">👁</Text>
            <Text fontWeight="bold">{video.views}</Text>
          </VStack>
          <VStack spacing={0}>
            <Text fontSize="2xl">❤️</Text>
            <Text fontWeight="bold">{video.likes}</Text>
          </VStack>
          <VStack spacing={0}>
            <Text fontSize="2xl">🔄</Text>
            <Text fontWeight="bold">{video.shares}</Text>
          </VStack>
          <VStack spacing={0}>
            <Text fontSize="2xl">💬</Text>
            <Text fontWeight="bold">{video.comments}</Text>
          </VStack>
        </HStack>
      </VStack>
    </Box>
  );
};

export default AllVideosCard;