import * as React from "react"
import {
  Box,
  Stack,
  VStack,
  SimpleGrid,
  Heading,
  Text,
  Icon,
  Circle,
  ResponsiveValue,
  useMultiStyleConfig,
  ThemingProps,
  SystemProps,
  Container,
} from '@chakra-ui/react'
import { MotionBox } from '#components/home-page/motion/box'

import {
  SectionTitle,
  SectionTitleProps,
} from "#components/home-page/section"

const Revealer = ({ children, delay }: any) => {
  return (
    <MotionBox
      initial={{ scale: 1, opacity: 0, translateY: '20px' }}
      whileInView={{ scale: 1, opacity: 1, translateY: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        type: 'tween',
        ease: 'easeOut',
        duration: 0.6,
        delay: delay || 0,
      }}
    >
      {children}
    </MotionBox>
  )
}

export interface FeaturesProps
  extends Omit<SectionTitleProps, "title" | "variant">,
    ThemingProps<"Features"> {
  title?: React.ReactNode
  description?: React.ReactNode
  features: Array<FeatureProps>
  columns?: ResponsiveValue<number>
  spacing?: string | number
  aside?: React.ReactChild
  reveal?: React.FC<any>
  iconSize?: SystemProps["boxSize"]
  innerWidth?: SystemProps["maxW"]
}

export interface FeatureProps {
  title?: React.ReactNode
  description?: React.ReactNode
  icon?: any
  iconPosition?: "left" | "top"
  iconSize?: SystemProps["boxSize"]
  ip?: "left" | "top"
  variant?: string
  delay?: number
}

export const BoxFeature: React.FC<FeatureProps> = (props) => {
  const {
    title,
    description,
    icon,
    iconPosition,
    iconSize = 6,
    ip,
    variant,
  } = props

  const styles = useMultiStyleConfig("Feature", { variant })
  const pos = iconPosition || ip
  const direction = pos === "left" ? "row" : "column"

  return (
    <Stack
      sx={styles.container}
      direction={direction}
      p={{ base: 6, md: 8 }}
      borderRadius="2xl"
      bg="rgba(255, 255, 255, 0.06)"
      backdropFilter="blur(14px)"
      border="1px solid"
      borderColor="whiteAlpha.300"
      boxShadow="0 6px 24px rgba(0,0,0,0.2)"
      transition="all 0.3s ease"
      align="center"
      justify="center"
      textAlign="center"
      h={{ base: "160px", md: "180px" }}
      w="100%"
      _hover={{
        transform: "translateY(-8px) scale(1.02)",
        boxShadow: "0 10px 35px rgba(0,0,0,0.3)",
        borderColor: "green.400",
      }}
    >
      {icon && (
        <Circle
          size={{ base: "10", md: "12" }}
          bgGradient="linear(to-br, green.400, teal.300)"
          color="white"
          mb={pos === "top" ? 4 : 0}
          mr={pos === "left" ? 4 : 0}
          shadow="lg"
          flexShrink={0}
        >
          <Icon as={icon} boxSize={iconSize} />
        </Circle>
      )}

      <Box textAlign={pos === "left" ? "left" : "center"} w="100%">
        <Heading
          fontSize={{ base: "xl", md: "2xl" }}
          fontWeight="bold"
          bgGradient="linear(to-r, teal.300, green.400)"
          bgClip="text"
          lineHeight="1.2"
        >
          {title}
        </Heading>
        <Text
          fontSize={{ base: "sm", md: "md" }}
          color="gray.300"
          fontWeight="medium"
          mt={2}
          lineHeight="1.4"
        >
          {description}
        </Text>
      </Box>
    </Stack>
  )
}

export const BoxFeatures: React.FC<FeaturesProps> = (props) => {
  const {
    title,
    description,
    features,
    columns = [1, 2, 4],
    spacing = { base: 4, md: 6, lg: 8 },
    align: alignProp = "center",
    iconSize = 6,
    aside,
    reveal: Wrap = Revealer,
    ...rest
  } = props

  const align = !!aside ? "left" : alignProp
  const ip = align === "left" ? "left" : "top"

  return (
    <Container {...rest} py={{ base: 12, md: 20 }}>
      <Stack direction="row" align="flex-start">
        <VStack flex="1" spacing={[6, null, 12]} alignItems="stretch">
          {(title || description) && (
            <SectionTitle
              title={title}
              description={description}
              align={align}
            />
          )}

          <SimpleGrid
            columns={columns}
            spacing={spacing}
            w="full"
          >
            {features.map((feature, i) => (
              <Wrap key={i} delay={feature.delay}>
                <BoxFeature iconSize={iconSize} {...feature} ip={ip} />
              </Wrap>
            ))}
          </SimpleGrid>
        </VStack>

        {aside && (
          <Box flex="1" p="8">
            {aside}
          </Box>
        )}
      </Stack>
    </Container>
  )
}