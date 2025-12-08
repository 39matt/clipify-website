'use client';

import React from 'react';
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  HStack,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Check, Calendar, ArrowLeft, Mail } from 'lucide-react';
import { Global } from '@emotion/react';
import type { NextPage } from 'next';

const MotionBox = motion(Box);
const MotionVStack = motion(VStack);

function DottedBackgroundGlobal() {
  return (
    <Global
      styles={`
        :root {
          --dot-color: rgba(0, 0, 0, 0.06);
          --dot-size: 2px;
          --dot-space: 22px;
        }
        html, body, #__next { height: 100%; }
        body {
          background-color: #ffffff;
          background-image:
            radial-gradient(var(--dot-color) var(--dot-size), transparent var(--dot-size));
          background-size: var(--dot-space) var(--dot-space);
        }
      `}
    />
  );
}

const ReservationConfirmation: NextPage = () => {
  return (
    <>
      <DottedBackgroundGlobal />
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgColor="white"
        sx={{
          backgroundImage: `radial-gradient(rgba(0,0,0,0.06) 2px, transparent 2px)`,
          backgroundSize: '22px 22px',
          backgroundAttachment: 'fixed',
        }}
        color="gray.900"
        overflow="hidden"
        py={{ base: 8, md: 12 }}
      >
        <Container maxW="3xl" px={{ base: 4, md: 6 }}>
          <MotionVStack
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            spacing={{ base: 6, md: 8 }}
            textAlign="center"
          >
            {/* Animated Checkmark */}
            <MotionBox
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
            >
              <Box
                w={{ base: '120px', md: '160px' }}
                h={{ base: '120px', md: '160px' }}
                borderRadius="full"
                bg="black"
                display="flex"
                alignItems="center"
                justifyContent="center"
                position="relative"
                boxShadow="0 20px 60px rgba(0,0,0,0.15)"
                _before={{
                  content: '""',
                  position: 'absolute',
                  inset: '-4px',
                  borderRadius: 'full',
                  padding: '4px',
                  background:
                    'linear-gradient(45deg, rgba(239, 68, 68, 0.5), rgba(0, 0, 0, 0.3))',
                  WebkitMask:
                    'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                }}
              >
                <Icon
                  as={Check}
                  boxSize={{ base: '60px', md: '80px' }}
                  color="white"
                  strokeWidth={3}
                />
              </Box>
            </MotionBox>

            {/* Success Message */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <VStack spacing={3}>
                <Heading
                  fontSize={{ base: '32px', md: '48px', lg: '56px' }}
                  fontWeight="900"
                  fontFamily="Montserrat Variable"
                  lineHeight="1.1"
                  letterSpacing="-0.02em"
                  color="black"
                >
                  Potvrđeno!
                </Heading>

                <Text
                  fontSize={{ base: 'lg', md: '2xl' }}
                  fontWeight="600"
                  color="gray.700"
                >
                  Vaša rezervacija je uspešno zakazana
                </Text>
              </VStack>
            </MotionBox>

            {/* Details Card */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              w="full"
            >
              <Box
                bg="gray.50"
                border="2px solid"
                borderColor="gray.200"
                borderRadius="2xl"
                p={{ base: 6, md: 8 }}
                w="full"
              >
                <VStack spacing={5}>
                  <HStack spacing={3}>
                    <Box
                      w="48px"
                      h="48px"
                      borderRadius="lg"
                      bg="black"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Icon as={Calendar} boxSize={6} color="white" />
                    </Box>
                    <Box textAlign="left">
                      <Text
                        fontSize="sm"
                        color="gray.600"
                        fontWeight="600"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        Šta dalje?
                      </Text>
                      <Text
                        fontSize={{ base: 'md', md: 'lg' }}
                        fontWeight="700"
                        color="black"
                      >
                        Proverite svoj email
                      </Text>
                    </Box>
                  </HStack>

                  <Text
                    color="gray.600"
                    fontSize={{ base: 'sm', md: 'md' }}
                    lineHeight="1.7"
                  >
                    Poslali smo vam potvrdu na email sa svim detaljima o
                    sastanku. Ako ne vidite email, proverite spam folder.
                  </Text>

                  <Box
                    w="full"
                    h="1px"
                    bg="gray.200"
                    my={2}
                  />

                  <HStack
                    spacing={2}
                    color="gray.600"
                    fontSize="sm"
                    flexWrap="wrap"
                    justify="center"
                  >
                    <Icon as={Mail} boxSize={4} />
                    <Text>Odgovor u roku od 24h</Text>
                  </HStack>
                </VStack>
              </Box>
            </MotionBox>

            {/* Action Buttons */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              w="full"
            >
              <VStack spacing={3} w="full">
                <Button
                  as="a"
                  href="/"
                  w="full"
                  size="lg"
                  bg="black"
                  color="white"
                  px={8}
                  py={7}
                  fontSize="lg"
                  fontWeight="700"
                  borderRadius="full"
                  leftIcon={<ArrowLeft size={20} />}
                  _hover={{
                    transform: 'translateY(-2px)',
                    boxShadow: 'xl',
                  }}
                  transition="all 0.2s"
                >
                  Nazad na početnu
                </Button>

                <Text fontSize="sm" color="gray.500">
                  Vidimo se uskoro! 🚀
                </Text>
              </VStack>
            </MotionBox>
          </MotionVStack>
        </Container>
      </Box>
    </>
  );
};

export default ReservationConfirmation;