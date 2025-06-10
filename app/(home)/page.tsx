'use client'

import {
  Box,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  Heading,
  Icon,
  IconButton,
  Stack,
  Tag,
  Text,
  VStack,
  Wrap,
  useClipboard,
} from '@chakra-ui/react'
import { Br, Link } from '@saas-ui/react'
import type { Metadata, NextPage } from 'next'
import Image from 'next/image'
import {
  FiArrowRight,
} from 'react-icons/fi'

import * as React from 'react'

import { ButtonLink } from '#components/home-page/button-link/button-link'
import { Faq } from 'components/home-page/faq'
import { Features } from 'components/home-page/features'
import { BackgroundGradient } from '#components/home-page/gradients/background-gradient'
import { Hero } from 'components/home-page/hero'
import {
  Highlights,
  HighlightsItem,
  HighlightsTestimonialItem,
} from 'components/home-page/highlights'
import { FallInPlace } from '#components/home-page/motion/fall-in-place'
import { Pricing } from '#components/home-page/pricing/pricing'
import { Testimonial, Testimonials } from 'components/home-page/testimonials'
import { Em } from 'components/home-page/typography'
import faq from '#data/faq'
import pricing from '#data/pricing'
import testimonials from '#data/testimonials'
import { Award, DollarSign, EyeIcon, MessageSquare, Search, Shield, UploadCloud, User, Users } from 'lucide-react'
import { ImBullhorn } from 'react-icons/im'
import { BoxFeatures } from '#components/home-page/features/box-features'


const Home: NextPage = () => {
  return (
    <Box>
      <HeroSection />

      <HighlightsSection />

      <FeaturesSection />

      <TestimonialsSection />

      <PricingSection />

      <FaqSection />
    </Box>
  )
}

const HeroSection: React.FC = () => {
  return (
    <Box position="relative" overflow="hidden">
      <BackgroundGradient height="100%" zIndex="-1" />
      <Container maxW="container.xl" pt={{ base: 40, md: 60 }} pb="40">
        <Stack direction={{ base: 'column', lg: 'row' }} >
          <Hero
            id="home"
            px="0"
            title={
              <FallInPlace>
                <Text fontSize={{base:'3xl', md:'5xl'}}>
                  Sve-u-jednom alat za
                  <Br /> viralnost
                </Text>
              </FallInPlace>
            }
            description={
              <FallInPlace delay={0.4} fontWeight="medium">
                <Text>
                Clipster pretvara strastvene kreatore
                <Br /> u <Em>viralni motor</Em> za brendove—
                plaćanje samo za stvarne preglede,
                stvarnu interakciju i stvaran uticaj.
                  </Text>
              </FallInPlace>
            }
          >
            <FallInPlace delay={0.8}>
              <HStack pt="4" pb="12" spacing="8">
              </HStack>

              <ButtonGroup
                spacing={{ base: 3, md: 4 }}
                alignItems="center"
                flexDirection={{ base: 'column', md: 'row' }}
                width={{ base: 'full', md: 'auto' }}
              >
                <ButtonLink
                  colorScheme="primary"
                  size="lg"
                  href="/signup"
                  width={{ base: 'full', md: 'auto' }}
                  mb={{base:'2em', md:0}}
                >
                  Pridruži se sada
                </ButtonLink>
                <ButtonLink
                  size="lg"
                  href=""
                  variant="outline"
                  width={{ base: 'full', md: 'auto' }}
                  rightIcon={
                    <Icon
                      as={FiArrowRight}
                      sx={{
                        transitionProperty: 'common',
                        transitionDuration: 'normal',
                        '.chakra-button:hover &': {
                          transform: 'translate(5px)',
                        },
                      }}
                    />
                  }
                >
                  Saradnja sa nama
                </ButtonLink>
              </ButtonGroup>
            </FallInPlace>
          </Hero>
          <Box
            height="600px"
            position="absolute"
            display={{ base: 'none', lg: 'block' }}
            left={{ lg: '60%', xl: '55%' }}
            width="80vw"
            maxW="1100px"
            margin="0 auto"
          >
            <FallInPlace delay={1}>
              <Box overflow="hidden" height="100%">
                <Image
                  src="/static/screenshots/example.png"
                  width={2000}
                  height={786}
                  alt="Snimak ekrana liste kampanja u Clipster-u"
                  quality="75"
                  priority
                />
              </Box>
            </FallInPlace>
          </Box>
        </Stack>
      </Container>

      <BoxFeatures
        id="benefits"
        columns={[1, 2, 4]}
        iconSize={4}
        innerWidth="container.xl"
        pt="20"
        features={[
          {
            title: '100K+',
            icon: DollarSign,
            description: 'Isplaćeno kliperima',
            iconPosition: 'left',
            delay: 0.6,
          },
          {
            title: '2,000+',
            icon: User,
            description:
              'Aktivnih klipera',
            iconPosition: 'left',
            delay: 0.8,
          },
          {
            title: '1.5B+',
            icon: EyeIcon,
            description:
              'Organskih pregleda',
            iconPosition: 'left',
            delay: 1,
          },
          {
            title: '51',
            icon: ImBullhorn,
            description:
              'Pokrenutih kampanja',
            iconPosition: 'left',
            delay: 1.1,
          },
        ]}
        reveal={FallInPlace}
      />
    </Box>
  )
}

