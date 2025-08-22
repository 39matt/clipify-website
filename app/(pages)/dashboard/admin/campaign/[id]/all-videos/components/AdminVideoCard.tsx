'use client';

import {
  Box,
  Image,
  Text,
  Button,
  Link,
  VStack,
  HStack,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react';
import { FiExternalLink } from 'react-icons/fi';
import { useRef } from 'react';
import { IVideo } from '../../../../../../../lib/models/video';

interface AdminVideoCardProps {
  video: IVideo;
  onDelete?: (id: string) => void;
}

const AdminVideoCard: React.FC<AdminVideoCardProps> = ({ video, onDelete }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  const confirmDelete = () => {
    if (onDelete) {
      onDelete(video.id!);
    }
    onClose();
  };

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
      h="100%" // ensures equal height in grid
    >
      {/* Thumbnail */}
      <Link href={video.link} target="_blank" rel="noopener noreferrer">
        <Image
          src={video.coverUrl}
          alt={video.name || 'Video cover'}
          w="100%"
          h="200px"
          objectFit="cover"
        />
      </Link>

      {/* Content */}
      <VStack align="start" spacing={3} p={4} flex="1">
        {/* Title */}
        <Text fontWeight="bold" fontSize="md" noOfLines={1}>
          {video.name || 'Untitled Video'}
        </Text>

        <Text fontWeight="light" color="gray.500" fontSize="md" noOfLines={1}>
          {new Date(video.createdAt).toDateString() || ''}
        </Text>

        {/* View Link */}
        <Link
          href={video.link}
          target="_blank"
          rel="noopener noreferrer"
          color="blue.300"
          fontSize="sm"
          display="flex"
          alignItems="center"
          gap={1}
        >
          View <FiExternalLink />
        </Link>

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

        {/* Push delete button to bottom */}
        <Box mt="auto" w="full">
          {onDelete && (
            <>
              <Button colorScheme="red" size="sm" w="full" onClick={onOpen}>
                Delete
              </Button>

              {/* Confirmation Modal */}
              <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Delete Video
                    </AlertDialogHeader>

                    <AlertDialogBody>
                      Are you sure you want to delete this video? This action
                      cannot be undone.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={onClose}>
                        Cancel
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={confirmDelete}
                        ml={3}
                      >
                        Delete
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
          )}
        </Box>
      </VStack>
    </Box>
  );
};

export default AdminVideoCard;