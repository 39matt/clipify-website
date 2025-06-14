
import { NextPage } from 'next'
import { Box, Grid, GridItem, Heading } from '@chakra-ui/react'

const Panel: NextPage = () => {
  return (
    <Box>
      <Heading textAlign='center' fontSize='48px'>
        Aktivne kampanje
      </Heading>
      <Grid templateColumns='repeat(5, 1fr)' gap={6}>
        <GridItem w='100%' h='10' bg='blue.500' />
        <GridItem w='100%' h='10' bg='blue.500' />
        <GridItem w='100%' h='10' bg='blue.500' />
        <GridItem w='100%' h='10' bg='blue.500' />
        <GridItem w='100%' h='10' bg='blue.500' />
      </Grid>
    </Box>
  )
}
export default Panel