const HighlightsSection = () => {
  return (
    <Highlights>
      <HighlightsItem
        colSpan={[1, null, 2]}
        title="Otključajte Potencijal Vašeg Sadržaja"
        delay={0}
      >
        <VStack alignItems="flex-start" spacing="8">
            <Text color="muted" fontSize="xl">
              Povežite se direktno sa talentovanim klip editorima spremnim da
              transformišu vaše najbolje trenutke u{' '}
              <Em>deljive, viralno spremne isečke</Em>. Ili, ako ste klip editor,
              pronađite uzbudljive projekte i{' '}
              <Em>zaradite prikazujući svoje veštine editovanja</Em>.
            </Text>
        </VStack>
      </HighlightsItem>
      <HighlightsItem title="Izgrađeno na Poverenju i Talentu" delay={0.5}>
        <Text color="muted" fontSize="lg">
          Verujemo u negovanje zajednice gde kreatori mogu sa poverenjem
          pronaći vešte klip editore, a klip editori mogu pronaći isplative
          prilike. Naša platforma je dizajnirana da ove veze učini glatkim i
          bezbednim.
        </Text>
      </HighlightsItem>
      <HighlightsTestimonialItem
        name="Aleks Strimer" // Or original "Alex Streamer"
        description="Kreator Sadržaja"
        avatar="/static/images/creator-avatar.jpg" // Replace with actual path
        gradient={['blue.300', 'teal.500']}
        delay={1}
      >
        „Ova platforma je revolucionisala način na koji upravljam svojim
        sadržajem! Pronašao sam neverovatne klip editore koji razumeju moj
        brend, i moj angažman je naglo porastao. Uštedela mi je toliko
        vremena, omogućavajući mi da se fokusiram na stvaranje.“
      </HighlightsTestimonialItem>
      <HighlightsItem
        colSpan={[1, null, 2]}
        delay={0.5}
        rowSpan={2}
        title="Povećajte Svoj Domet, Bez Napora"
        height="100%" // Attempt to make the card itself take full height of its grid cell
        // If HighlightsItem is a flex container, you might need:
        // display="flex"
        // flexDirection="column"
      >
        <VStack
          alignItems="flex-start"
          spacing="8"
          flexGrow={1} // Allows VStack to grow within HighlightsItem
          justifyContent="space-around" // ✅ centriranje vertikalno
          height="100%" // Ensures VStack tries to use all available height
          // justifyContent="space-between" // Optional: if you want to space out content within
        >
            <Text color="muted" fontSize="lg">
                Kreatorima pružamo alate za lako postavljanje sadržaja, određivanje nagrada
                i praćenje performansi u realnom vremenu. Bez potrebe za tehničkim znanjem,
                mogu definisati šta traže, koliko su spremni da plate i direktno komunicirati
                sa editorima. <Br /><Br />
                Klip editorima nudimo stalan priliv izazovnih projekata, priliku da izgrade
                svoj portfolio i unovče svoju strast kroz rad sa poznatim (i rastućim)
                kreatorima. Svaki editor ima slobodu da bira projekte, postavi cene i prikaže
                svoje veštine svetu. Naša platforma osigurava pošten sistem nagrađivanja,
                bezbedne isplate i zajednicu koja podržava tvoj rast.
            </Text>

          <Wrap mt="8">
            {[
              'Lako Postavljanje za Kreatore',
              'Sigurne Isplate za Klip Editore',
              'Otkrijte Vrhunske Talente',
              'Fleksibilna Zarada',
              'Kontrola Kvaliteta',
              'Direktna Komunikacija',
              'Izgradnja Portfolija',
              'Pošten Sistem Nagrađivanja',
              'Otkrivanje Sadržaja',
              'Podrška Zajednice',
              'Prilagođeno Mobilnim Uređajima',
              'Trenutna Obaveštenja',
              'Analitika Performansi (za Kreatore)',
              'Prikazivanje Veština (za Klip Editore)',
            ].map((value) => (
              <Tag
                key={value}
                variant="subtle"
                colorScheme="primary"
                rounded="full"
                px="3"
              >
                {value}
              </Tag>
            ))}
          </Wrap>
        </VStack>
      </HighlightsItem>
      <HighlightsTestimonialItem
        delay={1}
        name="Džejmi Li"
        description="Profi Klip Editor"
        avatar="/static/images/clipper-avatar.jpg" // Replace with actual path
        gradient={['pink.400', 'orange.600']}
      >
        „Bavim se klipovanjem godinama, i ovo je najbolje mesto za
        pronalaženje stalnog posla od različitih kreatora. Sistem plaćanja je
        pouzdan, i volim da pomažem strimerima da razviju svoje kanale mojim
        editima!“
      </HighlightsTestimonialItem>
    </Highlights>
  )
}

