'use client'
import {
  Box,
  BoxProps,
  Container,
  Flex,
  Heading,
  Link,
  Text,
  VStack,
  HStack,
} from '@chakra-ui/react'
import * as React from 'react'
import { Logo } from '#data/logo'

export interface FooterProps extends BoxProps {}

export const Footer: React.FC<FooterProps> = (props) => {
  const menuItems = [
    { label: 'Servisi', href: '#services' },
    { label: 'Radovi', href: '#case-studies' },
    { label: 'Cene', href: '#pricing' },
    { label: 'Kontaktiraj Nas', href: '#kontakt' },
  ]

  return (
    <Box bg="gray.900" color="white" {...props}>
      <Container maxW="7xl" py={16}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'start', md: 'start' }}
          gap={12}
        >
          {/* Left - Logo */}
          <Box>
            <Logo />
          </Box>

          {/* Right - Menu & Social */}
          <Flex
            direction="column"
            align={{ base: 'start', md: 'end' }}
            gap={8}
          >
            {/* Menu Label */}
            <Text
              fontSize="xs"
              fontWeight="bold"
              color="gray.500"
              textTransform="uppercase"
              letterSpacing="wider"
            >
              Menu
            </Text>

            {/* Menu Items */}
            <VStack
              align={{ base: 'start', md: 'end' }}
              spacing={4}
              fontSize={{ base: 'xl', md: '2xl' }}
            >
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  fontWeight="500"
                  color="white"
                  _hover={{
                    color: 'gray.400',
                    textDecoration: 'none',
                  }}
                  transition="color 0.2s"
                  onClick={(e) => {
                    if (item.href.startsWith('#')) {
                      e.preventDefault()
                      document.querySelector(item.href)?.scrollIntoView({
                        behavior: 'smooth',
                      })
                    }
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </VStack>

            {/* Social */}
            <VStack align={{ base: 'start', md: 'end' }} spacing={3} mt={4}>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="gray.500"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Prati Nas
              </Text>
              <Link
                href="https://instagram.com"
                isExternal
                fontSize="xl"
                fontWeight="500"
                color="white"
                _hover={{ color: 'gray.400' }}
                transition="color 0.2s"
              >
                Instagram
              </Link>
            </VStack>
          </Flex>
        </Flex>

        {/* Copyright */}
        <Box mt={16}>
          <Text fontSize="sm" color="gray.500">
            © {new Date().getFullYear()}, Sva prava zadržana
          </Text>
        </Box>
      </Container>
    </Box>
  )
}