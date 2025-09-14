'use client'
import React, { useEffect, useState } from 'react';
import { Container, Heading } from '@chakra-ui/react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  Text
} from '@chakra-ui/react';

interface Affiliate {
  code: string;
  count: number;
}

const AffiliatesPage: React.FC = () => {
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchAffiliates = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/affiliate/get-all');
        if (!response.ok) throw new Error('Failed to fetch affiliates');

        const data = await response.json();
        setAffiliates(data.affiliates);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAffiliates();
  }, []);

  return (
    <Container maxW="container.sm" py={8}>
      <Heading mb={6}>Affiliates Dashboard</Heading>
      <AffiliatesTable
        affiliates={affiliates}
        isLoading={isLoading}
        error={error}
      />
    </Container>
  );
};


interface Affiliate {
  code: string;
  count: number;
}

interface AffiliatesTableProps {
  affiliates: Affiliate[];
  isLoading?: boolean;
  error?: string;
}

const AffiliatesTable: React.FC<AffiliatesTableProps> = ({
                                                           affiliates,
                                                           isLoading = false,
                                                           error
                                                         }) => {
  if (isLoading) {
    return (
      <Box textAlign="center" p={8}>
        <Spinner size="lg" />
        <Text mt={4}>Loading affiliates...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  if (affiliates.length === 0) {
    return (
      <Box textAlign="center" p={8}>
        <Text>No affiliates found</Text>
      </Box>
    );
  }

  return (
    <Box
      w="full"
      borderWidth="1px"
      borderRadius="md"
      p={{ base: 2, md: 4 }}
      mb={4}
    >
      <Heading
        size="md"
        textColor="green.400"
        fontSize={{ base: '16px', md: '20px' }}
        mb={4}
      >
        Affiliates ({affiliates.length} total)
      </Heading>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th fontSize={{ base: '12px', md: '14px' }}>Affiliate Code</Th>
            <Th fontSize={{ base: '12px', md: '14px' }} isNumeric>Count</Th>
          </Tr>
        </Thead>
        <Tbody>
          {affiliates.map((affiliate) => (
            <Tr key={affiliate.code}>
              <Td fontSize={{ base: '14px', md: '16px' }}>
                {affiliate.code}
              </Td>
              <Td fontSize={{ base: '14px', md: '16px' }} isNumeric>
                {affiliate.count}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default AffiliatesPage;

