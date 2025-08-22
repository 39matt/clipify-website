'use client';

import { Box, Image, Text, Flex, Button, Link } from '@chakra-ui/react';
import { IVideo } from '../../../../../../../lib/models/video'

interface AdminVideoCardProps {
  video: IVideo;
  onApprove?: (id: string) => void;
  onDeny?: (id: string) => void;
}

const RevenueApprovalVideoCard: React.FC<AdminVideoCardProps> = ({ video, onApprove, onDeny }) => {
  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      shadow="sm"
      _hover={{ shadow: 'md' }}
      w="100%"
    >
      <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
        <Image
          src={video.coverUrl}
          alt={video.name || 'Video cover'}
          boxSize="120px"
          objectFit="cover"
          borderRadius="md"
        />

        <Flex flex="1" direction="column" justify="space-between">
          <Box>
            <Text fontWeight="bold" fontSize="lg" maxW="50%" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
              {video.name || 'Untitled Video'}
            </Text>
            <Link
              href={video.link}
              target="_blank"
              rel="noopener noreferrer"
              color="blue.400"
              fontSize="sm"
            >
              View Video
            </Link>
            <Text fontSize="sm" color="gray.500">
              Views: {video.views} | Likes: {video.likes} | Comments: {video.comments} | Shares: {video.shares}
            </Text>
          </Box>

          <Flex gap={2} mt={2}>
            {onApprove && (
              <Button
                colorScheme="green"
                size="sm"
                onClick={() => {
                  onApprove(video.id!);
                }
                  }
              >
                Approve revenue
              </Button>
            )}
            {onDeny && (
              <Button
                colorScheme="red"
                size="sm"
                onClick={() => {
                  onDeny(video.id!);
                }
                }
              >
                Deny revenue
              </Button>
            )}
          </Flex>
        </Flex>
        <Box
          w={20}
          h={20}
          borderRadius="md"
          borderWidth="1px"
          borderColor={video.revenueStatus == "Approved" ? "green.500"
          : video.revenueStatus == "Denied" ? "red.500"
            : "orange.500"}
          color={video.revenueStatus == "Approved" ? "green.500"
            : video.revenueStatus == "Denied" ? "red.500"
              : "orange.500"}
          display="flex"
          justifyContent="center"
          alignItems="center"
          alignSelf="center"
        >
          {video.revenueStatus || "Awaiting"}
        </Box>
      </Flex>
    </Box>
  );
};

export default RevenueApprovalVideoCard;