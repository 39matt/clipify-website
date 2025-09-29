'use client';

import { Alert, AlertIcon, Box, Card, CardBody, CardHeader, Center, Flex, HStack, Heading, SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import { PasswordForm } from '@saas-ui/auth';
import { PasswordSubmitParams } from '@saas-ui/auth/src/components';
import { Field } from '@saas-ui/react';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';



import { useEffect, useState } from 'react';



import { BackgroundGradient } from '#components/home-page/gradients/background-gradient';
import { PageTransition } from '#components/home-page/motion/page-transition';
import siteConfig from '#data/config';



import { signUp } from '../../lib/firebase/auth';
import { firebaseSignupErrorMap } from '../../lib/firebase/errors';
import { useAuth } from '../../providers/authProvider';
import { Features } from './components/features'


const SignUp: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard/profile');
    }
  }, [user, router]);

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner />
      </Center>
    );
  }

  const handleSignup = async (data: PasswordSubmitParams) => {
    try {
      const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement)?.value;
      const affiliateCode = (document.getElementById('affiliateCode') as HTMLInputElement)?.value;

      if (data.password !== confirmPassword) {
        setError('Lozinka i potvrda lozinke se ne podudaraju.');
        return;
      }
      if (affiliateCode !== "cecko" && affiliateCode?.length > 0) {
        setError('Uneli ste nepostojeći affiliate kod');
        return;
      }

      const response = await fetch(`/api/affiliate/add-count?code=${affiliateCode}`, {
        method:"PUT",
      })
      if(!response.ok) {
        setError('Greška pri verifikaciji koda');
        return;
      }

      await signUp(data.email, data.password);

      setSuccess(
        'Uspešno ste napravili nalog! Proverite vaš mail kako bi ste se verifikovali.',
      )
      setTimeout(() => {
        router.push('/login')
      }, 2000);
    } catch (err: any) {
      let code = ''
      if (err.code) {
        code = err.code
      } else if (err.message) {
        const match = err.message.match(/\(([^)]+)\)/)
        if (match) code = match[1]
      }

      setError(
        firebaseSignupErrorMap[code] || 'Došlo je do greške. Pokušajte ponovo.',
      )
    }
  }

  return (
    <Flex
      direction="column"
      minH="100vh"
      maxH="100vh"
      h="100vh"
      w="100vw"
      overflow="hidden"
      position="relative"
    >
      <BackgroundGradient
        zIndex="-1"
        width={{ base: 'full', lg: '50%' }}
        left="auto"
        right="0"
        borderLeftWidth="1px"
        borderColor="gray.200"
        _dark={{
          borderColor: 'gray.700',
        }}
      />
      <PageTransition h="100%" w="100%">
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          h="100%"
          minH="100vh"
          maxH="100vh"
          alignItems="center"
          spacing={{ base: 8, lg: 0 }}
        >
          <Flex
            direction="column"
            alignItems={{ base: 'center' }}
            px={{ base: 4, md: 12, lg: 20 }}
            py={{ base: 8, lg: 0 }}
          >
            <NextLink href="/" passHref>
              <Box
                as={siteConfig.logo}
                width={{ base: '150px', md: '240px' }}
                mb={{ base: 8, lg: 16 }}
                cursor="pointer"
                mx="auto"
              />
            </NextLink>
            <Features
              display={{ base: 'none', lg: 'flex' }}
              columns={1}
              iconSize={4}
              flex="1"
              py="0"
              ps="0"
              maxW={{ base: '100%', xl: '80%' }}
              features={siteConfig.signup.features.map((feature) => ({
                iconPosition: 'left',
                variant: 'left-icon',
                ...feature,
              }))}
            />
          </Flex>

          <Flex align="center" justify="center" h="100%" flexDirection="column" justifyContent="space-around">
            {/*<Alert status="error" maxW="75%">*/}
            {/*  <AlertIcon/>*/}
            {/*  Trenutno nije moguća registracija, radimo na tome!</Alert>*/}
            <Card maxW="400px" w="full" boxShadow="lg" paddingX="10px" paddingY="5px">
              <CardHeader>
                <Heading size="md" textAlign="center">
                  Napravi nalog na Clipify
                </Heading>
              </CardHeader>
              <CardBody>
                <PasswordForm
                  onSubmit={handleSignup}
                  fields={{
                    submit: {
                      children: 'Kreiraj nalog',
                      // isDisabled: true
                    },
                    email: {
                      isRequired: true,
                    },
                    password: {
                      isRequired: true,
                      label: "Lozinka"
                    }
                  }
                }
                >
                  <Field type="password" id="confirmPassword" name="confirmPassword" label="Potvrdi lozinku" isRequired />
                  <Field type="text" id="affiliateCode" name="affiliateCode" label="Affiliate kod" />

                  {/*<Field name="username" label="Korisničko ime" isRequired />*/}
                  {error && (
                    <Alert status="error">
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert status="success">
                      <AlertIcon />
                      {success}
                    </Alert>
                  )}
                </PasswordForm>
                <HStack spacing="5px" mt="10px">
                  <Text fontSize="14px" textColor="gray.500" display="inline">
                    Već imaš nalog?
                  </Text>
                  <NextLink href="/login" passHref>
                    <Text textColor="white" fontSize="14px">
                      Uloguj se
                    </Text>
                  </NextLink>
                </HStack>
              </CardBody>
            </Card>
          </Flex>
        </SimpleGrid>
      </PageTransition>
    </Flex>
  );
};

export default SignUp;