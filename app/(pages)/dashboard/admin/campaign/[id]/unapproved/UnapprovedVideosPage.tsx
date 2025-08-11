'use client';

import {
  Box,
  Text,
  VStack,
  Heading,
  Divider,
  Spinner,
  Center,
  Flex,
  Icon,
  Button,
  Alert,
  AlertIcon,
  Collapse,
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { IVideo } from '../../../../../../lib/models/video';
import { ICampaign } from '../../../../../../lib/models/campaign';
import UnapprovedVideoCard from '#components/app/UnapprovedVideoCard/UnapprovedVideoCard'

interface UnapprovedVideosProps {
  idToken: string;
}

const UnapprovedVideos: React.FC<UnapprovedVideosProps> = ({ idToken }) => {
  const pathname = usePathname();
  const campaignId = pathname.split('/')[pathname.split('/').length - 2];
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [videos, setVideos] = useState<IVideo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!campaignId) {
          setLoading(false);
          setError('Campaign ID is missing');
          return;
        }
        const responseJson = await fetch(`/api/campaign/get?id=${campaignId}`, {
          method: 'GET',
        }).then((res) => res.json());
        setCampaign(responseJson['campaign']);
        setVideos(responseJson['videos'] as IVideo[]);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error('Error fetching campaign:', err);
        setError('Došlo je do greške prilikom učitavanja kampanje.');
      }
    };

    fetchData();
  }, [campaignId]);

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

  const groupedVideos = videos?.reduce((acc, video) => {
    if (!video?.uid) return acc;
    const owner = video.uid;
    if (!acc[owner]) {
      acc[owner] = [];
    }
    acc[owner].push(video);
    return acc;
  }, {} as Record<string, IVideo[]>);

  const filteredGroupedVideos = groupedVideos
    ? Object.entries(groupedVideos).filter(([_, vids]) =>
      vids.some((video) => video.approved == null)
    )
    : [];

  const handleApproveVideo = async (videoId: string) => {
    try {
      const response = await fetch(
        `/api/campaign/video/approve?campaignId=${campaignId}&videoId=${videoId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      if (!response.ok) {
        setError('Failed to approve video!');
        return;
      }
      setSuccess('Successfully approved!');
      setVideos(
        (prev) =>
          prev?.map((video) =>
            video.id === videoId ? { ...video, approved: true } : video
          ) || null
      );
    } catch (err) {
      console.error(err);
      setError('Greška pri odobrenju videa: ' + err);
    }
  };

  const handleDenyVideo = async (videoId: string) => {
    try {
      const response = await fetch(
        `/api/campaign/video/deny?campaignId=${campaignId}&videoId=${videoId}`,
        { method: 'PUT' }
      );
      if (!response.ok) {
        setError('Failed to deny video!');
        return;
      }
      setSuccess('Successfully denied!');
      setVideos(
        (prev) =>
          prev?.map((video) =>
            video.id === videoId ? { ...video, approved: false } : video
          ) || null
      );
    } catch (err) {
      console.error(err);
      setError('Greška pri odbacivanju videa: ' + err);
    }
  };

  return (
    <VStack spacing={8} width={'90%'} mx="auto">
      <Box my={{ base: 4, md: 8 }}>
        <Heading
          textAlign="center"
          fontSize={{ base: '24px', md: '32px', lg: '48px' }}
          textColor="green.400"
        >
          {campaign.influencer} - {campaign.activity}
        </Heading>
      </Box>

      {success && (
        <Alert status="success">
          <AlertIcon />
          {success}
        </Alert>
      )}
      {error && (
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      )}

      <Divider />

      {filteredGroupedVideos.length === 0 ? (
        <Center py={8}>
          <Text color="gray.400" fontSize="lg">
            Nema videa na čekanju za odobrenje.
          </Text>
        </Center>
      ) : (
        filteredGroupedVideos.map(([owner, vids]) => (
          <UserVideosDropdown
            key={owner}
            owner={owner}
            videos={vids}
            onApprove={handleApproveVideo}
            onDeny={handleDenyVideo}
          />
        ))
      )}
    </VStack>
  );
};

interface UserVideosDropdownProps {
  owner: string;
  videos: IVideo[];
  onApprove: (id: string) => void;
  onDeny: (id: string) => void;
}

const UserVideosDropdown: React.FC<UserVideosDropdownProps> = ({
                                                                 owner,
                                                                 videos,
                                                                 onApprove,
                                                                 onDeny,
                                                               }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  const pendingVideos = videos.filter((video) => video.approved == null);

  if (pendingVideos.length === 0) return null;

  return (
    <Box
      w="full"
      borderWidth="1px"
      borderRadius="md"
      p={{ base: 2, md: 4 }}
      mb={4}
    >
      <Flex justify="space-between" align="center" onClick={toggle} cursor="pointer">
        <Heading size="md" textColor="green.400" fontSize={{ base: '16px', md: '20px' }}>
          User: {owner} ({pendingVideos.length} pending)
        </Heading>
        <Icon as={isOpen ? FiChevronUp : FiChevronDown} boxSize={{ base: 4, md: 5 }} />
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <VStack spacing={4} mt={4}>
          {pendingVideos.map((video) => (
            <UnapprovedVideoCard
              key={video.id}
              video={video}
              onApprove={onApprove}
              onDeny={onDeny}
            />
          ))}
        </VStack>
      </Collapse>
    </Box>
  );
};

export default UnapprovedVideos;