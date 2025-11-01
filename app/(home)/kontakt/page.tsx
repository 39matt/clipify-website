'use client';

import {
  Alert,
  AlertIcon,
  Card,
  CardBody,
  CardHeader,
  Center,
  HStack,
  Spinner,
  Text,
  Input,
  Textarea,
  Button,
  VStack,
  Heading,
  Box,
  Icon,
  Switch,
  Flex,
} from '@chakra-ui/react';
import { BackgroundGradient } from '#components/home-page/gradients/background-gradient';
import { PageTransition } from '#components/home-page/motion/page-transition';
import { Section } from '#components/home-page/section';
import { Logo } from '#data/logo';
import NextLink from 'next/link';
import { NextPage } from 'next';
import { useState } from 'react';
import { FiMail } from 'react-icons/fi';
import Link from 'next/link';
import { useForm, ValidationError } from '@formspree/react';

const Contact: NextPage = () => {
  // const [role, setRole] = useState<'kliper' | 'klijent'>('kliper');
  const [state, handleSubmit] = useForm("mzzvzkvp");

  return (
    <Section minH="90vh" display="flex" alignItems="center" mx="auto"   pt={{ base: "120px", md: "140px" }}>
      <BackgroundGradient zIndex="-1" />

      <PageTransition width="100%">
        <VStack spacing={8} align="center" mx="auto" w="full" maxW="container.md">
          {/* Heading and Description */}
          <Box textAlign="center">
            <Heading size="lg" mb={4}>
              Kontaktirajte nas
            </Heading>
            <Text fontSize="md" color="gray.500">
              Imate pitanja ili želite da viralizujete vaš sadržaj? Pošaljite nam
              poruku putem forme ispod.
            </Text>
          </Box>

          {/* Contact Form */}
          <Card
            flex="1"
            maxW="600px"
            w="full"
            boxShadow="lg"
            paddingX="10px"
            paddingY="5px"
          >
            <CardHeader
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Logo
                onClick={() => {}}
                _hover={{ cursor: "pointer" }}
                width={{ base: "150px", md: "240px" }}
              />
            </CardHeader>
            <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <Input name="name" placeholder="Ime" isRequired />
                  <ValidationError
                    prefix="Name"
                    field="name"
                    errors={state.errors}
                  />

                  <Input name="email" type="email" placeholder="Email" isRequired />
                  <ValidationError
                    prefix="Email"
                    field="email"
                    errors={state.errors}
                  />

                  <Textarea name="message" placeholder="Poruka" isRequired />
                  <ValidationError
                    prefix="Message"
                    field="message"
                    errors={state.errors}
                  />

                  {/* Checkbox Slider */}
                  {/*<Flex gap={4}>*/}
                  {/*  <Text*/}
                  {/*    fontSize="md"*/}
                  {/*    color={role === "kliper" ? "green.500" : "gray.500"}*/}
                  {/*  >*/}
                  {/*    Kliper*/}
                  {/*  </Text>*/}
                  {/*  <Switch*/}
                  {/*    isChecked={role === "klijent"}*/}
                  {/*    onChange={(e) =>*/}
                  {/*      setRole(e.target.checked ? "klijent" : "kliper")*/}
                  {/*    }*/}
                  {/*    size="lg"*/}
                  {/*    colorScheme="green"*/}
                  {/*  />*/}
                  {/*  <Text*/}
                  {/*    fontSize="md"*/}
                  {/*    color={role === "klijent" ? "green.500" : "gray.500"}*/}
                  {/*  >*/}
                  {/*    Klijent*/}
                  {/*  </Text>*/}
                  {/*</Flex>*/}

                  <Button
                    type="submit"
                    colorScheme="green"
                    isLoading={state.submitting}
                    w="full"
                  >
                    Pošalji
                  </Button>
                </VStack>
                {state.succeeded && (
                  <Alert status="success" mt={4}>
                    <AlertIcon />
                    Vaša poruka je uspešno poslata!
                  </Alert>
                )}
                {state.errors?.getFormErrors().length! > 0 && (
                  <Alert status="error" mt={4}>
                    <AlertIcon />
                    Došlo je do greške. Pokušajte ponovo.
                  </Alert>
                )}
              </form>
            </CardBody>
          </Card>

          {/* Additional Contact Information */}
          <Box textAlign="center">
            <Heading size="md" mb={4}>
              Ili nas kontaktirajte direktno mejlom:
            </Heading>
            <VStack spacing={4}>
              <HStack spacing={4}>
                <Icon as={FiMail} boxSize={6} color="green.500" />
                <Link passHref href={"mailto:kontakt@clipify.rs"}>
                  <Text fontSize="md" color="gray.500">
                    kontakt@clipify.rs
                  </Text>
                </Link>
              </HStack>
            </VStack>
          </Box>
        </VStack>
      </PageTransition>
    </Section>
  );
};

export default Contact;