const FeaturesSection = () => {
    return (
        <Features
            id="funkcionalnosti"
            title={
                <Heading
                    lineHeight="short"
                    fontSize={['2xl', null, '4xl']}
                    textAlign="left"
                    as="p"
                >
                    Povezujemo Kreatore i
                    <Br /> Klip Editore za Uspeh.
                </Heading>
            }
            description={
                <>
                    Naša platforma omogućava kreatorima da objave kampanje sa
                    budžetom i ciljem pregleda, dok klip editori stvaraju klipove i
                    takmiče se za nagrade.
                    <Br />
                    Pronađite idealnog saradnika i povećajte svoj domet.
                </>
            }
            align="left"
            columns={[1, 2, 3]}
            iconSize={4}
            features={[
                {
                    title: 'Jednostavno Postavljanje Kampanja',
                    icon: UploadCloud,
                    description:
                        'Kreatori lako kreiraju kampanje sa jasnim zadacima i budžetom za klip editore.',
                    variant: 'inline',
                    delay: 0
                },
                {
                    title: 'Prijavljivanje na Kampanje',
                    icon: Search,
                    description:
                        'Klip editori mogu pregledati dostupne kampanje i prijaviti se za one koje odgovaraju njihovim veštinama.',
                    variant: 'inline',
                  delay: 0.5
                },
                {
                    title: 'Sigurna Isplata po Učinku',
                    icon: Shield,
                    description:
                        'Sistem osigurava da klip editori budu plaćeni po broju pregleda ili unapred dogovorenim nagradama.',
                    variant: 'inline',
                  delay: 1
                },
                {
                    title: 'Pregled Profila i Portfolija',
                    icon: Users,
                    description:
                        'Kreatori mogu pregledati radove i ocene klip editora pre nego što ih angažuju.',
                    variant: 'inline',
                  delay: 1.5
                },
                {
                    title: 'Izgradnja Profesionalnog Portfolija',
                    icon: Award,
                    description:
                        'Svaki uspešan klip doprinosi reputaciji klip editora i povećava šanse za nove angažmane.',
                    variant: 'inline',
                  delay: 2
                },
                {
                    title: 'Direktna i Jasna Komunikacija',
                    icon: MessageSquare,
                    description:
                        'Olakšavamo komunikaciju između kreatora i klip editora za brzu i kvalitetnu saradnju.',
                    variant: 'inline',
                  delay: 2.5
                },
            ]}
        />
    )
}

const TestimonialsSection = () => {
  const columns = React.useMemo(() => {
    return testimonials.items.reduce<Array<typeof testimonials.items>>(
      (columns, t, i) => {
        columns[i % 3].push(t)

        return columns
      },
      [[], [], []],
    )
  }, [])

  return (
    <Testimonials
      title={testimonials.title}
      columns={[1, 2, 3]}
      innerWidth="container.xl"
    >
      <>
        {columns.map((column, i) => (
          <Stack key={i} spacing="8">
            {column.map((t, i) => (
              <Testimonial delay={i/2} key={i} {...t} />
            ))}
          </Stack>
        ))}
      </>
    </Testimonials>
  )
}

const PricingSection = () => {
  return (
    <Pricing {...pricing}>
      <Text p="8" textAlign="center" color="muted">
        VAT may be applicable depending on your location.
      </Text>
    </Pricing>
  )
}

const FaqSection = () => {
  return <Faq {...faq} />
}

export default Home
