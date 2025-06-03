import {
  Box,
  Card,
  CardProps,
  Grid,
  GridItem,
  GridItemProps,
  Heading,
  useTheme,
} from '@chakra-ui/react'
import { transparentize } from '@chakra-ui/theme-tools'
import { motion } from 'framer-motion'

import { Section, SectionProps } from '#components/section'
import { Testimonial, TestimonialProps } from '#components/testimonials'

// Use motion.div instead of motion(GridItem)
const MotionDiv = motion.div

export interface HighlightBoxProps
  extends GridItemProps,
    Omit<CardProps, 'title'> {
  delay?: number
}

import { MotionBox } from '#components/motion/box' // Your existing MotionBox

export const HighlightsItem: React.FC<HighlightBoxProps> = (props) => {
  const { children, title, delay = 0.2, ...rest } = props

  return (
    <GridItem {...rest}>
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
        height="100%"
      >
        <Card
          borderRadius="md"
          p="8"
          flex="1 0"
          alignItems="flex-start"
          overflow="hidden"
          position="relative"
          bg="white"
          _dark={{ bg: 'gray.800' }}
          height="100%"
        >
          {title && (
            <Heading fontSize="3xl" mb="8">
              {title}
            </Heading>
          )}
          {children}
        </Card>
      </MotionBox>
    </GridItem>
  )
}

export const HighlightsTestimonialItem: React.FC<
  HighlightBoxProps & TestimonialProps & { gradient: [string, string] }
> = (props) => {
  const {
    name,
    description,
    avatar,
    children,
    gradient = ['primary.500', 'secondary.500'],
    delay = 0.2,
    ...rest
  } = props
  const theme = useTheme()
  return (
    <HighlightsItem
      justifyContent="center"
      _dark={{ borderColor: 'gray.50' }}
      p="4"
      delay={delay} // Pass delay to HighlightsItem
      {...rest}
    >
      <Box
        bgGradient={`linear(to-br, ${transparentize(
          gradient[0],
          1,
        )(theme)}, ${transparentize(gradient[1], 1)(theme)})`}
        opacity="1"
        position="absolute"
        inset="0px"
        pointerEvents="none"
        zIndex="0"
        _dark={{ opacity: 1, filter: 'blur(50px)' }}
      />
      <Testimonial
        name={name}
        description={
          <Box as="span" color="gray.100">
            {description}
          </Box>
        }
        avatar={avatar}
        border="0"
        bg="transparent"
        boxShadow="none"
        color="gray.50"
        position="relative"
        delay={0}
      >
        {children}
      </Testimonial>
    </HighlightsItem>
  )
}

export const Highlights: React.FC<SectionProps> = (props) => {
  const { children, ...rest } = props

  return (
    <Section
      innerWidth="container.xl"
      position="relative"
      overflow="hidden"
      {...rest}
    >
      <Grid
        templateColumns={{ base: 'repeat(1, 1fr)', md: 'repeat(3, 1fr)' }}
        gap={8}
        position="relative"
      >
        {children}
      </Grid>
    </Section>
  )
}