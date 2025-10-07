import { ColorModeScript } from '@chakra-ui/react'

import { Provider } from './providers/provider'

export default function Layout(props: { children: React.ReactNode }) {
  const colorMode = 'dark'

  return (
    <html lang="en" data-theme={colorMode} style={{ colorScheme: colorMode, backgroundColor: '#0f172a' }} suppressHydrationWarning>
      <head>
        <title>Clipify</title>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={`chakra-ui-${colorMode}`} style={{ backgroundColor: '#0f172a', color: 'white' }}>
        <ColorModeScript initialColorMode={colorMode} />
        <Provider>{props.children}</Provider>
      </body>
    </html>
  )
}
