'use client';

import {
  Box,
  Card,
  CardBody,
  HStack,
  Image,
  Text,
  VStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Divider,
  Grid,
  GridItem,
  Badge,
  Progress, Icon,
} from '@chakra-ui/react'
import { motion } from 'framer-motion';
import {
  Eye,
  Calendar,
  TrendingUp,
  Users,
  Video,
  Award,
  LinkIcon,
  Link2Icon,
  ExternalLinkIcon,
  ExternalLink,
} from 'lucide-react'

interface Campaign {
  id: string;
  name: string;
  image: string;
  views: string;
  daysLeft: string;
}

interface FinishedCampaign {
  id: string;
  name: string;
  image: string;
  totalViews: string;
  totalClippers: number;
  totalVideos: number;
  duration: number;
  topVideo: {
    views: string;
    clipper: string;
    link: string;
  };
}

const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'ZavrtiKes',
    image: 'https://i.ibb.co/z96PyxD/491456585-653474470745354-2382746249902615751-n.jpg',
    views: "9000000",
    daysLeft: "30 dana",
  },
  {
    id: '2',
    name: 'AleksicMoto',
    image: 'https://i.ibb.co/vxJ9dpb2/Snap-Insta-to-360037824-551320730372188-7562058913064595415-n-1.jpg',
    views: "3000000",
    daysLeft: "14 dana",
  },
  {
    id: '3',
    name: 'Cjuree',
    image: 'https://i.ibb.co/DfyBDXdY/IMG-6251-1.jpg',
    views: "2000000",
    daysLeft: "U toku",
  },
];

const finishedCampaigns: FinishedCampaign[] = [
  {
    id: 'f1',
    name: 'ZavrtiKes - Clipping i Logo',
    image: 'https://firebasestorage.googleapis.com/v0/b/botina-44e95.firebasestorage.app/o/zavrtikes.jpg?alt=media&token=76c26083-7358-44b3-9807-5f79caebf6b0',
    totalViews: "9000000",
    totalClippers: 30,
    totalVideos: 127,
    duration: 30,
    topVideo: {
      views: "1000000",
      clipper: 'ZavrtiKesClips',
      link: "https://www.tiktok.com/@zavrtikesclips/video/7558444154922077462?_r=1&_t=ZM-912AC1OMWT2"
    },
  },
  {
    id: 'f2',
    name: 'AleksicMoto - Clipping',
    image: 'https://firebasestorage.googleapis.com/v0/b/botina-44e95.firebasestorage.app/o/aleksic.jpg?alt=media&token=6ece2b63-aabc-4d42-95f8-1b2eebc89af1',
    totalViews: "3000000",
    totalClippers: 15,
    totalVideos: 89,
    duration: 14,
    topVideo: {
      views: "300000",
      clipper: 'kliper1311',
      link: "https://www.tiktok.com/@kliper1311/video/7538504023171665208"
    },
  },
  {
    id: 'f3',
    name: 'Cjuree - Clipping',
    image: 'https://firebasestorage.googleapis.com/v0/b/botina-44e95.firebasestorage.app/o/cjuree.jpeg?alt=media&token=0cc34f5b-8216-4e79-aca0-22fd6beadf20',
    totalViews: "2000000",
    totalClippers: 15,
    totalVideos: 160,
    duration: 15,
    topVideo: {
      views: "280000",
      clipper: 'cjurefx.kliper',
      link: "https://www.tiktok.com/@cjurefx.kliper/video/7566342118235573560"
    }
  },
];

const formatViews = (views: string) => {
  const intViews = Number(views);
  if (intViews >= 1000000) return `${(intViews / 1000000).toFixed(1)}M`;
  if (intViews >= 1000) return `${(intViews / 1000).toFixed(0)}K`;
  return views.toString();
};

const formatCurrency = (amount: number) => {
  return `${(amount / 1000).toFixed(0)}K RSD`;
};

