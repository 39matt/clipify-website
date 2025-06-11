import { Box, Flex, Heading, VisuallyHidden } from '@chakra-ui/react'
import { Link } from '@saas-ui/react'

import * as React from 'react'

import siteConfig from '#data/config'

export interface LogoProps {
  href?: string
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export const Logo = ({ href = '/', onClick }: LogoProps) => {
  let logo
  if (siteConfig.logo) {
    logo = <Box as={siteConfig.logo} height="48px" mt="-4px" rounded="full" />
  } else {
    logo = (
      <Heading as="h1" size="md">
        {siteConfig.seo?.title}
      </Heading>
    )
  }

  return (
    <Flex h="12" flexShrink="0" alignItems="flex-start">
      <Link
        my={"auto"}
        href={href}
        display="flex"
        p="1"
        borderRadius="sm"
        onClick={onClick}
      >
        {logo}
        <VisuallyHidden>{siteConfig.seo?.title}</VisuallyHidden>
      </Link>
    </Flex>
  )
}
