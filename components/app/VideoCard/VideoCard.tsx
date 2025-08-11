import {
  AspectRatio,
  Badge,
  Box,
  Card,
  CardBody,
  HStack,
  IconButton,
  Image,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Text,
  VStack,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import { IVideo } from '../../../app/lib/models/video';
import { useState } from 'react';
import { DeleteIcon } from 'lucide-react'

const VideoCard = ({
                     video,
                     index,
                     onRemove,
                   }: {
  video: IVideo;
  index: number;
  onRemove?: (id: string) => void; // callback to parent after removal
}) => {
  const toast = useToast();
  const [removing, setRemoving] = useState(false);

  const handleRemove = async () => {
    if (!confirm('Da li ste sigurni da želite obrisati ovaj video?')) return;

    setRemoving(true);
    try {
      // Example API call — adjust endpoint to your backend
      const res = await fetch(`/api/campaign/video/delete?id=${video.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete video');
      }

      toast({
        title: 'Video obrisan',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      if (onRemove) onRemove(video.id!);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Greška pri brisanju videa',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRemoving(false);
    }
  };

  return (
    <Card
      key={video.id || index}
      bg="gray.700"
      borderRadius="md"
      overflow="hidden"
      position="relative"
      _hover={{ boxShadow: 'lg', transform: 'translateY(-2px)', transition: '0.2s' }}
    >
      {/* Remove Button */}
      <Tooltip label="Obriši video" hasArrow>
        <IconButton
          icon={<DeleteIcon />}
          aria-label="Obriši video"
          size="sm"
          colorScheme="red"
          position="absolute"
          top={2}
          right={2}
          onClick={handleRemove}
          isLoading={removing}
          variant="solid"
          _hover={{ bg: 'red.500' }}
        />
      </Tooltip>

      <AspectRatio ratio={9 / 16} maxH="200px">
        <Image
          src={video.coverUrl}
          alt={video.name || 'Video'}
          objectFit="cover"
          fallback={
            <Box
              bg="gray.600"
              w="full"
              h="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.400">Nema slike</Text>
            </Box>
          }
        />
      </AspectRatio>
      <CardBody p={3}>
        <VStack spacing={2} align="stretch">
          <HStack justify="space-between" align="center">
            <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
              @{video.accountName}
            </Text>
            <Badge
              colorScheme={
                video.approved === true
                  ? 'green'
                  : video.approved === false
                    ? 'red'
                    : 'yellow'
              }
              size="sm"
            >
              {video.approved === true
                ? 'Odobreno'
                : video.approved === false
                  ? 'Odbačeno'
                  : 'Na čekanju'}
            </Badge>
          </HStack>

          <Text fontSize="xs" color="gray.400" noOfLines={2}>
            {video.name || 'Bez naziva'}
          </Text>

          <SimpleGrid columns={2} spacing={2} fontSize="xs">
            <Stat size="sm">
              <StatLabel color="blue.300">Pregledi</StatLabel>
              <StatNumber fontSize="sm">
                {(video.views || 0).toLocaleString()}
              </StatNumber>
            </Stat>
            <Stat size="sm">
              <StatLabel color="red.300">Lajkovi</StatLabel>
              <StatNumber fontSize="sm">
                {(video.likes || 0).toLocaleString()}
              </StatNumber>
            </Stat>
            <Stat size="sm">
              <StatLabel color="yellow.300">Komentari</StatLabel>
              <StatNumber fontSize="sm">
                {(video.comments || 0).toLocaleString()}
              </StatNumber>
            </Stat>
            <Stat size="sm">
              <StatLabel color="green.300">Deljenja</StatLabel>
              <StatNumber fontSize="sm">
                {(video.shares || 0).toLocaleString()}
              </StatNumber>
            </Stat>
          </SimpleGrid>

          <Text fontSize="xs" color="gray.500" textAlign="center">
            {video.createdAt
              ? new Date(video.createdAt).toLocaleDateString('sr-RS')
              : 'Nepoznat datum'}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default VideoCard;