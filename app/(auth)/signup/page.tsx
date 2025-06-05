'use client'

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Center,
  Heading,
  Stack,
  Text,
  SimpleGrid,
  Flex,
  Button, HStack,
} from '@chakra-ui/react'
import { PasswordForm } from '@saas-ui/auth'
import { Field, FormLayout } from '@saas-ui/react'
import { NextPage } from 'next'
import NextLink from 'next/link'
import { Features } from 'components/home-page/features'
import { BackgroundGradient } from '#components/home-page/gradients/background-gradient'
import { PageTransition } from '#components/home-page/motion/page-transition'
import { Section } from 'components/home-page/section'
import siteConfig from '#data/config'
import { translations } from '../../../utils/translations'
import { useState } from 'react'
import { auth } from '../../../utils/firebase'
import {createUserWithEmailAndPassword} from "@firebase/auth";

const SignUp: NextPage = () => {
  const [error, setError] = useState('')

  const handleSignup = async (data: { email: string; password: string }) => {
    try {
      await createUserWithEmailAndPassword(auth, data.email, data.password)
    } catch (err: any) {
      setError(err)
    }
  }

  return (
    <Flex
      direction="column"
      minH="100vh"
      maxH="100vh"
      h="100vh"
      w="100vw"
      overflow="hidden"
      position="relative"
    >
      <BackgroundGradient
        zIndex="-1"
        width={{ base: 'full', lg: '50%' }}
        left="auto"
        right="0"
        borderLeftWidth="1px"
        borderColor="gray.200"
        _dark={{
          borderColor: 'gray.700',
        }}
      />
      <PageTransition h="100%" w="100%">
        <SimpleGrid
          columns={{ base: 1, lg: 2 }}
          h="100%"
          minH="100vh"
          maxH="100vh"
          alignItems="center"
          spacing={{ base: 8, lg: 0 }}
        >
          <Flex
            direction="column"
            alignItems={{ base: 'center' }}
            px={{ base: 4, md: 12, lg: 20 }}
            py={{ base: 8, lg: 0 }}
            h="100%"
          >
            <NextLink href="/" passHref>
              <Box
                as={siteConfig.logo}
                width={{ base: '150px', md: '240px' }}
                mb={{ base: 8, lg: 16 }}
                cursor="pointer"
                mx='auto'
              />
            </NextLink>
            <Features
              display={{ base: 'none', lg: 'flex' }}
              columns={1}
              iconSize={4}
              flex="1"
              py="0"
              ps="0"
              maxW={{ base: '100%', xl: '80%' }}
              features={siteConfig.signup.features.map((feature) => ({
                iconPosition: 'left',
                variant: 'left-icon',
                ...feature,
              }))}
            />
          </Flex>

          <Flex align="center" justify="center" h="100%" >
            <Card maxW="400px" w="full" boxShadow="lg" paddingX="10px" paddingY="5px">
              <CardHeader>
                <Heading size="md" textAlign="center">
                  Napravi nalog na Clipify
                </Heading>
              </CardHeader>
              <CardBody>
                <PasswordForm
                  onSubmit={handleSignup}
                >
                  <Field name="username" label="Username" />
                  <FormLayout columns={3}></FormLayout>
                  <Field name="refferalCode" label="Referral code" />
                </PasswordForm>
                <HStack spacing='5px' mt='10px'>
                  <Text fontSize='14px' textColor="gray.500" display="inline">
                    Već imaš nalog?
                  </Text>
                  <NextLink  href={"/login"} passHref>
                    <Text textColor="white" fontSize='14px'>
                      Uloguj se
                    </Text>
                  </NextLink>
                </HStack>
              </CardBody>

            </Card>
          </Flex>
        </SimpleGrid>
      </PageTransition>
    </Flex>
  )
}

export default SignUp