const FinishedCampaignsModal = ({
                                  isOpen,
                                  onClose,
                                }: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="blackAlpha.900" backdropFilter="blur(10px)" />
      <ModalContent bg="gray.900" color="white" m={0}>
        <ModalHeader
          borderBottom="1px"
          borderColor="gray.700"
          fontSize="2xl"
          fontWeight="bold"
        >
          Završene Kampanje
        </ModalHeader>
        <ModalCloseButton size="lg" />
        <ModalBody p={4} overflowY="auto">
          <VStack spacing={6} pb={6}>
            {finishedCampaigns.map((campaign) => (
              <Card
                key={campaign.id}
                w="full"
                bg="gray.800"
                borderRadius="xl"
                overflow="hidden"
              >
                <Image
                  src={campaign.image}
                  alt={campaign.name}
                  height="200px"
                  objectFit="cover"
                  fallbackSrc="https://via.placeholder.com/400x200"
                />
                <CardBody>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between" align="start">
                      <Text fontSize="xl" fontWeight="bold">
                        {campaign.name}
                      </Text>
                      <Badge
                        colorScheme={campaign.id === 'f3' ? 'blue' : 'green'}
                        fontSize="sm"
                      >
                        {campaign.id === 'f3' ? 'U toku' : 'Završeno'}
                      </Badge>
                    </HStack>

                    <Grid templateColumns="repeat(2, 1fr)" gap={3}>
                      <GridItem>
                        <VStack
                          align="start"
                          spacing={1}
                          p={3}
                          bg="gray.700"
                          borderRadius="lg"
                        >
                          <HStack color="gray.400">
                            <Eye size={16} />
                            <Text fontSize="xs">Ukupno Pregleda</Text>
                          </HStack>
                          <Text fontSize="lg" fontWeight="bold">
                            {formatViews(campaign.totalViews)}+
                          </Text>
                        </VStack>
                      </GridItem>

                      <GridItem>
                        <VStack
                          align="start"
                          spacing={1}
                          p={3}
                          bg="gray.700"
                          borderRadius="lg"
                        >
                          <HStack color="gray.400">
                            <Users size={16} />
                            <Text fontSize="xs">Kliperi</Text>
                          </HStack>
                          <Text fontSize="lg" fontWeight="bold">
                            {campaign.totalClippers}
                          </Text>
                        </VStack>
                      </GridItem>

                      <GridItem>
                        <VStack
                          align="start"
                          spacing={1}
                          p={3}
                          bg="gray.700"
                          borderRadius="lg"
                        >
                          <HStack color="gray.400">
                            <Video size={16} />
                            <Text fontSize="xs">Video Klipova</Text>
                          </HStack>
                          <Text fontSize="lg" fontWeight="bold">
                            {campaign.totalVideos}
                          </Text>
                        </VStack>
                      </GridItem>

                      <GridItem>
                        <VStack
                          align="start"
                          spacing={1}
                          p={3}
                          bg="gray.700"
                          borderRadius="lg"
                        >
                          <HStack color="gray.400">
                            <Calendar size={16} />
                            <Text fontSize="xs">Trajanje</Text>
                          </HStack>
                          <Text fontSize="lg" fontWeight="bold">
                            {campaign.duration} dana
                          </Text>
                        </VStack>
                      </GridItem>
                    </Grid>

                    <Divider borderColor="gray.700" />

                    <VStack
                      align="stretch"
                      p={3}
                      bg="gray.700"
                      borderRadius="lg"
                      spacing={2}
                    >
                      <HStack color="yellow.400">
                        <Award size={18} />
                        <Text fontSize="sm" fontWeight="bold">
                          Najpopularniji Video
                        </Text>
                      </HStack>
                      <HStack spacing={2}>
                        <Text
                          fontSize="md"
                          fontWeight="semibold"
                          color="blue.400"
                          textDecoration="underline"
                          cursor="pointer"
                          onClick={() => window.open(campaign.topVideo.link, '_blank')}
                        >
                          Link
                        </Text>
                        <ExternalLink size={16} color="#63B3ED" />
                      </HStack>
                      <HStack justify="space-between" fontSize="sm">
                        <HStack color="gray.400">
                          <Eye size={14} />
                          <Text>{formatViews(campaign.topVideo.views)}+</Text>
                        </HStack>
                        <Text color="gray.400">
                          by {campaign.topVideo.clipper}
                        </Text>
                      </HStack>
                    </VStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const CampaignCarousel = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const duplicatedCampaigns = [...campaigns, ...campaigns];

  return (
    <Box w="full" display={{ base: 'block', md: 'none' }}>
      <Box w="full" overflow="hidden" py={6}>
        <motion.div
          animate={{
            x: [0, -(296 * campaigns.length)],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{ display: 'flex', gap: '16px' }}
        >
          {duplicatedCampaigns.map((campaign, index) => (
            <Card
              key={`${campaign.id}-${index}`}
              minW="280px"
              bg="gray.800"
              borderRadius="xl"
              overflow="hidden"
              flexShrink={0}
            >
              <Image
                src={campaign.image}
                alt={campaign.name}
                height="160px"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/280x160"
              />
              <CardBody>
                <VStack align="stretch" spacing={3}>
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color="white"
                    noOfLines={1}
                  >
                    {campaign.name}
                  </Text>
                  <HStack justify="space-between">
                    <HStack spacing={2} color="gray.400">
                      <Eye size={16} />
                      <Text fontSize="md">
                        {formatViews(campaign.views)}+
                      </Text>
                    </HStack>
                    <HStack spacing={2} color="gray.400">
                      <Calendar size={16} />
                      <Text fontSize="md">{campaign.daysLeft}</Text>
                    </HStack>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ))}
        </motion.div>
      </Box>

      <Box px={4} pb={6} pt={16} display="flex" alignItems="center" justifyContent="center">
        <Button
          w="full"
          size="lg"
          bg="gray.800"
          color="white"
          borderRadius="xl"
          onClick={onOpen}
          rightIcon={<TrendingUp size={20} />}
          _hover={{ bg: 'gray.700' }}
          _active={{ bg: 'gray.600' }}
        >
          Pogledaj Završene Kampanje
        </Button>
      </Box>

      <FinishedCampaignsModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};