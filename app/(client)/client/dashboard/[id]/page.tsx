'use client'
import { usePathname } from 'next/navigation'
import { Box, Center, Container, Heading, SimpleGrid, Spinner, Text } from '@chakra-ui/react'
import { Global } from '@emotion/react'
import React, { useEffect, useState } from 'react'
import { ICampaign } from '../../../../lib/models/campaign'
import { IVideo } from '../../../../lib/models/video'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts'
import { ISnapshot } from '../../../../lib/models/snapshot'

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
      <LineChart
        width={1000}
        height={400}
        data={data}
        margin={{ top: 16, right: 24, left: 0, bottom: 16 }}
      >
        <XAxis dataKey="date" />
        <YAxis width={80}/>
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalViews" stroke="#3182CE" name="Pregledi" />
        <Line type="monotone" dataKey="totalLikes" stroke="#82ca9d" name="Lajkovi" />
        <Line type="monotone" dataKey="totalComments" stroke="#dd6b20" name="Komentari" />
        <Line
          type="monotone"
          dataKey="progress"
          stroke="#E53E3E"
          name="Progres (%)"
          yAxisId="right"
        />
        <YAxis yAxisId="right" orientation="right" />
      </LineChart>
    );
  }

  useEffect(() => {
    if (videos.length > 0) {
      setTotalViews(videos.reduce((sum, v) => sum + v.views, 0));
      setTotalLikes(videos.reduce((sum, v) => sum + (v.likes ?? 0), 0));
      setTotalComments(videos.reduce((sum, v) => sum + (v.comments ?? 0), 0));
      setTotalShares(videos.reduce((sum, v) => sum + (v.shares ?? 0), 0));
      setTotalVideos(videos.length);
    }
  }, [videos]);

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
        setCampaign(camp.isActive ? camp : null);
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Greška pri učitavanju videa, pokušajte ponovo.');
        setLoading(false);
      }
    }
    fetchData();
  }, []);

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
        <Container maxW={"75%"} w={"full"}>
          <Heading
            textAlign="center"
            mt={{ base: 4, md: 6, lg: 8 }}
            fontSize={{ base: '2xl', md: '4xl', lg: '6xl' }}
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
        </Container>

      </Box>
    </>
  )
}
export default Page;