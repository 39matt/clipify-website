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
  Progress,
  Spacer,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react';
import { Property, PropertyList } from '@saas-ui/core';
import { useAuth } from '../../providers/authProvider';
import { useRouter } from 'next/navigation';
import { isUserLinked } from '../../lib/firebase/firestore';
import { useEffect, useState } from 'react';
import { useLayoutContext } from '../layout'

const Profile: NextPage = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [linked, setLinked] = useState<boolean | null>(null);
  const [checkingLinked, setCheckingLinked] = useState(true);
  const { discordUsername } = useLayoutContext()

  // Check if the user is linked when the component mounts
  useEffect(() => {
    const checkLinkedStatus = async () => {
      if (user?.email) {
        setCheckingLinked(true);
        const isLinked = await isUserLinked(user.email);
        setLinked(isLinked);
        setCheckingLinked(false);
      } else {
        setLinked(null);
        setCheckingLinked(false);
      }
    };

    checkLinkedStatus();
  }, [user]);

  const handleLinkDiscord = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (linked) {
      alert(`Korisnik sa emailom "${user?.email}" je već povezao nalog`);
      return;
    }

    localStorage.setItem('userEmail', user?.email!);
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
        <Heading textAlign="center" fontSize="48px">
          User Profile
        </Heading>
      </Box>
      <HStack minW="100%" flex={1} justifyContent="space-around">
        <Card maxW="33%" w="full">
          <CardHeader display="flex" flexDirection="row">
            <Heading size="sm">{discordUsername}</Heading>
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
                label="Billing plan"
                value={<Text fontWeight="bold">Professional</Text>}
              />
              <Property label="Discord" value={
                linked ? "Linked" : "Not linked"
              } textColor={linked ? "green.500" : "red.500"} />
              <Property label="Renewal date" value="01-01-2023" />
              <Property
                label="Users"
                value={
                  <Box flex="1">
                    <Text fontSize="sm">20/100</Text>{' '}
                    <Progress
                      value={20}
                      size="xs"
                      colorScheme="primary"
                      borderRadius="full"
                    />
                  </Box>
                }
              />
              <Property label="Price" value="€1250,-" />
            </PropertyList>
          </CardBody>
        </Card>
        <Card maxW="33%" w="full"></Card>
      </HStack>
    </VStack>
  );
};

export default Profile;