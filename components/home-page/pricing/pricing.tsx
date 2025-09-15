import {
  Box,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  StackProps,
  Text,
  VStack, Divider,
} from '@chakra-ui/react'
import { FiCheck } from 'react-icons/fi'

import React from 'react'

import {
  ButtonLink,
  ButtonLinkProps,
} from '#components/home-page/button-link/button-link'
import { BackgroundGradient } from '#components/home-page/gradients/background-gradient'
import { Section, SectionProps, SectionTitle } from '#components/home-page/section'
import { MotionBox } from '#components/home-page/motion/box'

export interface PricingPlan {
  id: string
  title: React.ReactNode
  description: React.ReactNode
  price: React.ReactNode
  features: Array<PricingFeatureProps | null>
  action: ButtonLinkProps & { label?: string }
  isRecommended?: boolean
}

export interface PricingProps extends SectionProps {
  description: React.ReactNode
  plans: Array<PricingPlan>
}

export const Pricing: React.FC<PricingProps> = (props) => {
  const { children, plans, title, description, ...rest } = props

  return (
    <Section id="kreni" pos="relative" {...rest}>
      <BackgroundGradient height="100%" />
      <Box zIndex="2" pos="relative">
        <SectionTitle title={title} description={description}></SectionTitle>

        <SimpleGrid columns={[1, null, 2]} spacing={4} alignItems="stretch">
          {plans?.map((plan, i) => (
            <MotionBox
              initial={{ scale: 1, opacity: 0, translateY: '20px' }}
              whileInView={{ scale: 1, opacity: 1, translateY: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                type: 'tween',
                ease: 'easeOut',
                duration: 0.6,
                delay: i / 2,
              }}
              key={plan.id}
            >
              <PricingBox
                title={plan.title}
                description={plan.description}
                price={plan.price}
                sx={
                  plan.isRecommended
                    ? {
                      borderColor: "primary.500",
                      _dark: {
                        borderColor: "primary.500",
                        bg: "blackAlpha.300",
                      },
                    }
                    : {}
                }
              >
                <PricingFeatures>
                  {plan.features.map((feature, i) =>
                    feature ? (
                      <PricingFeature key={i} {...feature} />
                    ) : (
                      <br key={i} />
                    )
                  )}
                </PricingFeatures>

                <ButtonLink
                  size="lg"
                  colorScheme="primary"
                  position="relative"
                  overflow="hidden"
                  fontWeight="semibold"
                  px={8}
                  {...plan.action}
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: "-75%",
                    width: "50%",
                    height: "100%",
                    background:
                      "linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0) 100%)",
                    transform: "skewX(-20deg)",
                  }}
                  _hover={{
                    _before: {
                      left: "125%",
                      transition: "left 0.75s ease-in-out",
                    },
                  }}
                >
                  {plan.action.label || "Akcija"}
                </ButtonLink>
              </PricingBox>
            </MotionBox>
          ))}
        </SimpleGrid>
        {children}
      </Box>
    </Section>
  )
}

const PricingFeatures: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  return (
    <VStack
      align="stretch"
      justifyContent="stretch"
      spacing="4"
      mb="8"
      flex="1"
    >
      {children}
    </VStack>
  )
}

export interface PricingFeatureProps {
  title: React.ReactNode
  iconColor?: string
}

const PricingFeature: React.FC<PricingFeatureProps> = (props) => {
  const { title, iconColor = 'primary.500' } = props
  return (
    <HStack>
      <Icon as={FiCheck} color={iconColor} fontSize="3xl" />
      <Text flex="1" fontSize="sm">
        {title}
      </Text>
    </HStack>
  )
}

export interface PricingBoxProps extends Omit<StackProps, 'title'> {
  title: React.ReactNode
  description: React.ReactNode
  price: React.ReactNode
}
const PricingBox: React.FC<PricingBoxProps> = (props) => {
  const { title, description, price, children, ...rest } = props
  return (
    <VStack
      zIndex="2"
      bg="whiteAlpha.600"
      borderRadius="md"
      p="8"
      h="100%"
      alignItems="stretch"
      border="1px solid"
      borderColor="gray.400"
      _dark={{
        bg: "blackAlpha.300",
        borderColor: "gray.800",
      }}
      {...rest}
    >
      {/* Title framed with pill style */}
      <Box
        w="fit-content"
        px="4"
        py="1"
        border="1px solid"
        borderColor="primary.500"
        borderRadius="full"
        fontWeight="light"
        fontSize="sm"
        mb="4"
      >
        {title}
      </Box>

      {/* Description big and bold */}
      <Box textAlign="center" fontSize="2xl" fontWeight="bold" mb="4">
        {description}
      </Box>

      <Divider my="4" />

      {/* Price (if needed as separate emphasis) */}
      {price && (
        <Box textAlign="center" fontSize="3xl" fontWeight="extrabold" mb="4">
          {price}
        </Box>
      )}

      {/* Features + CTA, pushed to bottom */}
      <VStack align="stretch" justify="space-between" flex="1">
        <Box>{children}</Box>
      </VStack>
    </VStack>
  )
}
