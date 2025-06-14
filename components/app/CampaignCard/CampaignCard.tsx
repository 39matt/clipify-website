import {
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

interface CampaignCardProps {
  campaign: ICampaign;
  router: AppRouterInstance;
}

const CampaignCard: React.FC<CampaignCardProps> = ({campaign, router}) => {
  return (
    <Card maxW='sm'>
      <CardBody>
        <Image
          src={campaign.imageUrl}
          alt='Image'
          borderRadius='lg'
          onClick={()=>{router.push(`/campaigns/${campaign.id}`)}}
          _hover={{ cursor: "pointer" }}
        />
        <Stack mt='6' spacing='3'>
          <Heading size='md'>{`${campaign.influencer} - ${campaign.activity}`}</Heading>
          <Progress value={campaign.progress} size='xs' colorScheme='green' />
          <Text color='blue.600' fontSize='2xl'>
            ${campaign.budget}
          </Text>
        </Stack>
      </CardBody>
      <Divider />
      {/*<CardFooter>*/}
      {/*  <ButtonGroup spacing='2'>*/}
      {/*    <Button variant='solid' colorScheme='blue'>*/}
      {/*      Buy now*/}
      {/*    </Button>*/}
      {/*    <Button variant='ghost' colorScheme='blue'>*/}
      {/*      Add to cart*/}
      {/*    </Button>*/}
      {/*  </ButtonGroup>*/}
      {/*</CardFooter>*/}
    </Card>
  )
}

export default CampaignCard;
