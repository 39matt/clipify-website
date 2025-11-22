'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Image,
  Text,
  VStack,
  Badge,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalBody,
  ModalContent,
  Link,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Check,
  ArrowRight,
  ExternalLink,
  UsersIcon,
  RocketIcon,
  DollarSignIcon,
  ShieldCheckIcon,
  ChartLineIcon,
  LayersIcon,
  CalendarIcon,
  MessageSquareIcon,
  ClockIcon,
  MailIcon,
  PhoneIcon,
  Calendar,
} from 'lucide-react';
import type { NextPage } from 'next';
import { Global } from '@emotion/react';
import { GoPeople } from 'react-icons/go';
import { FaDiscord } from 'react-icons/fa'
import { FiAward, FiCheckCircle, FiStar, FiUsers, FiZap } from 'react-icons/fi'

const MotionBox = motion(Box);
const MotionText = motion(Text);
const MotionVStack = motion(VStack);
const MotionGridItem = motion(GridItem);

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

const Home: NextPage = () => {
  return (
    <>
      <DottedBackgroundGlobal />
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
        <HeroSection />
        <MarqueeSection />
        <StatsSection />
        <CaseStudiesSection />
        <StepsSection />
        <FeaturesSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </Box>
    </>
  );
};

const HeroSection = () => {
  return (
    <Box
      position="relative"
      minH="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Image mt="12" w="36" src="/static/images/logo-header.png" alt="Clipify Logo" />
      <Box
        position="absolute"
        inset={0}
        bgGradient="radial(circle at 50% 0%, rgba(0, 0, 0, 0.03), transparent 50%)"
        pointerEvents="none"
      />

      <Container maxW="7xl" py={20} pt={32}>
        <VStack spacing={8} textAlign="center" maxW="5xl" mx="auto">
          <Box whiteSpace="nowrap">
            <MotionText
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              fontSize={{ base: '24px', md: '64px', lg: '84px' }}
              fontWeight="900"
              lineHeight={1.1}
              color="black"
              letterSpacing="-0.02em"
              mb={2}
            >
              Otključaj <br />
            </MotionText>

            <MotionText
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              fontSize={{ base: '36px', md: '72px', lg: '96px' }}
              fontWeight="900"
              lineHeight={1.1}
              letterSpacing="-0.02em"
              display="inline-block"
              position="relative"
            >
              <Box
                as="span"
                position="relative"
                zIndex={1}
                color="black"
                px="4"
                bgGradient="linear(to-r, rgba(252, 165, 165, 0.7), rgba(252, 165, 165, 0.5), rgba(252, 165, 165, 0.0))"
                borderLeft="8px"
                borderColor="red.500"
              >
                Pun Potencijal<br />
              </Box>
            </MotionText>
            <MotionText
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              fontSize={{ base: '32px', md: '64px', lg: '84px' }}
              fontWeight="900"
              lineHeight={1.1}
              color="black"
              letterSpacing="-0.02em"
              mb={2}
            >
              Tvog Sadržaja
            </MotionText>
          </Box>

          <MotionText
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            fontSize={{ base: 'lg', md: 'xl' }}
            color="gray.600"
            maxW="3xl"
            lineHeight={1.7}
          >
            Clipify je vodeća performance-based platforma koja pretvara tvoj sadržaj u
            stotine viralnih kratkih klipova. Poveži se sa mrežom od 600+ pravih kreatora
            koji šire tvoj brend na svim društvenim mrežama uz trošak znatno manji od
            klasičnih reklama.
          </MotionText>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                size="lg"
                bg="black"
                color="white"
                px={10}
                py={8}
                fontSize="lg"
                fontWeight="600"
                borderRadius="full"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'xl',
                }}
                transition="all 0.2s"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#kontakt')?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
                leftIcon={<PhoneIcon size={16} />}
              >
                Zakaži Poziv
              </Button>
              <Button
                size="lg"
                borderColor="black"
                color="black"
                px={10}
                py={8}
                fontSize="lg"
                fontWeight="600"
                borderRadius="full"
                borderWidth="2px"
                _hover={{
                  bg: 'black',
                  color: 'white',
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.2s"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#case-studies')?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
                leftIcon={<GoPeople size={16} />}
              >
                Zaradi kao kliper
              </Button>
            </HStack>
          </MotionBox>
        </VStack>
      </Container>
    </Box>
  );
};

const MarqueeSection = () => {
  const words = [
    'Strimerima',
    'Kontent Kreatorima',
    'Brendovima',
    'Aplikacijama',
    'Podcastima',
    'Umetnicima',
    'Coachevima',
    'Youtuberima',
  ];

  return (
    <Box
      bg="gray.900"
      color="white"
      py={{ base: 6, md: 10 }}
      position="relative"
      overflow="hidden"
    >
      <Flex
        gap={12}
        animation="scroll 35s linear infinite"
        w="max-content"
        align="center"
      >
        {[...words, ...words].map((word, i) => (
          <Text
            key={i}
            fontSize={{ base: 'xl', md: '3xl' }}
            fontWeight="semibold"
            color="red.500"
            textShadow="0 0 8px rgba(255, 0, 0, 0.5), 0 0 16px rgba(255, 0, 0, 0.4)"
            whiteSpace="nowrap"
            transition="all 0.3s ease"
            _hover={{
              textShadow:
                '0 0 12px rgba(255, 0, 0, 0.8), 0 0 24px rgba(255, 70, 70, 0.6)',
              transform: 'scale(1.05)',
            }}
          >
            {word}
          </Text>
        ))}
      </Flex>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </Box>
  );
};

function useCountUp(params: {
  end: number;
  duration?: number;
  format?: (n: number) => string;
}) {
  const { end, duration = 5000, format = (n: number) => Math.floor(n).toString() } =
    params;

  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started) {
            setStarted(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    io.observe(ref.current);
    return () => io.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    const r = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(r);
  }, [started, duration, end]);

  return { ref, display: format(value) };
}

const formatInt = (n: number) => Math.floor(n).toLocaleString('sr-RS');

