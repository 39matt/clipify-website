  'use client'
  import {
    Box,
    Heading, VStack, Grid,
  } from '@chakra-ui/react'
  import { NextPage } from 'next'
  import CampaignCard from '#components/app/CampaignCard/CampaignCard'
  import { useEffect, useState } from 'react'
  import { getAllCampaigns } from '../../lib/firebase/firestore'
  import { useRouter } from 'next/navigation'

  const Campaigns: NextPage = () => {
    const router = useRouter()
    const [campaignList, setCampaignList] = useState<ICampaign[]>()
    useEffect(() => {
      const getCampaigns = async () => {
        const campaigns = await getAllCampaigns()
        setCampaignList(campaigns)
      }

    getCampaigns()
    },[])
      return(
      <VStack>
        <Box my="24px">
          <Heading textAlign="center" fontSize="48px">
            Aktivne kampanje
          </Heading>
        </Box>
        <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
          {campaignList?.map((campaign) => {
            return (<CampaignCard
              campaign={campaign}
              router={router}
            />)
          })}

        </Grid>
      </VStack>
    )
  }
  export default Campaigns