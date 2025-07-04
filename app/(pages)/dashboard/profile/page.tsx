'use client';
import { NextPage } from 'next';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  HStack,
  Spacer,
  Spinner,
  VStack,
} from '@chakra-ui/react';
import { Property, PropertyList } from '@saas-ui/core';
import { useRouter } from 'next/navigation';
import { isUserLinked } from '../../../lib/firebase/firestore'
import { useEffect, useState } from 'react';
import { useLayoutContext } from '../context';
import EditPaymentInfoCard from '#components/app/EditPaymentInfoCard/EditPaymentInfoCard'
import ChangePasswordCard from '#components/app/ChangePasswordCard/ChangePasswordCard'

const Profile: NextPage = () => {
  const router = useRouter();
  const [linked, setLinked] = useState<boolean | null>(null);
  const [checkingLinked, setCheckingLinked] = useState(true);
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
    <VStack>
      <Box my="24px">
        <Heading textAlign="center" fontSize="48px" textColor={"green.400"}>
          Korisnički profil
        </Heading>
      </Box>
      <VStack minW="85%" gap={{ base: 4, lg: 12 }}>
        <HStack w="100%" flex={1} justifyContent={{base: "center",md:"space-between"}} alignItems="flex-start" flexDirection={{base: "column", md: "row"}}>
          <Card maxW={{ base: '100%', md: '50%' }} w="full" h="full">
            <CardHeader display="flex" flexDirection="row">
              <Heading size="lg">{discordUsername}</Heading>
              <Spacer />
              {!linked && (
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
          <Card maxW={{ base: '100%', md: '50%' }} w="full">
            <CardHeader display="flex" flexDirection="row">
              <Heading size="lg">Statistike</Heading>
              <Spacer />
            </CardHeader>
            <CardBody>
              <PropertyList>
                <Property label="Broj videa" value="0" />
                <Property label="Zarađen novac" value="$0" />
                <Property label="Ukupan broj pregleda" value="0" />
              </PropertyList>
            </CardBody>
          </Card>
        </HStack>
        <HStack w="full" justifyContent={{base: "center",md:"space-between"}} flexDirection={{base: "column", md: "row"}}>
          <EditPaymentInfoCard discordUsername={discordUsername}/>
          <ChangePasswordCard user={user}/>
        </HStack>
      </VStack>
    </VStack>
  );
};

export default Profile;