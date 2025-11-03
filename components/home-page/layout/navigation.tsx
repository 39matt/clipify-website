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
          href="/register"
          onClick={(e) => {
            e.preventDefault()
            router.push("/signup")
          }}
          size="md"
          variant="outline"
          colorScheme="primary"
          borderRadius="lg"
          px={6}
          fontWeight="semibold"
          boxShadow="sm"
        >
          Zaradi kao kliper
        </Button>
        <Button
          as="a"
          href="#kontakt"
          size="md"
          colorScheme="primary"
          borderRadius="lg"
          px={6}
          fontWeight="semibold"
          boxShadow="sm"
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#kontakt')?.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }}
        >
          Pokreni svoju kampanju
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