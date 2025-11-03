'use client';

import {
  Box,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Stack,
  Tag,
  Text,
  VStack,
  Wrap,
  chakra,
  Card,
  CardBody,
  Badge,
  Grid,
  GridItem, Image, Link, Button,
} from '@chakra-ui/react'
import { Br } from '@saas-ui/react';
import { Faq } from 'components/home-page/faq';
import { Features } from 'components/home-page/features';
import { Hero } from 'components/home-page/hero';
import {
  BanknoteArrowUp,
  ChartLine,
  ChevronLeftIcon,
  ChevronRightIcon,
  DollarSign,
  EyeIcon,
  Search,
  Shield,
  UploadCloud,
  User,
  Users,
  Eye,
  Calendar,
  Video,
  Award,
  TrendingUp, ExternalLink,
} from 'lucide-react'
import type { NextPage } from 'next';
import { FiArrowRight } from 'react-icons/fi';
import { ImBullhorn } from 'react-icons/im';
import { useState } from 'react';

import * as React from 'react';

import { ButtonLink } from '#components/home-page/button-link/button-link';
import { BoxFeatures } from '#components/home-page/features/box-features';
import { BackgroundGradient } from '#components/home-page/gradients/background-gradient';
import { FallInPlace } from '#components/home-page/motion/fall-in-place';
import { Pricing } from '#components/home-page/pricing/pricing';
import faq from '#data/faq';
import pricing from '#data/pricing';
import Steps from '#components/home-page/steps/steps'
import { CampaignCarousel } from './components/campaign-carousel'

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

