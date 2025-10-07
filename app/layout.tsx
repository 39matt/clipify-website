import { ColorModeScript } from '@chakra-ui/react'
import { cookies } from 'next/headers'

import { Provider } from './providers/provider'

export default function Layout(props: { children: React.ReactNode }) {
  const colorMode = 'dark'
  const cookieStore = cookies()
  const cookieString = cookieStore.toString()

  return (
    <html lang="en" data-theme={colorMode} style={{ colorScheme: colorMode }} className={`chakra-ui-${colorMode}`} suppressHydrationWarning>
      <head>
        <title>Clipify</title>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={`chakra-ui-${colorMode}`}>
        <ColorModeScript initialColorMode={colorMode} />
        <Provider cookies={cookieString}>{props.children}</Provider>
      </body>
    </html>
  )
}
