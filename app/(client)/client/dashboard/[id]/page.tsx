'use client'
import { usePathname } from 'next/navigation'
import { Box, Center, Container, Heading, SimpleGrid, Spinner, Text, Input } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import React, { useEffect, useMemo, useState } from 'react'
import { ICampaign } from '../../../../lib/models/campaign'
import { IVideo } from '../../../../lib/models/video'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { ISnapshot } from '../../../../lib/models/snapshot'

function aggregateSnapshotsByDay(snapshots: ISnapshot[]) {
  const grouped: Record<string, ISnapshot> = {};

  snapshots.forEach((snap) => {
    const fullDate = new Date(snap.date);
    const dateKey = fullDate.toISOString().split("T")[0];

    if (
      !grouped[dateKey] ||
      new Date(snap.date).getTime() >
      new Date(grouped[dateKey].date).getTime()
    ) {
      grouped[dateKey] = snap;
    }
  });

  return Object.entries(grouped)
    .map(([dateKey, snap]) => ({
      ...snap,
      date: new Date(dateKey).toLocaleDateString("sr-RS", {
        day: "2-digit",
        month: "2-digit",
      }),
      timestamp: dateKey,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

function Chart({ data }) {
  return (
    <Box w="100%" h={{ base: "300px", md: "400px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis width={80} />
          <Tooltip contentStyle={{ fontSize: '12px' }} />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line type="monotone" dataKey="totalViews" stroke="#3182CE" name="Pregledi" />
          <Line type="monotone" dataKey="totalLikes" stroke="#82ca9d" name="Lajkovi" />
          <Line type="monotone" dataKey="totalShares" stroke="#dd6b20" name="Deljenja" />
          <Line
            type="monotone"
            dataKey="progress"
            stroke="#E53E3E"
            name="Progres (%)"
            yAxisId="right"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
}

function VideoCard({ video }: { video: IVideo }) {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="gray.300"
      borderRadius="xl"
      overflow="hidden"
      transition="all 0.25s ease"
      _hover={{
        transform: 'translateY(-4px)',
        boxShadow: 'xl',
        borderColor: 'black',
      }}
    >
      {/* Thumbnail */}
      <Box
        position="relative"
        paddingBottom="56.25%"
        bg="gray.100"
        overflow="hidden"
      >
        <Box
          as="img"
          src={video.coverUrl}
          alt={video.name}
          position="absolute"
          top={0}
          left={0}
          w="100%"
          h="100%"
          objectFit="cover"
        />
        {video.approved === false && (
          <Box
            position="absolute"
            top={2}
            right={2}
            bg="red.500"
            color="white"
            fontSize="xs"
            fontWeight="600"
            px={2}
            py={1}
            borderRadius="md"
          >
            Nije odobreno
          </Box>
        )}
      </Box>

      {/* Content */}
      <Box p={4}>
        <Text
          fontSize="md"
          fontWeight="600"
          color="black"
          noOfLines={2}
          mb={2}
        >
          {video.name}
        </Text>

        <Text fontSize="sm" color="gray.600" mb={3}>
          @{video.accountName}
        </Text>

        {/* Stats Grid */}
        <SimpleGrid columns={2} spacing={2} mb={3}>
          <Box>
            <Text fontSize="xs" color="gray.500">Pregledi</Text>
            <Text fontSize="sm" fontWeight="600">{video.views.toLocaleString()}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500">Lajkovi</Text>
            <Text fontSize="sm" fontWeight="600">{video.likes.toLocaleString()}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500">Komentari</Text>
            <Text fontSize="sm" fontWeight="600">{video.comments.toLocaleString()}</Text>
          </Box>
          <Box>
            <Text fontSize="xs" color="gray.500">Deljenja</Text>
            <Text fontSize="sm" fontWeight="600">{video.shares.toLocaleString()}</Text>
          </Box>
        </SimpleGrid>

        <Text fontSize="xs" color="gray.500" mb={3}>
          Postavljeno: {new Date(video.createdAt).toLocaleDateString('sr-RS')}
        </Text>

        {/* Link */}
        <Box
          as="a"
          href={video.link}
          target="_blank"
          rel="noopener noreferrer"
          display="block"
          textAlign="center"
          py={2}
          px={4}
          bg="gray.900"
          color="white"
          fontSize="sm"
          fontWeight="500"
          borderRadius="md"
          transition="all 0.2s"
          _hover={{
            bg: 'gray.700',
            textDecoration: 'none',
          }}
        >
          Pogledaj video
        </Box>
      </Box>
    </Box>
  );
}

const Page = () => {
  function DottedBackgroundGlobal() {
    return (
      <Global
        styles={`
        :root {
          --dot-color: rgba(0, 0, 0, 0.06);
          --dot-size: 2px;
          --dot-space: 22px;
        }
        html, body, #__next { height: 100%; }
        body {
          background-color: #ffffff;
          background-image:
            radial-gradient(var(--dot-color) var(--dot-size), transparent var(--dot-size));
          background-size: var(--dot-space) var(--dot-space);
        }
      `}
      />
    );
  }

  const pathname = usePathname();
  const [loading, setLoading] = useState(true)
  const campaignId = pathname?.split('/').pop();
  const [campaign, setCampaign] = useState<ICampaign | null>();
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [snapshots, setSnapshots] = useState<ISnapshot[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalViews, setTotalViews] = useState<number>(0);
  const [totalLikes, setTotalLikes] = useState<number>(0);
  const [totalShares, setTotalShares] = useState<number>(0);
  const [totalComments, setTotalComments] = useState<number>(0);
  const [totalVideos, setTotalVideos] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'date' | 'views'>('views');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!campaignId || Array.isArray(campaignId)) return;

    const fetchData = async () => {
      try {

        setLoading(true);
        const campaignResp = await fetch(`/api/campaign/get?id=${campaignId}`, {
          method: 'GET',
        });
        const responseJson = await campaignResp.json();
        const camp = responseJson.campaign as ICampaign
        const vids = responseJson.videos as IVideo[]
        const snapshots = responseJson.snapshots as ISnapshot[]
        // setVideos(vids.sort((a, b) => b.views- a.views));
        setVideos(vids);
        setSnapshots(aggregateSnapshotsByDay(snapshots));
        setCampaign(camp);
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Greška pri učitavanju videa, pokušajte ponovo.');
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (videos.length > 0) {
      setTotalViews(videos.reduce((sum, v) => sum + v.views, 0));
      setTotalLikes(videos.reduce((sum, v) => sum + (v.likes ?? 0), 0));
      setTotalComments(videos.reduce((sum, v) => sum + (v.comments ?? 0), 0));
      setTotalShares(videos.reduce((sum, v) => sum + (v.shares ?? 0), 0));
      setTotalVideos(videos.length);
    }
  }, [videos]);

  const sortedVideos = useMemo(() => {
    if (videos.length === 0) return [];

    const filtered = videos.filter(
      (v) =>
        v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.accountName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'views') {
        comparison = a.views - b.views;
      } else {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [videos, sortBy, sortOrder, searchTerm]);

  if (loading) {
    return (
      <>
        <DottedBackgroundGlobal/>
        <Box
          minH="100dvh"
          bgColor="white"
          sx={{
            backgroundImage: `radial-gradient(rgba(0,0,0,0.06) 2px, transparent 2px)`,
            backgroundSize: '22px 22px',
            backgroundAttachment: 'fixed',
          }}
          color="gray.900"
          overflow="hidden"
        >
          <Center minH="100vh" flex={1} flexDirection="column">
            <Spinner size="xl" />
            <Text mt={4} fontSize="lg" color="gray.500">
              Učitavanje kampanje...
            </Text>
          </Center>
        </Box>
      </>
    );
  }

  if (!campaign) {
    return (
      <>
        <DottedBackgroundGlobal/>
        <Box
          minH="100dvh"
          bgColor="white"
          sx={{
            backgroundImage: `radial-gradient(rgba(0,0,0,0.06) 2px, transparent 2px)`,
            backgroundSize: '22px 22px',
            backgroundAttachment: 'fixed',
          }}
          color="gray.900"
          overflow="hidden"
        >
          <Center minH="100dvh">
            <Text color="gray.900" fontSize="4xl">
              Žao nam je, kampanja nije pronađena.
            </Text>
          </Center>

        </Box>
      </>
    )
  }

  if (error) {
    return (
      <>
        <DottedBackgroundGlobal/>
        <Box
          minH="100dvh"
          bgColor="white"
          sx={{
            backgroundImage: `radial-gradient(rgba(0,0,0,0.06) 2px, transparent 2px)`,
            backgroundSize: '22px 22px',
            backgroundAttachment: 'fixed',
          }}
          color="gray.900"
          overflow="hidden"
        >
          <Center minH="100dvh">
            <Text color="red.500" fontSize="4xl">
              {error}
            </Text>
          </Center>

        </Box>
      </>
    )
  }

  return (
    <>
      <DottedBackgroundGlobal/>
      <Box
        minH="100dvh"
        bgColor="white"
        sx={{
          backgroundImage: `radial-gradient(rgba(0,0,0,0.06) 2px, transparent 2px)`,
          backgroundSize: '22px 22px',
          backgroundAttachment: 'fixed',
        }}
        color="gray.800"
        overflow="hidden"
      >
        <Container maxW={{base:"100%", md: "75%"}} w={"full"}>
          <Heading
            textAlign="center"
            mt={{ base: 6, lg: 8 }}
            fontSize={{ base: '4xl', lg: '6xl' }}
            fontWeight={300}
          >
            {campaign.influencer} - {campaign.activity}
          </Heading>
          <Box
            mt={8}
            w="100%"
            h="48px"
            bg="gray.200"
            borderRadius="full"
            overflow="hidden"
            position="relative"
          >
            <Box
              h="100%"
              bg={
                campaign.progress < 50
                  ? 'green.400'
                  : campaign.progress < 90
                    ? 'orange.500'
                    : 'red.500'
              }
              width={`${campaign.progress}%`}
              transition="width 0.4s ease"
              borderRadius="full"
            />

            <Center position="absolute" inset={0}>
              <Text
                fontSize="2xl"
                fontWeight="800"
                color={campaign.progress < 50 ? "black" : "white"}
                textShadow="0 0 4px rgba(0,0,0,0.2)"
              >
                {campaign.progress.toPrecision(3)}%
              </Text>
            </Center>
          </Box>

          <SimpleGrid
            mt={12}
            spacing={8}
            minChildWidth={{ base: '160px', md: '200px' }}
            w="100%"
          >
            {[
              { label: 'Ukupno Pregleda', value: totalViews.toLocaleString() },
              { label: 'Ukupno Lajkova', value: totalLikes.toLocaleString() },
              { label: 'Ukupno Komentara', value: totalComments.toLocaleString() },
              { label: 'Ukupno Deljenja', value: totalShares.toLocaleString() },
              { label: 'Ukupno Videa', value: videos.length },
            ].map((item, i) => (
              <Box
                key={i}
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="xl"
                p={{ base: 5, md: 6 }}
                textAlign="center"
                boxShadow="sm"
                transition="all 0.25s ease"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'xl',
                  borderColor: 'black',
                }}
              >
                <Text
                  fontSize="sm"
                  fontWeight="500"
                  color="gray.600"
                  textTransform="uppercase"
                  letterSpacing="wide"
                >
                  {item.label}
                </Text>

                <Text
                  fontSize={{ base: '2xl', md: '3xl' }}
                  fontWeight="700"
                  color="black"
                  mt={2}
                >
                  {item.value}
                </Text>
              </Box>
            ))}
          </SimpleGrid>

          {snapshots.length > 0 ? (
            <Center mt={12}>
              <Chart data={snapshots} />
            </Center>
          ) : (
            <Center mt={12}>
              <Text color="gray.500">Nema dostupnih snimaka napretka kampanje.</Text>
            </Center>
          )}

          {/* Video Listing Section */}
          <Box mt={16}>
            <Heading
              fontSize={{ base: '3xl', md: '4xl' }}
              fontWeight={300}
              mb={6}
            >
              Video Klipovi
            </Heading>
            {/* Search Bar */}
            <Box mb={6} position="relative">
              <Input
                type="text"
                placeholder="Pretraži po nazivu ili kreatoru..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="lg"
                bg="white"
                borderColor="gray.300"
                borderRadius="lg"
                fontSize="md"
                color="gray.900"
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                  borderColor: 'gray.400',
                }}
                _focus={{
                  borderColor: 'black',
                  boxShadow: '0 0 0 1px black',
                }}
              />
              {searchTerm && (
                <Box
                  as="button"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSearchTerm('');
                  }}
                  position="absolute"
                  right={3}
                  top="50%"
                  transform="translateY(-50%)"
                  color="gray.500"
                  fontSize="2xl"
                  fontWeight="bold"
                  lineHeight="1"
                  _hover={{ color: 'gray.900' }}
                  transition="color 0.2s"
                  cursor="pointer"
                >
                  ×
                </Box>
              )}
              {searchTerm && (
                <Text fontSize="sm" color="gray.600" mt={2}>
                  Pronađeno: {sortedVideos.length} video{sortedVideos.length !== 1 ? 'a' : ''}
                </Text>
              )}
            </Box>

            <SimpleGrid
              columns={{ base: 2 }}
              spacing={4}
              mb={8}
            >
              <Box
                as="button"
                onClick={() => setSortBy('views')}
                bg={sortBy === 'views' ? 'gray.900' : 'white'}
                color={sortBy === 'views' ? 'white' : 'gray.900'}
                border="1px solid"
                borderColor={sortBy === 'views' ? 'gray.900' : 'gray.300'}
                borderRadius="lg"
                p={4}
                textAlign="center"
                fontWeight="600"
                fontSize="sm"
                transition="all 0.2s"
                _hover={{
                  borderColor: 'black',
                  transform: 'translateY(-2px)',
                }}
              >
                Sortiraj po pregledima
              </Box>

              <Box
                as="button"
                onClick={() => setSortBy('date')}
                bg={sortBy === 'date' ? 'gray.900' : 'white'}
                color={sortBy === 'date' ? 'white' : 'gray.900'}
                border="1px solid"
                borderColor={sortBy === 'date' ? 'gray.900' : 'gray.300'}
                borderRadius="lg"
                p={4}
                textAlign="center"
                fontWeight="600"
                fontSize="sm"
                transition="all 0.2s"
                _hover={{
                  borderColor: 'black',
                  transform: 'translateY(-2px)',
                }}
              >
                Sortiraj po datumu
              </Box>
              <Box
                gridColumn={"span 2"}
                as="button"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                bg="white"
                border="1px solid"
                borderColor="gray.300"
                borderRadius="lg"
                p={4}
                textAlign="center"
                fontWeight="600"
                fontSize="sm"
                transition="all 0.2s"
                _hover={{
                  borderColor: 'black',
                  transform: 'translateY(-2px)',
                }}
              >
                {sortOrder === 'asc' ? '↑ Rastuće' : '↓ Opadajuće'}
              </Box>
            </SimpleGrid>


            {sortedVideos.length > 0 ? (
              <SimpleGrid
                columns={{ base: 1, sm: 2, lg: 3 }}
                spacing={6}
              >
                {sortedVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </SimpleGrid>
            ) : (
              <Center py={12}>
                <Text color="gray.500" fontSize="lg">
                  Nema video klipova za prikaz.
                </Text>
              </Center>
            )}
          </Box>
        </Container>
      </Box>
    </>
  )
}
export default Page;