const finishedCampaigns: FinishedCampaign[] = [
  {
    id: 'f1',
    name: 'ZavrtiKes - Clipping i Logo',
    image: 'https://i.ibb.co/z96PyxD/491456585-653474470745354-2382746249902615751-n.jpg',
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
    image: 'https://i.ibb.co/vxJ9dpb2/Snap-Insta-to-360037824-551320730372188-7562058913064595415-n-1.jpg',
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
    image: 'https://i.ibb.co/DfyBDXdY/IMG-6251-1.jpg',
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

const Home: NextPage = () => {
  return (
    <Box>
      <HeroSection />

      <PricingSection />

      <StepsSection/>

      <FeaturesSection />

      <FaqSection />
    </Box>
  )
}

const HeroSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? finishedCampaigns.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) =>
      prev === finishedCampaigns.length - 1 ? 0 : prev + 1
    );
  };

  const currentCampaign = finishedCampaigns[currentIndex];

  return (
    <Flex
      direction="column"
      justifyContent="space-around"
      position="relative"
      overflow="hidden"
      w="full"
      minH="100vh"
      h="full"
    >
      <BackgroundGradient height="100%" zIndex="-1" />
      <Container
        maxW={{ base: "95%", md: "85%" }}
        w="full"
        pt={{ base: 10, md: 48 }}
        px={{ base: 4, md: 6 }}
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: "center", md: "center" }}
          justify="space-between"
          gap={{ base: 0, md: 8, lg: 0 }}
          mt={{ base: 24, md: 0 }}
        >
          <Box
            flex={{ base: "none", md: "0 1 40%" }}
            minH={{base:"80vh", md: "auto"}}
            pr={{ base: 0, lg: 4 }}
            mb={{ base: 6, lg: 0 }}
            w="full"
            display="flex"
            flexDirection="column"
          >
            <Hero
              px="0"
              title={
                <FallInPlace>
                  <Text fontSize={{ base: "32px", sm: "36px", md: "56px" }}>
                    Sve-u-jednom alat za{" "}
                    <chakra.span
                      color="green.400"
                      fontWeight="extrabold"
                      animation="pulseGlow 2s ease-in-out infinite"
                      sx={{
                        "@keyframes pulseGlow": {
                          "0%, 100%": {
                            textShadow: "0 0 5px rgba(72, 187, 120, 0.8), 0 0 20px rgba(72, 187, 120, 0.5)"
                          },
                          "50%": {
                            textShadow: "0 0 10px rgba(72, 187, 120, 1), 0 0 30px rgba(72, 187, 120, 0.8)"
                          },
                        },
                      }}
                    >
                      viralnost
                    </chakra.span>
                  </Text>
                </FallInPlace>
              }
              description={
                <FallInPlace delay={0.2} fontWeight="medium">
                  <Text fontSize={{ base: "16px", sm: "18px", md: "22px" }}>
                    Clipify povezuje kreatore i klipere kroz video sadržaj koji donosi{" "}
                    <chakra.em
                      color="white"
                      fontStyle="normal"
                      fontWeight="semibold"
                    >
                      rezultate
                    </chakra.em>
                    , sve je usmereno na{" "}
                    <chakra.em
                      color="white"
                      fontStyle="normal"
                      fontWeight="semibold"
                    >
                      stvarne preglede
                    </chakra.em>
                    , pravu publiku i vidljive rezultate.
                  </Text>
                </FallInPlace>
              }
            >
              <FallInPlace delay={0.4}>
                <HStack pt="4" pb={{ base: 6, md: 12 }} spacing="8"></HStack>

                <ButtonGroup
                  spacing={{ base: 0, md: 6 }}
                  alignItems="center"
                  flexDirection={{ base: "column", sm: "column", md: "row" }}
                  width="full"
                >
                  <Button
                    colorScheme="primary"
                    onClick={(e) => {
                      e.preventDefault();
                      const isMobile = window.innerWidth < 768;
                      const targetId = isMobile ? '#kontakt2' : '#kontakt';
                      document.querySelector(targetId)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center',
                      });
                    }}
                    size={{ base: "md", md: "lg" }}
                    px={{ base: 8, md: 10 }}
                    py={{ base: 6, md: 7 }}
                    mb={{ base: 4, md: 0 }}
                    fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                    borderRadius="xl"
                    shadow="sm"
                    rightIcon={
                      <Icon
                        as={FiArrowRight}
                        transition="transform 0.2s ease"
                        _groupHover={{ transform: "translateX(4px)" }}
                      />
                    }
                    _hover={{ bg: "gray.50", _dark: { bg: "gray.700" }, border: "2px", borderColor: "green.500" }}
                  >
                    Pokreni svoju kampanju
                  </Button>

                  <ButtonLink
                    href="/signup"
                    size={{ base: "md", md: "lg" }}
                    px={{ base: 8, md: 10 }}
                    py={{ base: 6, md: 7 }}
                    fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                    borderRadius="xl"
                    shadow="lg"
                    _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.2s ease"
                  >
                    Zaradi kao kliper
                  </ButtonLink>
                </ButtonGroup>
              </FallInPlace>
            </Hero>
            <CampaignCarousel/>
          </Box>

          <Box
            flex={{ base: "none", md: "0 1 45%" }}
            pl={{ base: 0, lg: 4 }}
            w="full"
            justifyContent="center"
            alignItems="center"
            overflow="hidden"
            mt={{ base: 4, md: 0 }}
            display={{ base: 'none', md: 'flex' }}
            position="relative"
          >
            <FallInPlace delay={0.6}>
              <Box
                width="auto"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
              >
                <IconButton
                  aria-label="Previous campaign"
                  icon={<ChevronLeftIcon size={24} />}
                  onClick={goToPrevious}
                  position="absolute"
                  left={-10}
                  zIndex={2}
                  variant="ghost"
                  color="white"
                  size="md"
                  _hover={{ bg: "whiteAlpha.200" }}
                />

                <VStack
                  w="420px"
                  spacing={4}
                  align="stretch"
                >
                  {/* Campaign Header */}
                  <Box
                    position="relative"
                    borderRadius="xl"
                    overflow="hidden"
                    h="240px"
                    boxShadow="0 15px 40px rgba(0,0,0,0.3)"
                  >
                    <Image
                      src={currentCampaign.image}
                      alt={currentCampaign.name}
                      width="100%"
                      height="100%"
                      objectFit="cover"
                    />

                    <Box
                      position="absolute"
                      inset={0}
                      bgGradient="linear(to-b, transparent 40%, blackAlpha.900)"
                    />

                    <VStack
                      position="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      p={5}
                      align="start"
                      spacing={2}
                    >
                      <HStack spacing={2}>
                        <Badge
                          px={2}
                          py={1}
                          borderRadius="md"
                          bg={currentCampaign.id != "f3" ? "green.500" : "blue.500"}
                          color="white"
                          fontSize="xs"
                          fontWeight="bold"
                        >
                          {currentCampaign.id != "f3" ? "ZAVRŠENA" : "U TOKU"}
                        </Badge>
                        <HStack spacing={1} color="whiteAlpha.800" fontSize="xs">
                          <Calendar size={14} />
                          <Text fontWeight="medium">{currentCampaign.duration} dana</Text>
                        </HStack>
                      </HStack>

                      <Text
                        fontSize="2xl"
                        fontWeight="black"
                        color="white"
                        lineHeight={1.2}
                      >
                        {currentCampaign.name}
                      </Text>
                    </VStack>
                  </Box>

                  {/* Stats Grid */}
                  <Grid templateColumns="repeat(3, 1fr)" gap={3}>
                    <GridItem
                      colSpan={2}
                      bg="whiteAlpha.100"
                      borderRadius="lg"
                      p={4}
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      position="relative"
                      overflow="hidden"
                      _before={{
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        h: "2px",
                        bgGradient: "linear(to-r, green.400, green.600)"
                      }}
                    >
                      <VStack align="start" spacing={1}>
                        <HStack spacing={1} color="green.400">
                          <Eye size={16} />
                          <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
                            Ukupno Pregleda
                          </Text>
                        </HStack>
                        <HStack align="baseline" spacing={1}>
                          <Text
                            fontSize="3xl"
                            fontWeight="black"
                            color="white"
                            lineHeight={1}
                          >
                            {formatViews(currentCampaign.totalViews)}
                          </Text>
                          <Text fontSize="xl" color="green.400" fontWeight="bold">
                            +
                          </Text>
                        </HStack>
                      </VStack>
                    </GridItem>

                    <GridItem
                      bg="whiteAlpha.100"
                      borderRadius="lg"
                      p={4}
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      position="relative"
                      overflow="hidden"
                      _before={{
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        h: "2px",
                        bgGradient: "linear(to-r, blue.400, blue.600)"
                      }}
                    >
                      <VStack align="start" spacing={1} h="full" justify="space-between">
                        <Users size={16} color="#63B3ED" />
                        <VStack align="start" spacing={0}>
                          <Text
                            fontSize="2xl"
                            fontWeight="black"
                            color="white"
                            lineHeight={1}
                          >
                            {currentCampaign.totalClippers}
                          </Text>
                          <Text fontSize="2xs" color="gray.400" textTransform="uppercase" fontWeight="semibold">
                            Klipera
                          </Text>
                        </VStack>
                      </VStack>
                    </GridItem>

                    <GridItem
                      bg="whiteAlpha.100"
                      borderRadius="lg"
                      p={4}
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      position="relative"
                      overflow="hidden"
                      _before={{
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        h: "2px",
                        bgGradient: "linear(to-r, purple.400, purple.600)"
                      }}
                    >
                      <VStack align="start" spacing={1} h="full" justify="space-between">
                        <Video size={16} color="#B794F4" />
                        <VStack align="start" spacing={0}>
                          <Text
                            fontSize="2xl"
                            fontWeight="black"
                            color="white"
                            lineHeight={1}
                          >
                            {currentCampaign.totalVideos}
                          </Text>
                          <Text fontSize="2xs" color="gray.400" textTransform="uppercase" fontWeight="semibold">
                            Videa
                          </Text>
                        </VStack>
                      </VStack>
                    </GridItem>

                    <GridItem
                      colSpan={2}
                      bg="whiteAlpha.100"
                      borderRadius="lg"
                      p={4}
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      position="relative"
                      overflow="hidden"
                      _before={{
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        h: "2px",
                        bgGradient: "linear(to-r, yellow.400, yellow.600)"
                      }}
                    >
                      <HStack justify="space-between" align="start">
                        <VStack align="start" spacing={1} flex={1}>
                          <HStack spacing={1} color="yellow.400">
                            <Award size={16} />
                            <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase" letterSpacing="wide">
                              Najpopularniji Klip
                            </Text>
                          </HStack>
                          <Text
                            fontSize="xl"
                            fontWeight="black"
                            color="white"
                            lineHeight={1.2}
                          >
                            {formatViews(currentCampaign.topVideo.views)}+
                          </Text>
                          <Text fontSize="2xs" color="gray.400">
                            by {currentCampaign.topVideo.clipper}
                          </Text>
                        </VStack>
                        <Link
                          href={currentCampaign.topVideo.link}
                          isExternal
                          _hover={{ transform: "scale(1.1)" }}
                          transition="transform 0.2s"
                        >
                          <Box
                            p={2}
                            bg="yellow.500"
                            borderRadius="md"
                            cursor="pointer"
                          >
                            <ExternalLink size={16} color="white" />
                          </Box>
                        </Link>
                      </HStack>
                    </GridItem>
                  </Grid>
                </VStack>

                <IconButton
                  aria-label="Next campaign"
                  icon={<ChevronRightIcon size={24} />}
                  onClick={goToNext}
                  position="absolute"
                  right={-10}
                  zIndex={2}
                  variant="ghost"
                  color="white"
                  size="md"
                  _hover={{ bg: "whiteAlpha.200" }}
                />
              </Box>
            </FallInPlace>
          </Box>
        </Flex>
      </Container>

      <BoxFeatures
        w="full"
        maxW={{ base: "95%", md: "85%" }}
        mx="auto"
        px={{ base: 4, md: 6 }}
        id="benefits"
        columns={{ base: 1, sm: 2, md: 4 }}
        iconSize={4}
        features={[
          {
            title: '100.000+',
            icon: DollarSign,
            description: 'Dinara isplaćeno kliperima',
            iconPosition: 'left',
            delay: 0,
          },
          {
            title: '600+',
            icon: User,
            description: 'Aktivnih klipera',
            iconPosition: 'left',
            delay: 0.2,
          },
          {
            title: '20M+',
            icon: EyeIcon,
            description: 'Organskih pregleda',
            iconPosition: 'left',
            delay: 0.4,
          },
          {
            title: '5',
            icon: ImBullhorn,
            description: 'Pokrenutih kampanja',
            iconPosition: 'left',
            delay: 0.6,
          },
        ]}
        reveal={FallInPlace}
      />
    </Flex>
  )
}
const FeaturesSection = () => {
  return (
    <Features
      id="funkcionalnosti"
      title={
        <Heading
          as="h1"
          fontSize={['32px', '44px', '56px']}
          bgGradient="linear(to-r, white, #10b981)"
          bgClip="text"
          textAlign="center"
          fontWeight="extrabold"
          mt={24}
          mb={12}
        >
          Povezujemo Kreatore i
          <Br /> Klipere za zajednički uspeh.
        </Heading>
      }
      description={
        <>
          Kreatori postavljaju kampanje sa jasnim ciljem, a kliperi stvaraju sadržaj koji privlači pažnju i donosi rezultate
        </>
      }
      align="left"
      columns={[1, 2, 3]}
      iconSize={4}
      features={[
        {
          title: 'Jednostavno Kreiranje Kampanja',
          icon: UploadCloud,
          description1:
            'Kreatori lako kreiraju kampanje sa jasnim pravilima i budžetom za klipere.',
          variant: 'inline',
          delay: 0
        },
        {
          title: 'Učestvovanje u kampanjama',
          icon: Search,
          description1:
            'Kliperi imaju pristup svim dostupnim kampanjama i mogu učestvovati u onima koje im najviše odgovaraju.',
          variant: 'inline',
          delay: 0.2
        },
        {
          title: 'Sigurna i brza isplata',
          icon: Shield,
          description1:
            'Kliperi dobijaju sigurnu i brzu isplatu za svaki pregled koji ostvare - bez čekanja i komplikacija.',
          variant: 'inline',
          delay: 0.4
        },
        {
          title: 'Kompletna statistika',
          icon: ChartLine,
          description1:
            'Kliperi u svakom trenutku imaju jasan pregled svoje zarade i broja pregleda.',
          variant: 'inline',
          delay: 0.6
        },
        {
          title: 'Mogucnost ostvarivanja bonusa',
          icon: BanknoteArrowUp,
          description1:
            'Kliperi mogu ostvariti dodatne bonuse zasnovane na rezultatima i aktivnostima u kampanjamas',
          variant: 'inline',
          delay: 0.8
        },
        {
          title: 'Direktna i jasna komunikacija',
          icon: Users,
          description1:
            'Kliperi imaju direktnu i jasnu komunikaciju sa timom, što omogućava brzo rešavanje problema.',
          variant: 'inline',
          delay: 1
        },
      ]}
    />
  )
}

