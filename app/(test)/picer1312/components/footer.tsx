'use client'
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
  Divider,
} from '@chakra-ui/react'
import * as React from 'react'
import { Logo } from '#data/logo'
import { FaDiscord, FaTwitter, FaInstagram } from 'react-icons/fa'

export const Footer: React.FC = () => {
  return (
    <Box bg="black" color="white" pt={20} pb={10}>
      <Container maxW="7xl">
        <Grid
          templateColumns={{
            base: '1fr',
            md: 'repeat(4, 1fr)',
          }}
          gap={12}
        >
          {/* 1 — Logo and Description */}
          <GridItem>
            <Flex direction="column" gap={4}>
              <Logo w="120px"/>
              <Text color="gray.400" fontSize="sm" lineHeight="1.7" maxW="sm">
                The performance-based clipping platform connecting brands with
                over <strong>10K+</strong> creators.
              </Text>
              <HStack spacing={4} mt={4}>
                <IconButton
                  as="a"
                  href="https://discord.com"
                  aria-label="Discord"
                  icon={<FaDiscord />}
                  variant="ghost"
                  color="white"
                  _hover={{ color: 'gray.400' }}
                />
                <IconButton
                  as="a"
                  href="https://twitter.com"
                  aria-label="Twitter"
                  icon={<FaTwitter />}
                  variant="ghost"
                  color="white"
                  _hover={{ color: 'gray.400' }}
                />
                <IconButton
                  as="a"
                  href="https://instagram.com"
                  aria-label="Instagram"
                  icon={<FaInstagram />}
                  variant="ghost"
                  color="white"
                  _hover={{ color: 'gray.400' }}
                />
              </HStack>
            </Flex>
          </GridItem>

          {/* 2 — Platform */}
          <GridItem>
            <Heading as="h4" fontSize="md" mb={4} color="whiteAlpha.700">
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
            <Heading as="h4" fontSize="md" mb={4} color="whiteAlpha.700">
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
            <Heading as="h4" fontSize="md" mb={4} color="whiteAlpha.700">
              For Clippers
            </Heading>
            <Flex direction="column" gap={2}>
              <FooterLink href="#become">Become a Clipper</FooterLink>
              <FooterLink href="#earn">How to Earn</FooterLink>
              <FooterLink href="#community">Community</FooterLink>
            </Flex>
          </GridItem>
        </Grid>

        {/* Divider */}
        <Divider
          borderColor="whiteAlpha.200"
          my={10}
        />

        {/* Bottom Row */}
        <Flex justify="center">
          <Text fontSize="sm" color="gray.500" textAlign="center">
            © {new Date().getFullYear()} Clipify. All rights reserved.
          </Text>
        </Flex>
      </Container>
    </Box>
  )
}

/* Utility link component for cleaner code */
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    color="gray.300"
    fontSize="sm"
    _hover={{ color: 'white', textDecoration: 'none' }}
    transition="color 0.2s"
  >
    {children}
  </Link>
)