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
  Collapse,
  Flex,
  Icon, Button, Alert, AlertIcon,
} from '@chakra-ui/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import Image from 'next/image';
import { IVideo } from '../../../../../lib/models/video';
import { useLayoutContext } from '../../../context'

interface AccountPageProps {
  idToken: string;
}

const AccountPage:React.FC<AccountPageProps> = ({idToken}) => {
  const pathname = usePathname();
  const campaignId = pathname.split('/').pop();
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
        const responseJson = await fetch(`/api/campaign/get?id=${campaignId}`, { method: 'GET' }).then((res) => res.json());
        const cmp = responseJson['campaign'];
        setCampaign(cmp);

        const vids = responseJson['videos'];
        setVideos(vids);

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
    const owner = video.uid!;
    if (!acc[owner]) {
      acc[owner] = [];
    }
    acc[owner].push(video);
    return acc;
  }, {} as Record<string, IVideo[]>);

  const handleUpdateViews = async () => {
    try {
      const updatedVideos:IVideo[] = [];
      for (const video of videos || []) {
        const getVideoResponse = await fetch('/api/campaign/video/get-video-info',
          {
            method: "PUT",
            body: JSON.stringify({
              platform:video.link.includes("Instagram") ? "Instagram" : "TikTok",
              videoId: video.link.split('/')[5],
              api_key:process.env.NEXT_PUBLIC_RAPIDAPI_KEY!
            })
          }
        );
        if (getVideoResponse.status !== 200) {
          console.error('Error getting video info');
          setError("Error getting video info (update info)");
          return
        }
        const getVideoResponseJson = await getVideoResponse.json();
        const newVideo = getVideoResponseJson['videoInfo'] as IVideo;

        const updateVideoResponse = await fetch('/api/campaign/video/update-info', {method: 'PUT', body: JSON.stringify({video:newVideo, campaignId}) });
        if(updateVideoResponse.status !== 200) {
          console.error('Error updating video');
          setError("Error updating video info (update info)");
          return
        }
        const matchingVideo = videos?.find((vid) =>  vid.link === newVideo.link );
        if (matchingVideo) {
          newVideo.userAccountRef = matchingVideo.userAccountRef;
          newVideo.uid = matchingVideo.uid;
          newVideo.id = matchingVideo.id;
        }
        updatedVideos.push(newVideo);
      }

      setVideos(updatedVideos);
      setSuccess("Successfully updated videos!");
    } catch(error) {
      console.error(error);
      setError("Error updating videos: " + error);
    }
  }

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
      <Box>
        {success && (<Alert status="success">
          <AlertIcon />
          {success ? success : String(success)}
        </Alert>)}
      </Box>
      <Button colorScheme={"green"} ml={"auto"} size={"lg"} onClick={handleUpdateViews}>Update views</Button>

      <Divider />

      {groupedVideos &&
        Object.entries(groupedVideos).map(([owner, videos]) => (
          <UserVideosDropdown key={owner} owner={owner} videos={videos} campaignId={campaignId!} setVideos={setVideos} idToken={idToken} />
        ))}
    </VStack>
  );
};

interface UserVideosDropdownProps {
  owner: string;
  campaignId: string;
  videos: IVideo[];
  setVideos: (videos: IVideo[]) => void;
  idToken: string;
}

const UserVideosDropdown: React.FC<UserVideosDropdownProps> = ({ owner, videos, campaignId, setVideos, idToken }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setErrorMessage] = useState<string | null>(null);
  const [success, setSuccessMessage] = useState<string | null>(null);
  const toggle = () => setIsOpen(!isOpen);

  const handleApproveVideo = async (videoId: string) => {
    try {
      const response = await fetch(`/api/campaign/video/approve?campaignId=${campaignId}&videoId=${videoId}`
        , { method: 'PUT',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });
      if(!response.ok) {
        setErrorMessage("Failed to approve video!")
        return
      }
      setSuccessMessage(`Successfully approved!`);
      setVideos(videos.filter((video) => video.id !== videoId));
    } catch (err) {
      console.error(err);
      setErrorMessage("Greška pri odobrenju videa: " + err);
    }
  }

  const handleDenyVideo = async (videoId: string) => {
    try {
      const response = await fetch(`/api/campaign/video/deny?campaignId=${campaignId}&videoId=${videoId}`, { method: 'PUT' });
      if(!response.ok) {
        setErrorMessage("Failed to deny video!")
        return
      }
      setSuccessMessage("Successfully denied!");
      setVideos(videos.filter((video) => video.id !== videoId));
    } catch (err) {
      console.error(err);
      setErrorMessage("Greška pri odobrenju videa: " + err);
    }
  }

  return (
    <Box
      w="full"
      borderWidth="1px"
      borderRadius="md"
      p={{ base: 2, md: 4 }}
      mb={4}
      onClick={toggle}
      cursor="pointer"
    >
      <Flex justify="space-between" align="center">
        <Heading size="md" textColor="green.400" fontSize={{ base: '16px', md: '20px' }}>
          User: {owner}
        </Heading>
        <Icon as={isOpen ? FiChevronUp : FiChevronDown} boxSize={{ base: 4, md: 5 }} />
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <Box py={2}>
          {error && (<Alert status="error">
            <AlertIcon />
            {error ? error : String(error)}
          </Alert>)}
          {success && (<Alert status="success">
            <AlertIcon />
            {success ? success : String(success)}
          </Alert>)}
        </Box>
        <Box overflowX="auto">
          <Table variant="striped" colorScheme="green" mt={4} size="sm">
            <Thead>
              <Tr>
                <Th textAlign="center">Video Name</Th>
                <Th textAlign="center">Link</Th>
                <Th textAlign="center">Views</Th>
                <Th textAlign="center">Likes</Th>
                <Th textAlign="center">Shares</Th>
                <Th textAlign="center">Comments</Th>
                <Th textAlign="center">Cover</Th>
                <Th textAlign="center">Action</Th>
                {/*<Th textAlign="center">Approved</Th>*/}
              </Tr>
            </Thead>
            <Tbody>
              {videos.map((video, index) => (
                <Tr key={index}>
                  <Td textAlign="center">{video.name}</Td>
                  <Td textAlign="center">
                    <a href={video.link} target="_blank" rel="noopener noreferrer">
                      🔗
                    </a>
                  </Td>
                  <Td textAlign="center">{video.views}</Td>
                  <Td textAlign="center">{video.likes}</Td>
                  <Td textAlign="center">{video.shares}</Td>
                  <Td textAlign="center">{video.comments}</Td>
                  <Td display="flex" justifyContent="center">
                    <Image
                      src={video.coverUrl}
                      alt="Cover image"
                      width={27}
                      height={48}
                      style={{ objectFit: 'cover' }}
                    />
                  </Td>
                  <Td>
                    <Flex justifyContent="space-around" direction="row" gap={2}>
                      <Button colorScheme="blue" onClick={() => handleApproveVideo(video.id!)}>Accept</Button>
                      <Button colorScheme="red" onClick={() => handleDenyVideo(video.id!)}>Deny</Button>
                    </Flex>
                  </Td>
                  {/*<Td>*/}
                  {/*  <Flex justifyContent="space-around" direction="row" gap={2}>*/}
                  {/*  {video.approved ? <FcCheckmark/> : <FaXmark/>}*/}
                  {/*  </Flex>*/}
                  {/*</Td>*/}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Collapse>
    </Box>
  );
};

export default AccountPage;