const formatCompact = (n: number) => {
  const v = Math.floor(n);
  if (v >= 1_000_000) return (v / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (v >= 1_000) return (v / 1_000).toFixed(0) + 'K';
  return v.toString();
};

const StatsSection = () => {
  const targets = {
    dinara: 250_000,
    klipera: 700,
    pregleda: 25_000_000,
    kampanja: 6,
  };

  const dinara = useCountUp({
    end: targets.dinara,
    format: (n) => `${formatInt(n)}+`,
  });
  const klipera = useCountUp({
    end: targets.klipera,
    format: (n) => `${formatInt(n)}+`,
  });
  const pregleda = useCountUp({
    end: targets.pregleda,
    format: (n) => `${formatCompact(n)}+`,
  });
  const kampanja = useCountUp({
    end: targets.kampanja,
    format: (n) => `${formatInt(n)}`,
  });

  return (
    <Box py={{ base: 12, md: 20 }} bg="white">
      <Container maxW="7xl">
        <Grid templateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }} gap={{ base: 8, md: 10 }}>
          <GridItem>
            <VStack
              ref={dinara.ref as any}
              spacing={1}
              align="start"
              borderLeft="3px solid"
              borderColor="black"
              pl={4}
            >
              <Heading fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1" color="black">
                {dinara.display}
              </Heading>
              <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>
                Dinara isplaćeno kliperima
              </Text>
            </VStack>
          </GridItem>

          <GridItem>
            <VStack
              ref={klipera.ref as any}
              spacing={1}
              align="start"
              borderLeft="3px solid"
              borderColor="black"
              pl={4}
            >
              <Heading fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1" color="black">
                {klipera.display}
              </Heading>
              <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>
                Aktivnih klipera
              </Text>
            </VStack>
          </GridItem>

          <GridItem>
            <VStack
              ref={pregleda.ref as any}
              spacing={1}
              align="start"
              borderLeft="3px solid"
              borderColor="black"
              pl={4}
            >
              <Heading fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1" color="black">
                {pregleda.display}
              </Heading>
              <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>
                Organskih pregleda
              </Text>
            </VStack>
          </GridItem>

          <GridItem>
            <VStack
              ref={kampanja.ref as any}
              spacing={1}
              align="start"
              borderLeft="3px solid"
              borderColor="black"
              pl={4}
            >
              <Heading fontSize={{ base: '3xl', md: '4xl' }} lineHeight="1" color="black">
                {kampanja.display}
              </Heading>
              <Text color="gray.600" fontSize={{ base: 'md', md: 'lg' }}>
                Pokrenutih kampanja
              </Text>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};

type CaseItem = {
  id: string;
  name: string;
  views: string;
  text: string;
  image: string;
  totalClippers?: number;
  totalVideos?: number;
  durationDays?: number;
  topVideo?: {
    views: string;
    clipper: string;
    link: string;
  };
};

const CaseStudiesSection = () => {
  const cases: CaseItem[] = [
    {
      id: 'nosestrips',
      name: 'Nosestrips',
      views: '8M',
      image: 'https://firebasestorage.googleapis.com/v0/b/botina-44e95.firebasestorage.app/o/nosestrips.jpeg?alt=media&token=beb586e1-3856-40ac-bbbd-14f4682311e8',
      totalClippers: 20,
      totalVideos: 120,
      durationDays: 8,
      topVideo: {
        views: '600K',
        clipper: 'biohack.balkan',
        link: 'https://www.tiktok.com/@biohack.balkan/video/7570306263716760843',
      },
      text:
        'Tokom kampanje za Nosestrips fokusirali smo se na organsku distribuciju kroz našu mrežu klipera. Aktivirali smo kreatore koji klipuju najgledanije strimere, kako bi se brend prirodno pojavljivao u sadržaju sa visokim engagementom.\n' +
        '\n' +
        'Uz streamer sadržaj uključili smo i health & wellbeing stranice, čime smo pogodili najrelevantniju publiku za proizvod. Ovaj kombinovani pristup doneo je snažan organski reach i vrhunski engagement u kratkom roku.',
    },
    {
      id: 'cjuree',
      name: 'Cjuree',
      views: '5M',
      image: 'https://firebasestorage.googleapis.com/v0/b/botina-44e95.firebasestorage.app/o/cjuree.jpeg?alt=media&token=0cc34f5b-8216-4e79-aca0-22fd6beadf20',
      totalClippers: 15,
      totalVideos: 320,
      durationDays: 30,
      topVideo: {
        views: '370K',
        clipper: 'cjuree.clipping',
        link: 'https://www.tiktok.com/@cjuree.clipping/video/7568402808077045004',
      },
      text:
        'Tokom kampanje za Cjureta fokusirali smo se na organski rast kroz našu mrežu klipera. Otvarali su nove profile i svakodnevno pravili sadržaj koji najbolje prolazi u biznis niši - lifestyle edits, ragebait formate i isečke iz podcasta.\n' +
        '\n' +
        'Svi klipovi su optimizovani za publiku koja prati biznis, prodaju, mindset i motivacione kreatore. Na ovaj način je Cjureov brend prirodno plasiran tačno onoj publici koja najviše konvertuje, uz stabilan organski rast i visok engagement tokom cele kampanje.',
    },
    {
      id: 'aleksic',
      name: 'AleksicMoto',
      views: '3M',
      image: 'https://firebasestorage.googleapis.com/v0/b/botina-44e95.firebasestorage.app/o/aleksic.jpg?alt=media&token=d573b72a-2798-4892-a14b-7e684193d15d',
      totalClippers: 15,
      totalVideos: 95,
      durationDays: 14,
      topVideo: {
        views: '300K',
        clipper: 'kliper1311',
        link: 'https://www.tiktok.com/@kliper1311/video/7538504023171665208',
      },
      text: '',
    },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [active, setActive] = React.useState<CaseItem | null>(null);

  const openCase = (c: CaseItem) => {
    setActive(c);
    onOpen();
  };

  return (
    <Box
      py={{ base: 16, md: 24 }}
      position="relative"
      bg="gray.100"
      bgGradient="radial(circle at 50% 0%, rgba(0,0,0,0.06), rgba(0,0,0,0) 70%)"
    >
      <Container maxW="7xl">
        <Container maxW="7xl" mb={{ base: 10, md: 16 }}>
          <Grid
            templateColumns={{ base: '1fr', lg: '2fr 1fr' }}
            alignItems="end"
            gap={{ base: 6, lg: 8 }}
          >
            <Box>
              <Heading
                as="h2"
                fontWeight="900"
                letterSpacing="-0.03em"
                lineHeight="0.95"
                fontSize={{ base: '36px', md: '48px', lg: '56px' }}
                color="black"
              >
                Ko je sa nama
              </Heading>

              <Heading
                as="h2"
                fontWeight="900"
                letterSpacing="-0.03em"
                lineHeight="0.95"
                fontSize={{ base: '48px', md: '56px', lg: '64px' }}
                color="gray.500"
                mt={{ base: 2, md: 3 }}
              >
                Otišao viralno
              </Heading>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              justifyContent={{ base: 'flex-start', lg: 'flex-end' }}
            >
              <Text
                color="gray.800"
                fontSize={{ base: 'lg', md: 'xl' }}
                textAlign={{ base: 'left', lg: 'right' }}
                maxW={{ base: 'full', lg: 'sm' }}
              >
                Istraži rezultate koje smo <br /> ostvarili za klijente.
              </Text>
            </Box>
          </Grid>
        </Container>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={{ base: 6, md: 8 }}>
          {cases.map((item, i) => (
            <MotionBox
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              viewport={{ once: true }}
              bg="white"
              borderRadius="2xl"
              overflow="hidden"
              border="1px solid"
              borderColor="gray.200"
              boxShadow="0 10px 30px rgba(0,0,0,0.06)"
              _hover={{
                transform: 'translateY(-6px)',
                boxShadow: '0 16px 40px rgba(0,0,0,0.10)',
              }}
            >
              <Box position="relative" h={{ base: '220px', md: '260px' }} bg="gray.100">
                <Image src={item.image} alt={item.name} objectFit="cover" w="100%" h="100%" />
                <Box
                  position="absolute"
                  inset={0}
                  bgGradient="linear(to-b, rgba(0,0,0,0), rgba(0,0,0,0.35))"
                />
                <HStack
                  position="absolute"
                  bottom="4"
                  left="4"
                  bgGradient="linear(to-r, black, #111827)"
                  color="white"
                  borderRadius="full"
                  px={{ base: 4, md: 5 }}
                  py={{ base: 2, md: 2.5 }}
                  spacing="2"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  boxShadow="0 12px 28px rgba(0,0,0,0.4)"
                >
                  <Text
                    fontSize={{ base: '2rem', md: '2.5rem' }}
                    fontWeight="900"
                    lineHeight="1"
                    letterSpacing="-0.02em"
                    sx={{ textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}
                  >
                    {item.views}
                  </Text>
                  <Text fontSize={{ base: 'lg', md: 'xl' }} fontWeight="800" opacity={0.98}>
                    pregleda
                  </Text>
                </HStack>
              </Box>

              <VStack align="start" spacing={4} p={{ base: 5, md: 6 }}>
                <Heading size="lg" color="black" letterSpacing="-0.01em">
                  {item.name}
                </Heading>

                <Button
                  color="black"
                  rightIcon={<ChevronRight />}
                  fontWeight="700"
                  px={0}
                  onClick={() => openCase(item)}
                  _hover={{ bg: 'transparent', color: 'gray.700', transform: 'translateX(2px)' }}
                  transition="all 0.15s ease"
                >
                  Pogledaj Projekat
                </Button>
              </VStack>
            </MotionBox>
          ))}
        </Grid>
      </Container>

      <CaseStudyModal isOpen={isOpen} onClose={onClose} data={active} />
    </Box>
  );
};

type CaseStudyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  data: CaseItem | null;
};

const StatCard: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <Box
    borderRadius="xl"
    overflow="hidden"
    position="relative"
    sx={{
      _before: {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgGradient: 'linear(to-r, transparent, rgba(255,255,255,0.1), transparent)',
        animation: 'shine 2.5s infinite linear',
        pointerEvents: 'none',
        zIndex: 1,
      },
    }}
  >
    <VStack
      align="start"
      bg="whiteAlpha.100"
      border="1px solid"
      borderColor="whiteAlpha.300"
      borderRadius="xl"
      p={4}
      spacing={1}
      boxShadow="0 4px 10px rgba(0,0,0,0.3)"
      position="relative"
      zIndex={2}
    >
      <Text fontSize="sm" color="gray.400">
        {label}
      </Text>
      <Heading size="lg" color="white" fontWeight="bold">
        {value}
      </Heading>
    </VStack>
  </Box>
);

