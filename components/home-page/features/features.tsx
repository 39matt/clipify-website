import * as React from 'react'
import {
  Box,
  Stack,
  VStack,
  SimpleGrid,
  Heading,
  Text,
  Icon,
  ResponsiveValue,
  useMultiStyleConfig,
  ThemingProps,
  SystemProps, Container,
} from '@chakra-ui/react'

import { SectionTitleProps } from '#components/home-page/section'
import { MotionBox } from '#components/home-page/motion/box'

const Revealer = ({ children }: any) => {
  return children
}

export interface FeaturesProps
  extends Omit<SectionTitleProps, 'title' | 'variant'>,
    ThemingProps<'Features'> {
  title?: React.ReactNode
  description?: React.ReactNode
  features: Array<FeatureProps>
  columns?: ResponsiveValue<number>
  spacing?: string | number
  aside?: React.ReactChild
  reveal?: React.FC<any>
  iconSize?: SystemProps['boxSize']
  innerWidth?: SystemProps['maxW']
}

export interface FeatureProps {
  title?: React.ReactNode
  description1?: React.ReactNode
  description2?: React.ReactNode
  icon?: any
  iconPosition?: 'left' | 'top'
  iconSize?: SystemProps['boxSize']
  ip?: 'left' | 'top'
  variant?: string
  delay?: number
}
export const Feature: React.FC<FeatureProps> = (props) => {
  const {
    title,
    description1,
    description2,
    icon,
    iconPosition,
    iconSize = 8,
    ip,
    variant,
    delay = 0
  } = props
  const styles = useMultiStyleConfig('Feature', { variant })

  return (
    <MotionBox
      initial={{ scale: 1, opacity: 0, translateY: '20px' }}
      whileInView={{ scale: 1, opacity: 1, translateY: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        type: 'tween',
        ease: 'easeOut',
        duration: 0.6,
        delay,
      }}
    >
      <Box
        bg="rgba(255, 255, 255, 0.05)"
        borderRadius="xl"
        p={[5, 6, 8]}
        h="full"
        border="1px solid"
        borderColor="rgba(255, 255, 255, 0.1)"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
        transition="all 0.3s ease"
      >
        {icon && (
          <Icon
            as={icon}
            boxSize={10}
            color="white"
            mb={5}
          />
        )}
        <VStack align="stretch" spacing={3} w="100%">
          <Heading
            fontSize={["md", "lg", "xl"]}
            fontWeight="semibold"
            color="white"
            lineHeight="1.3"
            w="100%"
          >
            {title}
          </Heading>
          <Text
            fontSize={["xs", "sm", "md"]}
            color="rgba(255, 255, 255, 0.7)"
            lineHeight="1.6"
            w="100%"
          >
            {description1}
          </Text>
        </VStack>
      </Box>
    </MotionBox>
  )
}

export const Features: React.FC<FeaturesProps> = (props) => {
  const {
    title,
    description,
    features,
    columns = [1, 2, 3],
    spacing = 8,
    align: alignProp = 'center',
    iconSize = 8,
    aside,
    reveal: Wrap = Revealer,
    ...rest
  } = props

  const align = !!aside ? 'left' : alignProp

  return (
    <Box bg="gray.800" w="100vw" position="relative" left="50%" right="50%" marginLeft="-50vw" marginRight="-50vw" pb={24}>
      <Container maxW="container.xl" {...rest}>
        <Stack direction="row" height="full" align="flex-start">
          <VStack flex="1" spacing={[8, null, 12]} alignItems="stretch" w="full">
            {title}

            <SimpleGrid
              columns={columns}
              spacing={spacing}
              w="80%"
              mx={"auto"}
            >
              {features.map((feature, i) => {
                return (
                  <Wrap key={i} delay={feature.delay}>
                    <Feature iconSize={iconSize} {...feature} />
                  </Wrap>
                )
              })}
            </SimpleGrid>
          </VStack>
          {aside && (
            <Box flex="1" p="8">
              {aside}
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  )
}