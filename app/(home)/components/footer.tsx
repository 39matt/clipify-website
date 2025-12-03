'use client';
import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Link,
  Text,
  HStack,
  Icon,
  VStack,
  Divider,
} from '@chakra-ui/react';
import * as React from 'react';
import { FaDiscord, FaInstagram } from 'react-icons/fa';
import { FaTiktok, FaXTwitter } from 'react-icons/fa6'
import { ArrowRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <Box bg="black" color="white" pt={20} pb={8} borderTop="1px solid" borderColor="whiteAlpha.200">
      <Container maxW="6xl">
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(5, 1fr)',
          }}
          gap={12}
          mb={12}
        >
          <GridItem colSpan={{ base: 1, md: 2 }}>
            <VStack align="start" spacing={6}>
              <Box>
                <Heading size="lg" fontWeight="900" mb={3}>
                  Clipify
                </Heading>
                <Text color="gray.400" fontSize="sm" lineHeight="1.8" maxW="sm">
                  Performance-based platforma koja spaja brendove sa mrežom od{' '}
                  <Text as="span" color="white" fontWeight="600">
                    600+ kreatora
                  </Text>
                  . Pretvori svoj sadržaj u viralne klipove.
                </Text>
              </Box>

              <HStack spacing={3}>
                <Link
                  href="https://discord.com/invite/clipifyrs"
                  isExternal
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w={10}
                  h={10}
                  borderRadius="lg"
                  bg="whiteAlpha.100"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  transition="all 0.2s"
                  _hover={{
                    bg: 'whiteAlpha.200',
                    borderColor: '#7289da',
                    transform: 'translateY(-2px)',
                  }}
                >
                  <Icon as={FaDiscord} boxSize={5} color="white" />
                </Link>
                <Link
                  href="https://www.tiktok.com/@clipify.rs"
                  isExternal
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w={10}
                  h={10}
                  borderRadius="lg"
                  bg="whiteAlpha.100"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  transition="all 0.2s"
                  _hover={{
                    bg: 'whiteAlpha.200',
                    borderColor: 'white',
                    transform: 'translateY(-2px)',
                  }}
                >
                  <Icon as={FaTiktok} boxSize={5} color="white" />
                </Link>
                <Link
                  href="https://www.instagram.com/clipify.rs/"
                  isExternal
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w={10}
                  h={10}
                  borderRadius="lg"
                  bg="whiteAlpha.100"
                  border="1px solid"
                  borderColor="whiteAlpha.200"
                  transition="all 0.2s"
                  _hover={{
                    bg: 'whiteAlpha.200',
                    borderColor: '#E4405F',
                    transform: 'translateY(-2px)',
                  }}
                >
                  <Icon as={FaInstagram} boxSize={5} color="white" />
                </Link>
              </HStack>
            </VStack>
          </GridItem>

          {/* Platform */}
          <GridItem>
            <VStack align="start" spacing={4}>
              <Heading as="h4" fontSize="sm" fontWeight="900" color="gray.300" textTransform="uppercase" letterSpacing="wider">
                Platforma
              </Heading>
              <VStack align="start" spacing={3}>
                <FooterLink href="#how-it-works">Kako funkcioniše</FooterLink>
                <FooterLink href="#case-studies">Case studies</FooterLink>
                <FooterLink href="#faq">FAQ</FooterLink>
              </VStack>
            </VStack>
          </GridItem>

          {/* For Brands */}
          <GridItem>
            <VStack align="start" spacing={4}>
              <Heading as="h4" fontSize="sm" fontWeight="900" color="gray.300" textTransform="uppercase" letterSpacing="wider">
                Za Brendove
              </Heading>
              <VStack align="start" spacing={3}>
                <FooterLink href="#kontakt">Pokreni kampanju</FooterLink>
                <FooterLink href="#plans">Planovi</FooterLink>
                <FooterLink href="#case-studies">Rezultati</FooterLink>
              </VStack>
            </VStack>
          </GridItem>

          {/* For Clippers */}
          <GridItem>
            <VStack align="start" spacing={4}>
              <Heading as="h4" fontSize="sm" fontWeight="900" color="gray.300" textTransform="uppercase" letterSpacing="wider">
                Za Klipere
              </Heading>
              <VStack align="start" spacing={3}>
                <FooterLink href="/signup">Postani kliper</FooterLink>
                <FooterLink href="#faq">Kako zaraditi</FooterLink>
                <FooterLink href="https://discord.com" isExternal>Discord zajednica</FooterLink>
              </VStack>
            </VStack>
          </GridItem>
        </Grid>

        {/* Divider */}
        <Divider borderColor="whiteAlpha.200" />

        {/* Bottom Row */}
        <Flex
          mt={8}
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
          gap={4}
        >
          <Text fontSize="sm" color="gray.500">
            © {new Date().getFullYear()} Clipify. Sva prava zadržana.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

/* Utility link component */
const FooterLink = ({
                      href,
                      children,
                      isExternal = false,
                    }: {
  href: string;
  children: React.ReactNode;
  isExternal?: boolean;
}) => (
  <Link
    href={href}
    isExternal={isExternal}
    color="gray.400"
    fontSize="sm"
    fontWeight="500"
    position="relative"
    _hover={{
      color: 'white',
      textDecoration: 'none',
      _after: {
        width: '100%',
      }
    }}
    _after={{
      content: '""',
      position: 'absolute',
      bottom: '-2px',
      left: 0,
      width: 0,
      height: '1px',
      bg: 'red.500',
      transition: 'width 0.2s ease',
    }}
    transition="color 0.2s"
  >
    {children}
  </Link>
);