const GlowAnimation = () => (
  <style jsx global>{`
    @keyframes shine {
      0% {
        transform: translateX(-100%) skewX(-30deg);
      }
      100% {
        transform: translateX(200%) skewX(-30deg);
      }
    }
  `}</style>
);

const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ isOpen, onClose, data }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" motionPreset="slideInBottom">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(8px)" />
      <ModalContent bg="gray.900" color="white" borderRadius="2xl" overflow="hidden">
        <ModalCloseButton top={3} right={3} size="lg" />
        <ModalBody p={0}>
          {data && (
            <Box>
              <Box h={{ base: '220px', md: '320px' }} bg="gray.800" position="relative">
                <Image
                  src={data.image}
                  alt={data.name}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                />
                <Box position="absolute" inset={0} bg="linear-gradient(to top, rgba(0,0,0,0.5), transparent)" />
                <VStack position="absolute" bottom={4} left={4} align="start" spacing={1}>
                  <Heading size="lg">{data.name}</Heading>
                  <HStack>
                    <Badge colorScheme="green" px={2} py={1} borderRadius="md">
                      {data.views} pregleda
                    </Badge>
                  </HStack>
                </VStack>
              </Box>

              <Grid
                templateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }}
                gap={4}
                p={{ base: 4, md: 6 }}
                bg="gray.800"
                borderBottom="1px solid"
                borderColor="whiteAlpha.200"
                boxShadow="inset 0 -2px 8px rgba(0,0,0,0.2)"
              >
                <GlowAnimation />
                <StatCard label="Ukupno Klipera" value={data.totalClippers ?? 0} />
                <StatCard label="Ukupno Video klipova" value={data.totalVideos ?? 0} />
                <StatCard label="Trajanje Kampanje" value={`${data.durationDays ?? 0} dana`} />
                <StatCard label="Ukupno Pregleda" value={data.views} />
              </Grid>

              <Box maxW="95%" mx="auto" my="8">
                <Heading my={2}>Detaljna analiza</Heading>
                <Text color="gray.400" textAlign="left">
                  {data.text}
                </Text>
              </Box>

              {data.topVideo?.link && (
                <Box px={{ base: 4, md: 6 }} pb={{ base: 6, md: 8 }}>
                  <Button
                    as={Link}
                    href={data.topVideo.link}
                    isExternal
                    rightIcon={<ExternalLink size={18} />}
                    colorScheme="green"
                    variant="solid"
                    borderRadius="full"
                  >
                    Pogledaj najpopularniji klip
                  </Button>
                  <Text mt={2} color="gray.400" fontSize="sm">
                    by {data.topVideo.clipper}
                  </Text>
                </Box>
              )}
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

