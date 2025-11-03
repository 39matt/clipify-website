import {
  Box,
  HStack,
  Heading,
  Icon,
  StackProps,
  Text,
  VStack, Container, Flex,
} from '@chakra-ui/react'
import { FiCheck, FiStar, FiZap } from 'react-icons/fi'

import React from 'react'

import {
  ButtonLink,
  ButtonLinkProps,
} from '#components/home-page/button-link/button-link'
import { SectionProps } from '#components/home-page/section'
import { MotionBox } from '#components/home-page/motion/box'

export interface PricingPlan {
  id: string
  title: React.ReactNode
  description1: React.ReactNode
  description2: React.ReactNode
  price: React.ReactNode
  features: Array<PricingFeatureProps | null>
  action: ButtonLinkProps & { label?: string }
  isRecommended?: boolean
  isPopular?: boolean
}

export interface PricingProps extends SectionProps {
  description: React.ReactNode
  plans: Array<PricingPlan>
}

export const Pricing: React.FC<PricingProps> = (props) => {
  const { children, plans, title, description, ...rest } = props

  return (
    <Container id="kreni" pos="relative" {...rest} bgColor="gray.800" maxW="full" w="full" pb={12}>
      {/* Animated background gradient */}
      <Box
        pos="absolute"
        top="0"
        left="0"
        w="full"
        h="full"
        bgGradient="radial(circle at 20% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%), radial(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)"
        opacity="0.6"
        zIndex="0"
      />

      <Box
        pos="absolute"
        top="0"
        left="0"
        w="full"
        h="3px"
        bgGradient="linear(to-r, transparent, #ffffff 20%, #ffffff 80%, transparent)"
        boxShadow="0 0 30px rgba(255, 255, 255, 0.8)"
        zIndex="1"
      />

      <Box zIndex="2" pos="relative" w="full">
        <Flex direction="column" w="full" maxW="full" mx="auto" alignContent="space-around">
          <VStack
            py={[16, 20]}
            alignItems={'center'}
            spacing={6}
            {...rest}
          >
            <Heading
              as="h1"
              fontSize={['32px', '36px', '44px']}
              bgGradient="linear(to-r, white, #10b981)"
              bgClip="text"
              textAlign="center"
              fontWeight="extrabold"
            >
              {title}
            </Heading>
            {description && (
              <Box
                color="gray.300"
                fontSize={['lg', 'xl']}
                textAlign="center"
                maxW="2xl"
              >
                {description}
              </Box>
            )}
          </VStack>

          <Box
            w="full"
            display="grid"
            gap={[16, 0]}
            gridTemplateColumns={["1fr", "1fr", "repeat(2, 1fr)"]}
            maxW={{base: "full", md: "6xl"}}
            mx="auto"
            placeItems="center"
          >
            {plans?.map((plan, i) => (
              <MotionBox
                initial={{ scale: 0.9, opacity: 0, translateY: '40px' }}
                whileInView={{ scale: 1, opacity: 1, translateY: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  type: 'spring',
                  stiffness: 100,
                  damping: 15,
                  delay: i * 0.2,
                }}
                key={plan.id}
                h="100%"
                w="100%"
                display="flex"
                justifyContent="center"
              >
                <PricingBox
                  title={plan.title}
                  description1={plan.description1}
                  description2={plan.description2}
                  price={plan.price}
                  minH={["500px", "550px", "600px"]}
                  w="90%"
                  isRecommended={plan.isRecommended}
                  isPopular={plan.isPopular}
                >
                  <PricingFeatures>
                    {plan.features.map((feature, i) =>
                      feature ? (
                        <PricingFeature key={i} {...feature} />
                      ) : (
                        <Box key={i} h="4" />
                      )
                    )}
                  </PricingFeatures>

                  <ButtonLink
                    w="full"
                    size="lg"
                    colorScheme={plan.isRecommended ? "green" : "gray"}
                    position="relative"
                    overflow="hidden"
                    fontWeight="bold"
                    px={6}
                    py={4}
                    fontSize={["md", "lg"]}
                    whiteSpace="normal"
                    textAlign="center"
                    mt="auto"
                    borderRadius="xl"
                    textTransform="uppercase"
                    letterSpacing="wide"
                    bg={plan.isRecommended
                      ? "linear-gradient(135deg, #10b981, #059669)"
                      : "linear-gradient(135deg, #374151, #4b5563)"
                    }
                    border="2px solid"
                    borderColor={plan.isRecommended ? "#10b981" : "transparent"}
                    boxShadow={plan.isRecommended
                      ? "0 0 30px rgba(16, 185, 129, 0.4)"
                      : "0 8px 25px rgba(0,0,0,0.3)"
                    }
                    _hover={{
                      transform: "translateY(-2px) scale(1.02)",
                      boxShadow: plan.isRecommended
                        ? "0 0 40px rgba(16, 185, 129, 0.6)"
                        : "0 12px 30px rgba(0,0,0,0.4)",
                      bg: plan.isRecommended
                        ? "linear-gradient(135deg, #059669, #047857)"
                        : "linear-gradient(135deg, #4b5563, #6b7280)",
                      _before: {
                        left: "100%",
                        transition: "left 0.6s ease",
                      }
                    }}
                    transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                    {...plan.action}
                    _before={{
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: "-100%",
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
                      transform: "skewX(-25deg)",
                      transition: "left 0.6s ease",
                    }}
                  >
                    {plan.action.label || "Počni odmah"}
                  </ButtonLink>
                </PricingBox>
              </MotionBox>
            ))}
          </Box>
          {children}
        </Flex>
      </Box>

    </Container>
  )
}

