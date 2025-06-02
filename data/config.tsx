import { Button } from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { NextSeoProps } from 'next-seo'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'
import { Logo } from './logo'

const siteConfig = {
  logo: Logo,
  seo: {
    title: 'Clipify',
    description: 'Povezujemo kreatore i klip editore za viralni sadržaj',
  } as NextSeoProps,
  termsUrl: '/uslovi-koriscenja',
  privacyUrl: '/politika-privatnosti',
  header: {
    links: [
      {
        id: 'features',
        label: 'Funkcionalnosti',
      },
      {
        id: 'plans',
        label: 'Planovi',
      },
      {
        id: 'faq',
        label: 'FAQ',
      },
      {
        label: 'Login',
        href: '/login',
      },
      {
        label: 'Register',
        href: '/signup',
        variant: 'primary',
      },
    ],
  },
  footer: {
    copyright: (
      <>
        Clipify © 2025
      </>
    ),
    links: [
      {
        href: 'mailto:pomoc@klipplatforma.rs',
        label: 'Kontakt',
      },
      {
        href: 'https://twitter.com/klipplatforma',
        label: <FaTwitter size="14" />,
      },
      {
        href: 'https://github.com/klipplatforma',
        label: <FaGithub size="14" />,
      },
    ],
  },
  signup: {
    title: 'Kreni sa pravljenjem viralnih klipova',
    features: [
      {
        icon: FiCheck,
        title: 'Besplatno za sve korisnike',
        description: 'Kreirajte ili editujte bez ikakvih skrivenih troškova.',
      },
      {
        icon: FiCheck,
        title: 'Jednostavna saradnja',
        description:
          'Povežite se lako sa klip editorima ili kreatorima i ostvarite najbolje rezultate.',
      },
      {
        icon: FiCheck,
        title: 'Sigurna i transparentna isplata',
        description:
          'Sredstva su sigurno deponovana dok rad ne bude završen i odobren.',
      },
      {
        icon: FiCheck,
        title: 'Brza i direktna komunikacija',
        description:
          'Olakšavamo komunikaciju kako bi saradnja bila bez problema.',
      },
    ],
  },
}

export default siteConfig
