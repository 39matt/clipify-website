import {
  Box,
  Text,
} from '@chakra-ui/react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { IAccount } from '../../../app/lib/models/account'

interface Props {
  account: IAccount;
  index: number;
  router: AppRouterInstance;
}

const CampaignCard: React.FC<Props> = ({ account, index, router }) => {
  return (
    <Box
      key={index}
      p={4}
      bg="gray.700"
      borderRadius="md"
      boxShadow="md"
      textAlign="center"
    >
      {/* Platform Logo */}
      <Box
        w="50px"
        h="50px"
        borderRadius="full"
        mx="auto"
        bgImage={
          account.platform == 'Instagram'
            ? "url('/static/images/instagram-logo.jpg')"
            : "url('/static/images/tiktok-logo.png')"
        }
        bgSize="contain" // Ensures the image covers the box
        bgPosition="center" // Centers the image
        bgRepeat="no-repeat"
        mb={4}
      />
      {/* Username */}
      <Text fontSize="lg" color="white" fontWeight="bold" cursor="pointer">
        {account.username}
      </Text>
    </Box>
  );
};

export default CampaignCard;