const PricingFeatures: React.FC<React.PropsWithChildren<{}>> = ({
                                                                  children,
                                                                }) => {
  return (
    <VStack
      align="stretch"
      justifyContent="flex-start"
      spacing="4"
      mb="8"
      flex="1"
      w="full"
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
  const { title, iconColor = '#10b981' } = props
  return (
    <HStack spacing="4" align="center" w="full">
      <Box
        bg="linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))"
        borderRadius="full"
        p="2"
        border="1px solid"
        borderColor="rgba(16, 185, 129, 0.3)"
        flexShrink={0}
      >
        <Icon
          as={FiCheck}
          color={iconColor}
          fontSize="sm"
          flexShrink={0}
        />
      </Box>
      <Text
        flex="1"
        fontSize={["md", "lg"]}
        lineHeight="1.4"
        color="gray.200"
        fontWeight="medium"
        display="flex"
        alignItems="center"
      >
        {title}
      </Text>
    </HStack>
  )
}
export interface PricingBoxProps extends Omit<StackProps, 'title'> {
  title: React.ReactNode
  description1: React.ReactNode
  description2: React.ReactNode
  price: React.ReactNode
  isRecommended?: boolean
  isPopular?: boolean
}

const PricingBox: React.FC<PricingBoxProps> = (props) => {
  const { title, description1, description2, price, children, isRecommended, isPopular, ...rest } = props

  return (
    <VStack
      zIndex="2"
      bg="rgba(17, 24, 39, 0.8)"
      backdropFilter="blur(20px) saturate(180%)"
      borderRadius="3xl"
      p={[6, 8, 10]}
      h="100%"
      w="100%"
      border="2px solid"
      borderColor={isRecommended ? "#10b981" : "rgba(75, 85, 99, 0.3)"}
      boxShadow={isRecommended
        ? "0 25px 50px rgba(16, 185, 129, 0.15), 0 8px 25px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
        : "0 20px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)"
      }
      _hover={{
        transform: "translateY(-8px) scale(1.02)",
        borderColor: isRecommended ? "#059669" : "#10b981",
        boxShadow: isRecommended
          ? "0 35px 70px rgba(16, 185, 129, 0.25), 0 15px 35px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.15)"
          : "0 30px 60px rgba(16, 185, 129, 0.1), 0 12px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
        bg: "rgba(17, 24, 39, 0.9)",
      }}
      transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      position="relative"
      overflow="hidden"
      {...rest}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <Box
          position="absolute"
          top="-2px"
          left="50%"
          transform="translateX(-50%)"
          bg="linear-gradient(135deg, #10b981, #059669)"
          px="6"
          py="2"
          borderRadius="full"
          fontSize="sm"
          fontWeight="bold"
          color="white"
          textTransform="uppercase"
          letterSpacing="wide"
          boxShadow="0 8px 20px rgba(16, 185, 129, 0.4)"
          zIndex="10"
        >
          <HStack spacing="2">
            <Icon as={FiStar} />
            <Text>Preporučeno</Text>
          </HStack>
        </Box>
      )}

      {/* Popular badge */}
      {isPopular && (
        <Box
          position="absolute"
          top="6"
          right="6"
          bg="linear-gradient(135deg, #f59e0b, #d97706)"
          px="3"
          py="1"
          borderRadius="full"
          fontSize="xs"
          fontWeight="bold"
          color="white"
          textTransform="uppercase"
          letterSpacing="wide"
          zIndex="10"
        >
          <HStack spacing="1">
            <Icon as={FiZap} fontSize="xs" />
            <Text>Popularno</Text>
          </HStack>
        </Box>
      )}

      {/* Glowing border effect */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        bottom="0"
        borderRadius="3xl"
        bg="linear-gradient(135deg, rgba(16, 185, 129, 0.1), transparent, rgba(59, 130, 246, 0.1))"
        opacity={isRecommended ? "1" : "0.5"}
        zIndex="-1"
      />

      <Box
        as="span"
        w="fit-content"
        px={[4, 6]}
        py="3"
        mb={isRecommended ? "8" : "6"}
        mt={isRecommended ? "4" : "0"}
        border="2px solid"
        borderColor={isRecommended ? "#10b981" : "rgba(75, 85, 99, 0.5)"}
        borderRadius="2xl"
        fontWeight="bold"
        fontSize={["md", "lg"]}
        lineHeight="1"
        color="white"
        bg={isRecommended
          ? "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))"
          : "rgba(55, 65, 81, 0.5)"
        }
        backdropFilter="blur(10px)"
        boxShadow={isRecommended
          ? "0 8px 25px rgba(16, 185, 129, 0.3)"
          : "0 8px 20px rgba(0,0,0,0.3)"
        }
        position="relative"
        zIndex={2}
        textTransform="uppercase"
        letterSpacing="wide"
      >
        {title}
      </Box>

      <VStack spacing="2" w="full" mb="6">
        <Text
          textAlign="center"
          fontSize={["2xl", "3xl", "4xl"]}
          fontWeight="bold"
          w="full"
          color="gray.200"
          lineHeight="1.2"
        >
          {description1}
        </Text>
        <Text
          textAlign="center"
          fontSize={["xl", "2xl", "3xl"]}
          fontWeight="bold"
          w="full"
          bgGradient="linear(to-r, #10b981, #34d399)"
          bgClip="text"
          lineHeight="1.2"
        >
          {description2}
        </Text>
      </VStack>

      {/* Animated divider */}
      <Box
        w="full"
        h="2px"
        my="6"
        position="relative"
        borderRadius="full"
        bg="linear-gradient(90deg, transparent, #10b981, transparent)"
        boxShadow="0 0 10px rgba(16, 185, 129, 0.5)"
      />

      {price && (
        <Box
          textAlign="center"
          fontSize={["3xl", "4xl", "5xl"]}
          fontWeight="black"
          mb="8"
          w="full"
          minH="80px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgGradient="linear(to-r, #10b981, #34d399, #6ee7b7)"
          bgClip="text"
          position="relative"
          zIndex={2}
          textShadow="0 0 30px rgba(16, 185, 129, 0.5)"
          _hover={{
            transform: "scale(1.05)",
          }}
          transition="all 0.3s ease"
        >
          {price}
        </Box>
      )}

      <VStack
        align="stretch"
        justify="space-between"
        flex="1"
        spacing="6"
        w="full"
        position="relative"
        zIndex={2}
      >
        {children}
      </VStack>
    </VStack>
  )
}