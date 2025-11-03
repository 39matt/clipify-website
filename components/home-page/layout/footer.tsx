import {
  Box,
  BoxProps,
  Container,
  Flex,
  HStack,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { Link, LinkProps } from '@saas-ui/react'

import siteConfig from '#data/config'

export interface FooterProps extends BoxProps {
  columns?: number
}

export const Footer: React.FC<FooterProps> = (props) => {
  const { columns = 2, ...rest } = props
  const bg = useColorModeValue('whiteAlpha.700', 'rgba(29, 32, 37, 0.7)')

  return (
    <Box
      bg={bg}
      backdropFilter="blur(5px)"
      borderColor="whiteAlpha.100"
      borderTopWidth="1px"
      boxShadow="md"
      {...rest}
    >
      <Container maxW={{base: "full", md:"85%"}} px="8" py="6">
        <SimpleGrid columns={columns}>
          <Stack spacing="8" >
            <Copyright>{siteConfig.footer.copyright}</Copyright>
          </Stack>
          <HStack justify="flex-end" spacing="4" alignSelf="flex-end">
            {siteConfig.footer?.links?.map(({ href, label }) => (
              <FooterLink key={href} href={href}>
                {label}
              </FooterLink>
            ))}
          </HStack>
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export interface CopyrightProps {
  title?: React.ReactNode
  children: React.ReactNode
}

export const Copyright: React.FC<CopyrightProps> = ({
                                                      title,
                                                      children,
                                                    }: CopyrightProps) => {
  let content
  if (title && !children) {
    content = `&copy; ${new Date().getFullYear()} - ${title}`
  }
  return (
    <Text color="muted" fontSize={{base: "lg", md:"2xl"}}>
      {content || children}
    </Text>
  )
}

export const FooterLink: React.FC<LinkProps> = (props) => {
  const { children, ...rest } = props
  return (
    <Link
      color="muted"
      fontSize={{base: "lg", md:"2xl"}}
      textDecoration="none"
      _hover={{
        color: 'white',
        transition: 'color .2s ease-in',
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}