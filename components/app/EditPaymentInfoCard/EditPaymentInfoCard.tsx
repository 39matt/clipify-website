import React, { useState } from 'react';
import {
  Editable,
  EditableInput,
  EditablePreview,
  Button,
  VStack,
  Center, Spinner, Alert, AlertIcon, CardHeader, Heading, Spacer, CardBody, Card,
} from '@chakra-ui/react'
import { updateWalletAddress } from '../../../app/lib/firebase/firestore'
import { Property, PropertyList } from '@saas-ui/core'
import { useLayoutContext } from '../../../app/(pages)/dashboard/context'
import { Select, SelectButton, SelectList } from '@saas-ui/react'

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
      setError("Neispravan format adrese!");
      setLoading(false);
      return
    }
    try {
      console.log('Submitting wallet address:', walletAddress);
      await updateWalletAddress(discordUsername!, walletAddress);
      setSuccess('Usprešno izmenjena adresa!');
    } catch (error) {
      console.error('Error updating wallet address:', error);
      setError('Promena adrese nije uspela. Molimo vas pokušajte ponovo!');
    } finally {
      setLoading(false);
    }
  };

  if(loading) {
    return (
      <Center>
        <Spinner />
      </Center>
    )
  }

  return (
    <Card w={{ base: '100%', md: '40%' }} h="full">
      <CardHeader>
        <Heading size="lg">Payment info</Heading>
        <Spacer />
      </CardHeader>
      <CardBody h="full" justifyContent="space-between">
        <PropertyList>
          <Property
            w="full"
            label="Payment method"
            value={
              <Select
                name="payment"
                defaultValue="usdt"
                options={[
                  { label: 'USDT (ERC20)', value: 'usdt' },
                ]}
                aria-label="Select payment method"
              >
                <SelectButton />
                <SelectList />
              </Select>
            }
          />
    <VStack align="start">
      <Property
        w="full"
        label="Wallet address"
        value={
          <Editable
            defaultValue={walletAddress}
            onChange={(value) => setWalletAddress(value)}
            width="200px"
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
            <EditableInput w="full"/>
          </Editable>
        }
      />
      <Button
        colorScheme="blue"
        onClick={handleSubmit}
        isLoading={loading}
        loadingText="Submitting"
        w="full"
      >
        Submit
      </Button>
      {error && (<Alert status="error">
        <AlertIcon />
        {error ? error : String(error)}
      </Alert>)}
      {success && (<Alert status="success">
        <AlertIcon />
        {success ? success : String(success)}
      </Alert>)}
    </VStack>
        </PropertyList>
      </CardBody>
    </Card>
  );
};

export default EditPaymentInfoCard;