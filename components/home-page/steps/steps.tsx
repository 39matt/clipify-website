import React from 'react'
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  Image,
} from '@chakra-ui/react'
import { FallInPlace } from '#components/home-page/motion/fall-in-place'

interface StepItem {
  number: string
  title: string
  description: string
  image: string
  alt: string
}

interface StepsProps {
  title?: string
  description?: string
  steps: StepItem[]
}

const Steps: React.FC<StepsProps> = ({ title, description, steps }) => {
  return (
    <Box bg="gray.900" py={16}>
      <Container maxW="80%" mx="auto">
        {(title || description) && (
          <FallInPlace>
            <VStack spacing={3} textAlign="center" mb={12} w="full">
              {title && (
                <Heading
                  as="h1"
                  fontSize={['28px', '36px', '44px']}
                  bgGradient="linear(to-r, white, #10b981)"
                  bgClip="text"
                  textAlign="center"
                  fontWeight="extrabold"
                >
                  {title}
                </Heading>
              )}
            </VStack>
          </FallInPlace>
        )}

        <VStack spacing={10} w={"full"}>
          {steps.map((step, index) => {
            const isEven = index % 2 === 0
            return (
              <FallInPlace key={index} delay={index * 0.1} w={"full"}>
                <Flex
                  direction={['column', 'column', isEven ? 'row' : 'row-reverse']}
                  gap={[5, 6, 8]}
                  w="full"
                  align="center"
                >
                  {/* Text Content */}
                  <VStack
                    align={['center', 'center', isEven ? 'flex-start' : 'flex-end']}
                    spacing={4}
                    flex="1"
                    textAlign={['center', 'center', isEven ? 'left' : 'right']}
                    w={"full"}
                  >
                    <Box
                      fontSize="72px"
                      fontWeight="bold"
                      color="primary.500"
                      opacity={0.3}
                      lineHeight="1"
                    >
                      {step.number}
                    </Box>

                    <Heading
                      fontSize={['20px', '28px', '36px']}
                      color="white"
                      lineHeight="short"
                    >
                      {step.title}
                    </Heading>

                    <Text
                      fontSize={['14px', '16px', '18px']}
                      color="gray.300"
                      lineHeight="relaxed"
                      maxW={"75%"}
                      w={"full"}
                    >
                      {step.description}
                    </Text>
                  </VStack>

                  {/* Image */}
                  <Box
                    flex="1"
                    maxW={index == 1 ? ['100%', '450px', '550px'] : index == 0 ? ['100%', '350px', '450px'] :['100%', '300px', '400px']}
                    position="relative"
                  >
                    <Box
                      borderRadius="xl"
                      overflow="hidden"
                      bg="rgba(255, 255, 255, 0.05)"
                      backdropFilter="blur(10px)"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      p={3}
                      _hover={{
                        transform: "translateY(-8px)",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                      }}
                      transition="all 0.3s ease"
                    >
                      <Image
                        src={step.image}
                        alt={step.alt}
                        w="100%"
                        h="auto"
                        borderRadius="lg"
                      />
                    </Box>
                  </Box>
                </Flex>
              </FallInPlace>
            )
          })}
        </VStack>
      </Container>
    </Box>
  )
}

export default Steps