'use client';
import { NextPage } from 'next';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center, Grid,
  Heading,
  HStack,
  Spacer,
  Spinner,
  VStack,
} from '@chakra-ui/react'
import { Property, PropertyList } from '@saas-ui/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useLayoutContext } from '../context';
import EditPaymentInfoCard from '#components/app/EditPaymentInfoCard/EditPaymentInfoCard';
import ChangePasswordCard from '#components/app/ChangePasswordCard/ChangePasswordCard';
import { BoxFeature, BoxFeatures } from '#components/home-page/features/box-features';
import { FeatureProps } from '#components/home-page/features';
import { isUserLinked } from '../../../lib/firebase/firestore/user'

const Profile: NextPage = () => {
  const router = useRouter();
  const [linked, setLinked] = useState<boolean | null>(null);
  const [checkingLinked, setCheckingLinked] = useState(true);
  const { user, loading, discordUsername } = useLayoutContext();
  const features: FeatureProps[] = [
    { title: 'Broj videa', description: '0' },
    { title: 'Zarađen novac', description: '0' },
    { title: 'Ukupan broj pregleda', description: '0' },
  ];

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
    checkLinkedStatus();
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

  if (loading || checkingLinked) {
    return (
      <Center minH="100vh">
        <Spinner />
      </Center>
    );
  }

  return (
    <VStack minW="full">
      <Box my={{ base: 4, md: 8 }}>
        <Heading textAlign="center" fontSize={{ base: '32px', md: '48px' }} textColor="green.400">
          Korisnički profil
        </Heading>
      </Box>
      <VStack w={{ base: 'full', md: '85%' }} spacing={{ base: 4, md: 8 }}>
        {/* Discord Card */}
        <Card w="full">
          <CardHeader display="flex" flexDirection={{ base: 'column', md: 'row' }} gap={4}>
            <Heading size="lg">{discordUsername}</Heading>
            <Spacer />
            {!linked && linked !== null && (
              <Button colorScheme="green" variant="solid" onClick={handleLinkDiscord}>
                Link Discord
              </Button>
            )}
          </CardHeader>
          <CardBody>
            <PropertyList>
              <Property
                label="Discord"
                value={linked ? 'Linked' : 'Not linked'}
                textColor={linked ? 'green.500' : 'red.500'}
              />
            </PropertyList>
          </CardBody>
        </Card>

        {/* Statistics Card */}
        <Card w="full">
          <CardHeader display="flex" flexDirection="row">
            <Heading size="lg">Statistike</Heading>
            <Spacer />
          </CardHeader>
          <CardBody>
            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
              gap={{ base: 4, md: 8 }}
            >
              <BoxFeature title="Broj videa" description="0" />
              <BoxFeature title="Zarađen novac" description="0" />
              <BoxFeature title="Ukupan broj pregleda" description="0" />
            </Grid>
          </CardBody>
        </Card>

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