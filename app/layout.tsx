import { ColorModeScript, theme } from '@chakra-ui/react'

import { Provider } from './providers/provider'

export default function Layout(props: { children: React.ReactNode }) {
  const colorMode = theme.config.initialColorMode

  return (
    <html lang="en" data-theme={colorMode} style={{ colorScheme: colorMode }}>
      <head>
        <title>Clipify</title>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
      </head>
      <body className={`chakra-ui-${colorMode}`}>
        <ColorModeScript initialColorMode={colorMode} />
        <Provider>{props.children}</Provider>
      </body>
    </html>
  )
}
