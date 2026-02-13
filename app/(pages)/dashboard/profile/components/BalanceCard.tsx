import React from 'react'
import {
  VStack,
  CardHeader,
  Heading,
  Spacer,
  CardBody,
  Card,
  Button, Text, CardFooter,
} from '@chakra-ui/react'

interface BalanceCardProps {
  balance: number,
  // loading: boolean,
  uid: string,
  toast: any,
  payoutRequested: string,
}

const BalanceCard: React.FC<BalanceCardProps> = ({balance, uid, toast, payoutRequested}) => {
  const requestPayout = async () => {
    try {
      const response = await fetch(`/api/user/request-payout?uid=${uid}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });
      if(!response.ok) {
        console.error(await response.json().then(response => response.message));
      }
      toast({
        title: "Uspeh!",
        description: "Uspešno poslat zahtev za isplatu!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Card w={{ base: '100%', md: '60%' }} bg="gray.800">
      <CardHeader>
        <Heading size="lg">Vaš trenutni balance</Heading>
        <Spacer />
      </CardHeader>
      <CardBody>
          <VStack align="stretch" spacing={4}>
            <Text fontSize="4xl" fontWeight="bold" textAlign="center">
              ${balance}
            </Text>
            <Button isDisabled={balance < 10 || Date.now() - new Date(payoutRequested).getTime() / 1000 / 60 / 60 / 24 > 1} onClick={requestPayout} colorScheme="green" w="75%" mx="auto">
              Zatraži isplatu
            </Button>
          </VStack>
      </CardBody>
      <CardFooter>
        <Text
          fontSize="sm"
          fontWeight="light"
          color="gray.500"
          mx="auto"
          whiteSpace="pre-line"
          maxHeight="sm"
        >
          Minimalni iznos koji možete da isplatite je $3.
          {"\n"}
          Nakon svake kampanje vam se sabiraju pregledi validnih videa i dodaju na vaš balance.
        </Text>
      </CardFooter>
    </Card>
  );
};

export default BalanceCard;