const StepsSection = () => {
  const steps = [
    {
      number: '1',
      title: 'Launch Your Campaign',
      description:
        'Tell us your goals — whether it’s promoting your podcast, music, brand, livestream, or event. Set your budget and guidelines. We handle the rest.',
    },
    {
      number: '2',
      title: 'Clippers Create & Distribute',
      description:
        'Our network of 10K+ vetted creators discovers your campaign, clips the best moments, and posts authentic content to their engaged audiences across TikTok, Instagram Reels, YouTube Shorts, and X.',
    },
    {
      number: '3',
      title: 'Track, Verify & Pay',
      description:
        'Our AI-powered system tracks all views in real time and filters out bot activity. Pay only for verified, organic results while Clippers earn performance-based payouts instantly.',
    },
  ];

  return (
    <Flex
      minH="110vh"
      as="section"
      bg="black"
      color="white"
      py={{ base: 20, md: 28 }}
      align="center"
      justify="center"
    >
      <Container maxW="6xl" textAlign="center">
        <Text
          fontSize="sm"
          letterSpacing="0.15em"
          textTransform="uppercase"
          color="gray.400"
          mb={3}
        >
          Kako funkcioniše
        </Text>

        <Heading
          fontWeight="900"
          letterSpacing="-0.03em"
          fontSize={{ base: '28px', md: '36px', lg: '48px' }}
          mb={{ base: 12, md: 16 }}
        >
          Postani viralan u 3 prosta koraka
        </Heading>

        <Box mb={{ base: 16, md: 20 }}>
          {steps.map((step, i) => (
            <Flex key={i} align="flex-start" gap={6} mb={{ base: 12, md: 16 }}>
              <Flex
                w="60px"
                h="60px"
                borderRadius="full"
                bg="gray.800"
                align="center"
                justify="center"
                fontSize="24px"
                fontWeight="700"
              >
                {step.number}
              </Flex>

              <Box textAlign="left" maxW="5xl">
                <Heading
                  fontSize={{ base: '18px', md: '22px' }}
                  fontWeight="700"
                  mb={2}
                >
                  {step.title}
                </Heading>

                <Text color="gray.300" fontSize={{ base: 'md', md: 'lg' }}>
                  {step.description}
                </Text>
              </Box>
            </Flex>
          ))}
        </Box>

        <Button
          size="lg"
          bg="white"
          color="black"
          borderRadius="xl"
          px={12}
          py={8}
          fontSize="xl"
          fontWeight="700"
          boxShadow="0px 8px 24px rgba(255,255,255,0.15)"
          _hover={{
            opacity: 0.95,
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 32px rgba(255,255,255,0.2)',
          }}
          transition="all 0.2s ease"
          leftIcon={<Calendar />}
        >
          Rezerviši Poziv
        </Button>
      </Container>
    </Flex>
  );
};

