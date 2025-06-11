'use client';

import {
  Spinner,
  Center,
  Heading,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function DiscordCallback() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const didFetch = useRef(false);
  const [modalText, setModalText] = useState('');

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    const linkDiscordAccount = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const email = localStorage.getItem('userEmail');

      if (!code || !email) {
        router.replace('/dashboard/profile');
        return;
      }

      try {
        const res = await fetch(
          `/api/discord/link?code=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}`
        );
        const data = await res.json();

        if (res.ok) {
          setModalText(`Povezan discord nalog: ${data.discordUsername}`);
        } else {
          setModalText(data.error || 'Neuspešno povezivanje naloga!');
        }
      } catch (err) {
        console.error(err);
        setModalText('Greška pri povezivanju naloga');
      } finally {
        onOpen();
      }
    };

    linkDiscordAccount();
  }, [router, onOpen]);

  return (
    <Center minH="100vh" flexDir="column">
      <Heading mb={4}>Povezivanje vašeg naloga…</Heading>
      <Spinner />

      <Modal isOpen={isOpen} onClose={() => {
        onClose();
        router.replace('/dashboard/profile');
      }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalText}</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="green"
              onClick={() => {
                onClose();
                router.replace('/dashboard/profile');
              }}
            >
              Nazad na profil
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Center>
  );
}