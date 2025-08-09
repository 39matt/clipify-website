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
  Card, Stack, Flex, Box,
} from '@chakra-ui/react'
import { Property, PropertyList } from '@saas-ui/core';
import { Select, SelectButton, SelectList } from '@saas-ui/react';
import { updateWalletAddress } from '../../../app/lib/firebase/firestore/user'

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
    <Card w={{ base: '100%', md: '40%' }} minH="30vh" bg="gray.800">
      <CardHeader>
        <Heading size="lg">Informacije o isplati</Heading>
        <Spacer />
      </CardHeader>
      <CardBody h="full">
        <Flex
          direction="column"
          h="full"
          justify="space-between"
          align="stretch"
          gap={4} // Adds spacing between elements
          minW={"full"}
        >
          <PropertyList minW="full">
            <Property
              label={
                  "Način isplate"
              }
              value={
                <Select
                  name="payment"
                  defaultValue="usdt"
                  options={[{ label: 'USDT (ERC20)', value: 'usdt' }]}
                  aria-label="Izaberi način isplate"
                >
                  <SelectButton />
                  <SelectList />
                </Select>
              }
              minW={"full"}
              display="flex"
              flexDirection={{ base: 'column', xl: 'row' }}
              alignItems={{ base: 'flex-start', xl: 'center' }}
              gap={2} // Adds spacing between label and value
            />
            <Property
              minW={"full"}
              label={
                  "Adresa USDT novčanika"
              }
              value={
                <Editable
                  defaultValue={walletAddress}
                  onChange={(value) => setWalletAddress(value)}
                  isTruncated
                >
                  <EditablePreview
                    display="flex"
                    alignItems="center"
                    px="3"
                    fontSize="sm"
                    w="100%" // Ensures it doesn't overflow
                    minH="8"
                    _hover={{ bg: 'gray.100', borderRadius: 'md', cursor: 'pointer' }}
                    _dark={{
                      _hover: {
                        bg: 'whiteAlpha.100',
                      },
                    }}
                  />
                  <EditableInput w="100%" />
                </Editable>
              }
              display="flex"
              flexDirection={{ base: 'column', xl: 'row' }}
              alignItems={{ base: 'flex-start', xl: 'center' }}
              gap={2} // Adds spacing between label and value
              w="full"
            />
          </PropertyList>

          {/* Placeholder for error/success messages */}
          <Box minH="50px" w="full">
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
          </Box>

          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Submitting"
            w="full"
          >
            Submit
          </Button>
        </Flex>
      </CardBody>
    </Card>
  )}

export default EditPaymentInfoCard;