const FeatureCard = ({                      icon,
                       title,
                       description,
                       href = '#',
                     }: {
  icon: any;
  title: string;
  description: string;
  href?: string;
}) =>
{
  const accentPill = 'blue.600';

  return (
    <VStack
      as="a"
      href={href}
      role="group"
      align="start"
      spacing={0}
      bg="white"
      borderRadius="24px"
      border="1px solid"
      borderColor="gray.200"
      boxShadow="0 20px 60px rgba(0,0,0,0.10)"
      overflow="hidden"
      transition="transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease"
      _hover={{
        transform: 'translateY(-6px)',
        boxShadow: '0 28px 80px rgba(0,0,0,0.14)',
        borderColor: 'gray.300',
        textDecoration: 'none',
      }}
      h="100%"
    >
      <HStack
        w="100%"
        px={{ base: 5, md: 6 }}
        py={{ base: 4, md: 5 }}
        spacing={3}
        bgGradient="linear(to-r, #000000 0%, #111827 45%, #1F2937 100%)"
        color="white"
        position="relative"
      >
        <Box
          position="absolute"
          inset={0}
          opacity={0.18}
          bgGradient="radial(circle at 10% 0%, white 0%, transparent 40%)"
          pointerEvents="none"
        />
        <Box
          zIndex={1}
          bg="whiteAlpha.10"
          border="1px solid"
          borderColor="whiteAlpha.200"
          borderRadius="xl"
          p={2.5}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Icon as={icon} boxSize={6} />
        </Box>
        <Heading
          zIndex={1}
          as="h3"
          fontSize={{ base: 'lg', md: 'xl' }}
          lineHeight="1.2"
          fontWeight="900"
          letterSpacing="-0.015em"
        >
          {title}
        </Heading>
      </HStack>

      <VStack
        align="start"
        spacing={4}
        px={{ base: 5, md: 6 }}
        pt={{ base: 5, md: 6 }}
        pb={{ base: 6, md: 7 }}
        w="100%"
        flex="1"
        minH={{ base: '190px', md: '200px' }}
      >
        <Text color="gray.700" fontSize={{ base: 'md', md: 'lg' }} lineHeight="1.65">
          {description}
        </Text>

        <HStack mt="auto">
          <Badge
            variant="subtle"
            color="white"
            bg={accentPill}
            borderRadius="full"
            px={2.5}
            py={0.5}
            fontWeight="700"
            fontSize="xs"
          >
            VERIFIED
          </Badge>
        </HStack>
      </VStack>
    </VStack>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      title: 'Kliperi koji razumeju viralnost',
      icon: UsersIcon,
      description:
        'Poveži se sa 600+ kreativnih Klipera koji tačno znaju šta funkcioniše na društvenim mrežama.',
    },
    {
      title: 'Tvoj brend ne čeka',
      icon: RocketIcon,
      description:
        'Naša platforma omogućava da tvoja kampanja krene istog dana, sa velikim brojem klipera spremnih da je ožive.',
    },
    {
      title: 'Garancija',
      icon: DollarSignIcon,
      description:
        'Plaćaš tek kada klip isporuči stvarne preglede i engagement - svaki dinar radi za tebe, ne protiv tebe.',
    },
    {
      title: 'Autentičnost pregleda',
      icon: ShieldCheckIcon,
      description:
        'Clipify kombinuje AI analitiku i ljudsku proveru kako bi uklonio svaki lažni trag. Svaki pregled je stvaran - naši brojevi su čisti, provereni i pouzdani.',
    },
    {
      title: 'Real-Time Analitika',
      icon: ChartLineIcon,
      description:
        'Prati performanse svakog klipa u našem preglednom dashboardu: vidi preglede, engagement i rast - dok se dešava.',
    },
    {
      title: 'Snaga više platformi',
      icon: LayersIcon,
      description:
        'Clipify optimizuje tvoj sadržaj za TikTok, IG Reels i (uskoro) YT Shorts - automatski prilagođen svakom algoritmu i formatu.',
    },
  ];

  return (
    <Box as="section" bg="gray.200" color="black" py={{ base: 16, md: 24 }}>
      <Container maxW="7xl">
        <Box width="75%" textAlign="center" mx="auto">
          <Text
            fontSize="sm"
            letterSpacing="0.15em"
            textTransform="uppercase"
            color="gray.500"
            mb={3}
          >
            Zašto Clipify
          </Text>

          <Heading
            fontWeight="900"
            letterSpacing="-0.03em"
            fontSize={{ base: '28px', md: '36px', lg: '48px' }}
            mb={{ base: 12, md: 16 }}
          >
            Kreiramo mrežu gde kreatori i kliperi uspevaju zajedno.
          </Heading>
        </Box>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} gridAutoRows="1fr">
          {features.map((f, i) => (
            <MotionGridItem
              key={f.title}
              h="100%"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <FeatureCard icon={f.icon} title={f.title} description={f.description} />
            </MotionGridItem>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

const PricingSection = () => {
  const plans = [
    {
      name: '15-Day Sprint',
      tag: 'START',
      features: ['1 video/dan', '30 postova', '24/7 support', 'Mesečni reporti'],
    },
    {
      name: '30-Day Domination',
      tag: 'PRO',
      features: ['2 videa/dan', '60+ postova', 'Priority support', 'Weekly analytics', 'Radionice'],
      highlight: true,
    },
    {
      name: 'Custom Solution',
      tag: 'ENTERPRISE',
      features: ['Custom strategija', 'Dedicated tim', 'A/B testing', 'Full produkcija'],
      enterprise: true,
    },
  ];

  return (
    <Flex
      as="section"
      minH="110vh"
      bg="transparent"
      color="black"
      align="center"
      justify="center"
      py={12}
      px={4}
      position="relative"
      overflow="hidden"
    >
      <Container maxW="7xl" h="full">
        <VStack spacing={32} h="full" justify="center">
          {/* Header matching the image style */}
          <VStack spacing={3}>
            <Heading
              fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }}
              fontWeight="900"
              letterSpacing="-0.04em"
              lineHeight="1"
              textAlign="center"
            >
              Fleksibilni
              <Box
                as="span"
                position="relative"
                zIndex={1}
                color="black"
                pl="2"
                ml="2"
                bgGradient="linear(to-r, rgba(252, 165, 165, 0.7), rgba(252, 165, 165, 0.5), rgba(252, 165, 165, 0.0))"
                borderLeft="8px"
                borderColor="red.500"
              >
                Planovi
              </Box>
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="gray.600"
              fontWeight="500"
            >
              Za svaku vrstu kontenta
            </Text>
          </VStack>

          {/* Pricing Cards - Horizontal */}
          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap={6}
            w="full"
            maxW="6xl"
          >
            {plans.map((plan, idx) => {
              // Basic Plan Style - Similar to enterprise but less appealing
              if (idx === 0) {
                return (
                  <MotionBox
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                  >
                    <VStack
                      bg="linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)"
                      border="2px solid"
                      borderColor="gray.200"
                      borderRadius="2xl"
                      p={6}
                      spacing={4}
                      h="full"
                      position="relative"
                      transition="all 0.3s"
                      color="gray.700"
                      overflow="hidden"
                      _hover={{
                        transform: 'translateY(-4px)',
                        borderColor: 'gray.300',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                      }}
                      _before={{
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        bg: 'radial-gradient(circle at top right, rgba(0,0,0,0.02), transparent 60%)',
                        pointerEvents: 'none',
                      }}
                    >
                      <Badge
                        bgGradient="linear(to-r, gray.100, gray.200)"
                        color="gray.600"
                        px={4}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="900"
                        letterSpacing="widest"
                        border="1px solid"
                        borderColor="gray.200"
                      >
                        {plan.tag}
                      </Badge>

                      <Heading
                        fontSize="2xl"
                        fontWeight="900"
                        textAlign="center"
                        lineHeight="1.1"
                        letterSpacing="-0.02em"
                        bgGradient="linear(to-r, gray.700, gray.500)"
                        bgClip="text"
                      >
                        {plan.name}
                      </Heading>

                      <VStack spacing={2} flex="1" w="full">
                        {plan.features.map((feature, i) => (
                          <HStack
                            key={i}
                            spacing={2}
                            w="full"
                            p={2}
                            borderRadius="lg"
                            bg="white"
                            border="1px solid"
                            borderColor="gray.100"
                          >
                            <Box
                              w={4}
                              h={4}
                              borderRadius="full"
                              bgGradient="linear(to-r, gray.300, gray.400)"
                              flexShrink={0}
                            />
                            <Text fontSize="sm" fontWeight="700" noOfLines={1}>
                              {feature}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>

                      <VStack spacing={3} w="full">
                        <Heading fontSize="3xl" fontWeight="900" letterSpacing="-0.02em" color="gray.700">
                          Kontakt
                        </Heading>
                        <Button
                          w="full"
                          size="lg"
                          bgGradient="linear(to-r, gray.200, gray.300)"
                          color="gray.700"
                          borderRadius="xl"
                          fontWeight="800"
                          border="1px solid"
                          borderColor="gray.200"
                          _hover={{
                            transform: 'scale(1.05)',
                            bgGradient: 'linear(to-r, gray.300, gray.400)',
                          }}
                          transition="all 0.2s"
                        >
                          Zakaži Call
                        </Button>
                      </VStack>
                    </VStack>
                  </MotionBox>
                );
              }

              // Pro Plan Style (Highlighted)
              if (plan.highlight) {
                return (
                  <MotionBox
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                  >
                    <Box position="relative">
                      <VStack
                        bgGradient="linear(to-br, #000000, #1a1a1a, #0a0a0a)"
                        border="3px solid"
                        borderColor="red.500"
                        borderRadius="2xl"
                        p={6}
                        spacing={4}
                        h="full"
                        position="relative"
                        transition="all 0.3s"
                        color="white"
                        overflow="hidden"
                        _hover={{
                          transform: 'translateY(-8px)',
                          boxShadow: '0 20px 40px rgba(239, 68, 68, 0.4)',
                        }}
                        _before={{
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          w: '200px',
                          h: '200px',
                          bgGradient: 'radial(circle, rgba(239, 68, 68, 0.15), transparent 70%)',
                          pointerEvents: 'none',
                        }}
                      >
                        <Badge
                          bg="red.500"
                          color="white"
                          px={3}
                          py={1}
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="900"
                          letterSpacing="wider"
                        >
                          {plan.tag}
                        </Badge>

                        <Heading
                          fontSize="2xl"
                          fontWeight="900"
                          textAlign="center"
                          lineHeight="1.1"
                          letterSpacing="-0.02em"
                        >
                          {plan.name}
                        </Heading>

                        <VStack spacing={2} flex="1" w="full">
                          {plan.features.map((feature, i) => (
                            <HStack
                              key={i}
                              spacing={2}
                              w="full"
                              p={2}
                              borderRadius="lg"
                              bg="whiteAlpha.100"
                            >
                              <Box
                                w={4}
                                h={4}
                                borderRadius="full"
                                bg="red.500"
                                flexShrink={0}
                              />
                              <Text fontSize="sm" fontWeight="600" noOfLines={1}>
                                {feature}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>

                        <VStack spacing={3} w="full">
                          <Heading fontSize="3xl" fontWeight="900" letterSpacing="-0.02em">
                            Kontakt
                          </Heading>
                          <Button
                            w="full"
                            size="lg"
                            bg="red.500"
                            color="white"
                            borderRadius="xl"
                            fontWeight="800"
                            _hover={{
                              transform: 'scale(1.05)',
                              bg: 'red.600',
                            }}
                            transition="all 0.2s"
                          >
                            Zakaži Call
                          </Button>
                        </VStack>
                      </VStack>

                      <Box
                        position="absolute"
                        top="-3"
                        right="-3"
                        bg="red.500"
                        color="white"
                        px={4}
                        py={1}
                        borderRadius="full"
                        fontSize="xs"
                        fontWeight="900"
                        transform="rotate(12deg)"
                        zIndex={10}
                      >
                        TOP
                      </Box>
                    </Box>
                  </MotionBox>
                );
              }

              // Enterprise Plan Style
              return (
                <MotionBox
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                >
                  <VStack
                    bg="linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
                    border="2px solid"
                    borderColor="gray.700"
                    borderRadius="2xl"
                    p={6}
                    spacing={4}
                    h="full"
                    position="relative"
                    transition="all 0.3s"
                    color="white"
                    overflow="hidden"
                    _hover={{
                      transform: 'translateY(-4px)',
                      borderColor: 'gray.500',
                      boxShadow: '0 15px 40px rgba(0,0,0,0.25)',
                    }}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bg: 'radial-gradient(circle at top right, rgba(255,255,255,0.05), transparent 60%)',
                      pointerEvents: 'none',
                    }}
                  >
                    <Badge
                      bgGradient="linear(to-r, gray.600, gray.700)"
                      color="white"
                      px={4}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="900"
                      letterSpacing="widest"
                      border="1px solid"
                      borderColor="whiteAlpha.300"
                    >
                      {plan.tag}
                    </Badge>

                    <Heading
                      fontSize="2xl"
                      fontWeight="900"
                      textAlign="center"
                      lineHeight="1.1"
                      letterSpacing="-0.02em"
                      bgGradient="linear(to-r, white, gray.300)"
                      bgClip="text"
                    >
                      {plan.name}
                    </Heading>

                    <VStack spacing={2} flex="1" w="full">
                      {plan.features.map((feature, i) => (
                        <HStack
                          key={i}
                          spacing={2}
                          w="full"
                          p={2}
                          borderRadius="lg"
                          bg="whiteAlpha.100"
                          border="1px solid"
                          borderColor="whiteAlpha.100"
                        >
                          <Box
                            w={4}
                            h={4}
                            borderRadius="full"
                            bgGradient="linear(to-r, gray.400, gray.600)"
                            flexShrink={0}
                          />
                          <Text fontSize="sm" fontWeight="700" noOfLines={1}>
                            {feature}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>

                    <VStack spacing={3} w="full">
                      <Heading fontSize="3xl" fontWeight="900" letterSpacing="-0.02em">
                        Custom
                      </Heading>
                      <Button
                        w="full"
                        size="lg"
                        bgGradient="linear(to-r, gray.700, gray.900)"
                        color="white"
                        borderRadius="xl"
                        fontWeight="800"
                        border="1px solid"
                        borderColor="whiteAlpha.300"
                        _hover={{
                          transform: 'scale(1.05)',
                          bgGradient: 'linear(to-r, gray.600, gray.800)',
                        }}
                        transition="all 0.2s"
                      >
                        Kontaktiraj
                      </Button>
                    </VStack>
                  </VStack>
                </MotionBox>
              );
            })}
          </Grid>

          {/* Bottom CTA */}
          <HStack
            spacing={4}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            p={8}
            maxW="4xl"
            w="full"
            transition="all 0.3s"
            _hover={{
              transform: 'translateY(8px)',
            }}
          >
            <Box flex="1">
              <Text fontSize="lg" fontWeight="800" mb={1} color="black">
                Nisi siguran šta ti treba?
              </Text>
              <Text fontSize="sm" color="gray.600">
                Besplatna konsultacija - Odgovor za 2h
              </Text>
            </Box>
            <Button
              size="lg"
              bg="red.500"
              color="white"
              borderRadius="xl"
              fontWeight="800"
              px={8}
              rightIcon={<ArrowRight size={18} />}
              _hover={{
                transform: 'scale(1.05)',
                bg: 'red.600',
              }}
              flexShrink={0}
            >
              Kontakt
            </Button>
          </HStack>
        </VStack>
      </Container>
    </Flex>
  );
};
const FAQSection = () => {
  const clipperFaqs = [
    {
      q: 'Kako mogu postati Kliper?',
      a: 'Pridruži se našoj Discord zajednici gde prolaziš onboarding i dobijaš pristup novim kampanjama. Nakon odobrenja, možeš da klipuješ odmah.',
    },
    {
      q: 'Da li moram imati iskustvo sa video editingom?',
      a: 'Poželjno je, ali nije nužno. Dobijaš kratke edukacije i praktične vodiče kako bi brzo naučio sve što treba za kratke klipove.',
    },
    {
      q: 'Kako funkcioniše plaćanje?',
      a: 'Zarađuješ po performansama — za stvarne preglede i engagement. Isplata ide svake nedelje putem lokalnih servisa ili PayPala.',
    },
  ];

  const creatorFaqs = [
    {
      q: 'Kako Clipify pomaže kreatorima i brendovima?',
      a: 'Naša mreža klipera pomaže da tvoj sadržaj postane viralan na svim platformama, kroz autentične kratke formate koji dopiru do pravih publika.',
    },
    {
      q: 'Da li mogu birati tip sadržaja i ton komunikacije?',
      a: 'Naravno. Zajedno definišemo ton, ciljnu publiku i tip sadržaja kako bi kampanja bila potpuno u skladu sa tvojim brendom.',
    },
    {
      q: 'Postoji li minimalni budžet?',
      a: 'Ne. Možeš krenuti sa manjim pilot kampanjama — fokus je na pravim rezultatima i održivom rastu, ne na ulaznim troškovima.',
    },
  ];

  const FaqColumn = ({
                       title,
                       items,
                       ctaButtonText,
                       ctaButtonLink,
                     }: {
    title: string;
    items: { q: string; a: string }[];
    ctaButtonText: string;
    ctaButtonLink: string;
  }) => (
    <Box>
      <Heading
        as="h3"
        fontSize={{ base: '2xl', md: '3xl' }}
        mb={8}
        color="white"
        fontWeight="900"
        letterSpacing="-0.02em"
      >
        {title}
      </Heading>
      <Accordion allowToggle display="flex" flexDirection="column" gap={4}>
        {items.map((faq, i) => (
          <AccordionItem
            key={i}
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="xl"
            overflow="hidden"
            bg="whiteAlpha.50"
            flex="1"
          >
            <AccordionButton
              _expanded={{ bg: 'whiteAlpha.100' }}
              p={6}
              justifyContent="space-between"
              alignItems="center"
            >
              <Heading
                size="sm"
                color="white"
                fontWeight="700"
                letterSpacing="-0.01em"
                textAlign="left"
              >
                {faq.q}
              </Heading>
              <Box
                as="span"
                fontSize="2xl"
                lineHeight="1"
                color="gray.400"
                ml={4}
                transition="transform 0.2s"
                _groupHover={{ color: 'white' }}
              >
                +
              </Box>
            </AccordionButton>
            <AccordionPanel px={6} pb={5} color="gray.400" fontSize="sm" lineHeight="1.8">
              {faq.a}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      <Flex justify="center" mt={10}> {/* Added Flex to center the button */}
        <Button
          as="a"
          href={ctaButtonLink}
          target="_blank"
          rel="noopener noreferrer"
          size="lg"
          w={{ base: "full", md: "55%" }}
          bg="white"
          color="black"
          borderRadius="xl"
          px={12}
          py={8}
          fontSize="xl"
          fontWeight="700"
          boxShadow="0px 8px 24px rgba(255,255,255,0.15)"
          _hover={{
            opacity: 0.95,
            transform: 'translateY(-4px)',
            boxShadow: '0px 12px 32px rgba(255,255,255,0.2)',
          }}
          transition="all 0.2s ease"
          leftIcon={ctaButtonText.includes("Discord") ? <FaDiscord/> : <Calendar />}
        >
          {ctaButtonText}
        </Button>
      </Flex>
    </Box>
  );

  return (
    <Flex
      align="center"
      minH="80vh"
      as="section"
      bg="gray.700"
      color="white"
      py={{ base: 20, md: 28 }}
    >
      <Container maxW="7xl">
        <VStack spacing={4} mb={{ base: 12, md: 20 }} textAlign="center">
          <Text
            fontSize="sm"
            letterSpacing="0.15em"
            textTransform="uppercase"
            color="gray.500"
          >
            FAQ
          </Text>
          <Heading
            fontWeight="900"
            letterSpacing="-0.03em"
            fontSize={{ base: '36px', md: '48px', lg: '60px' }}
            color="white"
            lineHeight="1.1"
          >
            Česta Pitanja
          </Heading>
          <Text color="gray.400" fontSize={{ base: 'lg', md: 'xl' }} maxW="2xl">
            Sve što treba da znaš — bilo da kreiraš sadržaj ili klipuješ ga.
          </Text>
        </VStack>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          gap={{ base: 10, md: 16 }}
          alignItems="stretch"
        >
          <FaqColumn
            title="Za Klipere"
            items={clipperFaqs}
            ctaButtonText="Pridruži se našem Discordu"
            ctaButtonLink="https://discord.com/" // Replace with actual Discord link
          />
          <FaqColumn
            title="Za Kreatore"
            items={creatorFaqs}
            ctaButtonText="Zakažite poziv"
            ctaButtonLink="#kontakt" // Link to the contact section
          />
        </Grid>
      </Container>
    </Flex>
  );
};

const CTASection = () => {
  return (
    <Box
      id="kontakt"
      as="section"
      py={{ base: 20, md: 28 }}
      bg="blackAlpha.900"
      color="black"
      position="relative"
      overflow="hidden"
    >
      <Container maxW="6xl">
        <VStack spacing={4} textAlign="center" mb={16}>
          <HStack
            bg="gray.100"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="full"
            px={4}
            py={1}
            fontSize="sm"
            color="gray.700"
          >
            <Icon as={MessageSquareIcon} boxSize={4} />
            <Text fontWeight="medium">Stupite u kontakt</Text>
          </HStack>

          <Heading
            fontSize={{ base: '3xl', md: '6xl', lg: '7xl' }}
            fontWeight="900"
            lineHeight="1.05"
            letterSpacing="-0.03em"
            color="white"
          >
            ZAPOČNI SVOJ PUT KA
            <Box
              as="span"
              position="relative"
              zIndex={1}
              color="white"
              pl="2"
              ml="2"
              bgGradient="linear(to-r, rgba(252, 165, 165, 0.7), rgba(252, 165, 165, 0.5), rgba(252, 165, 165, 0.0))"
              borderLeft="8px"
              borderColor="red.500"
            >
              VIRALNOSTI
            </Box>
          </Heading>

          <Text
            maxW="3xl"
            color="gray.400"
            fontSize={{ base: 'lg', md: 'xl' }}
            lineHeight={1.7}
          >
            Spremni da pojačate angažman i prodaju na društvenim mrežama
            strateškim marketingom i profesionalnim uslugama klipovanja sadržaja?
            Hajde da razgovaramo kako možemo ostvariti prave rezultate za vaš brend.
          </Text>

          <HStack
            spacing={8}
            pt={4}
            flexWrap="wrap"
            justify="center"
            color="gray.300"
            fontSize="md"
            fontWeight="medium"
          >
            <HStack>
              <Icon as={ClockIcon} boxSize={5} />
              <Text>Odgovor u roku od 24h</Text>
            </HStack>
            <HStack>
              <Icon as={ArrowRight} boxSize={5} />
              <Text>Besplatne konsultacije</Text>
            </HStack>
            <HStack>
              <Icon as={Check} boxSize={5} />
              <Text>Veruju nam 100+ brendova</Text>
            </HStack>
          </HStack>
        </VStack>

        {/* --- Schedule a Meeting Card --- */}
        <Box
          bg="gray.900"
          color="white"
          border="1px solid"
          borderColor="gray.800"
          borderRadius="xl"
          textAlign="center"
          p={{ base: 10, md: 14 }}
          mb={{ base: 12, md: 16 }}
          boxShadow="0 0 80px rgba(255,255,255,0.05)" // Persistent white glow
          transition="all 0.3s ease" // Add transition for hover effect
          _hover={{
            transform: 'translateY(-8px)', // Lift on hover
            boxShadow: '0 8px 60px rgba(255,255,255,0.12)', // White glow on hover
          }}
          position="relative"
          // Removed transition and _hover as glow is now persistent
        >
          {/* Inner glowing effect - slightly more pronounced for persistent glow */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            w="350px" // Slightly larger for more impact
            h="350px"
            borderRadius="full"
            bg="radial-gradient(circle, rgba(255,255,255,0.1), transparent 80%)" // More visible glow
            filter="blur(80px)" // Increased blur for a softer spread
            transform="translate(-50%, -50%)"
            zIndex={0}
          />
          <VStack spacing={5} position="relative" zIndex={1}>
            <Icon
              as={CalendarIcon}
              boxSize={14}
              color="white"
              border="1px solid"
              borderColor="whiteAlpha.300"
              borderRadius="full"
              p={3}
            />
            <Heading size="lg">Zakažite sastanak</Heading>
            <Text color="gray.300" maxW="2xl" mx="auto" fontSize="md">
              Rezervišite 30-minutne konsultacije kako bismo razgovarali o vašem
              projektu i istražili kako vam možemo pomoći.
            </Text>
            <Button
              size="lg"
              mt={4}
              px={10}
              py={7}
              fontSize="md"
              fontWeight="bold"
              borderRadius="full"
              bg="white"
              color="black"
              border="1px solid"
              borderColor="gray.200"
              _hover={{
                bg: 'gray.100',
                transform: 'translateY(-2px)',
                boxShadow: '0 0 30px rgba(0,0,0,0.1)',
              }}
              transition="all 0.25s ease"
            >
              Zakaži konsultacije
            </Button>
          </VStack>
        </Box>

        {/* --- LOWER GRID --- */}
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          gap={{ base: 8, md: 10 }}
        >
          {/* LEFT: Contact */}
          <Box
            bg="gray.900"
            color="white"
            border="1px solid"
            borderColor="gray.700"
            borderRadius="xl"
            p={{ base: 8, md: 10 }}
            boxShadow="0 8px 60px rgba(255,255,255,0.05)" // Persistent white glow
            transition="all 0.3s ease" // Add transition for hover effect
            _hover={{
              transform: 'translateY(-8px)', // Lift on hover
              boxShadow: '0 8px 60px rgba(255,255,255,0.12)', // White glow on hover
            }}
            // Removed transition and _hover as glow is now persistent
          >
            <Heading size="md" mb={8}>
              Direktan kontakt
            </Heading>

            <VStack align="start" spacing={8}>
              {[
                {
                  icon: MailIcon,
                  label: 'Email',
                  value: 'khrish@spadegroup.io',
                  href: 'mailto:khrish@spadegroup.io',
                },
                {
                  icon: MessageSquareIcon,
                  label: 'Live Chat',
                  value: 'Započni razgovor',
                  href: '#',
                },
                {
                  icon: ClockIcon,
                  label: 'Vreme odgovora',
                  value: 'U roku od 24 sata',
                },
              ].map((item) => (
                <HStack key={item.label} spacing={4} align="flex-start">
                  <Flex
                    w={8}
                    h={8}
                    borderRadius="full"
                    border="1px solid"
                    borderColor="whiteAlpha.300"
                    align="center"
                    justify="center"
                    bg="white"
                  >
                    <Icon as={item.icon} boxSize={4} color="black" />
                  </Flex>
                  <Box>
                    <Text color="gray.400" fontSize="sm">
                      {item.label}
                    </Text>
                    {item.href ? (
                      <Link
                        href={item.href}
                        fontWeight="bold"
                        color="white"
                        _hover={{
                          color: 'gray.300',
                          textDecoration: 'underline',
                        }}
                      >
                        {item.value}
                      </Link>
                    ) : (
                      <Text fontWeight="bold" color="white">
                        {item.value}
                      </Text>
                    )}
                  </Box>
                </HStack>
              ))}
            </VStack>
          </Box>

          {/* RIGHT: Steps */}
          <Box
            bg="gray.900"
            color="white"
            border="1px solid"
            borderColor="gray.700"
            borderRadius="xl"
            p={{ base: 8, md: 10 }}
            boxShadow="0 8px 60px rgba(255,255,255,0.05)" // Persistent white glow
            transition="all 0.3s ease" // Add transition for hover effect
            _hover={{
              transform: 'translateY(-8px)', // Lift on hover
              boxShadow: '0 8px 60px rgba(255,255,255,0.12)', // White glow on hover
            }}
            // Removed transition and _hover as glow is now persistent
          >
            <Heading size="md" mb={8}>
              Šta se dešava{' '}
              <Box as="span" color="white">
                Dalje?
              </Box>
            </Heading>

            <VStack align="start" spacing={6}>
              {[
                {
                  num: '1',
                  title: 'Inicijalne konsultacije',
                  desc: 'Razumemo vaše ciljeve i publiku.',
                },
                {
                  num: '2',
                  title: 'Razvoj strategije',
                  desc: 'Kreiramo vaš prilagođeni plan kampanje.',
                },
                {
                  num: '3',
                  title: 'Pokretanje kampanje',
                  desc: 'Naša mreža započinje izvršenje.',
                },
                {
                  num: '4',
                  title: 'Praćenje rezultata',
                  desc: 'Merimo i optimizujemo performanse.',
                },
              ].map((step) => (
                <HStack key={step.num} align="flex-start" spacing={4}>
                  <Flex
                    bg="white"
                    color="black"
                    w={6}
                    h={6}
                    align="center"
                    justify="center"
                    borderRadius="full"
                    fontWeight="bold"
                    fontSize="sm"
                  >
                    {step.num}
                  </Flex>
                  <Box>
                    <Text fontWeight="bold" color="white">
                      {step.title}
                    </Text>
                    <Text color="gray.400" fontSize="sm">
                      {step.desc}
                    </Text>
                  </Box>
                </HStack>
              ))}
            </VStack>
          </Box>
        </Grid>
        <Box
          mt={{ base: 16, md: 24 }}
          mx="auto"
          w={{ base: '100%', md: '75%' }}
          bg="gray.900" // Background remains dark
          color="white"
          border="1px solid"
          borderColor="#7289da" // Discord purple border accent
          borderRadius="2xl"
          textAlign="center"
          p={{ base: 10, md: 12 }}
          boxShadow="0 10px 40px rgba(0,0,0,0.4), 0 0 20px rgba(88, 101, 242, 0.4)" // Sharp shadow with purple tinge (Discord brand color)
          transition="all 0.3s ease"
          _hover={{
            boxShadow: '0 15px 50px rgba(0,0,0,0.5), 0 0 30px rgba(88, 101, 242, 0.6)', // More pronounced shadow/purple glow on hover
          }}
        >
          <Heading
            fontSize={{ base: '3xl', md: '4xl' }}
            mb={3}
            fontWeight="800"
            lineHeight="short"
          >
            Spremni da se pridružite kao kreator klipova?
          </Heading>
          <Text color="gray.400" mb={8}>
            Počnite da zarađujete kreirajući viralne klipove za vrhunske brendove
            i kreatore.
          </Text>
          <Button
            size="lg"
            bg="#7289da" // Discord purple button background
            color="white" // White text for contrast
            borderRadius="full"
            px={8}
            py={6}
            fontWeight="700"
            fontSize="md"
            border="1px solid"
            borderColor="#7289da" // Slightly darker purple border
            _hover={{
              bg: '#7289da', // Darker purple on hover
              transform: 'translateY(-2px)',
              boxShadow: '0 0 20px rgba(88, 101, 242, 0.4)', // Purple glow on button hover
            }}
          >
            Pridružite se našem Discordu
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;