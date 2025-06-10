'use client'

import { ModalsProvider, SaasProvider } from '@saas-ui/react'

import { theme } from '#theme'
import { AuthProvider } from './authProvider'

export function Provider(props: { children: React.ReactNode }) {
  return (
    <SaasProvider theme={theme}>
      <ModalsProvider>
        <AuthProvider>
          {props.children}
        </AuthProvider>
      </ModalsProvider>
      {/*<AuthProvider>{props.children}</AuthProvider>*/}
    </SaasProvider>
  )
}
