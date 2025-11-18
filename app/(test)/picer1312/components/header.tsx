'use client'
import {
  Box,
  BoxProps,
  Container,
  Flex,
  Button,
  HStack,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  useDisclosure, Text,
} from '@chakra-ui/react'
import { useScroll } from 'framer-motion'
import { Menu } from 'lucide-react'
import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Logo } from '#data/logo'

export interface HeaderProps extends Omit<BoxProps, 'children'> {}

export const Header = (props: HeaderProps) => {
  const ref = React.useRef<HTMLHeadingElement>(null)
  const [y, setY] = React.useState(0)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  const { scrollY } = useScroll()
  React.useEffect(() => {
    return scrollY.on('change', () => setY(scrollY.get()))
  }, [scrollY])

  const menuItems = [
    { label: 'Studije Slučaja', href: '#case-studies' },
    { label: 'Cene', href: '#pricing' },
    { label: 'Zaposli se', href: '/signup' },
  ]

  return (
    <>
      {/* Desktop Header - Top */}
      {/* Desktop Header - Bottom Sticky Pill (visible on white, larger) */}
      <Box
        as="header"
        position="fixed"
        bottom="24px"           // a bit higher from the edge
        left="0"
        right="0"
        zIndex="sticky"
        display={{ base: 'none', md: 'block' }}
        pointerEvents="none"
      >
        <Container maxW="7xl">
          <Flex justify="center">
            <Box
              pointerEvents="auto"
              bg="rgba(255,255,255,0.9)"
              backdropFilter="blur(10px)"
              border="1px solid"
              borderColor="rgba(0,0,0,0.06)"
              boxShadow="0 12px 40px rgba(0,0,0,0.12)"
              borderRadius="full"
              px={{ md: 4, lg: 6 }}
              py={{ md: 2, lg: 3 }}
              minH={{ md: '64px', lg: '72px' }}
              display="flex"
              alignItems="center"
            >
              <HStack spacing={{ md: 1, lg: 2 }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.href}
                    size="lg"
                    fontWeight="700"
                    color="gray.900"
                    px={{ md: 4, lg: 5 }}
                    height={{ md: '48px', lg: '52px' }}
                    borderRadius="full"
                    _hover={{ bg: 'blackAlpha.100' }}
                    _active={{ bg: 'blackAlpha.200' }}
                    onClick={(e) => {
                      e.preventDefault()
                      if (item.href.startsWith('#')) {
                        document.querySelector(item.href)?.scrollIntoView({
                          behavior: 'smooth',
                        })
                      } else {
                        router.push(item.href)
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}

                <Button
                  size="lg"
                  height={{ md: '48px', lg: '52px' }}
                  bg="black"
                  color="white"
                  fontWeight="800"
                  px={{ md: 6, lg: 7 }}
                  borderRadius="full"
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: '0 10px 24px rgba(0,0,0,0.2)',
                    bg: 'black',
                  }}
                  _active={{ transform: 'translateY(0)' }}
                  transition="all 0.2s"
                  onClick={(e) => {
                    e.preventDefault()
                    document.querySelector('#kontakt')?.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }}
                >
                  Zakaži Poziv
                </Button>
              </HStack>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Header - Bottom Sticky */}
      <Box
        as="header"
        bottom="0"
        w="full"
        position="fixed"
        zIndex="sticky"
        bg="rgba(26, 26, 26, 0.95)"
        backdropFilter="blur(10px)"
        borderTopWidth="1px"
        borderColor="whiteAlpha.200"
        display={{ base: 'block', md: 'none' }}
        {...props}
      >
        <Container maxW="full" py={3} px={4}>
          <Flex width="full" align="center" justify="space-between">
            <Logo
              onClick={(e) => {
                if (window.location.pathname === '/') {
                  e.preventDefault()
                  window.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  })
                }
              }}
            />

            <HStack spacing={3}>
              <Button
                size="md"
                bg="white"
                color="black"
                fontWeight="600"
                px={6}
                borderRadius="full"
                fontSize="sm"
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector('#kontakt')?.scrollIntoView({
                    behavior: 'smooth',
                  })
                }}
              >
                Zakaži Poziv
              </Button>

              <IconButton
                aria-label="Open menu"
                icon={<Menu />}
                variant="ghost"
                color="white"
                size="lg"
                onClick={onOpen}
                _hover={{ bg: 'whiteAlpha.200' }}
              />
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Menu Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.900">
          <DrawerCloseButton color="white" size="lg" />
          <DrawerBody pt={20}>
            <VStack spacing={6} align="stretch">
              <Text
                fontSize="xs"
                fontWeight="bold"
                color="gray.500"
                textTransform="uppercase"
                letterSpacing="wider"
              >
                Menu
              </Text>
              {menuItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="lg"
                  fontWeight="600"
                  color="white"
                  justifyContent="flex-start"
                  fontSize="xl"
                  _hover={{ bg: 'whiteAlpha.200' }}
                  onClick={(e) => {
                    e.preventDefault()
                    if (item.href.startsWith('#')) {
                      document.querySelector(item.href)?.scrollIntoView({
                        behavior: 'smooth',
                      })
                    } else {
                      router.push(item.href)
                    }
                    onClose()
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}