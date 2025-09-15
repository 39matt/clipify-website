import { HStack, Text } from '@chakra-ui/react'

export default {
  title: 'Kako naša platforma funkcioniše',
  description:
    'Povezujemo kreatore sa kliperima koji prave viralne klipove – bez ulaganja na početku, plaćate tek kada klipovi donesu rezultate',
  plans: [
    {
      id: 'creator-start',
      title: 'Kreator',
      description:
        'Kampanja sa jasnim ciljem i kontrolisanim budžetom. Plaćate isključivo kada vidite konkretne rezultate.',
      price: '',
      features: [
        {
          title: 'Kreiranje i objava kampanja sa jasnim ciljevima',
        },
        {
          title: 'Pristup velikom broju iskusnih klipera',
        },
        {
          title: 'Plaćaš samo za autentične preglede i engagement',
        },
        {
          title: 'Detaljna analitika i izveštaji o performansama',
        },
        {
          title: '24/7 Korisnička Podrška',
        },
      ],
      action: {
        href: '/kontakt',
        label: 'Započni svoju prvu kampanju!'
      },
    },
    {
      id: 'clipper',
      title: 'Kliper',
      description:
        'Kreirajte klipove, ucestvujte u kampanjama i zarađujte neograničeno – što više pregleda, to veća zarada.',
      price: '',
      features: [
        {
          title: 'Možete učestvovati u svim dostupnim kampanjama',
        },
        {
          title: 'Zarada bazirana na autentičnim pregledima klipova',
        },
        {
          title: 'Mogućnost otključavanja bonusa i napredovanja',
        },
        {
          title: 'Sigurna i brza isplata',
        },
        {
          title: '24/7 Support',
        },
      ],
      action: {
        href: '/login',
        label: 'Pridruži se kao kliper!'
      },
    },
  ],
}
