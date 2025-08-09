'use client';
import { NextPage } from 'next';
import {
  AbsoluteCenter,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center, Grid,
  Heading,
  HStack,
  Spacer,
  Spinner, Text,
  VStack,
} from '@chakra-ui/react'
import { Property, PropertyList } from '@saas-ui/core';
import { useEffect, useState } from 'react';
import { useLayoutContext } from '../context';
import EditPaymentInfoCard from '#components/app/EditPaymentInfoCard/EditPaymentInfoCard';
import ChangePasswordCard from '#components/app/ChangePasswordCard/ChangePasswordCard';
import { BoxFeature, BoxFeatures } from '#components/home-page/features/box-features';
import { FeatureProps } from '#components/home-page/features';
import { isUserLinked } from '../../../lib/firebase/firestore/user'

const Profile: NextPage = () => {
  const [linked, setLinked] = useState<boolean | null>(null);
  const [checkingLinked, setCheckingLinked] = useState(false);
  const { user, loading, discordUsername } = useLayoutContext();

  useEffect(() => {
    const checkLinkedStatus = async () => {
      if (discordUsername) {
        setCheckingLinked(true);
        const isLinked = await isUserLinked(discordUsername);
        setLinked(isLinked);
        setCheckingLinked(false);
      } else {
        setLinked(false);
        setCheckingLinked(false);
      }
    };
    if (discordUsername) {
      checkLinkedStatus();
    }
    }, [discordUsername]);

  const handleLinkDiscord = async () => {
    if (!user?.email) {
      return;
    }

    if (linked) {
      alert(`Korisnik sa emailom "${user.email}" je već povezao nalog`);
      return;
    }

    localStorage.setItem('userEmail', user.email);
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
      response_type: 'code',
      scope: 'identify email',
      prompt: 'consent',
    });
    window.location.href = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  };

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner />
      </Center>
    );
  }

  return (
    <VStack minW="full">
      <Box textAlign="center" maxW="2xl">
        <Heading
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="bold"
          bgGradient="linear(to-r, green.400, teal.500)"
          bgClip="text"
          mb={4}
        >
          Korisnički profil
        </Heading>
      </Box>
      <VStack w={{ base: 'full', md: '85%' }} spacing={{ base: 4, md: 8 }}>
        {/* Discord Card */}
        <Card w="full" minH="200px" position="relative" bg="gray.800">
          <CardHeader display="flex" flexDirection={{ base: 'column', md: 'row' }} gap={4}>
            <Heading size="lg">Osnovne informacije</Heading>
            {/* Only show button after checking is done AND user is not linked */}
            {linked === false && !checkingLinked && (
              <Button
                colorScheme="green"
                variant="solid"
                onClick={handleLinkDiscord}
              >
                Link Discord
              </Button>
            )}
          </CardHeader>
          <CardBody>
            <PropertyList>
              <Property
                label="Discord"
                value={
                  checkingLinked
                    ? "Proverava..."
                    : linked
                      ? discordUsername
                      : 'Nije povezan'
                }
                textColor={
                  checkingLinked
                    ? 'gray.500'
                    : linked
                      ? '#5865F2'
                      : 'red.500'
                }
                fontWeight="bold"
              />
              <Property
                label="Email"
                value={user?.email}
                fontWeight="bold"
              />
            </PropertyList>
          </CardBody>

          {/* Optional: Show a subtle loading indicator */}
          {checkingLinked && (
            <Box position="absolute" top={2} right={2}>
              <Spinner size="sm" color="gray.400" />
            </Box>
          )}
        </Card>
        {/* Statistics Card */}
        {/*<Card*/}
        {/*  w="full"*/}
        {/*  bg="gray.800"*/}
        {/*  borderRadius="lg"*/}
        {/*  boxShadow="lg"*/}
        {/*>*/}
        {/*  <CardHeader>*/}
        {/*    <Heading*/}
        {/*      size="lg"*/}
        {/*      mb={4}*/}
        {/*    >*/}
        {/*      Statistike*/}
        {/*    </Heading>*/}
        {/*  </CardHeader>*/}

        {/*  <CardBody>*/}
        {/*    <Grid*/}
        {/*      templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}*/}
        {/*      gap={{ base: 4, md: 6 }}*/}
        {/*    >*/}
        {/*      /!* Video Count *!/*/}
        {/*      <Card*/}
        {/*        bg="gray.700"*/}
        {/*        borderRadius="md"*/}
        {/*        p={4}*/}
        {/*        textAlign="center"*/}
        {/*        transition="all 0.2s"*/}
        {/*        _hover={{*/}
        {/*          bg: "gray.600",*/}
        {/*          transform: "translateY(-2px)"*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        <VStack spacing={2}>*/}
        {/*          <Text fontSize="2xl" color="blue.400" fontWeight="bold">*/}
        {/*            0*/}
        {/*          </Text>*/}
        {/*          <Text fontSize="sm" color="gray.300">*/}
        {/*            Broj videa*/}
        {/*          </Text>*/}
        {/*        </VStack>*/}
        {/*      </Card>*/}

        {/*      /!* Earnings *!/*/}
        {/*      <Card*/}
        {/*        bg="gray.700"*/}
        {/*        borderRadius="md"*/}
        {/*        p={4}*/}
        {/*        textAlign="center"*/}
        {/*        transition="all 0.2s"*/}
        {/*        _hover={{*/}
        {/*          bg: "gray.600",*/}
        {/*          transform: "translateY(-2px)"*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        <VStack spacing={2}>*/}
        {/*          <Text fontSize="2xl" color="green.400" fontWeight="bold">*/}
        {/*            $0*/}
        {/*          </Text>*/}
        {/*          <Text fontSize="sm" color="gray.300">*/}
        {/*            Zarađen novac*/}
        {/*          </Text>*/}
        {/*        </VStack>*/}
        {/*      </Card>*/}

        {/*      /!* Total Views *!/*/}
        {/*      <Card*/}
        {/*        bg="gray.700"*/}
        {/*        borderRadius="md"*/}
        {/*        p={4}*/}
        {/*        textAlign="center"*/}
        {/*        transition="all 0.2s"*/}
        {/*        _hover={{*/}
        {/*          bg: "gray.600",*/}
        {/*          transform: "translateY(-2px)"*/}
        {/*        }}*/}
        {/*      >*/}
        {/*        <VStack spacing={2}>*/}
        {/*          <Text fontSize="2xl" color="yellow.400" fontWeight="bold">*/}
        {/*            0*/}
        {/*          </Text>*/}
        {/*          <Text fontSize="sm" color="gray.300">*/}
        {/*            Ukupan broj pregleda*/}
        {/*          </Text>*/}
        {/*        </VStack>*/}
        {/*      </Card>*/}
        {/*    </Grid>*/}
        {/*  </CardBody>*/}
        {/*</Card>*/}
        {/* Payment Info and Change Password Cards */}
        <HStack
          w="full"
          justifyContent={{ base: 'center', md: 'space-between' }}
          flexDirection={{ base: 'column', md: 'row' }}
          spacing={{ base: 4, md: 8 }}
        >
          <EditPaymentInfoCard discordUsername={discordUsername} />
          <ChangePasswordCard user={user} />
        </HStack>
      </VStack>
    </VStack>
  );
};

export default Profile;