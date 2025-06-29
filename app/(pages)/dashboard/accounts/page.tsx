'use client';

import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Icon,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  useDisclosure,
  SimpleGrid,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { NextPage } from 'next';
import { useState, useEffect } from 'react';
import {
  accountExists,
  addVerification,
  getAllAccounts,
  verificationExists,
  verifyVerification,
} from '../../../lib/firebase/firestore';
import { useLayoutContext } from '../context';
import AccountCard from '#components/app/AccountCard/AccountCard'
import { useRouter } from 'next/navigation'

const ConnectedAccounts: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [accountLink, setAccountLink] = useState('');
  const [verificationCode, setVerificationCode] = useState<number | null>(null);
  const [isVerifyEnabled, setIsVerifyEnabled] = useState(false);
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [message, setMessage] = useState('');
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
          const verificationExist = await verificationExists(discordUsername!);
          if (verificationExist) {
            setVerificationCode(verificationExist.code);
            setAccountLink(
              verificationExist.platform === 'Instagram'
                ? `https://instagram.com/${verificationExist.username}`
                : `https://tiktok.com/@${verificationExist.username}`
            );
            setIsVerifyEnabled(true);
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
      const instagramRegex = /^https:\/\/(www\.)?instagram\.com\/?[a-zA-Z0-9_.]+$/;
      const tiktokRegex = /^https:\/\/(www\.)?tiktok\.com\/@?[a-zA-Z0-9_.]+$/;
      if (!instagramRegex.test(accountLink) && !tiktokRegex.test(accountLink)) {
        setMessage('Uneti link nije validan. Molimo unesite ispravan link naloga.');
        return;
      }
      const username = accountLink.includes('tiktok')
        ? accountLink.split('@')[1]
        : accountLink.split('/')[accountLink.split('/').length - 1];
      if (await accountExists(username)) {
        setMessage('Nalog se već koristi.');
        return;
      }
      const verification = await addVerification(discordUsername!, accountLink);
      setVerificationCode(verification.code);
      setAccountLink(
        verification.platform === 'Instagram'
          ? `https://instagram.com/${verification.username}`
          : `https://tiktok.com/@${verification.username}`
      );
      setIsVerifyEnabled(true);
      setMessage('Nalog je uspešno dodat!');
    } catch (error) {
      console.error('Greška prilikom dodavanja naloga:', error);
      setMessage('Dodavanje naloga nije uspelo. Pokušajte ponovo.');
    }
  };

  const handleVerifyAccount = async () => {
    try {
      const verification = {
        platform: accountLink.toLowerCase().includes('tiktok') ? 'TikTok' : 'Instagram',
        username: accountLink.split('@')[1],
        code: verificationCode!,
      };
      await verifyVerification(discordUsername!, verification, process.env.NEXT_PUBLIC_RAPIDAPI_KEY!);
      setMessage('Nalog je uspešno verifikovan!');
      resetForm();
    } catch (error) {
      console.error('Greška prilikom verifikacije naloga:', error);
      setMessage('Verifikacija nije uspela. Pokušajte ponovo.');
    }
  };

  const resetForm = () => {
    setAccountLink('');
    setVerificationCode(null);
    setIsVerifyEnabled(false);
    setMessage('');
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
        <Heading size="lg" color="green.400">
          Povezani Nalozi
        </Heading>
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
              <AccountCard account={account} index={index} router={router}/>
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
            />
            {verificationCode && (
              <Box mt={4}>
                <Text>Platforma:</Text>
                <Heading size="md" color="green.400">
                  {accountLink.toLowerCase().includes('tiktok') ? 'TikTok' : 'Instagram'}
                </Heading>
                <Text mt={2}>Korisničko ime:</Text>
                <Heading size="md" color="green.400">
                  {accountLink.split('@')[1]}
                </Heading>
                <Text mt={4}>Vaš verifikacioni kod:</Text>
                <Heading size="lg" color="green.400">
                  {verificationCode}
                </Heading>
              </Box>
            )}
            {message && (
              <Text mt={4} color={message.includes('uspešno') ? 'green.400' : 'red.400'}>
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
              <Button
                colorScheme="green"
                mr={3}
                onClick={handleVerifyAccount}
                isDisabled={!isVerifyEnabled}
              >
                Verifikujte Nalog
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => {
                resetForm();
                onClose();
              }}
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