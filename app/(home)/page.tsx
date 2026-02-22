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
  ModalBody,
  ModalContent,
  Link,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel, IconButton, SimpleGrid,
} from '@chakra-ui/react'
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
  Instagram, SparklesIcon,
} from 'lucide-react'
import type { NextPage } from 'next';
import { Global } from '@emotion/react';
import { GoPeople } from 'react-icons/go';
import { FaDiscord } from 'react-icons/fa';
import { GrCheckmark } from 'react-icons/gr';
import { ButtonLink } from '#components/home-page/button-link'

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
    <Box position="relative" minH={{base: "140vh", md: "100vh"}}>
      {/* Logo and Badge - Fixed at top */}

      <VStack spacing={{ base: 2, md: 3 }} mt={{ base: 6, md: 12 }} position="relative" zIndex={2}>
        <MotionBox
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            w={{ base: 16, md: 24 }}
            src="/static/images/logo-header2.png"
            alt="Clipify Logo"
          />
        </MotionBox>
        <MotionBox
          display={{ base: "block", md: "none" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <HStack
            mt="4"
            spacing={2}
            bg="white"
            px={4}
            py={2}
            borderRadius="full"
            border="2px solid"
            borderColor="gray.100"
            boxShadow="0 4px 16px rgba(0,0,0,0.08)"
          >
            <Box position="relative">
              <Box
                w="8px"
                h="8px"
                borderRadius="full"
                bg="red.500"
              />
              <Box
                as={motion.div}
                position="absolute"
                top="0"
                left="0"
                w="8px"
                h="8px"
                borderRadius="full"
                bg="red.500"
                animate={{
                  scale: [1, 2, 2],
                  opacity: [0.8, 0, 0],
                }}
              />
            </Box>
            <Text fontSize="xs" fontWeight="700" color="gray.900">
              5 aktivnih kampanja
            </Text>
          </HStack>
        </MotionBox>
      </VStack>

      {/* Background gradient */}
      <Box position="absolute" inset={0} pointerEvents="none" />

      {/* Main Content - Absolutely centered on screen */}
      <Box
        position="absolute"
        top={{ base: "38%", md: "45%" }}
        left="50%"
        transform="translate(-50%, -50%)"
        w="full"
        zIndex={1}
      >
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <VStack spacing={{ base: 10, md: 8 }} textAlign="center" maxW="5xl" mx="auto">
            <Box whiteSpace='nowrap'>
              <MotionText
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                fontSize={{ base: '36px', sm: '48px', md: '64px', lg: '84px' }}
                fontWeight="500"
                fontFamily={"Montserrat Variable"}
                lineHeight={1.1}
                color="black"
                letterSpacing="-0.02em"
                mb={1}
              >
                Otključaj <br />
              </MotionText>

              <MotionText
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                fontSize={{ base: '42px', sm: '56px', md: '72px', lg: '96px' }}
                fontWeight="600"
                fontFamily={"Montserrat Variable"}
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
                  px={{ base: 2, md: 4 }}
                  bgGradient='linear(to-r, rgba(252, 165, 165, 0.9), rgba(252, 165, 165, 0.5), rgba(252, 165, 165, 0.2), rgba(252, 165, 165, 0.0))'
                  borderLeft="8px"
                  borderColor="red.500"

                >
                  Pun Potencijal

                </Box>
              </MotionText>
              <MotionText
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                fontSize={{ base: '36px', sm: '44px', md: '64px', lg: '84px' }}
                fontWeight="500"
                fontFamily={"Montserrat Variable"}
                lineHeight={1.1}
                color="black"
                letterSpacing="-0.02em"
                mb={{ base: 16, md: 2 }}
                mt={1}
              >
                Tvog Sadržaja
              </MotionText>
            </Box>

            <MotionText
              display={{ base: 'none', md: 'block' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              fontSize={{ base: 'md', sm: 'lg', md: 'xl' }}
              color="gray.600"
              maxW="3xl"
              lineHeight={1.7}
              px={{ base: 2, md: 0 }}
            >
              Clipify je vodeća performance-based platforma koja pretvara tvoj
              sadržaj u stotine viralnih kratkih klipova. Poveži se sa mrežom
              od 600+ pravih kreatora koji šire tvoj brend na svim društvenim
              mrežama uz
              <Text as="span" fontWeight="700">
                {' '}
                znatno manji trošak od klasičnih reklama.
              </Text>
            </MotionText>

            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    document.querySelector('#kontakt')?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                  width={{base: "full", md: "auto"}}
                  bg="black"
                  color="white"
                  px={{ base: 6, md: 10 }}
                  py={{ base: 6, md: 8 }}
                  fontSize={{ base: 'md', md: 'lg' }}
                  fontWeight="600"
                  borderRadius="full"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.2s"
                  leftIcon={<PhoneIcon size={16} />}
                >
                  Zakaži Poziv
                </Button>
                <Button
                  as="a"
                  href="/signup"
                  width={{base: "full", md: "auto"}}
                  borderColor="black"
                  color="black"
                  px={{ base: 6, md: 10 }}
                  py={{ base: 6, md: 8 }}
                  fontSize={{ base: 'md', md: 'lg' }}
                  fontWeight="600"
                  borderRadius="full"
                  borderWidth={{ base: '1px', md: '2px' }}
                  _hover={{
                    bg: 'black',
                    color: 'white',
                    transform: 'translateY(-2px)',
                  }}
                  transition="all 0.2s"
                  leftIcon={<GoPeople size={16} />}
                >
                  Zaradi kao kliper
                </Button>
              </HStack>
            </MotionBox>

            {/* Scroll Indicator */}
            <MotionBox
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, 10, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.9 },
                y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
              }}
              mt={{ base: 0, md: 6 }}
            >
              <VStack spacing={2}>
                <Text
                  fontSize={{ base: 'xs', md: 'sm' }}
                  color="gray.500"
                  fontWeight="500"
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Skroluj
                </Text>
                <Box
                  w="1px"
                  h={{ base: "40px", md: "50px" }}
                  bg="gray.300"
                  position="relative"
                  overflow="hidden"
                >
                  <MotionBox
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    h="20px"
                    bgGradient="linear(to-b, gray.600, transparent)"
                    animate={{ y: [0, 30, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                </Box>
              </VStack>
            </MotionBox>
          </VStack>
        </Container>
      </Box>

      {/* Long text - positioned at bottom of hero section */}
      <Box
        display={{ base: 'block', md: 'none' }}
        position="absolute"
        bottom={{ base: '10vh', md: '15vh' }}
        left="50%"
        transform="translateX(-50%)"
        w="full"
        zIndex={1}
      >
        <Container maxW="7xl" px={{ base: 4, md: 6 }}>
          <Flex
            mx="auto"
            mb="6"
            w={16}
            h={16}
            borderRadius="lg"
            bg="black"
            border="1px solid"
            borderColor="whiteAlpha.200"
            align="center"
            justify="center"
            flexShrink={0}
          >
            <Icon as={SparklesIcon} boxSize="50%" color="white" />
          </Flex>

          <MotionText
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            fontSize={{ base: 'md', sm: 'lg', md: 'xl' }}
            color="gray.600"
            maxW="3xl"
            mx="auto"
            textAlign="center"
            lineHeight={1.7}
            px={{ base: 2, md: 0 }}
          >
            Clipify je vodeća performance-based platforma koja pretvara tvoj
            sadržaj u stotine viralnih kratkih klipova. Poveži se sa mrežom
            od 600+ pravih kreatora koji šire tvoj brend na svim društvenim
            mrežama uz
            <Text as="span" fontWeight="700">
              {' '}
              znatno manji trošak od klasičnih reklama.
            </Text>
          </MotionText>
        </Container>
      </Box>

      {/* Pulse animation for the red dot */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
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
      bg="black"
      color="white"
      py={{ base: 8, md: 10 }}
      position="relative"
      overflow="hidden"
    >
      {/* Background accent */}
      <Box
        position="absolute"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        w="600px"
        h="300px"
        bgGradient="radial(circle, rgba(239, 68, 68, 0.1), transparent 70%)"
        pointerEvents="none"
      />

      <Container maxW="7xl" position="relative" zIndex={1}>
        {/* Heading with decorative border */}
        <Flex justify="center" mb={{ base: 6, md: 8 }}>
          <Box position="relative">
            {/* Decorative corner elements */}
            <Box
              position="absolute"
              top="-3px"
              left="-3px"
              w="30px"
              h="30px"
              borderTop="3px solid"
              borderLeft="3px solid"
              borderColor="red.500"
            />
            <Box
              position="absolute"
              top="-3px"
              right="-3px"
              w="30px"
              h="30px"
              borderTop="3px solid"
              borderRight="3px solid"
              borderColor="red.500"
            />
            <Box
              position="absolute"
              bottom="-3px"
              left="-3px"
              w="30px"
              h="30px"
              borderBottom="3px solid"
              borderLeft="3px solid"
              borderColor="red.500"
            />
            <Box
              position="absolute"
              bottom="-3px"
              right="-3px"
              w="30px"
              h="30px"
              borderBottom="3px solid"
              borderRight="3px solid"
              borderColor="red.500"
            />

            {/* Dashed border */}
            <Box
              position="absolute"
              inset={0}
              border="2px dashed"
              borderColor="whiteAlpha.300"
              pointerEvents="none"
            />

            {/* Main heading box */}
            <Box
              bg="black"
              px={{ base: 4, sm: 8, md: 12 }}
              py={{ base: 3, md: 3.5 }}
              position="relative"
            >
              <Heading
                fontSize={{ base: 'xl', md: '3xl', lg: '4xl' }}
                fontWeight="900"
                letterSpacing="-0.02em"
                textAlign="center"
                color="white"
              >
                Saradjujemo sa
              </Heading>
            </Box>
          </Box>
        </Flex>

        {/* Scrolling marquee */}
        <Box position="relative" overflow="hidden">
          <Flex
            gap={12}
            animation="scroll 35s linear infinite"
            w="max-content"
            align="center"
          >
            {[...words, ...words, ...words].map((word, i) => (
              <Text
                key={i}
                fontSize={{ base: 'xl', md: '2xl' }}
                fontWeight="700"
                color="red.500"
                textShadow="0 0 8px rgba(239, 68, 68, 0.5), 0 0 16px rgba(239, 68, 68, 0.4)"
                whiteSpace="nowrap"
                transition="all 0.3s ease"
                _hover={{
                  textShadow:
                    '0 0 12px rgba(239, 68, 68, 0.8), 0 0 24px rgba(239, 68, 68, 0.6)',
                  transform: 'scale(1.05)',
                }}
              >
                {word}
              </Text>
            ))}
          </Flex>

          {/* Fade edges */}
          <Box
            position="absolute"
            left={0}
            top={0}
            bottom={0}
            w="100px"
            bgGradient="linear(to-r, black, transparent)"
            pointerEvents="none"
          />
          <Box
            position="absolute"
            right={0}
            top={0}
            bottom={0}
            w="100px"
            bgGradient="linear(to-l, black, transparent)"
            pointerEvents="none"
          />
        </Box>
      </Container>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </Box>
  );
};

const StatsSection = () => {
  const targets = {
    dinara: 400_000,
    klipera: 1_100,
    pregleda: 50_000_000,
    kampanja: 20,
  };

  function useCountUp(params: {
    end: number;
    duration?: number;
    format?: (n: number) => string;
  }) {
    const {
      end,
      duration = 5000,
      format = (n: number) => Math.floor(n).toString(),
    } = params;

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
    if (v >= 1_000_000)
      return (v / 1_000_000).toFixed(1).replace('.0', '') + 'M';
    if (v >= 1_000) return (v / 1_000).toFixed(0) + 'K';
    return v.toString();
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
        <Grid
          templateColumns={{ base: '1fr 1fr', md: 'repeat(4, 1fr)' }}
          gap={{ base: 6, md: 10 }}
        >
          <GridItem>
            <VStack
              ref={dinara.ref as any}
              spacing={1}
              align="start"
              borderLeft="3px solid"
              borderColor='black'
              pl={4}
            >
              <Heading
                fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
                lineHeight="1"
                color="black"
              >
                {dinara.display}
              </Heading>
              <Text
                color="gray.600"
                fontSize={{ base: 'sm', sm: 'md', md: 'lg' }}
              >
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
              borderColor='black'
              pl={4}
            >
              <Heading
                fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
                lineHeight="1"
                color="black"
              >
                {klipera.display}
              </Heading>
              <Text
                color="gray.600"
                fontSize={{ base: 'sm', sm: 'md', md: 'lg' }}
              >
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
              borderColor='black'
              pl={4}
            >
              <Heading
                fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
                lineHeight="1"
                color="black"
              >
                {pregleda.display}
              </Heading>
              <Text
                color="gray.600"
                fontSize={{ base: 'sm', sm: 'md', md: 'lg' }}
              >
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
              borderColor='black'
              pl={4}
            >
              <Heading
                fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
                lineHeight="1"
                color="black"
              >
                {kampanja.display}
              </Heading>
              <Text
                color="gray.600"
                fontSize={{ base: 'sm', sm: 'md', md: 'lg' }}
              >
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
      id: 'trajko',
      name: 'Trajko',
      views: '30M',
      image: 'https://firebasestorage.googleapis.com/v0/b/botina-44e95.firebasestorage.app/o/trajko2.jpg?alt=media&token=0a3856fd-cb1f-473a-b61b-41f7c62dc181',
      totalClippers: 50,
      totalVideos: 1000,
      durationDays: 10,
      topVideo: {
        views: '570K',
        clipper: 'kliper_1311',
        link: 'https://www.instagram.com/p/DUq_kBnj_kz/',
      },
      text: "Tokom kampanje za Trajka fokusirali smo se na organski rast kroz našu mrežu klipera. Umesto otvaranja novih profila, Trajkov sadržaj je strateški ubacen na već postojeće kliperske i streamerske profile koji imaju izgrađenu publiku. Kliperi su svakodnevno izbacivali najbolje momente i zabavne isečke iz njegovih kick strimova koje najbolje prolaze u njegovoj niši."
    },
    {
      id: 'cjuree',
      name: 'Cjuree',
      views: '10M',
      image:
        'https://firebasestorage.googleapis.com/v0/b/botina-44e95.firebasestorage.app/o/cjuree.jpeg?alt=media&token=0cc34f5b-8216-4e79-aca0-22fd6beadf20',
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
      image:
        'https://firebasestorage.googleapis.com/v0/b/botina-44e95.firebasestorage.app/o/aleksic.jpg?alt=media&token=d573b72a-2798-4892-a14b-7e684193d15d',
      totalClippers: 15,
      totalVideos: 95,
      durationDays: 14,
      topVideo: {
        views: '300K',
        clipper: 'kliper1311',
        link: 'https://www.tiktok.com/@kliper1311/video/7538504023171665208',
      },
      text: 'Tokom kampanje za Aleksića fokusirali smo se na organski rast kroz našu mrežu klipera. Umesto otvaranja novih profila, Aleksićev sadržaj je strateški ubacen na već postojeće kliperske i streamerske profile koji imaju izgrađenu publiku. Kliperi su svakodnevno izbacivali najbolje momente i zabavne isečke iz njegovih videa koje najbolje prolaze u njegovoj niši. ',
    },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [active, setActive] = React.useState<CaseItem | null>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const openCase = (c: CaseItem) => {
    setActive(c);
    onOpen();
  };

  return (
    <Box
      id="case-studies"
      py={{ base: 16, md: 24 }}
      position="relative"
      bg="gray.200"
      bgGradient="radial(circle at 50% 0%, rgba(0,0,0,0.04), transparent 70%)"
    >
      <Container maxW="7xl">
        <Container maxW="7xl" mb={{ base: 12, md: 20 }}>
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
                fontSize={{ base: '32px', md: '48px', lg: '56px' }}
                color="black"
              >
                Ko je sa nama
              </Heading>

              <Heading
                as="h2"
                fontWeight="900"
                letterSpacing="-0.03em"
                lineHeight="0.95"
                fontSize={{ base: '40px', md: '56px', lg: '64px' }}
                bgGradient="linear(to-r, gray.400, gray.600)"
                bgClip="text"
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
                color="gray.700"
                fontSize={{ base: 'md', md: 'xl' }}
                textAlign={{ base: 'left', lg: 'right' }}
                maxW={{ base: 'full', lg: 'sm' }}
                lineHeight="1.6"
              >
                Istraži rezultate koje smo <br /> ostvarili za klijente.
              </Text>
            </Box>
          </Grid>
        </Container>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap={{ base: 6, md: 8 }}
        >
          {cases.map((item, i) => (
            <MotionBox
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              bg="white"
              borderRadius="3xl"
              overflow="hidden"
              border="3px solid"
              borderColor={hoveredId === item.id ? 'red.500' : 'gray.200'}
              boxShadow={
                hoveredId === item.id
                  ? '0 32px 64px rgba(239, 68, 68, 0.25), 0 0 80px rgba(239, 68, 68, 0.15)'
                  : '0 20px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)'
              }
              cursor="pointer"
              onClick={() => openCase(item)}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              position="relative"
              _hover={{
                transform: { base: 'none', md: 'translateY(-12px) scale(1.02)' },
              }}
              role="group"
            >
              {/* Image Section */}
              <Box
                position="relative"
                h={{ base: '280px', sm: '320px', md: '380px' }}
                bg="gray.900"
                overflow="hidden"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                  filter="brightness(0.9)"
                  transition="transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.3s"
                  _groupHover={{
                    transform: 'scale(1.1)',
                    filter: 'brightness(1)',
                  }}
                />
                <Box
                  position="absolute"
                  inset={0}
                  bgGradient="linear(to-b, transparent 50%, rgba(0,0,0,0.7))"
                />

                {/* Floating badge that appears on hover */}
                <Badge
                  position="absolute"
                  top={6}
                  right={6}
                  bg="red.500"
                  color="white"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="900"
                  textTransform="uppercase"
                  letterSpacing="wider"
                  opacity={hoveredId === item.id ? 1 : 0}
                  transform={
                    hoveredId === item.id
                      ? 'translateY(0)'
                      : 'translateY(-10px)'
                  }
                  transition="all 0.3s"
                >
                  POGLEDAJ
                </Badge>

                {/* Content Overlay */}
                <VStack
                  position="absolute"
                  bottom="0"
                  left="0"
                  right="0"
                  p={{ base: 4, sm: 6, md: 7 }}
                  spacing={3}
                  align="start"
                >
                  <Heading
                    size={{ base: 'lg', md: 'xl' }}
                    color="white"
                    letterSpacing="-0.02em"
                    fontWeight="900"
                    textShadow="0 4px 16px rgba(0,0,0,0.4)"
                    transition="transform 0.3s"
                    transform={
                      hoveredId === item.id
                        ? 'translateX(8px)'
                        : 'translateX(0)'
                    }
                  >
                    {item.name}
                  </Heading>

                  <HStack
                    bg={hoveredId === item.id ? 'red.500' : 'whiteAlpha.200'}
                    backdropFilter="blur(12px)"
                    color="white"
                    borderRadius="full"
                    px={{ base: 4, md: 6 }}
                    py={{ base: 2, md: 3.5 }}
                    spacing="2"
                    border="1px solid"
                    borderColor={
                      hoveredId === item.id ? 'red.600' : 'whiteAlpha.300'
                    }
                    transition="all 0.3s"
                  >
                    <Text
                      fontSize={{ base: 'xl', md: '3xl' }}
                      fontWeight="900"
                      lineHeight="1"
                      letterSpacing="-0.02em"
                    >
                      {item.views}
                    </Text>
                    <Text
                      fontSize={{ base: 'md', md: 'lg' }}
                      fontWeight="700"
                      opacity={0.95}
                    >
                      pregleda
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              {/* CTA Section */}
              <Box p={{ base: 4, sm: 5, md: 6 }}>
                <Button
                  w="100%"
                  size={{ base: 'md', md: 'lg' }}
                  bg={hoveredId === item.id ? 'red.500' : 'black'}
                  color="white"
                  fontWeight="700"
                  borderRadius="xl"
                  rightIcon={
                    <Box
                      as={ChevronRight}
                      transition="transform 0.3s"
                      transform={
                        hoveredId === item.id
                          ? 'translateX(4px)'
                          : 'translateX(0)'
                      }
                    />
                  }
                  _hover={{
                    bg: hoveredId === item.id ? 'red.600' : 'gray.800',
                  }}
                  transition="all 0.3s"
                >
                  Pogledaj Projekat
                </Button>
              </Box>
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

const CaseStudyModal: React.FC<CaseStudyModalProps> = ({isOpen,onClose,data,}) => {
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

  const StatCard: React.FC<{ label: string; value: React.ReactNode }> = ({label,value,}) => (
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
          bgGradient:
            'linear(to-r, transparent, rgba(255,255,255,0.1), transparent)',
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
        p={{ base: 3, md: 4 }}
        spacing={1}
        boxShadow="0 4px 10px rgba(0,0,0,0.3)"
        position="relative"
        zIndex={2}
      >
        <Text fontSize={{ base: 'xs', md: 'sm' }} color="gray.400">
          {label}
        </Text>
        <Heading
          size={{ base: 'md', md: 'lg' }}
          color="white"
          fontWeight="bold"
        >
          {value}
        </Heading>
      </VStack>
    </Box>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: 'full', md: '4xl' }}
      motionPreset="slideInBottom"
      scrollBehavior="inside"
    >
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(8px)" />
      <ModalContent
        bg="gray.900"
        color="white"
        borderRadius={{ base: 'none', md: '2xl' }}
        overflow="hidden"
        mx={{ base: 0, md: 4 }}
        my={{ base: 0, md: 4 }}
        maxH={{ base: '100vh', md: '90vh' }}
      >
        {/* Close Button */}
        <IconButton
          aria-label="Close modal"
          icon={<Box fontSize="24px">×</Box>}
          onClick={onClose}
          position="absolute"
          top={{ base: 2, md: 3 }}
          right={{ base: 2, md: 3 }}
          zIndex={10}
          size={{ base: 'md', md: 'lg' }}
          bg="blackAlpha.600"
          color="white"
          borderRadius="full"
          _hover={{
            bg: 'blackAlpha.800',
            transform: 'scale(1.1)',
          }}
          _active={{
            bg: 'blackAlpha.900',
          }}
          transition="all 0.2s"
        />

        <ModalBody p={0}>
          {data && (
            <Box>
              {/* Hero Image Section */}
              <Box
                h={{ base: '200px', sm: '250px', md: '320px' }}
                bg="gray.800"
                position="relative"
              >
                <Image
                  src={data.image}
                  alt={data.name}
                  objectFit="cover"
                  w="100%"
                  h="100%"
                />
                <Box
                  position="absolute"
                  inset={0}
                  bg="linear-gradient(to top, rgba(0,0,0,0.7), transparent)"
                />
                <VStack
                  position="absolute"
                  bottom={{ base: 3, md: 4 }}
                  left={{ base: 3, md: 4 }}
                  align="start"
                  spacing={1}
                >
                  <Heading size={{ base: 'md', md: 'lg' }}>
                    {data.name}
                  </Heading>
                  <Badge
                    colorScheme="green"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize={{ base: 'xs', md: 'sm' }}
                  >
                    {data.views} pregleda
                  </Badge>
                </VStack>
              </Box>

              {/* Stats Grid */}
              <Grid
                templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
                gap={{ base: 3, md: 4 }}
                p={{ base: 4, md: 6 }}
                bg="gray.800"
                borderBottom="1px solid"
                borderColor="whiteAlpha.200"
                boxShadow="inset 0 -2px 8px rgba(0,0,0,0.2)"
              >
                <GlowAnimation />
                <StatCard
                  label="Ukupno Klipera"
                  value={data.totalClippers ?? 0}
                />
                <StatCard
                  label="Ukupno Video klipova"
                  value={data.totalVideos ?? 0}
                />
                <StatCard
                  label="Trajanje Kampanje"
                  value={`${data.durationDays ?? 0} dana`}
                />
                <StatCard label="Ukupno Pregleda" value={data.views} />
              </Grid>

              {/* Detailed Analysis */}
              <Box px={{ base: 4, md: 6 }} py={{ base: 6, md: 8 }}>
                <Heading size={{ base: 'md', md: 'lg' }} mb={4}>
                  Detaljna analiza
                </Heading>
                <Text
                  color="gray.400"
                  textAlign="left"
                  fontSize={{ base: 'sm', md: 'md' }}
                  lineHeight="1.7"
                >
                  {data.text}
                </Text>
              </Box>

              {/* Top Video Link */}
              {data.topVideo?.link && (
                <Box
                  px={{ base: 4, md: 6 }}
                  pb={{ base: 6, md: 8 }}
                  pt={{ base: 0, md: 0 }}
                >
                  <Button
                    as={Link}
                    href={data.topVideo.link}
                    isExternal
                    rightIcon={<ExternalLink size={18} />}
                    colorScheme="green"
                    variant="solid"
                    borderRadius="full"
                    size={{ base: 'md', md: 'lg' }}
                    w={{ base: 'full', sm: 'auto' }}
                    px={{ base: 6, md: 8 }}
                  >
                    Pogledaj najpopularniji klip
                  </Button>
                  <Text
                    mt={2}
                    color="gray.400"
                    fontSize={{ base: 'xs', md: 'sm' }}
                  >
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
      title: 'Pokreni Kampanju',
      description:
        'Reci nam svoje ciljeve - bilo da promovišeš klip, podcast, pesmu, brend ili događaj. Odredi budžet i smernice, a mi se brinemo o svemu ostalom.',
      icon: RocketIcon,
    },
    {
      number: '2',
      title: 'Kliperi Kreiraju',
      description:
        'Kliperi (video editori) prate naš dokazani sistem kreiranja sadržaja, usklađen sa vizijom tvog brenda - dok im naš tim kroz stalni coaching pomaže da maksimalno povećaju rezultate.',
      icon: UsersIcon,
    },
    {
      number: '3',
      title: 'Prati rezultate',
      description:
        'Statistiku možeš pratiti uživo na svojem personalizovanom Dashboardu dok naš AI sistem u realnom vremenu prati preglede i filtrira lažnu aktivnost. Plaćaš samo za prave, organske rezultate.',
      icon: ChartLineIcon,
    },
  ];

  return (
    <Box
      id="how-it-works"
      as="section"
      bg="white"
      color="black"
      py={{ base: 20, md: 28 }}
      position="relative"
    >
      <Container maxW="7xl">
        {/* Header */}
        <VStack spacing={3} mb={{ base: 16, md: 20 }} textAlign="center">
          <Text
            fontSize="sm"
            letterSpacing="0.15em"
            textTransform="uppercase"
            color="gray.500"
            fontWeight="600"
          >
            Kako funkcioniše
          </Text>

          <Heading
            fontWeight="900"
            letterSpacing="-0.03em"
            fontSize={{ base: '38px', md: '48px', lg: '56px' }}
            lineHeight="1.1"
            px={{ base: 4, md: 0 }}
          >
            Postani viralan {' '}
            <Box as="span" display={{base: "block", md: "none"}}></Box>
            u

            <Box
              as="span"
              position="relative"
              zIndex={1}
              bgGradient='linear(to-r, rgba(252, 165, 165, 0.9), rgba(252, 165, 165, 0.5), rgba(252, 165, 165, 0.2), rgba(252, 165, 165, 0.0))'
              borderLeft="8px"
              borderColor="red.500"
              pl="2"
              ml="1"
            >
              3 Koraka
            </Box>
          </Heading>

          <Text
            color="gray.600"
            fontSize={{ base: 'md', md: 'xl' }}
            maxW="2xl"
            lineHeight="1.6"
            px={{ base: 4, md: 0 }}
          >
            Od ideje do viralnog sadržaja bez puno razmišljanja
          </Text>
        </VStack>

        {/* Steps Grid */}
        <Grid
          templateColumns={{ base: '1fr', lg: 'repeat(3, 1fr)' }}
          gap={{ base: 8, md: 6 }}
          position="relative"
          mb={{ base: 16, md: 20 }}
        >
          {/* Connection Lines - Desktop Only */}
          <Box
            display={{ base: 'none', lg: 'block' }}
            position="absolute"
            top="80px"
            left="16.66%"
            right="16.66%"
            h="3px"
            bgGradient="linear(to-r, red.500, red.300, red.500)"
            zIndex={0}
            _after={{
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '100%',
              height: '100%',
              bgGradient: 'linear(to-r, red.500, red.300, red.500)',
              filter: 'blur(8px)',
              opacity: 0.4,
            }}
          />

          {steps.map((step, i) => (
            <MotionBox
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              position="relative"
              zIndex={1}
            >
              <VStack
                bg="white"
                border="3px solid"
                borderColor="gray.200"
                borderRadius="2xl"
                p={{ base: 6, sm: 8, md: 10 }}
                spacing={5}
                h="100%"
                transition="all 0.3s ease"
                position="relative"
                overflow="hidden"
                role="group"
                _hover={{
                  borderColor: 'red.500',
                  transform: 'translateY(-8px)',
                  boxShadow: {
                    base: 'none',
                    md: '0 20px 40px rgba(239, 68, 68, 0.15)',
                  },
                }}

              >
                {/* Background Gradient Effect */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bgGradient="radial(circle at top right, rgba(239, 68, 68, 0.03), transparent 70%)"
                  opacity={0}
                  transition="opacity 0.3s"
                  _groupHover={{ opacity: 1 }}
                  pointerEvents="none"
                />

                {/* Step Number Badge */}
                <Flex
                  w={{ base: '64px', md: '80px' }}
                  h={{ base: '64px', md: '80px' }}
                  borderRadius="full"
                  bg="black"
                  color="white"
                  align="center"
                  justify="center"
                  fontSize={{ base: '28px', md: '36px' }}
                  fontWeight="900"
                  position="relative"
                  border="4px solid"
                  borderColor="white"
                  boxShadow="0 8px 24px rgba(0,0,0,0.12)"
                  transition="all 0.3s ease"
                  _groupHover={{
                    bg: 'red.500',
                    transform: 'scale(1.1) rotate(5deg)',
                    boxShadow: {
                      base: '0 8px 24px rgba(0,0,0,0.12)',
                      md: '0 12px 32px rgba(239, 68, 68, 0.3)',
                    },
                  }}
                >
                  {step.number}

                  {/* Pulse effect on hover */}
                  <Box
                    position="absolute"
                    inset={-2}
                    borderRadius="full"
                    border="2px solid"
                    borderColor="red.500"
                    opacity={0}
                    transition="all 0.3s"
                    _groupHover={{
                      opacity: 1,
                      transform: 'scale(1.2)',
                    }}
                  />
                </Flex>

                {/* Icon */}
                <Flex
                  w={{ base: '48px', md: '56px' }}
                  h={{ base: '48px', md: '56px' }}
                  borderRadius="xl"
                  bg="gray.100"
                  align="center"
                  justify="center"
                  transition="all 0.3s"
                  _groupHover={{
                    bg: 'red.50',
                  }}
                >
                  <Icon
                    as={step.icon}
                    boxSize={{ base: 6, md: 7 }}
                    color="gray.700"
                    transition="color 0.3s"
                    _groupHover={{ color: 'red.500' }}
                  />
                </Flex>

                {/* Content */}
                <VStack spacing={3} flex="1">
                  <Heading
                    fontSize={{ base: 'xl', md: '2xl' }}
                    fontWeight="800"
                    textAlign="center"
                    letterSpacing="-0.02em"
                  >
                    {step.title}
                  </Heading>

                  <Text
                    color="gray.600"
                    fontSize={{ base: 'sm', md: 'lg' }}
                    textAlign="center"
                    lineHeight="1.7"
                  >
                    {step.description}
                  </Text>
                </VStack>

                {/* Step indicator bar */}
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  h="4px"
                  bg="gray.200"
                  overflow="hidden"
                >
                  <Box
                    h="100%"
                    bg="red.500"
                    w="0%"
                    transition="width 0.6s ease"
                    _groupHover={{ w: '100%' }}
                  />
                </Box>
              </VStack>
            </MotionBox>
          ))}
        </Grid>

        {/* CTA Section */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <VStack
            bg="black"
            color="white"
            borderRadius="3xl"
            p={{ base: 8, md: 14 }}
            spacing={6}
            position="relative"
            overflow="hidden"
          >
            {/* Background accent */}
            <Box
              position="absolute"
              top="50%"
              left="50%"
              transform="translate(-50%, -50%)"
              w="400px"
              h="400px"
              bgGradient="radial(circle, rgba(239, 68, 68, 0.15), transparent 70%)"
              pointerEvents="none"
            />

            <Badge
              bg="red.500"
              color="white"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Spreman za početak?
            </Badge>

            <Heading
              fontSize={{ base: 'xl', sm: '2xl', md: '4xl' }}
              fontWeight="900"
              textAlign="center"
              letterSpacing="-0.02em"
              maxW="3xl"
            >
              Započni svoj rast na društvenim mrežama već danas
            </Heading>

            <Text
              color="gray.400"
              fontSize={{ base: 'sm', md: 'lg' }}
              textAlign="center"
              maxW="2xl"
            >
              Pridruži se brendovima koji već koriste našu platformu za organski
              rast
            </Text>

            <HStack
              spacing={4}
              flexWrap="wrap"
              justify="center"
              pt={2}
              w="full"
            >
              <Button
                as="a"
                href="https://cal.com/petarnovakovic/"
                target="_blank"
                size={{ base: 'md', md: 'lg' }}
                bg="white"
                color="black"
                px={{ base: 6, md: 10 }}
                py={{ base: 6, md: 8 }}
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="700"
                borderRadius="full"
                leftIcon={<Calendar size={20} />}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(255,255,255,0.3)',
                }}
                transition="all 0.2s"
              >
                Zakaži Konsultacije
              </Button>

              <Button
                size={{ base: 'md', md: 'lg' }}
                variant="outline"
                borderColor="whiteAlpha.300"
                color="white"
                px={{ base: 6, md: 10 }}
                py={{ base: 6, md: 8 }}
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="700"
                borderRadius="full"
                borderWidth="2px"
                leftIcon={<ArrowRight size={20} />}
                _hover={{
                  bg: 'whiteAlpha.100',
                  borderColor: 'white',
                  transform: 'translateY(-2px)',
                }}
                transition="all 0.2s"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector('#plans')?.scrollIntoView({
                    behavior: 'smooth',
                  });
                }}
              >
                Planovi
              </Button>
            </HStack>

            <HStack
              spacing={{ base: 4, md: 8 }}
              pt={6}
              color="gray.400"
              fontSize={{ base: 'xs', md: 'sm' }}
              flexWrap="wrap"
              justify="center"
            >
              <HStack>
                <Icon as={Check} boxSize={4} color="green.400" />
                <Text>30x Jeftinije od Reklama</Text>
              </HStack>
              <HStack>
                <Icon as={Check} boxSize={4} color="green.400" />
                <Text>Setup za 24h</Text>
              </HStack>
              <HStack>
                <Icon as={Check} boxSize={4} color="green.400" />
                <Text>Garancija</Text>
              </HStack>
            </HStack>
          </VStack>
        </MotionBox>
      </Container>
    </Box>
  );
};

const FeatureCard = ({icon,title,description,index,}: {icon: any;title: string;description: string;index: number;}) => {
  return (
    <MotionBox
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      h="100%"
    >
      <VStack
        role="group"
        align="start"
        spacing={0}
        bg="white"
        borderRadius="2xl"
        border="3px solid"
        borderColor="gray.200"
        overflow="hidden"
        transition="all 0.3s ease"
        h="100%"
        position="relative"
        _hover={{
          transform: { base: 'none', md: 'translateY(-8px)' },
          borderColor: 'red.500',
          boxShadow: {
            base: 'none',
            md: '0 20px 40px rgba(239, 68, 68, 0.15)',
          },
        }}
      >
        {/* Background gradient effect on hover */}
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgGradient="radial(circle at top right, rgba(239, 68, 68, 0.05), transparent 60%)"
          opacity={0}
          transition="opacity 0.3s"
          _groupHover={{ opacity: 1 }}
          pointerEvents="none"
          zIndex={0}
        />

        {/* Icon Section */}
        <Box
          w="100%"
          px={{ base: 5, sm: 6, md: 7 }}
          pt={{ base: 6, md: 7 }}
          pb={{ base: 4, md: 5 }}
          position="relative"
          zIndex={1}
        >
          <Flex
            w={{ base: '64px', md: '72px' }}
            h={{ base: '64px', md: '72px' }}
            borderRadius="xl"
            bg="black"
            align="center"
            justify="center"
            position="relative"
            transition="all 0.3s ease"
            _groupHover={{
              bg: 'red.500',
              transform: { base: 'none', md: 'rotate(-5deg) scale(1.05)' },
            }}
          >
            <Icon as={icon} boxSize={{ base: 7, md: 8 }} color="white" />

            {/* Glow effect */}
            <Box
              position="absolute"
              inset={-2}
              borderRadius="xl"
              bg="red.500"
              opacity={0}
              filter="blur(20px)"
              transition="opacity 0.3s"
              _groupHover={{ opacity: 0.4 }}
            />
          </Flex>
        </Box>

        {/* Content Section */}
        <VStack
          align="start"
          spacing={4}
          px={{ base: 5, sm: 6, md: 7 }}
          pb={{ base: 6, md: 7 }}
          w="100%"
          flex="1"
          position="relative"
          zIndex={1}
        >
          <Heading
            as="h3"
            fontSize={{ base: 'lg', md: '2xl' }}
            lineHeight="1.2"
            fontWeight="800"
            letterSpacing="-0.02em"
            color="black"
          >
            {title}
          </Heading>

          <Text
            color="gray.600"
            fontSize={{ base: 'sm', md: 'lg' }}
            lineHeight="1.7"
            flex="1"
          >
            {description}
          </Text>

          {/* Animated arrow indicator */}
          <HStack
            spacing={2}
            color="gray.400"
            transition="all 0.3s"
            _groupHover={{
              color: 'red.500',
              transform: 'translateX(4px)',
            }}
          >
            <Text
              fontSize="sm"
              fontWeight="700"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Verifikovano
            </Text>
            <Icon as={GrCheckmark} boxSize={4} />
          </HStack>
        </VStack>

        {/* Bottom accent bar */}
        <Box
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          h="4px"
          bg="gray.100"
          overflow="hidden"
        >
          <Box
            h="100%"
            bg="red.500"
            w="0%"
            transition="width 0.5s ease"
            _groupHover={{ w: '100%' }}
          />
        </Box>
      </VStack>
    </MotionBox>
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
        'Plaćaš tek kada klip isporuči stvarne preglede i engagement - ti si u Kontroli svojih reklama a ne neki nevidljivi algoritmi.',
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
      title: 'Masivna Distribucija',
      icon: LayersIcon,
      description:
        'Clipify optimizuje tvoj sadržaj za TikTok, IG Reels i (uskoro) YT Shorts - automatski prilagođen svakom algoritmu i formatu.',
    },
  ];

  return (
    <Box as="section" bg="gray.200" color="black" py={{ base: 16, md: 24 }}>
      <Container maxW="7xl">
        <Box
          width={{ base: '90%', md: '75%' }}
          textAlign="center"
          mx="auto"
        >
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

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
          gap={6}
          gridAutoRows="1fr"
        >
          {features.map((f, i) => (
            <MotionGridItem
              key={f.title}
              h="100%"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <FeatureCard
                icon={f.icon}
                title={f.title}
                description={f.description}
                index={i}
                key={i}
              />
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
      name: 'Povećaj Prodaju',
      tag: 'PRODAJA',
      features: [
        'Kampanja optimizovana za rast prodaje',
        'Pristup našem Dashboard-u',
        'Nedeljni izvestaji + 24/7 support',
        'Organski rast engagementa',
        'Garancija Rezultata',
      ],
    },
    {
      name: 'Povećaj Vidljivost',
      tag: 'VIRALNOST',
      features: [
        'Kampanja fokusirana na rast pregleda',
        'Pristup našem Dashboard-u',
        'Nedeljni izvestaji + 24/7 support',
        'Organski rast engagementa',
        'Garancija Rezultata',
      ],
      highlight: true,
    },
    {
      name: 'Paket po želji',
      tag: 'CUSTOM',
      features: [
        'Sve po Dogovoru',
      ],
      enterprise: true,
    },
  ];

  return (
    <Flex
      id="plans"
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
        <VStack spacing={{ base: 12, md: 24 }} h="full" justify="center">
          {/* Header matching the image style */}
          <VStack spacing={3}>
            <Heading
              fontSize={{ base: '32px', sm: '48px', md: '72px' }}
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
                bgGradient='linear(to-r, rgba(252, 165, 165, 0.9), rgba(252, 165, 165, 0.5), rgba(252, 165, 165, 0.2), rgba(252, 165, 165, 0.0))'
                borderLeft="8px"
                borderColor="red.500"
              >
                Planovi
              </Box>
            </Heading>
            <Text
              fontSize={{ base: '14px', md: '20px' }}
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
                      p={{ base: 5, md: 6 }}
                      spacing={4}
                      h="full"
                      position="relative"
                      transition="all 0.3s"
                      color="gray.700"
                      overflow="hidden"
                      _hover={{
                        transform: { base: 'none', md: 'translateY(-4px)' },
                        borderColor: 'gray.300',
                        boxShadow: {
                          base: 'none',
                          md: '0 10px 30px rgba(0,0,0,0.05)',
                        },
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
                        fontSize={{ base: '2xl', md: '3xl' }}
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
                            <Text
                              fontSize={{ base: 'xs', md: 'sm' }}
                              fontWeight="700"
                              noOfLines={1}
                            >
                              {feature}
                            </Text>
                          </HStack>
                        ))}
                      </VStack>

                      <VStack spacing={3} w="full">
                        <Heading
                          fontSize={{ base: 'md', md: 'lg' }}
                          fontWeight="900"
                          letterSpacing="-0.02em"
                          color="gray.700"
                        >
                          Kontaktiraj nas za cenu
                        </Heading>
                        <Button
                          as="a"
                          href="https://cal.com/petarnovakovic/"
                          target="_blank"
                          rel="noopener noreferrer"
                          w="full"
                          size={{ base: 'md', md: 'lg' }}
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
                          Zakaži Konsultacije
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
                        p={{ base: 5, md: 6 }}
                        spacing={4}
                        h="full"
                        position="relative"
                        transition="all 0.3s"
                        color="white"
                        overflow="hidden"
                        _hover={{
                          transform: { base: 'none', md: 'translateY(-8px)' },
                          boxShadow: {
                            base: 'none',
                            md: '0 20px 40px rgba(239, 68, 68, 0.4)',
                          },
                        }}
                        _before={{
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          right: 0,
                          w: '200px',
                          h: '200px',
                          bgGradient:
                            'radial(circle, rgba(239, 68, 68, 0.15), transparent 70%)',
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
                          fontSize={{ base: '2xl', md: '3xl' }}
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
                              <Text
                                fontSize={{ base: 'xs', md: 'sm' }}
                                fontWeight="600"
                                noOfLines={1}
                              >
                                {feature}
                              </Text>
                            </HStack>
                          ))}
                        </VStack>

                        <VStack spacing={3} w="full">
                          <Heading
                            fontSize={{ base: 'md', md: 'lg' }}
                            fontWeight="900"
                            letterSpacing="-0.02em"
                          >
                            Kontaktiraj nas za cenu
                          </Heading>
                          <Button
                            as="a"
                            href="https://cal.com/petarnovakovic/"
                            target="_blank"
                            rel="noopener noreferrer"
                            w="full"
                            size={{ base: 'md', md: 'lg' }}
                            bg="red.500"
                            color="white"
                            borderRadius="xl"
                            fontWeight="800"
                            border="1px solid"
                            borderColor="red.200"
                            _hover={{
                              transform: 'scale(1.05)',
                            }}
                            transition="all 0.2s"
                          >
                            Zakaži Konsultacije
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
                    p={{ base: 5, md: 6 }}
                    spacing={4}
                    h="full"
                    position="relative"
                    transition="all 0.3s"
                    color="white"
                    overflow="hidden"
                    _hover={{
                      transform: { base: 'none', md: 'translateY(-4px)' },
                      borderColor: 'gray.500',
                      boxShadow: {
                        base: 'none',
                        md: '0 15px 40px rgba(0,0,0,0.25)',
                      },
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
                      fontSize={{ base: '2xl', md: '3xl' }}
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
                          <Text
                            fontSize={{ base: 'xs', md: 'sm' }}
                            fontWeight="700"
                            noOfLines={1}
                          >
                            {feature}
                          </Text>
                        </HStack>
                      ))}
                    </VStack>

                    <VStack spacing={3} w="full">
                      <Heading
                        fontSize={{ base: 'md', md: 'lg' }}
                        fontWeight="900"
                        letterSpacing="-0.02em"
                      >
                        Kontaktiraj nas za cenu
                      </Heading>
                      <Button
                        as="a"
                        href="https://cal.com/petarnovakovic/"
                        target="_blank"
                        rel="noopener noreferrer"
                        w="full"
                        size={{ base: 'md', md: 'lg' }}
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
                        Zakaži Konsultacije
                      </Button>
                    </VStack>
                  </VStack>
                </MotionBox>
              );
            })}
          </Grid>

          {/* Bottom CTA */}
          <HStack
            spacing={{ base: 3, md: 4 }}
            bg="gray.50"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="xl"
            p={{ base: 6, md: 8 }}
            maxW="4xl"
            w="full"
            transition="all 0.3s"
            flexDirection={{ base: 'column', md: 'row' }}
            _hover={{
              transform: { base: 'none', md: 'translateY(-8px)' },
            }}
          >
            <Box flex="1">
              <Text
                fontSize={{ base: 'lg', md: 'xl' }}
                fontWeight="800"
                mb={1}
                color="black"
              >
                Nisi siguran šta ti treba?
              </Text>
              <Text fontSize="sm" color="gray.600">
                Besplatna konsultacija - Odgovor za 24h
              </Text>
            </Box>
            <Button
              size={{ base: 'md', md: 'lg' }}
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
              w={{ base: 'full', md: 'auto' }}
              flexShrink={0}
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#kontakt')?.scrollIntoView({
                  behavior: 'smooth',
                })
              }}
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
      a: 'Pridruži se našoj Discord zajednici gde možeš dobiti pristup novim kampanjama. Nakon povezivanja Discord naloga sa sajtom i povezivanja društvenih mreža, možeš da klipuješ odmah.',
    },
    {
      q: 'Kako funkcioniše plaćanje?',
      a: 'Zarađuješ po svojim performansama - za stvarne preglede i engagement. Isplate se vrše na kraju kampanje putem crypta.',
    },
    {
      q: 'Da li mogu učestvovati u više kampanja odjednom?',
      a: 'Da, moguće je pridružiti se svim dostupnim kampanjama i raditi paralelno na više njih.',
    },
  ];

  const creatorFaqs = [
    {
      q: 'Šta mi je potrebno da bih započeo?',
      a: 'Sve što nam je potrebno je vaš sadržaj i jasna vizija vašeg brenda. Nakon toga, naš tim se bavi kompletnim procesom podešavanja kampanje.',
    },
    {
      q: 'Šta treba da radim tokom kampanje?',
      a: 'Nije potreban nikakav dodatni posao sa vaše strane. Mi upravljamo svime - od izgradnje kampanje do kompletnog upravljanja kliperima (video-editorima).',
    },
    {
      q: 'Šta mogu da očekujem?',
      a: 'Brendirane stranice prilagođene vašim ciljevima, milione organskih pregleda, vaš Dashboard sa svim analitičkim podacima, 24/7 podršku našeg tima i rast društvenih mreža sa novim potencijalnim klijentima.',
    },
  ];

  const FaqColumn = ({
                       title,
                       items,
                       ctaButtonText,
                       ctaButtonLink,
                       accentColor,
                     }: {
    title: string;
    items: { q: string; a: string }[];
    ctaButtonText: string;
    ctaButtonLink: string;
    accentColor: string;
  }) => (
    <Box>
      <Heading
        as="h3"
        fontSize={{ base: 'xl', md: '3xl' }}
        mb={8}
        color="white"
        fontWeight="900"
        letterSpacing="-0.02em"
        position="relative"
        pl={4}
        _before={{
          content: '""',
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '4px',
          height: '70%',
          bg: accentColor,
          borderRadius: 'full',
        }}
      >
        {title}
      </Heading>
      <Accordion allowToggle display="flex" flexDirection="column" gap={4}>
        {items.map((faq, i) => (
          <AccordionItem
            key={i}
            border="2px solid"
            borderColor="whiteAlpha.200"
            borderRadius="xl"
            overflow="hidden"
            bg="whiteAlpha.50"
            flex="1"
            transition="all 0.3s ease"
            _hover={{
              borderColor: accentColor,
              bg: 'whiteAlpha.100',
              transform: { base: 'none', md: 'translateX(4px)' },
            }}
          >
            {({ isExpanded }) => (
              <>
                <h2>
                  <AccordionButton
                    _expanded={{ bg: 'whiteAlpha.100' }}
                    p={{ base: 4, md: 6 }}
                    justifyContent="space-between"
                    alignItems="center"
                    _hover={{ bg: 'whiteAlpha.100' }}
                  >
                    <Heading
                      size={{ base: 'xs', md: 'sm' }}
                      color="white"
                      fontWeight="700"
                      letterSpacing="-0.01em"
                      textAlign="left"
                      pr={4}
                    >
                      {faq.q}
                    </Heading>
                    <Flex
                      w="32px"
                      h="32px"
                      borderRadius="md"
                      bg={isExpanded ? accentColor : 'whiteAlpha.200'}
                      align="center"
                      justify="center"
                      flexShrink={0}
                      transition="all 0.3s ease"
                    >
                      <Box
                        as="span"
                        fontSize="xl"
                        lineHeight="1"
                        color="white"
                        fontWeight="bold"
                        transform={
                          isExpanded ? 'rotate(45deg)' : 'rotate(0deg)'
                        }
                        transition="transform 0.3s ease"
                      >
                        +
                      </Box>
                    </Flex>
                  </AccordionButton>
                </h2>
                <AccordionPanel
                  px={{ base: 4, md: 6 }}
                  pb={{ base: 4, md: 6 }}
                  pt={2}
                  color="gray.300"
                  fontSize={{ base: 'sm', md: 'md' }}
                  lineHeight="1.8"
                >
                  {faq.a}
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        ))}
      </Accordion>
      <Flex justify="center" mt={10}>
        <Button
          as="a"
          href={ctaButtonLink}
          target={ctaButtonText.includes('Discord') ? '_blank' : undefined}
          rel={
            ctaButtonText.includes('Discord') ? 'noopener noreferrer' : undefined
          }
          size={{ base: 'md', md: 'lg' }}
          w={{ base: 'full', md: '85%' }}
          bg="white"
          color="black"
          borderRadius="full"
          px={{ base: 6, md: 10 }}
          py={{ base: 6, md: 8 }}
          fontSize={{ base: 'md', md: 'lg' }}
          fontWeight="700"
          boxShadow="0px 8px 24px rgba(255,255,255,0.15)"
          leftIcon={
            ctaButtonText.includes('Discord') ? (
              <FaDiscord size={22} />
            ) : (
              <Calendar size={20} />
            )
          }
          _hover={{
            bg: accentColor,
            color: 'white',
            transform: 'translateY(-4px)',
            boxShadow: `0px 12px 32px ${
              accentColor === 'red.500'
                ? 'rgba(239, 68, 68, 0.4)'
                : 'rgba(114, 137, 218, 0.4)'
            }`,
          }}
          transition="all 0.3s ease"
          onClick={(e) => {
            if (ctaButtonLink.startsWith('#')) {
              e.preventDefault();
              document.querySelector(ctaButtonLink)?.scrollIntoView({
                behavior: 'smooth',
              });
            }
          }}
        >
          {ctaButtonText}
        </Button>
      </Flex>
    </Box>
  );

  return (
    <Flex
      id="faq"
      align="center"
      minH="80vh"
      as="section"
      bg="gray.900"
      color="white"
      py={{ base: 20, md: 28 }}
      position="relative"
      overflow="hidden"
    >
      {/* Background accents */}
      <Box
        position="absolute"
        top="20%"
        left="-10%"
        w="500px"
        h="500px"
        borderRadius="full"
        bgGradient="radial(circle, rgba(114, 137, 218, 0.06), transparent 70%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="20%"
        right="-10%"
        w="500px"
        h="500px"
        borderRadius="full"
        bgGradient="radial(circle, rgba(239, 68, 68, 0.08), transparent 70%)"
        pointerEvents="none"
      />

      <Container maxW="7xl" position="relative" zIndex={1}>
        <MotionVStack
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          spacing={4}
          mb={{ base: 12, md: 20 }}
          textAlign="center"
        >
          <Text
            fontSize="sm"
            letterSpacing="0.15em"
            textTransform="uppercase"
            color="gray.500"
            fontWeight="600"
          >
            FAQ
          </Text>
          <Heading
            fontWeight="900"
            letterSpacing="-0.03em"
            fontSize={{ base: '32px', md: '48px', lg: '56px' }}
            color="white"
            lineHeight="1.1"
          >
            Česta{' '}
            <Box as="span" position="relative" zIndex={1}>
              Pitanja
            </Box>
          </Heading>
          <Text
            color="gray.400"
            fontSize={{ base: 'md', md: 'xl' }}
            maxW="2xl"
            lineHeight="1.6"
            px={{ base: 4, md: 0 }}
          >
            Sve što treba da znaš - bilo da kreiraš sadržaj ili klipuješ ga.
          </Text>
        </MotionVStack>

        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          gap={{ base: 10, md: 12 }}
          alignItems="start"
        >
          <MotionBox
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <FaqColumn
              title="Za Klipere"
              items={clipperFaqs}
              ctaButtonText="Pridruži se našem Discordu"
              ctaButtonLink="https://discord.com/invite/clipifyrs"
              accentColor="#7289da" // Discord purple
            />
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <FaqColumn
              title="Za Kreatore"
              items={creatorFaqs}
              ctaButtonText="Zakažite poziv"
              ctaButtonLink="#kontakt"
              accentColor="red.500" // Brand red
            />
          </MotionBox>
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
      color="white"
      position="relative"
      overflow="hidden"
    >
      {/* Subtle background accents */}
      <Box
        position="absolute"
        top="20%"
        left="-10%"
        w="600px"
        h="600px"
        borderRadius="full"
        bgGradient="radial(circle, rgba(255, 255, 255, 0.02), transparent 70%)"
        pointerEvents="none"
      />
      <Box
        position="absolute"
        bottom="10%"
        right="-10%"
        w="500px"
        h="500px"
        borderRadius="full"
        bgGradient="radial(circle, rgba(255, 255, 255, 0.02), transparent 70%)"
        pointerEvents="none"
      />

      <Container maxW="7xl" position="relative" zIndex={1}>
        <MotionVStack
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          spacing={6}
          textAlign="center"
          mb={16}
        >
          <HStack
            bg="whiteAlpha.50"
            border="1px solid"
            borderColor="whiteAlpha.200"
            borderRadius="full"
            px={5}
            py={2}
            fontSize="sm"
            color="white"
            spacing={2}
          >
            <Icon as={MessageSquareIcon} boxSize={4} />
            <Text fontWeight="600">Stupite u kontakt</Text>
          </HStack>
          <Heading
            fontSize={{base: '36px', md: '52px'}}
            fontWeight="900"
            lineHeight="1.05"
            letterSpacing="-0.03em"
            color="white"
          >
            ZAPOČNI SVOJ PUT
            <Box
              as="br"
              display={{ base: "block", md: "none" }}
            />
            <Box
              fontSize={{base: "42px", md: '52px'}}
              as="span"
              position="relative"
              zIndex={1}
              color="white"
              pl="2"
              ml="2"
              bgGradient='linear(to-r, rgba(252, 165, 165, 0.9), rgba(252, 165, 165, 0.5), rgba(252, 165, 165, 0.2), rgba(252, 165, 165, 0.0))'
              borderLeft="8px"
              borderColor="red.500"
            >
              VIRALNOSTI
            </Box>
          </Heading>

          <Text
            color="gray.400"
            fontSize={{ base: 'lg', md: 'xl' }}
            lineHeight={1.5}
            display={{ base: "none", md: "block" }}
          >
            Spremni da pojačate engagement i prodaju na društvenim mrežama kroz
            strateški organski   <Box as="br" display={{ base: 'none', md: 'block' }} /> marketing i profesionalne usluge
            klipovanja kontenta? Zakažite besplatan poziv
            <Box as="br" display={{ base: 'none', md: 'block' }} /> kako bi videli da li možemo ostvariti prave rezultate za vaš
            brend.
          </Text>

          <Text
            color="gray.400"
            fontSize={{ base: 'lg', md: 'xl' }}
            lineHeight={1.5}
            display={{ base: "block", md: "none" }}

          >
            Spremni da pojačate engagement? Zakažite besplatan poziv
            kako bi videli da li možemo ostvariti prave rezultate za vaš
            brend.
          </Text>

          <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacingY={12}
            spacingX={{ base: 0, sm: 8 }}
            pt={4}
            justifyItems="center"
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

            <HStack
              justify="center"
            >
              <Icon as={Check} boxSize={5} />
              <Text>Veruju nam 100+ brendova</Text>
            </HStack>
          </SimpleGrid>
        </MotionVStack>

        {/* --- Schedule a Meeting Card --- */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          mb={{ base: 12, md: 16 }}
        >
          <Box
            bg="gray.900"
            color="white"
            border="3px solid"
            borderColor="white"
            borderRadius="2xl"
            textAlign="center"
            p={{ base: 8, md: 14 }}
            boxShadow="0 20px 60px rgba(255, 255, 255, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)"
            transition="all 0.3s ease"
            _hover={{
              transform: { base: 'none', md: 'translateY(-8px)' },
              boxShadow: {
                base: '0 20px 60px rgba(255, 255, 255, 0.15)',
                md: '0 30px 80px rgba(255, 255, 255, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2)',
              },
              borderColor: 'gray.100',
            }}
            position="relative"
            overflow="hidden"
          >
            {/* Subtle glow effect */}
            <Box
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              bgGradient="radial(circle at top, rgba(255, 255, 255, 0.08), transparent 60%)"
              pointerEvents="none"
            />

            <VStack spacing={5} position="relative" zIndex={1}>
              <Flex
                w={{ base: '60px', md: '72px' }}
                h={{ base: '60px', md: '72px' }}
                borderRadius="xl"
                bg="white"
                align="center"
                justify="center"
              >
                <Icon
                  as={CalendarIcon}
                  boxSize={{ base: 8, md: 10 }}
                  color="black"
                />
              </Flex>
              <Heading size={{ base: 'md', md: 'lg' }} fontWeight="900" color="white">
                Zakažite Besplatan Poziv
              </Heading>
              <Text
                color="gray.400"
                maxW="2xl"
                mx="auto"
                fontSize={{ base: 'sm', md: 'md' }}
                lineHeight="1.7"
              >
                Rezervišite 30-minutni besplatan poziv za više informacija {' '}
                <Box as="br" display={{ base: 'none', md: 'block' }} />
                kako bismo videli da li {' '}
                <Box as="br" display={{ base: 'block', md: 'none' }} />
                možemo da vam pomognemo
              </Text>
              <Button
                as="a"
                href="https://cal.com/petarnovakovic/"
                target="_blank"
                size={{ base: 'md', md: 'lg' }}
                mt={4}
                px={{ base: 6, md: 10 }}
                py={{ base: 6, md: 7 }}
                fontSize={{ base: 'md', md: 'lg' }}
                fontWeight="700"
                borderRadius="full"
                bg="white"
                color="black"
                leftIcon={<Calendar size={20} />}
                _hover={{
                  bg: 'gray.100',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(255, 255, 255, 0.4)',
                }}
                transition="all 0.25s ease"
              >
                Zakaži konsultacije
              </Button>
            </VStack>
          </Box>
        </MotionBox>

        {/* --- LOWER GRID --- */}
        <Grid
          templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
          gap={{ base: 8, md: 10 }}
          mb={{ base: 16, md: 20 }}
        >
          {/* LEFT: Contact */}
          <MotionBox
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box
              bg="gray.900"
              color="white"
              border="2px solid"
              borderColor="whiteAlpha.200"
              borderRadius="2xl"
              p={{ base: 6, md: 10 }}
              boxShadow="0 20px 60px rgba(0,0,0,0.3)"
              transition="all 0.3s ease"
              _hover={{
                transform: { base: 'none', md: 'translateY(-8px)' },
                borderColor: 'whiteAlpha.300',
                boxShadow: {
                  base: '0 20px 60px rgba(0,0,0,0.3)',
                  md: '0 30px 80px rgba(0,0,0,0.4)',
                },
              }}
              h="100%"
            >
              <HStack spacing={2} mb="8">
                <Icon as={MailIcon} boxSize={6} my="auto" color="white" />
                <Heading size={{ base: 'md', md: 'lg' }} my="auto" fontWeight="900">
                  Direktan kontakt
                </Heading>
              </HStack>

              <VStack align="start" spacing={8}>
                {[
                  {
                    icon: MailIcon,
                    label: 'Email',
                    value: 'kontakt@clipify.rs',
                    href: 'mailto:kontakt@clipify.rs',
                  },
                  {
                    icon: Instagram,
                    label: 'Instagram',
                    value: 'Pošalji nam poruku u DM',
                    href: 'https://www.instagram.com/clipify.rs/',
                  },
                  {
                    icon: ClockIcon,
                    label: 'Vreme odgovora',
                    value: 'U roku od 24 sata',
                  },
                ].map((item) => (
                  <HStack key={item.label} spacing={4} align="flex-start">
                    <Flex
                      w={12}
                      h={12}
                      borderRadius="lg"
                      bg="white"
                      border="1px solid"
                      borderColor="whiteAlpha.200"
                      align="center"
                      justify="center"
                      flexShrink={0}
                    >
                      <Icon as={item.icon} boxSize={5} color="black" />
                    </Flex>
                    <Box>
                      <Text
                        color="gray.500"
                        fontSize="sm"
                        fontWeight="600"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        {item.label}
                      </Text>
                      {item.href ? (
                        <Link
                          href={item.href}
                          fontWeight="700"
                          fontSize={{ base: 'md', md: 'lg' }}
                          color="white"
                          _hover={{
                            color: 'gray.300',
                            textDecoration: 'underline',
                          }}
                          transition="color 0.2s"
                        >
                          {item.value}
                        </Link>
                      ) : (
                        <Text
                          fontWeight="700"
                          fontSize={{ base: 'md', md: 'lg' }}
                          color="white"
                        >
                          {item.value}
                        </Text>
                      )}
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </MotionBox>

          {/* RIGHT: Steps */}
          <MotionBox
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Box
              bg="gray.900"
              color="white"
              border="2px solid"
              borderColor="whiteAlpha.200"
              borderRadius="2xl"
              p={{ base: 6, md: 10 }}
              boxShadow="0 20px 60px rgba(0,0,0,0.3)"
              transition="all 0.3s ease"
              _hover={{
                transform: { base: 'none', md: 'translateY(-8px)' },
                borderColor: 'whiteAlpha.300',
                boxShadow: {
                  base: '0 20px 60px rgba(0,0,0,0.3)',
                  md: '0 30px 80px rgba(0,0,0,0.4)',
                },
              }}
              h="100%"
            >
              <Heading size={{ base: 'md', md: 'lg' }} mb={8} fontWeight="900">
                Šta{' '}
                <Box as="span" fontWeight="900" color="white">
                  Dalje?
                </Box>
              </Heading>

              <VStack align="start" spacing={6}>
                {[
                  {
                    num: '1',
                    title: 'Besplatna konsultacija',
                    desc: 'Analiziramo vaše ciljeve i publiku.',
                  },
                  {
                    num: '2',
                    title: 'Razvoj strategije',
                    desc: 'Kreiramo vaš prilagođeni plan kampanje.',
                  },
                  {
                    num: '3',
                    title: 'Pokretanje kampanje',
                    desc: 'Naša mreža klipera počinje sa radom.',
                  },
                  {
                    num: '4',
                    title: 'Praćenje rezultata',
                    desc: 'Merimo i pratimo performanse.',
                  },
                ].map((step) => (
                  <HStack key={step.num} align="flex-start" spacing={4}>
                    <Flex
                      bg="white"
                      color="black"
                      w={10}
                      h={10}
                      align="center"
                      justify="center"
                      borderRadius="lg"
                      fontWeight="900"
                      fontSize="lg"
                      flexShrink={0}
                    >
                      {step.num}
                    </Flex>
                    <Box>
                      <Text
                        fontWeight="700"
                        color="white"
                        fontSize={{ base: 'md', md: 'lg' }}
                        mb={1}
                      >
                        {step.title}
                      </Text>
                      <Text
                        color="gray.400"
                        fontSize={{ base: 'sm', md: 'md' }}
                        lineHeight="1.6"
                      >
                        {step.desc}
                      </Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </Box>
          </MotionBox>
        </Grid>

        {/* Discord CTA */}
        <MotionBox
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Box
            mx="auto"
            w={{ base: '100%', md: '55%' }}
            bg="gray.900"
            color="white"
            border="2px solid"
            borderColor="whiteAlpha.200"
            borderRadius="2xl"
            textAlign="center"
            p={{ base: 8, md: 12 }}
            boxShadow="0 20px 60px rgba(0,0,0,0.3)"
            transition="all 0.3s ease"
            _hover={{
              transform: { base: 'none', md: 'translateY(-8px)' },
              borderColor: '#7289da',
              boxShadow: {
                base: '0 20px 60px rgba(0,0,0,0.3)',
                md: '0 30px 80px rgba(114, 137, 218, 0.2)',
              },
            }}
            position="relative"
            overflow="hidden"
          >
            <VStack spacing={6} position="relative" zIndex={1}>
              <Flex
                w={{ base: '60px', md: '72px' }}
                h={{ base: '60px', md: '72px' }}
                borderRadius="xl"
                bg="#7289da"
                align="center"
                justify="center"
              >
                <Icon
                  as={FaDiscord}
                  boxSize={{ base: 10, md: 12 }}
                  color="white"
                />
              </Flex>

              <Heading
                fontSize={{ base: 'xl', md: '3xl' }}
                fontWeight="900"
                lineHeight="short"
              >
                Želiš da postaneš kliper?
              </Heading>

              <Text
                color="gray.400"
                fontSize={{ base: 'md', md: 'lg' }}
                maxW="2xl"
              >
                Počni da zarađuješ kreirajući viralne klipove za top brendove i
                kreatore.
              </Text>

              <Button
                size={{ base: 'md', md: 'lg' }}
                bg="#7289da"
                color="white"
                borderRadius="full"
                px={{ base: 6, md: 10 }}
                py={{ base: 6, md: 7 }}
                fontWeight="700"
                fontSize={{ base: 'md', md: 'lg' }}
                leftIcon={<FaDiscord size={22} />}
                _hover={{
                  bg: '#5b6eae',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 24px rgba(114, 137, 218, 0.3)',
                }}
                transition="all 0.25s ease"
                as="a"
                href="https://discord.com/invite/clipifyrs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pridružite se našem Discordu
              </Button>
            </VStack>
          </Box>
        </MotionBox>
      </Container>
    </Box>
  );
};

export default Home;