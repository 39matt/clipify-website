'use client'

import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  SimpleGrid,
  Flex,
  HStack, Alert, AlertIcon,
} from '@chakra-ui/react'
import { PasswordForm } from '@saas-ui/auth'
import { Field, FormLayout } from '@saas-ui/react'
import { NextPage } from 'next'
import NextLink from 'next/link'
import { Features } from 'components/home-page/features'
import { BackgroundGradient } from '#components/home-page/gradients/background-gradient'
import { PageTransition } from '#components/home-page/motion/page-transition'
import siteConfig from '#data/config'
import { useState } from 'react'
import {firebaseSignupErrorMap} from '../../lib/firebase/errors'
import {useRouter} from "next/navigation";
import { signUp } from '../../lib/firebase/auth'

const SignUp: NextPage = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')


  const handleSignup = async (data: { email: string; password: string}) => {
    try {

      await signUp(data.email, data.password)
      setSuccess("Uspešno ste napravili nalog! Proverite vaš mail kako bi ste se verifikovali.")
      router.push('/login')

    } catch (err: any) {

      let code = ''
      if (err.code) {
        code = err.code
      } else if (err.message) {
        const match = err.message.match(/\(([^)]+)\)/)
        if (match) code = match[1]
      }

      setError(firebaseSignupErrorMap[code] || 'Došlo je do greške. Pokušajte ponovo.')
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
                  fields={{
                    submit: {
                      children: 'Kreiraj nalog',
                    },
                    email: {
                      isRequired: true
                    },
                    password: {
                      isRequired: true
                    }
                  }}
                >
                  <Field name="username" label="Username" isRequired/>
                  <FormLayout columns={3}></FormLayout>
                  <Field name="refferalCode" label="Referral code" />
                  {error && (<Alert status="error">
                    <AlertIcon />
                    {error ? error : String(error)}
                  </Alert>)}
                  {success && (<Alert status="success">
                    <AlertIcon />
                    {success ? success : String(success)}
                  </Alert>)}
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