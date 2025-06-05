'use client'

import { Card, CardBody, CardHeader, Center, Text } from '@chakra-ui/react'
import { Auth } from '@saas-ui/auth'
import { Link } from '@saas-ui/react'
import { BackgroundGradient } from '#components/home-page/gradients/background-gradient'
import { PageTransition } from '#components/home-page/motion/page-transition'
import { Section } from 'components/home-page/section'
import { NextPage } from 'next'
import { FaDiscord, FaGithub, FaGoogle } from 'react-icons/fa'
import { Logo } from '#data/logo'
import { translations } from '../../../utils/translations'
import NextLink from 'next/link'

const providers = {
  google: {
    name: 'Discord',
    icon: FaDiscord,
  },
}

const Login: NextPage = () => {
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
              <Auth type="password" translations={translations} signupLink={
                <NextLink href="/signup" passHref>

                    Registracija
c
                </NextLink>
              }/>
            </CardBody>
          </Card>
        </PageTransition>
      </Center>
    </Section>
  )
}


export default Login
