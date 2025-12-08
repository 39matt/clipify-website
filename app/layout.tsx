import { ColorModeScript } from '@chakra-ui/react'

import { Provider } from './providers/provider'
import { Analytics } from "@vercel/analytics/next"
import '@fontsource-variable/montserrat';
import dynamic from 'next/dynamic'
const PixelTracker = dynamic(() => import("./providers/PixelTracker"), { ssr: false });

export default function Layout(props: { children: React.ReactNode }) {
  const colorMode = 'dark'

  return (
    <html lang="en" data-theme={colorMode} style={{ colorScheme: colorMode }}>
      <head>
        <title>Clipify</title>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        {/* Meta Pixel Code */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?                         
              n.callMethod.apply(n,arguments):n.queue.push   
              (arguments)}; if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!
              0;n.version='2.0';n.queue=[];t=b.createElement(e);
              t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,
              'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1140035588329481');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=
            PageView&noscript=1"/>
        </noscript>
        {/* End Meta Pixel Code */}
      </head>
      <body className={`chakra-ui-${colorMode}`}>
        <ColorModeScript initialColorMode={colorMode} />
        <PixelTracker/>
        <Provider>{props.children}</Provider>
        <Analytics />
      </body>
    </html>
  )
}
