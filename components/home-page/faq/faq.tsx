import {
  chakra,
  Box,
  Flex,
  Collapse,
  Icon,
  Container,
  Heading,
  VStack,
  Text,
  Card,
  CardHeader,
  CardBody,
  Input,
  Textarea,
  Button,
  Alert,
  AlertIcon,
  HStack,
} from '@chakra-ui/react'
import { SectionProps } from '#components/home-page/section';
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiMail, FiSend } from 'react-icons/fi'
import { Logo } from '#data/logo'
import { useForm, ValidationError } from '@formspree/react'
import Link from 'next/link'

interface FaqProps extends Omit<SectionProps, 'title' | 'children'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  items: { q: React.ReactNode; a: React.ReactNode }[];
}

export const Faq: React.FC<FaqProps> = (props) => {
  const [state, handleSubmit] = useForm("mzzvzkvp");

  return (
    <Box
      w="full"
      position="relative"
      py={20}
      bg="transparent"
    >
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          {/* Header Section */}
          <VStack spacing={4} textAlign="center">
            <Heading
              as="h1"
              fontSize={['28px', '36px', '44px']}
              bgGradient="linear(to-r, #d1fae5, #10b981, #059669)"
              bgClip="text"
              textAlign="center"
              fontWeight="extrabold"
            >
              Pokreni svoju kampanju kroz par sati
            </Heading>

            <Text
              fontSize={['md', 'lg', 'xl']}
              color="white"
              maxW="2xl"
              fontWeight="semibold"
            >
              Popuni formu ispod, pokreni svoju kampanju i povećaj svoju
              vidljivost na društvenim mrežama.
            </Text>
          </VStack>

          <Flex justify="center" w="full"      >
            <Box w="full" maxW="600px">
              <Card
                bg="whiteAlpha.100"
                border="1px solid"
                borderColor="whiteAlpha.200"
                borderRadius="xl"
                overflow="hidden"
                boxShadow="0 20px 40px rgba(0,0,0,0.3)"
              >
                <CardHeader
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  pt={6}
                  pb={6}
                  borderBottom="1px solid"
                  borderColor="whiteAlpha.200"
                >
                  <Logo

                    onClick={() => {}}
                    _hover={{ cursor: "pointer" }}
                    width={{ base: "150px", md: "180px" }}
                  />
                </CardHeader>

                <CardBody p={8}>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={5}>
                      <Box w="full">
                        <Input
                          id="kontakt"
                          name="name"
                          placeholder="Ime i prezime"
                          isRequired
                          size="lg"
                          bg="whiteAlpha.50"
                          border="1px solid"
                          borderColor="whiteAlpha.300"
                          color="white"
                          _placeholder={{ color: "gray.500" }}
                          _hover={{
                            borderColor: "green.500",
                          }}
                          _focus={{
                            borderColor: "green.500",
                            boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                          }}
                        />
                        <ValidationError
                          prefix="Name"
                          field="name"
                          errors={state.errors}
                        />
                      </Box>

                      <Box w="full">
                        <Input
                          name="email"
                          type="email"
                          placeholder="Email"
                          isRequired
                          size="lg"
                          bg="whiteAlpha.50"
                          border="1px solid"
                          borderColor="whiteAlpha.300"
                          color="white"
                          _placeholder={{ color: "gray.500" }}
                          _hover={{
                            borderColor: "green.500",
                          }}
                          _focus={{
                            borderColor: "green.500",
                            boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                          }}
                        />
                        <ValidationError
                          prefix="Email"
                          field="email"
                          errors={state.errors}
                        />
                      </Box>

                      <Box w="full" >
                        <Textarea
                          name="message"
                          placeholder="Ciljevi i detalji kampanje"
                          isRequired
                          size="lg"
                          minH="120px"
                          bg="whiteAlpha.50"
                          border="1px solid"
                          borderColor="whiteAlpha.300"
                          color="white"
                          _placeholder={{ color: "gray.500" }}
                          _hover={{
                            borderColor: "green.500",
                          }}
                          _focus={{
                            borderColor: "green.500",
                            boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
                          }}
                        />
                        <ValidationError
                          prefix="Message"
                          field="message"
                          errors={state.errors}
                        />
                      </Box>

                      <Button
                        id="kontakt2"
                        type="submit"
                        isLoading={state.submitting}
                        w="full"
                        size="lg"
                        h="54px"
                        bg="green.500"
                        color="white"
                        fontSize="lg"
                        fontWeight="semibold"
                        rightIcon={<Icon as={FiSend} boxSize={5} />}
                        _hover={{
                          bg: "green.600",
                        }}
                        _active={{
                          bg: "green.700",
                        }}
                      >
                        Pošalji Poruku
                      </Button>
                    </VStack>

                    {state.succeeded && (
                      <Alert
                        status="success"
                        mt={5}
                        borderRadius="lg"
                        bg="green.900"
                        border="1px solid"
                        borderColor="green.500"
                      >
                        <AlertIcon color="green.400" />
                        <Text color="white" fontWeight="medium">
                          Vaša poruka je uspešno poslata!
                        </Text>
                      </Alert>
                    )}

                    {state.errors?.getFormErrors().length! > 0 && (
                      <Alert
                        status="error"
                        mt={5}
                        borderRadius="lg"
                        bg="red.900"
                        border="1px solid"
                        borderColor="red.500"
                      >
                        <AlertIcon color="red.400" />
                        <Text color="white" fontWeight="medium">
                          Došlo je do greške. Pokušajte ponovo.
                        </Text>
                      </Alert>
                    )}
                  </form>
                </CardBody>
              </Card>
            </Box>
          </Flex>

          {/* Direct Contact Section */}
          <VStack
            spacing={4}
            p={6}
            bg="whiteAlpha.100"
            borderRadius="xl"
            border="1px solid"
            borderColor="whiteAlpha.200"
            maxW="600px"
            mx="auto"
            w="full"
          >
            <Heading size="md" color="white" textAlign="center">
              Ili nas kontaktirajte direktno
            </Heading>

            <Link passHref href="mailto:kontakt@clipify.rs">
              <HStack
                spacing={3}
                p={4}
                bg="whiteAlpha.100"
                borderRadius="lg"
                border="1px solid"
                borderColor="whiteAlpha.200"
                cursor="pointer"
                w="full"
                justify="center"
                _hover={{
                  borderColor: "green.500",
                  bg: "whiteAlpha.200",
                }}
              >
                <Icon as={FiMail} boxSize={5} color="green.400" />
                <Text fontSize="lg" color="white" fontWeight="medium">
                  kontakt@clipify.rs
                </Text>
              </HStack>
            </Link>
          </VStack>
        </VStack>
      </Container>
    </Box>
  );
};

