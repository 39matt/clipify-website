import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Image,
  Progress,
  Stack,
  Text,
} from '@chakra-ui/react'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

interface Props {
  account: IAccount;
  index: number
  router: AppRouterInstance;
}

const CampaignCard: React.FC<Props> = ({account, index, router}) => {
  return (
      <Box
        key={index}
        p={4}
        bg="gray.700"
        borderRadius="md"
        boxShadow="md"
        textAlign="center"
        onClick={()=>{router.push(`/dashboard/accounts/${account.id}`);}}
        _hover={{cursor:"pointer"}}
      >
        <Box
          w="50px"
          h="50px"
          bg="gray.500"
          borderRadius="full"
          mx="auto"
          mb={4}
        />
        <Text fontSize="lg" color="green.400" fontWeight="bold">
          {account.platform}
        </Text>
        <Text
          fontSize="lg"
          color="white"
          fontWeight="bold"
          cursor="pointer"
        >
          {account.username}
        </Text>
      </Box>
  )
}

export default CampaignCard;
