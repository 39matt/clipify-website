'use client'

import { ModalsProvider, SaasProvider } from '@saas-ui/react'
import { cookieStorageManagerSSR } from '@chakra-ui/react'

import { theme } from '#theme'
import { AuthProvider } from './authProvider'

export function Provider(props: { children: React.ReactNode, cookies?: string }) {
  const colorModeManager = typeof window === 'undefined'
    ? cookieStorageManagerSSR(props.cookies ?? '')
    : undefined

  return (
    <SaasProvider theme={theme} colorModeManager={colorModeManager}>
      <ModalsProvider>
        <AuthProvider>
          {props.children}
        </AuthProvider>
      </ModalsProvider>
      {/*<AuthProvider>{props.children}</AuthProvider>*/}
    </SaasProvider>
  )
}
