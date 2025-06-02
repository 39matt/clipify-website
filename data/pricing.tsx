import { HStack, Text } from '@chakra-ui/react'

export default {
  title: 'Kako naša platforma funkcioniše',
  description:
    'Povezujemo kreatore sa kliperima koji stvaraju viralne isečke – sve besplatno, plaćanje samo za ostvarene preglede.',
  plans: [
    {
      id: 'creator-start',
      title: 'Kreator',
      description:
        'Objavite kampanje sa budžetom i ciljem pregleda. Plaćate samo za stvarne rezultate i angažman.',
      price: 'Besplatno za registraciju',
      features: [
        {
          title: 'Kreiranje i objava kampanja sa jasnim ciljevima',
        },
        {
          title: 'Pristup širokoj mreži talentovanih klipera',
        },
        {
          title: 'Plaćanje po stvarnim pregledima i angažmanu',
        },
        {
          title: 'Detaljna analitika i izveštaji o performansama',
        },
        {
          title: 'Podrška korisnicima',
        },
      ],
      action: {
        href: '/signup',
      },
    },
    {
      id: 'clipper',
      title: 'Klip Editor',
      description:
        'Prijavite se na kampanje, kreirajte viralne isečke i zarađujte po broju pregleda vašeg rada.',
      price: 'Besplatno za registraciju',
      features: [
        {
          title: 'Pregled otvorenih kampanja za prijavu',
        },
        {
          title: 'Zarada bazirana na stvarnim pregledima klipova',
        },
        {
          title: 'Mogućnost izgradnje portfolija i ocenjivanja',
        },
        {
          title: 'Sigurno i pravovremeno plaćanje',
        },
        {
          title: 'Pristup zajednici i podršci',
        },
      ],
      action: {
        href: '/signup',
      },
    },
  ],
}
