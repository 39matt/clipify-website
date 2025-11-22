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
  IconButton,
  Image, // Import Image for your logo
} from '@chakra-ui/react';
import * as React from 'react';
import { FaDiscord, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export const Footer: React.FC = () => {
  return (
    <Box bg="black" color="white" pt={20} pb={10}>
      <Container maxW="60%">
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(5, 1fr)',
          }}
          gap={12}
        >
          {/* 1 — Logo and Description */}
          <GridItem colSpan={2} maxW="50%" mx="auto">
            <Flex direction="column" gap={4}>
              {/* Using Image for the logo with grayscale styles */}
              <Text fontSize="3xl" fontWeight="bold" color="white">
                Clipify
              </Text>
              <Text color="gray.400" fontSize="sm" lineHeight="1.7" maxW="sm">
                The performance-based clipping platform connecting brands with
                over <strong>10K+</strong> creators.
              </Text>
              <HStack spacing={2} mt={2}>
                <IconButton
                  as="a"
                  href="https://discord.com" // Replace with actual Discord link
                  aria-label="Discord"
                  icon={<FaDiscord />}
                  bg="white" // White background
                  color="black" // Black icon color
                  borderRadius="full"
                  _hover={{ bg: 'gray.200' }} // Light gray on hover
                  size="sm"
                  minW="32px"
                  h="32px"
                />
                <IconButton
                  as="a"
                  href="https://twitter.com" // Replace with actual X link
                  aria-label="X (Twitter)"
                  icon={<FaXTwitter />}
                  bg="white" // White background
                  color="black" // Black icon color
                  borderRadius="full"
                  _hover={{ bg: 'gray.200' }} // Light gray on hover
                  size="sm"
                  minW="32px"
                  h="32px"
                />
                <IconButton
                  as="a"
                  href="https://instagram.com" // Replace with actual Instagram link
                  aria-label="Instagram"
                  icon={<FaInstagram />}
                  bg="white" // White background
                  color="black" // Black icon color
                  borderRadius="full"
                  _hover={{ bg: 'gray.200' }} // Light gray on hover
                  size="sm"
                  minW="32px"
                  h="32px"
                />
              </HStack>
            </Flex>
          </GridItem>

          {/* 2 — Platform */}
          <GridItem>
            <Heading as="h4" fontSize="md" mb={4} color="white" fontWeight="bold">
              Platform
            </Heading>
            <Flex direction="column" gap={2}>
              <FooterLink href="#how-it-works">How It Works</FooterLink>
              <FooterLink href="#case-studies">Case Studies</FooterLink>
              <FooterLink href="#join">Join Discord</FooterLink>
            </Flex>
          </GridItem>

          {/* 3 — For Brands */}
          <GridItem>
            <Heading as="h4" fontSize="md" mb={4} color="white" fontWeight="bold">
              For Brands
            </Heading>
            <Flex direction="column" gap={2}>
              <FooterLink href="#launch-campaign">Launch Campaign</FooterLink>
              <FooterLink href="#pricing">Pricing</FooterLink>
              <FooterLink href="#results">Results</FooterLink>
            </Flex>
          </GridItem>

          {/* 4 — For Clippers */}
          <GridItem>
            <Heading as="h4" fontSize="md" mb={4} color="white" fontWeight="bold">
              For Clippers
            </Heading>
            <Flex direction="column" gap={2}>
              <FooterLink href="#become">Become a Clipper</FooterLink>
              <FooterLink href="#earn">How to Earn</FooterLink>
              <FooterLink href="#community">Community</FooterLink>
            </Flex>
          </GridItem>
        </Grid>

        {/* Bottom Row */}
        <Flex justify="center" pt={16}>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            © {new Date().getFullYear()} Clipify. All rights reserved.
          </Text>
        </Flex>
      </Container>
    </Box>
  );
};

/* Utility link component for cleaner code */
const FooterLink = ({
                      href,
                      children,
                    }: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link
    href={href}
    color="gray.300"
    fontSize="sm"
    _hover={{ color: 'white', textDecoration: 'none' }}
    transition="color 0.2s"
  >
    {children}
  </Link>
);