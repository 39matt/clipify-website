import React, { useState } from 'react';
import {
  Editable,
  EditableInput,
  EditablePreview,
  Button,
  VStack,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  CardHeader,
  Heading,
  Spacer,
  CardBody,
  Card, Stack,
} from '@chakra-ui/react'
import { updateWalletAddress } from '../../../app/lib/firebase/firestore';
import { Property, PropertyList } from '@saas-ui/core';
import { Select, SelectButton, SelectList } from '@saas-ui/react';

interface EditPaymentInfoCardProps {
  discordUsername: string | null;
}

const EditPaymentInfoCard: React.FC<EditPaymentInfoCardProps> = ({ discordUsername }) => {
  const [walletAddress, setWalletAddress] = useState('Enter wallet address');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validateWalletAddress = (address: string): boolean => {
    const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
    return ethereumAddressRegex.test(address);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!validateWalletAddress(walletAddress)) {
      setError('Neispravan format adrese!');
      setLoading(false);
      return;
    }
    try {
      console.log('Submitting wallet address:', walletAddress);
      await updateWalletAddress(discordUsername!, walletAddress);
      setSuccess('Uspešno izmenjena adresa!');
    } catch (error) {
      console.error('Error updating wallet address:', error);
      setError('Promena adrese nije uspela. Molimo vas pokušajte ponovo!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  return (
    <Card w={{ base: '100%', md: '40%' }} minH="30vh">
      <CardHeader>
        <Heading size="lg">Informacije o isplati</Heading>
        <Spacer />
      </CardHeader>
      <CardBody h="full">
        <VStack h="full" align="stretch" spacing={4}>
          <PropertyList>
            <Property
              label="Način isplate"
              value={
                <Select
                  name="payment"
                  defaultValue="usdt"
                  options={[{ label: 'USDT (ERC20)', value: 'usdt' }]}
                  aria-label="Izaberi način isplate"
                >
                  <SelectButton maxW="90%" />
                  <SelectList />
                </Select>
              }
            />
            <Property
              w="full"
              label="Adresa USDT novčanika"
              value={
                <Editable
                  defaultValue={walletAddress}
                  onChange={(value) => setWalletAddress(value)}
                  width="90%"
                  isTruncated
                >
                  <EditablePreview
                    display="flex"
                    alignItems="center"
                    px="3"
                    fontSize="sm"
                    w="full"
                    minH="8"
                    _hover={{ bg: 'gray.100', borderRadius: 'md', cursor: 'pointer' }}
                    _dark={{
                      _hover: {
                        bg: 'whiteAlpha.100',
                      },
                    }}
                  />
                  <EditableInput w="full" />
                </Editable>
              }
            />
          </PropertyList>
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
          <Spacer />
          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Submitting"
            w="full"
          >
            Submit
          </Button>
å        </VStack>
      </CardBody>
    </Card>
  );
};

export default EditPaymentInfoCard;