export interface FaqItemProps {
  question: React.ReactNode;
  answer: React.ReactNode;
}

const FaqItem: React.FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Box
      w="full"
      bg="whiteAlpha.100"
      borderRadius="lg"
      border="1px solid"
      borderColor={isOpen ? "green.500" : "whiteAlpha.200"}
      p={6}
      color="white"
      boxShadow="0 10px 20px rgba(0,0,0,0.2)"
      _hover={{
        cursor: 'pointer',
        borderColor: "green.500",
      }}
      onClick={toggle}
      position="relative"
    >
      <Flex justify="space-between" align="center">
        <chakra.dt
          fontWeight="semibold"
          fontSize={["md", "lg"]}
          pr={4}
          color="white"
          flex="1"
        >
          {question}
        </chakra.dt>
        <Box
          bg={isOpen ? "green.500" : "whiteAlpha.200"}
          borderRadius="md"
          w="32px"
          h="32px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexShrink={0}
        >
          <Icon
            as={isOpen ? FiChevronUp : FiChevronDown}
            boxSize={5}
            color={isOpen ? "white" : "gray.400"}
          />
        </Box>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Box
          mt={4}
          pt={4}
          borderTop="1px solid"
          borderColor="whiteAlpha.200"
        >
          <chakra.dd
            fontSize={["sm", "md"]}
            color="gray.300"
            lineHeight="relaxed"
            fontWeight="normal"
          >
            {answer}
          </chakra.dd>
        </Box>
      </Collapse>
    </Box>
  );
};