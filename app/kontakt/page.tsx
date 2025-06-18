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
import { Section } from 'components/home-page/section';
import { Logo } from '#data/logo';
import NextLink from 'next/link';
import { NextPage } from 'next';
import { useState } from 'react';
import { FiPhone, FiMail } from 'react-icons/fi';

const Contact: NextPage = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'kliper' | 'klijent'>('kliper'); // State for the slider

  const handleContactSubmit = async (data: { name: string; email: string; message: string; role: string }) => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (!data.name || !data.email || !data.message) {
        throw new Error('Sva polja su obavezna.');
      }

      setSuccess('Vaša poruka je uspešno poslata!');
    } catch (err: any) {
      setError(err.message || 'Došlo je do greške. Pokušajte ponovo.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      message: formData.get('message') as string,
      role, // Include the role in the form data
    };

    handleContactSubmit(data);
  };

  return (
    <Section height="calc(100vh)" innerWidth="container.md">
      <BackgroundGradient zIndex="-1" />

      <Center height="100%">
        <PageTransition width="100%">
          <VStack spacing={8} align="center" w="full">
            {/* Heading and Description */}
            <Box textAlign="center">
              <Heading size="lg" mb={4}>
                Kontaktirajte nas
              </Heading>
              <Text fontSize="md" color="gray.500">
                Imate pitanja ili želite da viralizujete vaš kontent? Pošaljite nam poruku putem forme ispod.
              </Text>
            </Box>

            {/* Contact Form */}
            <Card flex="1" maxW="600px" w="full" boxShadow="lg" paddingX="10px" paddingY="5px">
              <CardHeader display="flex" alignItems="center" justifyContent="center">
                <Logo onClick={() => {}} _hover={{ cursor: 'pointer' }} width={{ base: '150px', md: '240px' }} />
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4}>
                    <Input name="name" placeholder="Ime" isRequired />
                    <Input name="email" type="email" placeholder="Email" isRequired />
                    <Textarea name="message" placeholder="Poruka" isRequired />

                    {/* Checkbox Slider */}
                    <Flex gap={4} >
                      <Text fontSize="md" color={role === 'kliper' ? 'green.500' : 'gray.500'}>
                        Kliper
                      </Text>
                      <Switch
                        isChecked={role === 'klijent'}
                        onChange={(e) => setRole(e.target.checked ? 'klijent' : 'kliper')}
                        size="lg"
                        colorScheme="green"
                      />
                      <Text fontSize="md" color={role === 'klijent' ? 'green.500' : 'gray.500'}>
                        Klijent
                      </Text>
                    </Flex>

                    <Button type="submit" colorScheme="green" isLoading={loading} w="full">
                      Pošalji
                    </Button>
                  </VStack>
                  {error && (
                    <Alert status="error" mt={4}>
                      <AlertIcon />
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert status="success" mt={4}>
                      <AlertIcon />
                      {success}
                    </Alert>
                  )}
                </form>
              </CardBody>
            </Card>

            {/* Additional Contact Information */}
            <Box textAlign="center" mt={8}>
              <Heading size="md" mb={4}>
                Ili nas kontaktirajte direktno mejlom:
              </Heading>
              <VStack spacing={4}>
                <HStack spacing={4}>
                  <Icon as={FiMail} boxSize={6} color="green.500" />
                  <Text fontSize="md" color="gray.500">
                    kontakt@clipify.com
                  </Text>
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </PageTransition>
      </Center>
    </Section>
  );
};

export default Contact;