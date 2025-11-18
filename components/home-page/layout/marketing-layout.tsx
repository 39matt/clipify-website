'use client'

import { Box, SkipNavContent, SkipNavLink } from '@chakra-ui/react'

import { ReactNode } from 'react'

import {
  AnnouncementBanner,
  AnnouncementBannerProps,
} from '../announcement-banner'
import { Footer, FooterProps } from './footer'
import { Header, HeaderProps } from './header'

interface LayoutProps {
  children: ReactNode
  headerProps?: HeaderProps
  footerProps?: FooterProps
}

export const MarketingLayout: React.FC<LayoutProps> = (props) => {
  const { children, headerProps, footerProps } = props
  return (
    <Box>
      <Header {...headerProps} />
      <Box as="main">
        {children}
      </Box>
      <Footer {...footerProps} />
    </Box>
  )
}
