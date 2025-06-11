'use client'

import { Alert, AlertIcon, Card, CardBody, CardHeader, Center, HStack, Spinner, Text } from '@chakra-ui/react'
import { Auth, PasswordForm } from '@saas-ui/auth'
import { BackgroundGradient } from '#components/home-page/gradients/background-gradient'
import { PageTransition } from '#components/home-page/motion/page-transition'
import { Section } from 'components/home-page/section'
import { NextPage } from 'next'
import { Logo } from '#data/logo'
import NextLink from 'next/link'
import { useEffect, useState } from 'react'
import { firebaseLoginErrorMap } from '../../lib/firebase/errors'
import { useRouter } from 'next/navigation'
import {  signIn } from '../../lib/firebase/auth'
import { useAuth } from '../../providers/authProvider'

const Login: NextPage = () => {
  const router = useRouter()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const {user, loading} = useAuth()

  useEffect(() => {
    if (user) {
      router.push('/dashboard/profile');
    }
  }, [user, router]);



  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner />
      </Center>
    )
  }




  const handleLogin = async (data: { email: string, password: string }) => {
    try {
      await signIn(data.email, data.password)
      setSuccess("Uspešno ste se ulogovali!")
        router.push('/login');

    } catch (err: any) {

      let code = ''
      if (err.code) {
        code = err.code
      } else if (err.message) {
        const match = err.message.match(/\(([^)]+)\)/)
        if (match) code = match[1]
      }

      setError(firebaseLoginErrorMap[code] || 'Došlo je do greške. Pokušajte ponovo.')    }
  }
  return (
    <Section height="calc(100vh - 200px)" innerWidth="container.sm">
      <BackgroundGradient zIndex="-1" />

      <Center height="100%" pt="20">
        <PageTransition width="100%">
          {/*<Auth*/}
          {/*  view="login"*/}
          {/*  providers={providers}*/}
          {/*  signupLink={<Link href="/signup">Sign up</Link>}*/}
          {/*  onSuccess={()=>{}}*/}
          {/*/>*/}
          <Card flex="1" maxW="400px">
            <CardHeader display="flex" alignItems="center" justifyContent="center">
              <Logo width={{ base: '150px', md: '240px' }} />
            </CardHeader>
            <CardBody>
              <PasswordForm onSubmit={handleLogin} fields={{submit: {children:'Uloguj se'}}}>
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
                  Nemaš nalog?
                </Text>
                <NextLink  href={"/signup"} passHref>
                  <Text textColor="white" fontSize='14px'>
                    Registracija
                  </Text>
                </NextLink>
              </HStack>
            </CardBody>
          </Card>
        </PageTransition>
      </Center>
    </Section>
  )
}


export default Login
