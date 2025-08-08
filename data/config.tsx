import { Button } from '@chakra-ui/react'
import { Link } from '@saas-ui/react'
import { NextSeoProps } from 'next-seo'
import { FaGithub, FaTwitter } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'
import { Logo } from './logo'
import { FaInstagram, FaTiktok } from 'react-icons/fa6'

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
        id: 'funkcionalnosti',
        label: 'O nama',
      },
      {
        id: 'kreni',
        label: 'Kreni',
      },
      {
        id: 'faq',
        label: 'FAQ',
        href: '',
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
        href: '/kontakt',
        label: 'Kontakt',
      },
      {
        href: 'https://www.tiktok.com/@clipify.rs',
        label: <FaTiktok size="14" />,
      },
      {
        href: 'https://www.instagram.com/clipify.rs/',
        label: <FaInstagram size="14" />,
      },
    ],
  },
  signup: {
    title: 'Zašto odabrati našu platformu?',
    features: [
      {
        icon: FiCheck,
        title: 'Besplatno za sve korisnike',
        description: 'Kreirajte ili editujte bez ikakvih skrivenih troškova.',
      },
      {
        icon: FiCheck,
        title: 'Brza i Sigurna Isplata',
        description: 'Brza i sigurna isplata u najkraćem roku.',
      },
      {
        icon: FiCheck,
        title: 'Efikasna Komunikacija',
        description: 'Aktivno komuniciramo i pružamo podršku svakome kome je potrebna.',
      },
      {
        icon: FiCheck,
        title: 'Jednostavnost Korišćenja',
        description: 'Korak po korak instrukcije olakšavaju korišćenje i onima koji se prvi put susreću sa platformom.',
      },
    ],
  },
}

export default siteConfig
