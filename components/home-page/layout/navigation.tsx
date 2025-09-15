import {
  Button,
  HStack,
  useDisclosure,
  useUpdateEffect,
} from '@chakra-ui/react'
import { usePathname, useRouter } from 'next/navigation'
import * as React from 'react'

import { MobileNavButton } from '#components/home-page/mobile-nav'
import { MobileNavContent } from '#components/home-page/mobile-nav'
import ThemeToggle from './theme-toggle'
const Navigation: React.FC = () => {
  const mobileNav = useDisclosure()
  const router = useRouter()
  const path = usePathname()
  const mobileNavBtnRef = React.useRef<HTMLButtonElement>()

  useUpdateEffect(() => {
    mobileNavBtnRef.current?.focus()
  }, [mobileNav.isOpen])

  return (
    <HStack spacing="4" flexShrink={0}>
      {/* Hide on mobile, show from md+ */}
      <HStack spacing="4" display={{ base: "none", md: "flex" }}>
        <Button
          as="a"
          href="/login"
          onClick={(e) => {
            e.preventDefault()
            router.push("/login")
          }}
          size="lg"
          variant="outline"
          colorScheme="primary"
          borderRadius="lg"
          px={8}
          fontWeight="semibold"
          boxShadow="sm"
        >
          Login
        </Button>

        <Button
          as="a"
          href="/register"
          onClick={(e) => {
            e.preventDefault()
            router.push("/register")
          }}
          size="lg"
          colorScheme="primary"
          borderRadius="lg"
          px={8}
          fontWeight="semibold"
          boxShadow="sm"
        >
          Register
        </Button>
      </HStack>

      <ThemeToggle />

      {/* Always visible on mobile */}
      <MobileNavButton
        ref={mobileNavBtnRef}
        aria-label="Open Menu"
        onClick={mobileNav.onOpen}
      />
      <MobileNavContent
        isOpen={mobileNav.isOpen}
        onClose={mobileNav.onClose}
        router={router}
      />
    </HStack>
  )
}
export default Navigation