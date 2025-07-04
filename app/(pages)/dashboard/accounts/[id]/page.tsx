'use client';

import {
  Box,
  Text,
  VStack,
  Heading,
  Divider,
  Spinner,
  Center,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  SimpleGrid,
  useColorModeValue,
  Badge,
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLayoutContext } from '../../context';
import { getAccountAndVideos } from '../../../../lib/firebase/firestore';

const AccountPage = () => {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [account, setAccount] = useState<IAccount | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, loading, discordUsername } = useLayoutContext();

  const cardBg = useColorModeValue('white', 'gray.800');
  const cardHoverBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.700', 'gray.300');

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [videoLink, setVideoLink] = useState('');
  const [message, setMessage] = useState('');

  const handleAddVideo = () => {
    if (!videoLink) {
      setMessage('Molimo unesite validan link.');
      return;
    }
    // Add logic to save the video link to the database
    setMessage('Video je uspešno dodat!');
    setVideoLink('');
    onClose();
  };

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        if (!id) {
          throw new Error('Account ID is missing');
        }
        const acc = await getAccountAndVideos(discordUsername!, id);
        setAccount(acc);
      } catch (err) {
        console.error('Error fetching account:', err);
        setError('Došlo je do greške prilikom učitavanja naloga.');
      }
    };

    fetchAccount();
  }, [id]);

  if (loading) {
    return (
      <Center minH="100vh" flex={1} flexDirection="column">
        <Spinner size="xl" />
        <Text mt={4} fontSize="lg" color="gray.500">
          Učitavanje naloga...
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

  if (!account) {
    return (
      <Center minH="100vh">
        <Text color="gray.500" fontSize="lg">
          Nalog nije pronađen.
        </Text>
      </Center>
    );
  }

  return (
    <Box maxW="1200px" mx="auto" p={8}>
      <Card
        bg={cardBg}
        boxShadow="2xl"
        borderRadius="xl"
        p={8}
        mb={8}
        _hover={{ bg: cardHoverBg }}
        transition="background-color 0.2s"
      >
        <CardBody>
          <StatGroup mb={8}>
            <Stat>
              <StatLabel fontSize="lg" color={textColor}>
                Korisničko ime
              </StatLabel>
              <StatNumber fontSize="2xl">
                <Text as="a" href={account.link}>
                  {account.username}
                </Text>
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel fontSize="lg" color={textColor}>
                Platforma
              </StatLabel>
              <StatNumber fontSize="2xl">{account.platform}</StatNumber>
            </Stat>
          </StatGroup>
        </CardBody>
        <CardFooter>
          <Center>
            <Text fontSize="md" color="gray.400">
              {/* Additional footer content can go here */}
            </Text>
          </Center>
        </CardFooter>
      </Card>

      {/* Add Video Button */}
      <Button
        colorScheme="green"
        mb={6}
        onClick={onOpen}
        size="lg"
        alignSelf="center"
      >
        Dodajte Video
      </Button>

      {/* Videos Section */}
      <Heading as="h2" size="xl" mb={6} textAlign="center">
        Videozapisi
      </Heading>
      {account.videos.length > 0 ? (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {account.videos.map((video) => (
            <Card
              key={video.uid}
              bg={cardBg}
              boxShadow="lg"
              borderRadius="lg"
              p={4}
              _hover={{ bg: cardHoverBg }}
              transition="background-color 0.2s"
            >
              <CardHeader>
                <Heading
                  as="h3"
                  size="md"
                  mb={4}
                  color="blue.500"
                  cursor="pointer"
                  _hover={{ color: "blue.600" }}
                  onClick={() => window.open(video.link, "_blank")}
                >
                  {video.name}
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Box minW="100px" fontWeight="bold" color={textColor}>
                      Pregledi:
                    </Box>
                    <Badge colorScheme="blue" fontSize="0.8em">
                      {video.views}
                    </Badge>
                  </HStack>
                  <HStack>
                    <Box minW="100px" fontWeight="bold" color={textColor}>
                      Lajkovi:
                    </Box>
                    <Badge colorScheme="green" fontSize="0.8em">
                      {video.likes}
                    </Badge>
                  </HStack>
                  <HStack>
                    <Box minW="100px" fontWeight="bold" color={textColor}>
                      Deljenja:
                    </Box>
                    <Badge colorScheme="purple" fontSize="0.8em">
                      {video.shares}
                    </Badge>
                  </HStack>
                  <HStack>
                    <Box minW="100px" fontWeight="bold" color={textColor}>
                      Komentari:
                    </Box>
                    <Badge colorScheme="red" fontSize="0.8em">
                      {video.comments}
                    </Badge>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      ) : (
        <Center>
          <Text fontSize="lg" color="gray.500">
            Nema videozapisa za ovaj nalog.
          </Text>
        </Center>
      )}

      {/* Add Video Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Dodajte Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Link ka vašem videu:</Text>
            <Input
              placeholder="https://tiktok.com/@username/video/12345"
              value={videoLink}
              onChange={(e) => setVideoLink(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              _placeholder={{ color: 'gray.400' }}
            />
            {message && (
              <Text mt={4} color={message.includes('uspešno') ? 'green.400' : 'red.400'}>
                {message}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleAddVideo}>
              Dodajte Video
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Otkaži
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AccountPage;