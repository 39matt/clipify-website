'use client';

import {
  Box,
  Heading,
  VStack,
  Text,
  Spinner,
  Center,
  Divider,
  Button,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter, useClipboard, Grid, SimpleGrid,
} from '@chakra-ui/react'
import { useEffect, useState, useRef } from 'react';
import { IUser } from '../../../../lib/models/user';
import CopyableText from './components/CopyableText'

interface PayoutPageProps {
  idToken: string;
}

const PayoutPage: React.FC<PayoutPageProps> = ({ idToken }) => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const getPayouts = async () => {
      try {
        const response = await fetch('/api/user/get-all-requested-payout', {
          method: 'GET',
        });
        const users = await response.json();
        setUsers(users ?? []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching payouts:', error);
      }
    };

    getPayouts();
  }, []);

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner />
        <Text ml={4}>Loading payouts...</Text>
      </Center>
    );
  }

  const resetBalance = async (uid: string) => {
    try {
      setIsProcessing(true);
      await fetch('/api/admin/reset-user-balance', {
        method: 'POST',
        body: JSON.stringify({ uid }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === uid ? { ...u, balance: 0, payoutRequested: '' } : u
        )
      );
    } catch (error) {
      console.error('Error resetting balance:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleOpenConfirm = (user: IUser) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleConfirm = async () => {
    if (!selectedUser) return;
    await resetBalance(selectedUser.id!);
    onClose();
  };

  return (
    <VStack minW="full">
      <Box my={{ base: 4, md: 8 }}>
        <Heading
          textAlign="center"
          fontSize={{ base: '32px', md: '48px' }}
          textColor="green.400"
        >
          Payouts
        </Heading>
      </Box>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6}>
        {users.map((user) => (
          <VStack
            key={user.id}
            w="220px"
            py={6}
            px={4}
            bgGradient="linear(to-br, blue.400, blue.600)"
            color="white"
            rounded="lg"
            shadow="xl"
            spacing={4}
          >
            <Text fontWeight="bold" fontSize="2xl" textAlign="center">
              {user.id}
            </Text>

            <Divider borderColor="whiteAlpha.500" />

            <Text fontSize="lg" fontWeight="semibold">
              Balance: ${user.balance}
            </Text>

            {/* 👇 Apply truncation only here */}
            <CopyableText value={user.walletAddress} />

            <Button
              onClick={() => handleOpenConfirm(user)}
              colorScheme="teal"
              size="sm"
              w="full"
              rounded="md"
              shadow="md"
              _hover={{ bg: "teal.500" }}
            >
              Isplaćeno
            </Button>
          </VStack>
        ))}
      </SimpleGrid>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Potvrdi isplatu
            </AlertDialogHeader>

            <AlertDialogBody>
              Da li si siguran da želiš da označiš{' '}
              <Text as="span" fontWeight="bold">
                {selectedUser?.email}
              </Text>{' '}
              kao isplaćeno? Ova akcija se ne može opozvati!
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Otkaži
              </Button>
              <Button
                colorScheme="red"
                onClick={handleConfirm}
                ml={3}
                isLoading={isProcessing}
              >
                Da, potvrdi
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </VStack>
  );
};

export default PayoutPage;