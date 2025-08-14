'use client';

import { Box, Button, Center, Flex, Heading, Icon, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, SimpleGrid, Text, VStack, useDisclosure } from '@chakra-ui/react';
import { NextPage } from 'next';
import { useRouter } from 'next/navigation';
import { FiPlus } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import AccountCard from '#components/app/AccountCard/AccountCard';
import { accountExists, getAllAccounts } from '../../../lib/firebase/firestore/account';
import { IAccount } from '../../../lib/models/account';
import { useLayoutContext } from '../context';
import { Simulate } from 'react-dom/test-utils'


const ConnectedAccounts: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [accountLink, setAccountLink] = useState('');
  const [verificationCode, setVerificationCode] = useState<number | null>(null);
  const [isVerifyEnabled, setIsVerifyEnabled] = useState(false);
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [message, setMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { user, loading, discordUsername } = useLayoutContext();
  const router = useRouter()

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accounts = await getAllAccounts(discordUsername!);
        setAccounts(accounts);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };
    fetchAccounts();
  }, [discordUsername]);

  useEffect(() => {
    const fetchVerificationDetails = async () => {
      if (isOpen) {
        try {
          // const verificationExist = await verificationExists(discordUsername!);
          const response = await fetch(`/api/user/verification/exists?uid=${discordUsername}`, {
            method:"GET"
          })
          const responseJson = await response.json()
          if (responseJson.verification) {
            setVerificationCode(responseJson.verification.code);
            setAccountLink(
              responseJson.verification.platform === 'Instagram'
                ? `https://instagram.com/${responseJson.verification.username}`
                : `https://tiktok.com/@${responseJson.verification.username}`
            );
            setIsVerifyEnabled(true);
            setMessage('Molimo postavite kod u opis vašeg profila i kliknite "Verifikujte Nalog".');
          }
        } catch (error) {
          console.error('Greška prilikom preuzimanja podataka o verifikaciji:', error);
        }
      }
    };

    fetchVerificationDetails();
  }, [isOpen, discordUsername]);

  const handleAddAccount = async () => {
    try {
      setMessage('');

      const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/;
      const tiktokRegex = /^https:\/\/(www\.)?tiktok\.com\/@?[a-zA-Z0-9_.]+\/?$/;

      if (!instagramRegex.test(accountLink) && !tiktokRegex.test(accountLink)) {
        setMessage('Uneti link nije validan. Molimo unesite ispravan link naloga.');
        return;
      }

      let username = '';

      if (accountLink.includes('tiktok')) {
        if (accountLink.includes('@')) {
          username = accountLink.split('@')[1].replace('/', '');
        } else {
          const parts = accountLink.split('/');
          username = parts[parts.length - 1] || parts[parts.length - 2];
        }
        if (await accountExists(username, "TikTok")) {
          setMessage('Nalog se već koristi.');
          return;
        }
      } else {
        const parts = accountLink.split('/').filter(part => part !== '');
        username = parts[parts.length - 1];
        if (await accountExists(username, "Instagram")) {
          setMessage('Nalog se već koristi.');
          return;
        }
      }

      // Validate extracted username
      if (!username || username.trim() === '') {
        setMessage('Nije moguće izdvojiti korisničko ime iz linka.');
        return;
      }

      username = username.trim();
      console.log('Extracted username:', username);

      const response = await fetch('/api/user/verification/add', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid:discordUsername, accountLink }),
      })
      const responseJson = await response.json()
      console.log(responseJson)
      setVerificationCode(responseJson.verification.code);
      setAccountLink(
        responseJson.verification.platform === 'Instagram'
          ? `https://instagram.com/${responseJson.verification.username}`
          : `https://tiktok.com/@${responseJson.verification.username}`
      );
      setIsVerifyEnabled(true);

      setMessage('Molimo postavite kod u opis vašeg profila i kliknite "Verifikujte Nalog".');

    } catch (error) {
      console.error('Greška prilikom dodavanja naloga:', error);
      setMessage('Dodavanje naloga nije uspelo. Pokušajte ponovo.');
    }
  };

  const handleRemoveVerification = async () => {
    try {
      setIsVerifying(true);
      setMessage('Brisanje u toku...');

      const response = await fetch('/api/user/verification/remove', {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid:discordUsername }),
      })
      console.log(response)
      setIsVerifying(false)
      if(response.ok) {
        setMessage('Uspešno obrisana verifikacija!');
        resetForm()
        return
      }
      setMessage('Greška pri brisanju verifikacije!');

    } catch (err) {
      console.error('Greška prilikom brisanja verifikacije:', err);
      setMessage('Brisanje verifikacije nije uspelo. Pokušajte ponovo.');
    }
  }

  const handleVerifyAccount = async () => {
    try {
      setIsVerifying(true)
      setMessage('Verifikacija u toku...')

      const verification = {
        platform: accountLink.toLowerCase().includes('tiktok')
          ? 'TikTok'
          : 'Instagram',
        username: accountLink.includes('tiktok')
          ? accountLink.split('@')[1]
          : accountLink.split('/')[accountLink.split('/').length - 1],
        code: verificationCode!,
      }

      const response = await fetch('/api/user/verification/verify', {
        method:"POST",
        headers: {    'Content-Type': 'application/json'},
        body: JSON.stringify({uid: discordUsername, verification, api_key:process.env.NEXT_PUBLIC_RAPIDAPI_KEY!})
      })
      // await verifyVerification(discordUsername!, verification, process.env.NEXT_PUBLIC_RAPIDAPI_KEY!);
      const responseJson = await response.json();
      if(responseJson.result.success) {
        setMessage('Nalog je uspešno verifikovan!');
        const updatedAccounts = await getAllAccounts(discordUsername!);
        setAccounts(updatedAccounts);

        setTimeout(() => {
          resetForm();
          onClose();
        }, 2000);
      }
      else {
        console.log("false")
        setMessage('Kod se ne nalazi u bio. Pokušajte ponovo.');
      }
    } catch (error) {
      console.error('Greška prilikom verifikacije naloga:', error);
      setMessage('Verifikacija nije uspela. Proverite da li je kod postavljen u opis profila.');
    } finally {
      setIsVerifying(false);
    }
  };


  const resetForm = () => {
    setAccountLink('');
    setVerificationCode(null);
    setIsVerifyEnabled(false);
    setMessage('');
    setIsVerifying(false);
  };

  const handleAccountDelete = (deletedAccountId: string) => {
    setAccounts(prev => prev.filter(account => account.id !== deletedAccountId));
  };

  return (
    <VStack align="center" minH="100vh" bg="gray.900" color="white" px={6}>
      <Flex
        gap={8}
        justify="space-between"
        flexDirection="column"
        align="center"
        w="full"
        maxW="1200px"
        mb={8}
      >
        <Box textAlign="center" maxW="2xl">
          <Heading
            fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
            fontWeight="bold"
            bgGradient="linear(to-r, green.400, teal.500)"
            bgClip="text"
            mb={4}
          >
            Povezani nalozi
          </Heading>
        </Box>
        <Button
          leftIcon={<Icon as={FiPlus} />}
          colorScheme="green"
          variant="solid"
          onClick={onOpen}
          borderRadius="full"
          px={6}
          py={4}
        >
          Poveži Nalog
        </Button>
      </Flex>

      <Center
        w="full"
        maxW="1200px"
        h="auto"
        borderWidth="1px"
        borderStyle="dashed"
        borderColor="gray.700"
        borderRadius="lg"
        bg="gray.800"
        p={8}
      >
        {accounts && accounts.length > 0 ? (
          <SimpleGrid columns={[1, 2, 3]} spacing={6} w="full">
            {accounts.map((account, index) => (
              <AccountCard
                key={account.id}
                account={account}
                index={index}
                router={router}
                userId={discordUsername!}
                onDelete={handleAccountDelete}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Box textAlign="center">
            <Icon as={FiPlus} boxSize={12} color="green.400" />
            <Heading size="md" color="white" mt={4}>
              Nema Povezanih Naloga
            </Heading>
            <Text fontSize="sm" color="gray.400" mt={2}>
              Povežite svoje naloge na društvenim mrežama kako biste započeli
            </Text>
          </Box>
        )}
      </Center>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Dodajte TikTok/Instagram nalog</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Link ka vašem nalogu:</Text>
            <Input
              placeholder="https://tiktok.com/@username"
              value={accountLink}
              onChange={(e) => setAccountLink(e.target.value)}
              bg="gray.700"
              borderColor="gray.600"
              _placeholder={{ color: 'gray.400' }}
              isDisabled={verificationCode !== null}
            />
            {verificationCode && (
              <Box mt={4}>
                <Text>Platforma:</Text>
                <Heading size="md" color="green.400">
                  {accountLink.toLowerCase().includes('tiktok') ? 'TikTok' : 'Instagram'}
                </Heading>
                <Text mt={2}>Korisničko ime:</Text>
                <Heading size="md" color="green.400">
                  {accountLink.includes('tiktok')
                    ? accountLink.split('@')[1]
                    : accountLink.split('/')[accountLink.split('/').length - 1]
                  }
                </Heading>
                <Text mt={4}>Vaš verifikacioni kod:</Text>
                <Heading size="lg" color="green.400">
                  {verificationCode}
                </Heading>
              </Box>
            )}
            {message && (
              <Text
                mt={4}
                color={
                  message.includes('uspešno')
                    ? 'green.400'
                    : message.includes('Molimo') || message.includes('u toku')
                      ? 'blue.400'
                      : 'red.400'
                }
                fontWeight={message.includes('uspešno') ? 'bold' : 'normal'}
              >
                {message}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            {!verificationCode ? (
              <Button colorScheme="green" mr={3} onClick={handleAddAccount}>
                Dodajte Nalog
              </Button>
            ) : (
              <Box>
                <Button
                  colorScheme="green"
                  mr={3}
                  onClick={handleVerifyAccount}
                  isDisabled={!isVerifyEnabled}
                  isLoading={isVerifying}
                >
                  Verifikuj Nalog
                </Button>
                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={handleRemoveVerification}
                  isDisabled={!isVerifyEnabled}
                  isLoading={isVerifying}
                >
                  Otkaži verifikaciju
                </Button>
              </Box>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                resetForm();
                onClose();
              }}
              isDisabled={isVerifying}
            >
              Otkaži
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default ConnectedAccounts;