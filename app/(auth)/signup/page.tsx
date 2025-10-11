'use client';

import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  HStack,
  Icon,
  Center,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

import { PageTransition } from '#components/home-page/motion/page-transition';
import siteConfig from '#data/config';

import { signUp } from '../../lib/firebase/auth';
import { firebaseSignupErrorMap } from '../../lib/firebase/errors';
import { useAuth } from '../../providers/authProvider';

const SignUp: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Lozinka i potvrda lozinke se ne podudaraju.');
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      setSuccess('Uspešno ste napravili nalog!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      let code = '';
      if (err.code) {
        code = err.code;
      } else if (err.message) {
        const match = err.message.match(/\(([^)]+)\)/);
        if (match) code = match[1];
      }

      setError(
        firebaseSignupErrorMap[code] ||
        'Došlo je do greške. Pokušajte ponovo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      h="100vh"
      direction={{ base: 'column', lg: 'row' }}
      position="relative"
      overflow="hidden"
    >
      {/* Left side - Branding */}
      <Flex
        w={{ base: 'full', lg: '50%' }}
        h={{ base: '35%', lg: 'auto' }}
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        px={{ base: 8, md: 12, lg: 8, xl: 12 }}
        py={{ base: 6, lg: 0 }}
        pt={{ base: 20, md: 'auto' }}
        position="relative"
        bg="gray.900"
        _light={{ bg: 'gray.50' }}
        overflow="hidden"
      >
        {/* Large decorative gradient */}
        <Box
          position="absolute"
          top="-20%"
          left="-20%"
          w="140%"
          h="140%"
          animation="pulse 8s ease-in-out infinite"
          sx={{
            '@keyframes pulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.6 },
              '50%': { transform: 'scale(1.1)', opacity: 0.8 },
            },
          }}
        />

        <VStack
          align="center"
          spacing={{ base: 5, lg: 10 }}
          maxW="600px"
          w="full"
          position="relative"
          zIndex={1}
          textAlign="center"
        >
          {/* Logo - hidden on mobile */}
          <Box
            display={{ base: 'none', lg: 'block' }}
            opacity={0}
            animation="fadeInUp 0.8s ease forwards"
            sx={{
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(30px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <NextLink href="/">
              <Box
                as={siteConfig.logo}
                width="220px"
                cursor="pointer"
                transition="all 0.3s ease"
                _hover={{ transform: 'scale(1.05)' }}
                mx="auto"
              />
            </NextLink>
          </Box>

          {/* Main heading */}
          <VStack
            spacing={{ base: 4, lg: 4 }}
            opacity={0}
            animation="fadeInUp 0.8s ease 0.1s forwards"
          >
            <Heading
              fontSize={{ base: '4xl', md: '7xl' }}
              fontWeight="black"
              bgGradient="linear(to-r, green.200, green.300, green.400, green.500)"
              bgClip="text"
              lineHeight="1.05"
              letterSpacing="-0.03em"

            >
              Zarađuj od svojih klipova
            </Heading>
            {/* Text visible only on desktop */}
            <Text
              display={{ base: 'none', lg: 'block' }}
              fontSize="2xl"
              color="gray.300"
              _light={{ color: 'gray.700' }}
              lineHeight="1.4"
              fontWeight="medium"
              maxW="500px"
            >
              Klipuj. Okači. Zaradi.
            </Text>
          </VStack>

          {/* Stats */}
          <SimpleGrid
            columns={3}
            spacing={{ base: 3, lg: 6 }}
            w="full"
            opacity={0}
            animation="fadeInUp 0.8s ease 0.2s forwards"
            maxW="550px"
          >
            {[
              { value: '100k+', label: 'Isplaćeno', icon: '💰' },
              { value: '600+', label: 'Aktivnih klipera', icon: '👥' },
              { value: '20M+', label: 'Ukupno pregleda', icon: '📈' },
            ].map((stat, idx) => (
              <VStack
                key={idx}
                spacing={{ base: 1.5, lg: 2 }}
                p={{ base: 3, lg: 4 }}
                bg="whiteAlpha.50"
                _light={{ bg: 'white' }}
                borderRadius={{ base: 'xl', lg: 'xl' }}
                borderWidth="2px"
                borderColor="transparent"
                transition="all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
                _hover={{
                  borderColor: 'green.400',
                  transform: 'translateY(-8px)',
                  shadow: '0 20px 40px rgba(72, 187, 120, 0.2)',
                }}
              >
                <Text fontSize={{ base: 'xl', lg: '2xl' }}>{stat.icon}</Text>
                <VStack spacing={0.5}>
                  <Text
                    fontSize={{ base: 'lg', lg: '2xl' }}
                    fontWeight="black"
                    bgGradient="linear(to-r, green.300, green.500)"
                    bgClip="text"
                    letterSpacing="-0.03em"
                  >
                    {stat.value}
                  </Text>
                  <Text
                    fontSize={{ base: '2xs', lg: 'xs' }}
                    color="gray.400"
                    _light={{ color: 'gray.600' }}
                    fontWeight="semibold"
                    textTransform="uppercase"
                    letterSpacing="wider"
                  >
                    {stat.label}
                  </Text>
                </VStack>
              </VStack>
            ))}
          </SimpleGrid>

          {/* Features - desktop only */}
          <VStack
            spacing={3}
            opacity={0}
            animation="fadeInUp 0.8s ease 0.3s forwards"
            w="full"
            align="stretch"
            display={{ base: 'none', lg: 'flex' }}
          >
            {siteConfig.signup.features.slice(0, 4).map((feature, idx) => (
              <Flex
                key={idx}
                align="center"
                justify="flex-start"
                gap={3}
                p={4}
                w="full"
                bg="whiteAlpha.50"
                _light={{ bg: 'white' }}
                borderRadius="lg"
                borderWidth="2px"
                borderColor="transparent"
                transition="all 0.3s ease"
                _hover={{
                  borderColor: 'green.400',
                  transform: 'translateX(8px)',
                }}
              >
                <Center
                  w="44px"
                  h="44px"
                  borderRadius="lg"
                  bgGradient="linear(to-br, green.400, green.600)"
                  color="white"
                  flexShrink={0}
                  boxShadow="0 4px 14px rgba(72, 187, 120, 0.4)"
                >
                  <Icon as={feature.icon} boxSize={5} />
                </Center>
                <VStack align="start" spacing={0.5} flex={1}>
                  <Text
                    fontWeight="bold"
                    color="white"
                    _light={{ color: 'gray.900' }}
                    fontSize="md"
                    textAlign="left"
                  >
                    {feature.title}
                  </Text>
                  <Text
                    fontSize="sm"
                    color="gray.400"
                    _light={{ color: 'gray.600' }}
                    lineHeight="1.5"
                    textAlign="left"
                  >
                    {feature.description}
                  </Text>
                </VStack>
              </Flex>
            ))}
          </VStack>
        </VStack>
      </Flex>

      {/* Right side - Form */}
      <Flex
        w={{ base: 'full', lg: '50%' }}
        h={{ base: '65%', lg: 'auto' }}
        flexDirection="column"
        justifyContent="center"
        px={{ base: 6, md: 12, lg: 16 }}
        py={{ base: 6, lg: 0 }}
        bg="white"
        _dark={{ bg: 'gray.900', borderColor: 'gray.700' }}
        position="relative"
        zIndex={1}
        borderLeftWidth={{ base: 0, lg: '1px' }}
        borderColor="gray.200"
        boxShadow={{ base: 'none', lg: '-20px 0 60px rgba(0, 0, 0, 0.05)' }}
        _light={{
          boxShadow: { lg: '-20px 0 60px rgba(0, 0, 0, 0.08)' },
        }}
        overflow="hidden"
      >
        <PageTransition>
          <VStack
            spacing={{ base: 4, lg: 8 }}
            align="stretch"
            maxW="440px"
            mx="auto"
            w="full"
          >
            <VStack spacing={{ base: 1, lg: 3 }} align="start">
              <Box>
                <Heading
                  fontSize={{ base: '2xl', lg: '4xl' }}
                  fontWeight="black"
                  color="gray.900"
                  _dark={{ color: 'white' }}
                  letterSpacing="-0.02em"
                  mb={{ base: 1, lg: 2 }}
                >
                  Napravi nalog
                </Heading>
                <Text
                  color="gray.600"
                  _dark={{ color: 'gray.400' }}
                  fontSize={{ base: 'sm', lg: 'lg' }}
                >
                  Popuni podatke i započni svoju zaradu!
                </Text>
              </Box>
            </VStack>

            <Box as="form" onSubmit={handleSignup}>
              <VStack spacing={{ base: 3, lg: 5 }} align="stretch">
                <VStack spacing={{ base: 1, lg: 2 }} align="stretch">
                  <Text
                    fontSize="sm"
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
                    height={{ base: '48px', lg: '56px' }}
                    fontSize="md"
                    transition="all 0.2s"
                  />
                </VStack>

                <VStack spacing={{ base: 1, lg: 2 }} align="stretch">
                  <Text
                    fontSize="sm"
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
                      height={{ base: '48px', lg: '56px' }}
                      fontSize="md"
                      transition="all 0.2s"
                      pr="3.5rem"
                    />
                    <InputRightElement height={{ base: '48px', lg: '56px' }}>
                      <IconButton
                        aria-label={
                          showPassword ? 'Sakrij lozinku' : 'Prikaži lozinku'
                        }
                        icon={<Icon as={showPassword ? FiEyeOff : FiEye} />}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="sm"
                        color="gray.500"
                        _hover={{ color: 'green.500', bg: 'transparent' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </VStack>

                <VStack spacing={{ base: 1, lg: 2 }} align="stretch">
                  <Text
                    fontSize="sm"
                    fontWeight="600"
                    color="gray.700"
                    _dark={{ color: 'gray.300' }}
                  >
                    Potvrdi lozinku
                  </Text>
                  <InputGroup size="lg">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      size="lg"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                      height={{ base: '48px', lg: '56px' }}
                      fontSize="md"
                      transition="all 0.2s"
                      pr="3.5rem"
                    />
                    <InputRightElement height={{ base: '48px', lg: '56px' }}>
                      <IconButton
                        aria-label={
                          showConfirmPassword
                            ? 'Sakrij lozinku'
                            : 'Prikaži lozinku'
                        }
                        icon={
                          <Icon
                            as={showConfirmPassword ? FiEyeOff : FiEye}
                          />
                        }
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        variant="ghost"
                        size="sm"
                        color="gray.500"
                        _hover={{ color: 'green.500', bg: 'transparent' }}
                      />
                    </InputRightElement>
                  </InputGroup>
                </VStack>

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
                    py={{ base: 2, lg: 3 }}
                  >
                    <AlertIcon boxSize={{ base: 4, lg: 5 }} />
                    <Text fontSize="sm" fontWeight="medium">
                      {error}
                    </Text>
                  </Alert>
                )}

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
                    py={{ base: 2, lg: 3 }}
                  >
                    <AlertIcon boxSize={{ base: 4, lg: 5 }} />
                    <Text fontSize="sm" fontWeight="medium">
                      {success}
                    </Text>
                  </Alert>
                )}

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
                  _active={{
                    transform: 'translateY(0)',
                  }}
                  height={{ base: '48px', lg: '56px' }}
                  fontSize="md"
                  fontWeight="bold"
                  borderRadius="xl"
                  transition="all 0.2s"
                  isLoading={loading}
                  loadingText="Kreiranje naloga..."
                  boxShadow="0 8px 16px rgba(72, 187, 120, 0.3)"
                  mt={{ base: 1, lg: 2 }}
                >
                  Kreiraj nalog
                </Button>
              </VStack>
            </Box>

            <HStack spacing={2} justify="center" pt={{ base: 0, lg: 2 }}>
              <Text
                fontSize={{ base: 'sm', lg: 'lg' }}
                color="gray.600"
                _dark={{ color: 'gray.400' }}
              >
                Već imaš nalog?
              </Text>
              <NextLink href="/login" passHref>
                <Text
                  fontSize={{ base: 'sm', lg: 'lg' }}
                  fontWeight="bold"
                  color="green.500"
                  cursor="pointer"
                  _hover={{
                    color: 'green.600',
                    textDecoration: 'underline',
                  }}
                  transition="all 0.2s"
                >
                  Uloguj se
                </Text>
              </NextLink>
            </HStack>
          </VStack>
        </PageTransition>
      </Flex>
    </Flex>
  );
};

export default SignUp;