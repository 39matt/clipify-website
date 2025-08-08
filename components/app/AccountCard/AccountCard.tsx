import {
  Box,
  Text,
  IconButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useState } from 'react'
import { IAccount } from '../../../app/lib/models/account'

interface Props {
  account: IAccount;
  index: number;
  router: AppRouterInstance;
  userId: string;
  onDelete?: (accountId: string, userId: string) => void; // Optional callback for parent component
}

const AccountCard: React.FC<Props> = ({ account, index, router, onDelete, userId }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent any parent click handlers
    onOpen(); // Open confirmation modal
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return; // Prevent multiple clicks

    try {
      setIsDeleting(true);

      const response = await fetch(`/api/user/account/delete?accountId=${account.id}&userId=${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        toast({
          title: 'Nalog obrisan',
          description: `Nalog @${account.username} je uspešno obrisan.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        onClose(); // Close modal after successful deletion
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Greška pri brisanju naloga');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: 'Greška',
        description: error instanceof Error ? error.message : 'Došlo je do greške pri brisanju naloga.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Box
        key={index}
        p={4}
        bg="gray.700"
        borderRadius="md"
        boxShadow="md"
        textAlign="center"
        position="relative" // Required for absolute positioning of delete button
      >
        {/* Delete Button */}
        <IconButton
          icon={<FaTimes />}
          aria-label="Obriši nalog"
          size="sm"
          colorScheme="red"
          variant="solid"
          borderRadius="full"
          position="absolute"
          top={2}
          left={2}
          zIndex={1}
          onClick={handleDeleteClick}
          _hover={{
            transform: 'scale(1.1)',
            bg: 'red.600',
          }}
          transition="all 0.2s"
        />

        {/* Platform Logo */}
        <Box
          w="50px"
          h="50px"
          borderRadius="full"
          mx="auto"
          bgImage={
            account.platform === 'Instagram'
              ? "url('/static/images/instagram-logo.jpg')"
              : "url('/static/images/tiktok-logo.png')"
          }
          bgSize="contain"
          bgPosition="center"
          bgRepeat="no-repeat"
          mb={4}
        />

        {/* Username */}
        <Text fontSize="lg" color="white" fontWeight="bold" cursor="pointer">
          {account.username}
        </Text>
      </Box>

      {/* Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="gray.800" color="white">
          <ModalHeader>Potvrdi brisanje</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Da li ste sigurni da želite da obrišete nalog{' '}
              <Text as="span" fontWeight="bold" color="red.400">
                @{account.username}
              </Text>{' '}
              sa platforme{' '}
              <Text as="span" fontWeight="bold" color="blue.400">
                {account.platform}
              </Text>
              ?
            </Text>
            <Text mt={2} fontSize="sm" color="red.500" fontWeight={"bold"}>
              UPOZORENJE: Ova akcija se ne može poništiti i briše sve videe vezane za ovaj nalog!
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={onClose}
              isDisabled={isDeleting}
            >
              Otkaži
            </Button>
            <Button
              colorScheme="red"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              loadingText="Brisanje..."
            >
              Obriši nalog
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AccountCard;