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

      {/*<HighlightsSection />*/}

      <FeaturesSection />

      {/*<TestimonialsSection />*/}

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
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          align="center"
          gap={{ base: 8, lg: 24 }}
        >
          <Box flex="1"  pr={{ base: 0, lg: 8 }} mb={{ base: 8, lg: 0 }}>
            <Hero
              id="home"
              px="0"
              title={
                <FallInPlace>
                  <Text fontSize={{ base: '3xl', md: '5xl' }}>
                    Sve-u-jednom alat za
                    <Br /> viralnost
                  </Text>
                </FallInPlace>
              }
              description={
                <FallInPlace delay={0.2} fontWeight="medium">
                  <Text>
                    Clipify povezuje kreatore i klipere kroz video sadržaj koji donosi{' '}
                    <Em>rezultate</Em>, sve je usmereno na <Em>stvarne preglede</Em>,
                    pravu publiku i vidljive rezultate.
                  </Text>
                </FallInPlace>
              }
            >
              <FallInPlace delay={0.4}>
                <HStack pt="4" pb="12" spacing="8"></HStack>

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
                    mb={{ base: '2em', md: 0 }}
                  >
                    Pridruži se sada
                  </ButtonLink>
                  <ButtonLink
                    size="lg"
                    href="/kontakt"
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
          </Box>

          <Box flex="1" pl={{ base: 0, lg: 8 }}>
            <FallInPlace delay={0.6}>
              <Box
                width="100%"
                maxWidth="700px"
                mx="auto"
                overflow="hidden"
              >
                <Image
                  src="/static/screenshots/example.png"
                  alt="Snimak ekrana liste kampanja u Clipster-u"
                  quality={75}
                  priority
                  width={2000}
                  height={786}
                />
              </Box>
            </FallInPlace>
          </Box>
        </Flex>
      </Container>

      <BoxFeatures
        id="benefits"
        columns={[1, 2, 4]}
        iconSize={4}
        innerWidth="container.xl"
        pt="20"
        features={[
          {
            title: '100.000+',
            icon: DollarSign,
            description: 'Dinara isplaćeno kliperima',
            iconPosition: 'left',
            delay: 0,
          },
          {
            title: '250+',
            icon: User,
            description:
              'Aktivnih klipera',
            iconPosition: 'left',
            delay: 0.2,
          },
          {
            title: '10M+',
            icon: EyeIcon,
            description:
              'Organskih pregleda',
            iconPosition: 'left',
            delay: 0.4,
          },
          {
            title: '3',
            icon: ImBullhorn,
            description:
              'Pokrenutih kampanja',
            iconPosition: 'left',
            delay: 0.6,
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
              Clipify povezuje kreatore i klipere kroz video sadržaj koji donosi <Em>rezultate</Em>
              - sve je usmereno na <Em>stvarne preglede</Em>, pravu publiku i vidljive rezultate.
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
                    <Br /> Klipere za zajednički uspeh.
                </Heading>
            }
            description={
                <>
                  Kreatori postavljaju kampanje sa jasnim ciljem, a kliperi stvaraju sadržaj koji privlači pažnju i donosi rezultate
                </>
            }
            align="left"
            columns={[1, 2, 3]}
            iconSize={4}
            features={[
                {
                    title: 'Jednostavno Kreiranje Kampanja',
                    icon: UploadCloud,
                    description:
                        'Kreatori lako kreiraju kampanje sa jasnim pravilima i budžetom za klipere.',
                    variant: 'inline',
                    delay: 0
                },
                {
                    title: 'Učestvovanje u kampanjama',
                    icon: Search,
                    description:
                        'Kliperi imaju pristup svim dostupnim kampanjama i mogu učestvovati u onima koje im najviše odgovaraju.',
                    variant: 'inline',
                  delay: 0.5
                },
                {
                    title: 'Sigurna i brza isplata',
                    icon: Shield,
                    description:
                        'Kliperi dobijaju sigurnu i brzu isplatu za svaki pregled koji ostvare - bez čekanja i komplikacija.',
                    variant: 'inline',
                  delay: 1
                },
                {
                    title: 'Kompletna statistika',
                    icon: Award,
                    description:
                        'Kliperi u svakom trenutku imaju jasan pregled svoje zarade i broja pregleda.',
                    variant: 'inline',
                  delay: 1.5
                },
                {
                    title: 'Mogucnost ostvarivanja bonusa',
                    icon: MessageSquare,
                    description:
                        'Kliperi mogu ostvariti dodatne bonuse zasnovane na rezultatima i aktivnostima u kampanjamas',
                    variant: 'inline',
                  delay: 2
                },
                {
                  title: 'Direktna i jasna komunikacija',
                  icon: Users,
                  description:
                    'Kliperi imaju direktnu i jasnu komunikaciju sa timom, što omogućava brzo rešavanje problema.',
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
      </Text>
    </Pricing>
  )
}

const FaqSection = () => {
  return <Faq {...faq} />
}

export default Home
