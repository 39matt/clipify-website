'use client';

import {
  Box,
  Text,
  VStack,
  Heading,
  Divider,
  Spinner,
  Center,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLayoutContext } from '../../../context';
import { getCampaign, getCampaignVideos } from '../../../../../lib/firebase/firestore/campaign';
import { IVideo } from '../../../../../lib/models/video';
import Image from 'next/image'

const AccountPage = () => {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [videos, setVideos] = useState<IVideo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, loading, discordUsername } = useLayoutContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) {
          throw new Error('Campaign ID is missing');
        }
        const cmp = await getCampaign(id);
        setCampaign(cmp);

        const cmpVids = await getCampaignVideos(id);
        setVideos(cmpVids);
      } catch (err) {
        console.error('Error fetching campaign:', err);
        setError('Došlo je do greške prilikom učitavanja kampanje.');
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Center minH="100vh" flex={1} flexDirection="column">
        <Spinner size="xl" />
        <Text mt={4} fontSize="lg" color="gray.500">
          Učitavanje kampanje...
        </Text>
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="100vh">
        <Text color="red.500" fontSize="lg">
          {error}
        </Text>
      </Center>
    );
  }

  if (!campaign) {
    return (
      <Center minH="100vh">
        <Text color="gray.500" fontSize="lg">
          Kampanja nije pronađena.
        </Text>
      </Center>
    );
  }

  // Group videos by owner
  const groupedVideos = videos?.reduce((acc, video) => {
    const owner = video.uid!;
    if (!acc[owner]) {
      acc[owner] = [];
    }
    acc[owner].push(video);
    return acc;
  }, {} as Record<string, IVideo[]>);

  return (
    <VStack spacing={8}>
      <Box my={{ base: 4, md: 8 }}>
        <Heading
          textAlign="center"
          fontSize={{ base: '32px', md: '48px' }}
          textColor="green.400"
        >
          {campaign.influencer} - {campaign.activity}
        </Heading>
      </Box>

      <Divider />

      {groupedVideos &&
        Object.entries(groupedVideos).map(([owner, videos]) => (
          <Box key={owner} w="full">
            <Heading size="lg" textColor="green.400" mb={4}>
              User: {owner}
            </Heading>
            <Table variant="striped" colorScheme="green">
              <Thead>
                <Tr>
                  <Th>Video Name</Th>
                  <Th>Link</Th>
                  <Th>Views</Th>
                  <Th>Likes</Th>
                  <Th>Shares</Th>
                  <Th>Comments</Th>
                </Tr>
              </Thead>
              <Tbody>
                {videos.map((video, index) => (
                  <Tr key={index}>
                    <Td>{video.name}</Td>
                    <Td>
                      <a href={video.link} target="_blank" rel="noopener noreferrer">
                        {video.link}
                      </a>
                    </Td>
                    <Td>{video.views}</Td>
                    <Td>{video.likes}</Td>
                    <Td>{video.shares}</Td>
                    <Td>{video.comments}</Td>
                    <Td><Image src={video.coverUrl} alt={"Cover image"} width={27} height={48}/></Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        ))}
    </VStack>
  );
};

export default AccountPage;