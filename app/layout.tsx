import { ColorModeScript } from '@chakra-ui/react'

import { Provider } from './providers/provider'
import { Analytics } from "@vercel/analytics/next"

export default function Layout(props: { children: React.ReactNode }) {
  const colorMode = 'dark'

  return (
    <html lang="en" data-theme={colorMode} style={{ colorScheme: colorMode }}>
      <head>
        <title>Clipify</title>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={`chakra-ui-${colorMode}`}>
        <ColorModeScript initialColorMode={colorMode} />
        <Provider>{props.children}</Provider>
        <Analytics />
      </body>
    </html>
  )
}
