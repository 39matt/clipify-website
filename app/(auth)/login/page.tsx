'use client';

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Spinner,
  Text,
  VStack,
  HStack,
  Icon,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { PageTransition } from '#components/home-page/motion/page-transition';
import siteConfig from '#data/config';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { firebaseLoginErrorMap } from '../../lib/firebase/errors';
import { useRouter } from 'next/navigation';
import { signIn } from '../../lib/firebase/auth';
import { useAuth } from '../../providers/authProvider';

const Login: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/dashboard/profile');
    }
  }, [user, router]);

  if (authLoading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="green.500" thickness="4px" />
      </Center>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await signIn(email, password);
      setSuccess('Uspešno ste se ulogovali!');
      setTimeout(() => {
        router.push('/dashboard/profile');
      }, 1000);
    } catch (err: any) {
      let code = '';
      if (err.code) {
        code = err.code;
      } else if (err.message) {
        const match = err.message.match(/\(([^)]+)\)/);
        if (match) code = match[1];
      }

      setError(
        firebaseLoginErrorMap[code] || 'Došlo je do greške. Pokušajte ponovo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      direction="column"
      bg="white"
      _dark={{ bg: 'gray.900' }}
      px={{ base: 4, md: 8 }}
      py={{ base: 6, md: 12 }}
      position="relative"
    >
      {/* ✅ Centered logo in upper part of screen */}
      <Flex
        position="absolute"
        top="10%"
        left="50%"
        transform="translateX(-50%)"
        justifyContent="center"
      >
        <NextLink href="/">
          <Box
            as={siteConfig.logo}
            width={{ base: '150px', md: '200px' }}
            mx="auto"
            cursor="pointer"
          />
        </NextLink>
      </Flex>

      {/* ✅ Form perfectly centered in viewport */}
      <Flex flex="1" align="center" justify="center">
        <PageTransition>
          <VStack
            spacing={{ base: 6, md: 8, lg: 9 }}
            align="stretch"
            maxW="900px"
            minW={{base: "auto", md:"400px"}}
            w="full"
          >
            {/* Heading */}
            <VStack spacing={{ base: 2, md: 3, lg: 3 }} align="start">
              <Box>
                <Heading
                  fontSize={{ base: '3xl', md: '4xl', lg: '4xl' }}
                  fontWeight="black"
                  color="gray.900"
                  _dark={{ color: 'white' }}
                  letterSpacing="-0.02em"
                  mb={{ base: 2, md: 2, lg: 3 }}
                >
                  Dobrodošao nazad
                </Heading>
                <Text
                  color="gray.600"
                  _dark={{ color: 'gray.400' }}
                  fontSize={{ base: 'md', md: 'lg', lg: 'lg' }}
                >
                  Uloguj se da nastaviš zaradu
                </Text>
              </Box>
            </VStack>

            {/* Form */}
            <Box as="form" onSubmit={handleLogin}>
              <VStack spacing={{ base: 4, md: 5, lg: 6 }} align="stretch">
                {/* Email field */}
                <VStack spacing={{ base: 2, md: 3, lg: 3 }} align="stretch">
                  <Text
                    fontSize={{ base: 'sm', md: 'sm', lg: 'md' }}
                    fontWeight="600"
                    color="gray.700"
                    _dark={{ color: 'gray.300' }}
                  >
                    Email adresa
                  </Text>
                  <Input
                    type="email"
                    placeholder="tvoj@email.com"
                    size="lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    bg="gray.50"
                    _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
                    border="2px"
                    borderColor="gray.200"
                    _hover={{ borderColor: 'green.300' }}
                    _focus={{
                      borderColor: 'green.500',
                      boxShadow: '0 0 0 3px rgba(72, 187, 120, 0.1)',
                      bg: 'white',
                      _dark: { bg: 'gray.700' },
                    }}
                    borderRadius="xl"
                    height={{ base: '52px', md: '56px', lg: '58px' }}
                    fontSize={{ base: 'md', md: 'md', lg: 'md' }}
                    transition="all 0.2s"
                  />
                </VStack>

                {/* Password field */}
                <VStack spacing={{ base: 2, md: 3, lg: 3 }} align="stretch">
                  <Text
                    fontSize={{ base: 'sm', md: 'sm', lg: 'md' }}
                    fontWeight="600"
                    color="gray.700"
                    _dark={{ color: 'gray.300' }}
                  >
                    Lozinka
                  </Text>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      size="lg"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      bg="gray.50"
                      _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
                      border="2px"
                      borderColor="gray.200"
                      _hover={{ borderColor: 'green.300' }}
                      _focus={{
                        borderColor: 'green.500',
                        boxShadow: '0 0 0 3px rgba(72, 187, 120, 0.1)',
                        bg: 'white',
                        _dark: { bg: 'gray.700' },
                      }}
                      borderRadius="xl"
                      height={{ base: '52px', md: '56px', lg: '58px' }}
                      fontSize={{ base: 'md', md: 'md', lg: 'md' }}
                      transition="all 0.2s"
                      pr="3.5rem"
                    />
                    <InputRightElement
                      height={{ base: '52px', md: '56px', lg: '58px' }}
                    >
                      <IconButton
                        aria-label={
                          showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'
                        }
                        icon={<Icon as={showPassword ? FiEyeOff : FiEye} />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size={{ base: 'sm', md: 'md', lg: 'md' }}
                        color="gray.500"
                        _hover={{ color: 'green.500', bg: 'transparent' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </VStack>

                {/* Error */}
                {error && (
                  <Alert
                    status="error"
                    borderRadius="xl"
                    bg="red.50"
                    _dark={{
                      bg: 'rgba(127, 29, 29, 0.3)',
                      borderColor: 'red.900',
                    }}
                    borderWidth="2px"
                    borderColor="red.200"
                    py={{ base: 3, md: 4, lg: 5 }}
                  >
                    <AlertIcon boxSize={{ base: 4, md: 5, lg: 6 }} />
                    <Text
                      fontSize={{ base: 'sm', md: 'md', lg: 'md' }}
                      fontWeight="medium"
                    >
                      {error}
                    </Text>
                  </Alert>
                )}

                {/* Success */}
                {success && (
                  <Alert
                    status="success"
                    borderRadius="xl"
                    bg="green.50"
                    _dark={{
                      bg: 'rgba(22, 101, 52, 0.3)',
                      borderColor: 'green.900',
                    }}
                    borderWidth="2px"
                    borderColor="green.200"
                    py={{ base: 3, md: 4, lg: 5 }}
                  >
                    <AlertIcon boxSize={{ base: 4, md: 5, lg: 6 }} />
                    <Text
                      fontSize={{ base: 'sm', md: 'md', lg: 'md' }}
                      fontWeight="medium"
                    >
                      {success}
                    </Text>
                  </Alert>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  w="full"
                  bgGradient="linear(to-r, green.500, green.600)"
                  color="white"
                  _hover={{
                    bgGradient: 'linear(to-r, green.600, green.700)',
                    transform: 'translateY(-2px)',
                    shadow: '0 12px 24px rgba(72, 187, 120, 0.4)',
                  }}
                  _active={{ transform: 'translateY(0)' }}
                  height={{ base: '52px', md: '56px', lg: '58px' }}
                  fontSize={{ base: 'md', md: 'md', lg: 'lg' }}
                  fontWeight="bold"
                  borderRadius="xl"
                  transition="all 0.2s"
                  isLoading={loading}
                  loadingText="Prijavljivanje..."
                  boxShadow="0 8px 16px rgba(72, 187, 120, 0.3)"
                  mt={2}
                >
                  Uloguj se
                </Button>
              </VStack>
            </Box>

            {/* Register */}
            <HStack spacing={{ base: 2, md: 2 }} justify="center" pt={{ base: 2, md: 4 }}>
              <Text
                fontSize={{ base: 'md', md: 'sm', lg: 'md' }}
                color="gray.600"
                _dark={{ color: 'gray.400' }}
              >
                Nemaš nalog?
              </Text>
              <NextLink href="/signup" passHref>
                <Text
                  fontSize={{ base: 'md', md: 'sm', lg: 'md' }}
                  fontWeight="bold"
                  color="green.500"
                  cursor="pointer"
                  _hover={{
                    color: 'green.600',
                    textDecoration: 'underline',
                  }}
                >
                  Registracija
                </Text>
              </NextLink>
            </HStack>
          </VStack>
        </PageTransition>
      </Flex>
    </Flex>
  );
};

export default Login;