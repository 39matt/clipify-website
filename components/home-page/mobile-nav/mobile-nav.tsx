import {
  Box,
  CloseButton,
  Flex,
  HStack,
  IconButton,
  IconButtonProps,
  LinkProps,
  Stack,
  useBreakpointValue,
  useColorModeValue,
  useUpdateEffect,
} from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import useRouteChanged from '#hooks/use-route-changed'
import { usePathname } from 'next/navigation'
import { AiOutlineMenu } from 'react-icons/ai'
import { RemoveScroll } from 'react-remove-scroll'

import * as React from 'react'

import { Logo } from '#components/home-page/layout/logo'
import siteConfig from '#data/config'
import { NextRouter } from 'next/router'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface NavLinkProps extends LinkProps {
  label: string
  href?: string
  isActive?: boolean
}

function NavLink({ href, children, isActive, ...rest }: NavLinkProps) {
  const pathname = usePathname()
  const bgActiveHoverColor = useColorModeValue('gray.100', 'whiteAlpha.100')

  const [, group] = href?.split('/') || []
  isActive = isActive ?? pathname?.includes(group)

  return (
    <Link
      href={href}
      display="inline-flex"
      flex="1"
      minH="40px"
      px="8"
      py="3"
      transition="0.2s all"
      fontWeight={isActive ? 'semibold' : 'medium'}
      borderColor={isActive ? 'green.400' : undefined}
      borderBottomWidth="1px"
      color={isActive ? 'white' : undefined}
      _hover={{
        bg: isActive ? 'green.500' : bgActiveHoverColor,
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}

interface MobileNavContentProps {
  isOpen?: boolean
  onClose: () => void
  router: AppRouterInstance
}

export function MobileNavContent(props: MobileNavContentProps) {
  const isOpen = props.isOpen
  const onClose = props.onClose
  const router = props.router
  const closeBtnRef = React.useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const bgColor = useColorModeValue('whiteAlpha.900', 'blackAlpha.900')

  useRouteChanged(onClose)
  console.log({ isOpen })
  /**
   * Scenario: Menu is open on mobile, and user resizes to desktop/tablet viewport.
   * Result: We'll close the menu
   */
  const showOnBreakpoint = useBreakpointValue({ base: true, lg: false })

  React.useEffect(() => {
    if (showOnBreakpoint == false) {
      onClose()
    }
  }, [showOnBreakpoint, onClose])

  useUpdateEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        closeBtnRef.current?.focus()
      })
    }
  }, [isOpen])

  const handleScrollToSection = (id: string) => {
    const section = document.getElementById(id)
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth', // Smooth scrolling
        block: 'start', // Align to the top of the section
      })
    }
  }

  return (
    <>
      {isOpen && (
        <RemoveScroll forwardProps>
          <Flex
            direction="column"
            w="100%"
            bg={bgColor}
            h="100vh"
            overflow="auto"
            pos="absolute"
            inset="0"
            zIndex="modal"
            pb="8"
            backdropFilter="blur(5px)"
          >
            <Box>
              <Flex justify="space-between" px="8" pt="4" pb="4">
                <Logo />
                <HStack spacing="5">
                  <CloseButton ref={closeBtnRef} onClick={onClose} />
                </HStack>
              </Flex>
              <Stack alignItems="stretch" spacing="0">
                {siteConfig.header.links.map(
                  ({ href, id, label, ...props }, i) => {
                    return (
                      <NavLink
                        href={href || `/`}
                        key={i}
                        onClick={(e) => {
                          e.preventDefault() // Prevent default navigation behavior
                          if (id) {
                            handleScrollToSection(id) // Scroll to the section with the given id
                          } else if (href) {
                            router.push(href) // Navigate to the href if no id is provided
                          }
                        }}
                        {...(props as any)}
                      >
                        {label}
                      </NavLink>
                    )
                  },
                )}
              </Stack>
            </Box>
          </Flex>
        </RemoveScroll>
      )}
    </>
  )
}

export const MobileNavButton = React.forwardRef(
  (props: IconButtonProps, ref: React.Ref<any>) => {
    return (
      <IconButton
        ref={ref}
        display={{ base: 'flex', md: 'none' }}
        fontSize="20px"
        color={useColorModeValue('gray.800', 'inherit')}
        variant="ghost"
        icon={<AiOutlineMenu />}
        {...props}
        aria-label="Open menu"
      />
    )
  },
)

MobileNavButton.displayName = 'MobileNavButton'