const StepsSection = () => {
  return (
    <Steps
      title="Kako Clipify Funkcioniše"
      description=""
      steps={[
        {
          number: "1",
          title: "Brendovi pokreću kampanje za par minuta",
          description: "Brendovi postave ciljeve i odrede budžet, a kampanja je odmah spremna – bilo da je u pitanju Klipping, Muzicka, Logo ili UGC kampanja.",
          image: "/static/images/111.png",
          alt: ""
        },
        {
          number: "2",
          title: "Kliperi se uključuju i prave sadržaj",
          description: "Naša zajednica od preko 300 klipera bira kampanje koje im odgovaraju i objavljuje originalan, kvalitetan sadržaj na mrežama koje brendovi žele.",
          image: "/static/images/2222.png",
          alt: ""
        },
        {
          number: "3",
          title: "Clipify proverava rezultate",
          description: "Naša AI tehnologija proverava da li su pregledi i interakcije stvarni, uklanja lažne aktivnosti i daje ti jasne rezultate kampanje u realnom vremenu.",
          image: "/static/images/33.png",
          alt: ""
        },
        {
          number: "4",
          title: "Svi su na dobitku",
          description: "Brendovi plaćaju samo za ono što zaista daje rezultate, a kliperi odmah dobijaju isplatu za sadržaj koji donosi engagement.",
          image: "/static/images/4.png",
          alt: ""
        }
      ]}
    />
  )
}

const PricingSection = () => {
  return (
    <Pricing {...pricing}>
      <Text p="8" textAlign="center" color="muted">
      </Text>
    </Pricing>
  )
}

const FaqSection = () => {
  return <Faq  {...faq} />
}

export default Home