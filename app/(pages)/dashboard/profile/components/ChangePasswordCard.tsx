import React, { useState } from 'react';
import {
  VStack,
  Center,
  Spinner,
  Alert,
  AlertIcon,
  CardHeader,
  Heading,
  Spacer,
  CardBody,
  Card,
  Button,
  FormControl,
} from '@chakra-ui/react'
import { PasswordInput } from '@saas-ui/react'
import { changePassword } from '../../../../lib/firebase/auth'
import { User } from '@firebase/auth'
import { firebaseResetPasswordErrorMap } from '../../../../lib/firebase/errors'

interface ChangePasswordCardProps {
  user: User | null;
}

const ChangePasswordCard: React.FC<ChangePasswordCardProps> = ({user}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const validatePasswords = (): boolean => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Popunite sva polja.');
      return false;
    }
    if (newPassword.length < 8) {
      setError('Nova šifra mora biti dužine bar 8 karaktera.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Šifre se ne poklapaju.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!validatePasswords()) {
      setLoading(false);
      return;
    }

    try {
      console.log('Submitting password change:', { currentPassword, newPassword });
      await changePassword(user!, currentPassword, newPassword);
      setSuccess('Uspešno promenjena šifra!');
    } catch (err: any) {
      console.error('Error updating password:', err);
      let code = ''
      if (err.code) {
        code = err.code
      } else if (err.message) {
        const match = err.message.match(/\(([^)]+)\)/)
        if (match) code = match[1]
      }

      setError(firebaseResetPasswordErrorMap[code] || 'Došlo je do greške. Pokušajte ponovo.')
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
    <Card w={{ base: '100%', md: '60%' }} minH="30vh" bg="gray.800">
      <CardHeader>
        <Heading size="lg">Izmeni šifru</Heading>
        <Spacer />
      </CardHeader>
      <CardBody>
        <VStack align="stretch" spacing={4}>
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
          <FormControl isInvalid={!!error}>
            <PasswordInput
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Trenutna šifra"
            />
          </FormControl>
          <FormControl isInvalid={!!error}>
            <PasswordInput
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nova šifra"
            />
          </FormControl>
          <FormControl isInvalid={!!error}>
              <PasswordInput
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Potvrdite novu šifru"
              />
            </FormControl>

          <Button
            colorScheme="green"
            onClick={handleSubmit}
            isLoading={loading}
            loadingText="Submitting"
          >
            Submit
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default ChangePasswordCard;