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
import { getAccountAndVideos } from '../../../../lib/firebase/firestore/account'
import { IAccount } from '../../../../lib/models/account'

const AccountPage = () => {
  const pathname = usePathname();
  const id = pathname.split('/').pop();
  const [account, setAccount] = useState<IAccount | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user, loading, discordUsername } = useLayoutContext();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [videoLink, setVideoLink] = useState('');
  const [message, setMessage] = useState('');

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
    <Box bg="gray.900" color="white" maxH="100vh" p={6}>
      {/* Header Section */}
      <Box
        position="relative"
        bg="gray.800"
        borderRadius="lg"
        p={12}
        mb={6}
        textAlign="center"
        boxShadow="lg"
        overflow="hidden"
      >
        {/* Background Image */}
        <Box
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          bgSize="cover"
          bgPosition="center"
          filter="blur(8px)"
          opacity={0.6}
        />

        {/* Content */}
        <Heading as="h1" size="lg" mb={2} opacity={1}>
          {account.username}
        </Heading>
        <Text fontSize="md" color="gray.300" opacity={1}>
          {account.platform}
        </Text>
      </Box>

      {/* Account Details Section */}
      <HStack spacing={6}>
        {/* Card 1: Account Stats */}
        <Card bg="gray.800" borderRadius="lg" boxShadow="lg" p={6} flex="2">
          <CardHeader textAlign="center">
            <Heading as="h2" size="md" color="red.400" mb={4}>
              Detalji naloga
            </Heading>
          </CardHeader>
          <CardBody>
            <StatGroup>
              <Stat>
                <StatLabel fontSize="lg" color="gray.300">
                  Korisničko ime
                </StatLabel>
                <StatNumber fontSize="2xl">
                  <Text as="a" href={account.link}>
                    {account.username}
                  </Text>
                </StatNumber>
              </Stat>
              <Stat>
                <StatLabel fontSize="lg" color="gray.300">
                  Platforma
                </StatLabel>
                <StatNumber fontSize="2xl">{account.platform}</StatNumber>
              </Stat>
            </StatGroup>
          </CardBody>
        </Card>

        {/* Card 2: Add Video */}
        <Card bg="gray.800" borderRadius="lg" boxShadow="lg" p={6} flex="1">
          <CardHeader textAlign="center">
            <Heading as="h2" size="md" color="red.400" mb={4}>
              Dodajte Video
            </Heading>
          </CardHeader>
          <CardBody textAlign="center">
            <Button colorScheme="green" size="lg" onClick={onOpen}>
              Dodajte Video
            </Button>
          </CardBody>
        </Card>
      </HStack>

      {/* Videos Section */}
      <Heading as="h2" size="xl" mb={6} textAlign="center">
        Videi
      </Heading>
      {account.videos.length > 0 ? (
        <SimpleGrid columns={[1, 2, 3]} spacing={6}>
          {account.videos.map((video) => (
            <Card
              key={video.uid}
              bg="gray.800"
              boxShadow="lg"
              borderRadius="lg"
              p={4}
              _hover={{ bg: 'gray.700' }}
              transition="background-color 0.2s"
            >
              <CardHeader>
                <Heading
                  as="h3"
                  size="md"
                  mb={4}
                  color="blue.500"
                  cursor="pointer"
                  _hover={{ color: 'blue.600' }}
                  onClick={() => window.open(video.link, '_blank')}
                >
                  {video.name}
                </Heading>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={2}>
                  <HStack>
                    <Box minW="100px" fontWeight="bold" color="gray.300">
                      Pregledi:
                    </Box>
                    <Badge colorScheme="blue" fontSize="0.8em">
                      {video.views}
                    </Badge>
                  </HStack>
                  <HStack>
                    <Box minW="100px" fontWeight="bold" color="gray.300">
                      Lajkovi:
                    </Box>
                    <Badge colorScheme="green" fontSize="0.8em">
                      {video.likes}
                    </Badge>
                  </HStack>
                  <HStack>
                    <Box minW="100px" fontWeight="bold" color="gray.300">
                      Deljenja:
                    </Box>
                    <Badge colorScheme="purple" fontSize="0.8em">
                      {video.shares}
                    </Badge>
                  </HStack>
                  <HStack>
                    <Box minW="100px" fontWeight="bold" color="gray.300">
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
            Nema videa za ovaj nalog.
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
            <Button colorScheme="green" mr={3} onClick={() => onClose()}>
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