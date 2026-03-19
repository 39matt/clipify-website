'use client';

import { Box, Button, ButtonGroup, Center, Container, HStack, Heading, Input, SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react';
import { Global } from '@emotion/react';
import { usePathname } from 'next/navigation';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';



import React, { useEffect, useMemo, useRef, useState } from 'react';



import { ICampaign } from '../../../../lib/models/campaign';
import { ISnapshot } from '../../../../lib/models/snapshot';
import { IVideo } from '../../../../lib/models/video';


function calculateDailyDeltas(sortedSnapshots: ISnapshot[]) {
  return sortedSnapshots.map((snap, index) => {
    if (index === 0) return snap;
    const prevSnap = sortedSnapshots[index - 1];

    return {
      ...snap,
      totalViews: Math.max(0, snap.totalViews - prevSnap.totalViews),
      totalLikes: Math.max(0, snap.totalLikes - prevSnap.totalLikes),
      totalShares: Math.max(0, snap.totalShares - prevSnap.totalShares),
      totalComments: Math.max(0, snap.totalComments - prevSnap.totalComments),
    };
  });
}

function mergeGroupSnapshots(allSnapshots: ISnapshot[][]) {
  const dailyPerCampaign = allSnapshots.map((campaignSnapshots) => {
    const grouped: Record<string, ISnapshot> = {};
    campaignSnapshots.forEach((snap) => {
      const dateKey = new Date(snap.date).toISOString().split('T')[0];
      if (!grouped[dateKey] || new Date(snap.date).getTime() > new Date(grouped[dateKey].date).getTime()) {
        grouped[dateKey] = { ...snap };
      }
    });
    return grouped;
  });

  const allDatesSet = new Set<string>();
  dailyPerCampaign.forEach((data) => Object.keys(data).forEach((k) => allDatesSet.add(k)));
  const sortedDates = Array.from(allDatesSet).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  const latestKnown: ISnapshot[] = new Array(allSnapshots.length).fill(null);
  const combinedDaily: Record<string, ISnapshot> = {};

  sortedDates.forEach((dateKey) => {
    let tViews = 0, tLikes = 0, tShares = 0, tComments = 0, mProgress = 0;
    dailyPerCampaign.forEach((campaignData, index) => {
      if (campaignData[dateKey]) latestKnown[index] = campaignData[dateKey];
      const knownSnap = latestKnown[index];
      if (knownSnap) {
        tViews += knownSnap.totalViews || 0;
        tLikes += knownSnap.totalLikes || 0;
        tShares += knownSnap.totalShares || 0;
        tComments += knownSnap.totalComments || 0;
        mProgress = Math.max(mProgress, knownSnap.progress || 0);
      }
    });
    combinedDaily[dateKey] = { id: dateKey, date: dateKey, totalViews: tViews, totalLikes: tLikes, totalShares: tShares, totalComments: tComments, progress: mProgress } as ISnapshot;
  });

  return Object.entries(combinedDaily)
    .map(([dateKey, snap]) => ({
      ...snap,
      date: new Date(dateKey).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit' }),
      timestamp: dateKey,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

function aggregateSnapshotsByDay(snapshots: ISnapshot[]) {
  const grouped: Record<string, ISnapshot> = {};
  snapshots.forEach((snap) => {
    const dateKey = new Date(snap.date).toISOString().split('T')[0];
    if (!grouped[dateKey] || new Date(snap.date).getTime() > new Date(grouped[dateKey].date).getTime()) {
      grouped[dateKey] = snap;
    }
  });

  return Object.entries(grouped)
    .map(([dateKey, snap]) => ({
      ...snap,
      date: new Date(dateKey).toLocaleDateString('sr-RS', { day: '2-digit', month: '2-digit' }),
      timestamp: dateKey,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

function Chart({ data, selectedStats }: { data: ISnapshot[]; selectedStats: string[] }) {
  const statConfig: Record<string, { color: string; label: string }> = {
    totalViews: { color: '#3182CE', label: 'Pregledi' },
    totalLikes: { color: '#82ca9d', label: 'Lajkovi' },
    totalShares: { color: '#dd6b20', label: 'Deljenja' },
    totalComments: { color: '#d53f8c', label: 'Komentari' },
    progress: { color: '#E53E3E', label: 'Progres (%)' },
    totalVideos: { color: '#fff200', label: 'Broj videa' },
  };

  const activeStats = selectedStats.length > 0 ? selectedStats : ['totalViews'];

  return (
    <VStack spacing={8} w="100%">
      {activeStats.map((statKey) => {
        const { color, label } = statConfig[statKey];
        const isProgress = statKey === 'progress';

        return (
          <Box key={statKey} w="100%">
            <Heading fontSize="lg" color="gray.700" mb={3} textAlign="center">{label}</Heading>
            <Box w="100%" h={{ base: '250px', md: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis width={80} domain={isProgress ? [0, 100] : undefined} />
                  <Tooltip
                    contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                    formatter={(value: number) => isProgress ? `${value.toFixed(2)}%` : value.toLocaleString()}
                  />
                  <Line type="monotone" dataKey={statKey} stroke={color} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        );
      })}
    </VStack>
  );
}

const DurationCounter = ({ startDate, endDate }: { startDate: string; endDate?: string }) => {
  const [duration, setDuration] = useState('');
  useEffect(() => {
    const calculateTime = () => {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : new Date();
      const diff = end.getTime() - start.getTime();
      if (diff < 0) return setDuration('Not started');
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      setDuration(`${days} dana, ${hours} sati, ${minutes} minuta`);
    };
    calculateTime();
    if (!endDate) {
      const timer = setInterval(calculateTime, 60000);
      return () => clearInterval(timer);
    }
  }, [startDate, endDate]);
  return <>{duration}</>;
};

function VideoCard({ video }: { video: IVideo }) {
  return (
    <Box bg="white" border="1px solid" borderColor="gray.300" borderRadius="xl" overflow="hidden" transition="all 0.25s ease" _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl', borderColor: 'black' }}>
      <Box position="relative" paddingBottom="56.25%" bg="gray.100" overflow="hidden">
        <Box as="img" src={video.coverUrl} alt={video.name} position="absolute" top={0} left={0} w="100%" h="100%" objectFit="cover" />
        {video.approved === false && <Box position="absolute" top={2} right={2} bg="red.500" color="white" fontSize="xs" fontWeight="600" px={2} py={1} borderRadius="md">Nije odobreno</Box>}
      </Box>
      <Box p={4}>
        <Text fontSize="md" fontWeight="600" color="black" noOfLines={2} mb={2}>{video.name}</Text>
        <Text fontSize="sm" color="gray.600" mb={3}>@{video.accountName}</Text>
        <SimpleGrid columns={2} spacing={2} mb={3}>
          <Box><Text fontSize="xs" color="gray.500">Pregledi</Text><Text fontSize="sm" fontWeight="600">{video.views.toLocaleString()}</Text></Box>
          <Box><Text fontSize="xs" color="gray.500">Lajkovi</Text><Text fontSize="sm" fontWeight="600">{video.likes.toLocaleString()}</Text></Box>
          <Box><Text fontSize="xs" color="gray.500">Komentari</Text><Text fontSize="sm" fontWeight="600">{video.comments.toLocaleString()}</Text></Box>
          <Box><Text fontSize="xs" color="gray.500">Deljenja</Text><Text fontSize="sm" fontWeight="600">{video.shares.toLocaleString()}</Text></Box>
        </SimpleGrid>
        <Text fontSize="xs" color="gray.500" mb={3}>Postavljeno: {new Date(video.createdAt).toLocaleDateString('sr-RS')}</Text>
        <Box as="a" href={video.link} target="_blank" rel="noopener noreferrer" display="block" textAlign="center" py={2} px={4} bg="gray.900" color="white" fontSize="sm" fontWeight="500" borderRadius="md" transition="all 0.2s" _hover={{ bg: 'gray.700', textDecoration: 'none' }}>Pogledaj video</Box>
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
      `}
      />
    )
  }

  const pathname = usePathname();
  const campaignId = pathname?.split('/').pop();

  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<ICampaign | null>(null);
  const [videos, setVideos] = useState<IVideo[]>([]);
  const [rawSnapshots, setRawSnapshots] = useState<ISnapshot[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [totalViews, setTotalViews] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [totalShares, setTotalShares] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalVideos, setTotalVideos] = useState(0);

  const [viewMode, setViewMode] = useState<'cumulative' | 'daily'>('cumulative');
  const [sortBy, setSortBy] = useState<'date' | 'views'>('views');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStats, setSelectedStats] = useState<string[]>(['totalViews']);
  const [currentPage, setCurrentPage] = useState(1);
  const videoSectionRef = useRef<HTMLDivElement>(null);

  const displayedSnapshots = useMemo(() => {
    return viewMode === 'daily' ? calculateDailyDeltas(rawSnapshots) : rawSnapshots;
  }, [rawSnapshots, viewMode]);

  useEffect(() => {
    if (!campaignId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/campaign/get?id=${campaignId}`);
        const data = await res.json();

        if (data.campaign) {
          setCampaign(data.campaign);
          setVideos(data.videos || []);
          setRawSnapshots(aggregateSnapshotsByDay(data.snapshots || []));
        } else {
          const groupRes = await fetch(`/api/campaign/group/get?id=${campaignId}`);
          const groupData = await groupRes.json();
          const validMembers = groupData.members?.filter((m: any) => m != null) || [];

          if (groupData.group && validMembers.length > 0) {
            const first = validMembers[0];
            const aggregatedCampaign: ICampaign = {
              ...first,
              id: campaignId as string,
              influencer: campaignId.charAt(0).toUpperCase() + campaignId.slice(1),
              totalViews: validMembers.reduce(
                (sum: number, m: any) => sum + (m.totalViews || 0),
                0,
              ),
              totalLikes: validMembers.reduce(
                (sum: number, m: any) => sum + (m.totalLikes || 0),
                0,
              ),
              totalComments: validMembers.reduce(
                (sum: number, m: any) => sum + (m.totalComments || 0),
                0,
              ),
              totalShares: validMembers.reduce(
                (sum: number, m: any) => sum + (m.totalShares || 0),
                0,
              ),
              moneySpent: validMembers.reduce(
                (sum: number, m: any) => sum + (m.moneySpent || 0),
                0,
              ),
              budget: validMembers.reduce(
                (sum: number, m: any) => sum + (m.budget || 0),
                0,
              ),
              progress:
                validMembers.reduce(
                  (sum: number, m: any) => sum + (m.progress || 0),
                  0,
                ) / validMembers.length,
              dateStarted: validMembers.reduce((earliest: any, m: any) => {
                console.log(m.dateStarted)
                const mStart = m.dateStarted || m.createdAt
                if (!mStart) return earliest
                if (!earliest) return mStart
                return new Date(mStart) < new Date(earliest) ? mStart : earliest
              }, null),
              lastUpdatedAt: validMembers.reduce((latest: any, m: any) => {
                if (!m.lastUpdatedAt) return latest
                if (!latest) return m.lastUpdatedAt
                return new Date(m.lastUpdatedAt) > new Date(latest)
                  ? m.lastUpdatedAt
                  : latest
              }, null),
            }
            setCampaign(aggregatedCampaign);
            setVideos(groupData.videos || []);
            setRawSnapshots(mergeGroupSnapshots(groupData.snapshots || []));
          } else {
            setError('Kampanja nije pronađena.');
          }
        }
      } catch (err) {
        setError('Greška pri učitavanju podataka.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [campaignId]);

  useEffect(() => {
    if (videos?.length > 0) {
      setTotalViews(videos.reduce((s, v) => s + v.views, 0));
      setTotalLikes(videos.reduce((s, v) => s + (v.likes ?? 0), 0));
      setTotalComments(videos.reduce((s, v) => s + (v.comments ?? 0), 0));
      setTotalShares(videos.reduce((s, v) => s + (v.shares ?? 0), 0));
      setTotalVideos(videos.length);
    }
  }, [videos]);

  const sortedVideos = useMemo(() => {
    const filtered = videos?.filter(v => v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.accountName.toLowerCase().includes(searchTerm.toLowerCase()));
    return [...filtered].sort((a, b) => {
      const diff = sortBy === 'views' ? a.views - b.views : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? diff : -diff;
    });
  }, [videos, sortBy, sortOrder, searchTerm]);

  const indexOfLastVideo = currentPage * 12;
  const indexOfFirstVideo = indexOfLastVideo - 12;
  const currentVideos = sortedVideos.slice(indexOfFirstVideo, indexOfLastVideo);
  const totalPages = Math.ceil(sortedVideos.length / 12);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (videoSectionRef.current) {
      videoSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <>
        <DottedBackgroundGlobal />
        <Box minH="100dvh" bgColor="white" sx={{ backgroundImage: `radial-gradient(rgba(0,0,0,0.06) 2px, transparent 2px)`, backgroundSize: '22px 22px', backgroundAttachment: 'fixed' }} color="gray.900" overflow="hidden">
          <Center minH="100vh" flexDirection="column">
            <Spinner size="xl" />
            <Text mt={4} fontSize="lg" color="gray.500">Učitavanje kampanje...</Text>
          </Center>
        </Box>
      </>
    );
  }

  if (!campaign || error) return null;

  return (
    <>
      <DottedBackgroundGlobal />
      <Box minH="100dvh" bgColor="white" sx={{ backgroundImage: `radial-gradient(rgba(0,0,0,0.06) 2px, transparent 2px)`, backgroundSize: '22px 22px', backgroundAttachment: 'fixed' }} color="gray.800" overflow="hidden">
        <Container maxW={{ base: '100%', md: '75%' }} w="full">

          <Heading textAlign="center" mt={{ base: 6, lg: 8 }} fontSize={{ base: '4xl', lg: '6xl' }} fontWeight={300}>
            {campaign.influencer} - {campaign.activity}
          </Heading>

          <Box mt={8} w="100%" h="48px" bg="gray.200" borderRadius="full" overflow="hidden" position="relative">
            <Box h="100%" bg={campaign.progress < 50 ? 'green.400' : campaign.progress < 90 ? 'orange.500' : 'red.500'} width={`${campaign.progress}%`} transition="width 0.4s ease" borderRadius="full" />
            <Center position="absolute" inset={0}><Text fontSize="2xl" fontWeight="800" color={campaign.progress < 50 ? 'black' : 'white'} textShadow="0 0 4px rgba(0,0,0,0.2)">{campaign.progress.toPrecision(3)}%</Text></Center>
          </Box>

          {(campaign.dateStarted || campaign.dateEnded) && (
            <Center mt={4}>
              <Box bg="gray.100" px={4} py={2} borderRadius="full" border="1px solid" borderColor="gray.300">
                <Text fontSize="sm" fontWeight="600" color="gray.600">📅 Trajanje: <DurationCounter startDate={campaign.dateStarted || campaign.createdAt} endDate={campaign.dateEnded} /></Text>
              </Box>
            </Center>
          )}

          {campaign.lastUpdatedAt && (
            <Center mt={4}>
              <Box bg="gray.100" px={4} py={2} borderRadius="full" border="1px solid" borderColor="gray.300">
                <Text fontSize="sm" fontWeight="600" color="gray.600">🔄 Poslednji update: {new Date(campaign.lastUpdatedAt).toLocaleDateString('sr-RS')}</Text>
              </Box>
            </Center>
          )}

          <SimpleGrid mt={12} spacing={8} minChildWidth={{ base: '160px', md: '200px' }} w="100%">
            {[
              { label: 'Ukupno Pregleda', val: totalViews, key: 'totalViews' },
              { label: 'Ukupno Lajkova', val: totalLikes, key: 'totalLikes' },
              { label: 'Ukupno Komentara', val: totalComments, key: 'totalComments' },
              { label: 'Ukupno Deljenja', val: totalShares, key: 'totalShares' },
              { label: 'Progres (%)', val: campaign.progress.toFixed(1), key: 'progress' },
              { label: 'Broj videa', val: totalVideos, key: 'totalVideos' },
            ].map(item => (
              <Box key={item.key} as="button" onClick={() => setSelectedStats(p => p.includes(item.key) ? p.filter(s => s !== item.key) : [...p, item.key])} bg="white" color="black" border="2px solid" borderColor={selectedStats.includes(item.key) ? 'black' : 'gray.300'} borderRadius="xl" p={{ base: 5, md: 6 }} textAlign="center" boxShadow={selectedStats.includes(item.key) ? 'xl' : 'sm'} transition="all 0.25s ease" transform={selectedStats.includes(item.key) ? 'scale(1.05)' : 'scale(1)'} _hover={{ transform: 'translateY(-4px) scale(1.03)', boxShadow: 'xl', borderColor: 'black', bg: 'gray.100' }} _active={{ transform: 'translateY(0) scale(0.98)' }}>
                <Text fontSize="sm" fontWeight="500" color="gray.600" textTransform="uppercase" letterSpacing="wide">{item.label}</Text>
                <Text fontSize={{ base: '2xl', md: '3xl' }} fontWeight="700" color="black" mt={2}>{item.val.toLocaleString()}</Text>
                {selectedStats.includes(item.key) && <Text fontSize="xs" color="green.300" mt={1}>✓ Prikazano</Text>}
              </Box>
            ))}
          </SimpleGrid>

          {displayedSnapshots.length > 0 ? (
            <Center mt={12} flexDirection="column" gap={4}>
              <HStack justify="space-between" w="100%" px={4} wrap="wrap">
                <Heading fontSize="xl" color="gray.700">📊 Izabrane metrike {selectedStats.length > 0 ? `(${selectedStats.length})` : '(ništa izabrano)'}</Heading>
                <ButtonGroup size="sm" isAttached>
                  <Button
                    bg={viewMode === 'cumulative' ? 'gray.900' : 'white'}
                    color={viewMode === 'cumulative' ? 'white' : 'gray.900'}
                    border="1px solid"
                    borderColor="gray.900"
                    _hover={{ bg: viewMode === 'cumulative' ? 'black' : 'gray.100' }}
                    onClick={() => setViewMode('cumulative')}
                  >
                    Ukupno
                  </Button>
                  <Button
                    bg={viewMode === 'daily' ? 'gray.900' : 'white'}
                    color={viewMode === 'daily' ? 'white' : 'gray.900'}
                    border="1px solid"
                    borderColor="gray.900"
                    // To prevent double borders in the middle of the attached group:
                    borderLeft="none"
                    _hover={{ bg: viewMode === 'daily' ? 'black' : 'gray.100' }}
                    onClick={() => setViewMode('daily')}
                  >
                    Dnevno
                  </Button>
                </ButtonGroup>
              </HStack>
              <Chart data={displayedSnapshots} selectedStats={selectedStats} />
            </Center>
          ) : (
            <Center mt={12}>
              <Text color="gray.500">Nema dostupnih podataka.</Text>
            </Center>
          )}

          <Box mt={16} ref={videoSectionRef}>
            <Heading fontSize={{ base: '3xl', md: '4xl' }} fontWeight={300} mb={6}>Video Klipovi</Heading>

            <Box mb={6} position="relative">
              <Input type="text" placeholder="Pretraži po nazivu ili kreatoru..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} size="lg" bg="white" borderColor="gray.300" borderRadius="lg" fontSize="md" color="gray.900" _placeholder={{ color: 'gray.500' }} _hover={{ borderColor: 'gray.400' }} _focus={{ borderColor: 'black', boxShadow: '0 0 0 1px black' }} />
              {searchTerm && (
                <Box as="button" type="button" onClick={(e) => { e.preventDefault(); setSearchTerm(''); }} position="absolute" right={3} top="50%" transform="translateY(-50%)" color="gray.500" fontSize="2xl" fontWeight="bold" lineHeight="1" _hover={{ color: 'gray.900' }} transition="color 0.2s" cursor="pointer">×</Box>
              )}
            </Box>

            <SimpleGrid columns={{ base: 2 }} spacing={4} mb={8}>
              <Box as="button" onClick={() => setSortBy('views')} bg={sortBy === 'views' ? 'gray.900' : 'white'} color={sortBy === 'views' ? 'white' : 'gray.900'} border="1px solid" borderColor={sortBy === 'views' ? 'gray.900' : 'gray.300'} borderRadius="lg" p={4} textAlign="center" fontWeight="600" fontSize="sm" transition="all 0.2s" _hover={{ borderColor: 'black', transform: 'translateY(-2px)' }}>Sortiraj po pregledima</Box>
              <Box as="button" onClick={() => setSortBy('date')} bg={sortBy === 'date' ? 'gray.900' : 'white'} color={sortBy === 'date' ? 'white' : 'gray.900'} border="1px solid" borderColor={sortBy === 'date' ? 'gray.900' : 'gray.300'} borderRadius="lg" p={4} textAlign="center" fontWeight="600" fontSize="sm" transition="all 0.2s" _hover={{ borderColor: 'black', transform: 'translateY(-2px)' }}>Sortiraj po datumu</Box>
              <Box gridColumn="span 2" as="button" onClick={() => setSortOrder(p => p === 'asc' ? 'desc' : 'asc')} bg="white" border="1px solid" borderColor="gray.300" borderRadius="lg" p={4} textAlign="center" fontWeight="600" fontSize="sm" transition="all 0.2s" _hover={{ borderColor: 'black', transform: 'translateY(-2px)' }}>{sortOrder === 'asc' ? '↑ Rastuće' : '↓ Opadajuće'}</Box>
            </SimpleGrid>

            {sortedVideos.length > 0 ? (
              <>
                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={6}>
                  {currentVideos.filter(video => video.approved).map((video) => <VideoCard key={video.id} video={video} />)}
                </SimpleGrid>

                {totalPages > 1 && (
                  <HStack spacing={4} justify="center" mt={12} mb={12}>
                    <Button onClick={() => handlePageChange(currentPage - 1)} isDisabled={currentPage === 1} variant="outline" colorScheme="black" size="md">Prethodna</Button>
                    <Text fontWeight="bold">Strana {currentPage} od {totalPages}</Text>
                    <Button onClick={() => handlePageChange(currentPage + 1)} isDisabled={currentPage === totalPages} variant="outline" colorScheme="black" size="md">Sledeća</Button>
                  </HStack>
                )}
              </>
            ) : (
              <Center py={12}><Text color="gray.500" fontSize="lg">Nema video klipova za prikaz.</Text></Center>
            )}
          </Box>
        </Container>
      </Box>
    </>
  );
};
export default Page;