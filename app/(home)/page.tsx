'use client';

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
  chakra,
  useClipboard,
} from '@chakra-ui/react'
import { Br, Link } from '@saas-ui/react';
import { Faq } from 'components/home-page/faq';
import { Features } from 'components/home-page/features';
import { Hero } from 'components/home-page/hero';
import { Highlights, HighlightsItem, HighlightsTestimonialItem } from 'components/home-page/highlights';
import { Testimonial, Testimonials } from 'components/home-page/testimonials';
import { Em } from 'components/home-page/typography';
import {
  Award, BanknoteArrowUp,
  ChartLine,
  DollarSign,
  EyeIcon,
  MessageSquare,
  Search,
  Shield,
  UploadCloud,
  User,
  Users,
} from 'lucide-react'
import type { Metadata, NextPage } from 'next';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';
import { ImBullhorn } from 'react-icons/im';



import * as React from 'react';



import { ButtonLink } from '#components/home-page/button-link/button-link';
import { BoxFeatures } from '#components/home-page/features/box-features';
import { BackgroundGradient } from '#components/home-page/gradients/background-gradient';
import { FallInPlace } from '#components/home-page/motion/fall-in-place';
import { Pricing } from '#components/home-page/pricing/pricing';
import faq from '#data/faq';
import pricing from '#data/pricing';
import testimonials from '#data/testimonials';
import Steps from '#components/home-page/steps/steps'


const Home: NextPage = () => {
  return (
    <Box>
      <HeroSection />

      {/*<HighlightsSection />*/}

      <PricingSection />

      <StepsSection/>

      <FeaturesSection />

      {/*<TestimonialsSection />*/}


      <FaqSection />
    </Box>
  )
}

const HeroSection: React.FC = () => {
  return (
    <Flex
      direction="column"
      justifyContent="space-around"
      position="relative"
      overflow="hidden"
      w="full"
      minH="100vh"
      h="full"
    >
      <BackgroundGradient height="100%" zIndex="-1" />
      <Container
        maxW={{ base: "95%", md: "85%" }}
        w="full"
        pt={{ base: 16, md: 48 }}
        px={{ base: 4, md: 6 }}
      >
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align={{ base: "center", md: "center" }}
          justify="space-between"
          gap={{ base: 0, md: 8, lg: 0 }}
          mt={{ base: 24, md: 0 }}
        >
          <Box
            flex={{ base: "none", md: "0 1 40%" }}
            pr={{ base: 0, lg: 4 }}
            mb={{ base: 6, lg: 0 }}
            w="full"
            display="flex"
            alignItems="center"
          >
            <Hero
              px="0"
              title={
                <FallInPlace>
                  <Text fontSize={{ base: "32px", sm: "36px", md: "56px" }}>
                    Sve-u-jednom alat za{" "}
                    <chakra.span
                      color="green.400"
                      fontWeight="extrabold"
                      animation="pulseGlow 2s ease-in-out infinite"
                      sx={{
                        "@keyframes pulseGlow": {
                          "0%, 100%": {
                            textShadow: "0 0 5px rgba(72, 187, 120, 0.8), 0 0 20px rgba(72, 187, 120, 0.5)"
                          },
                          "50%": {
                            textShadow: "0 0 10px rgba(72, 187, 120, 1), 0 0 30px rgba(72, 187, 120, 0.8)"
                          },
                        },
                      }}
                    >
                      viralnost
                    </chakra.span>
                  </Text>
                </FallInPlace>
              }
              description={
                <FallInPlace delay={0.2} fontWeight="medium">
                  <Text fontSize={{ base: "16px", sm: "18px", md: "22px" }}>
                    Clipify povezuje kreatore i klipere kroz video sadržaj koji donosi{" "}
                    <chakra.em
                      color="white"
                      fontStyle="normal"
                      fontWeight="semibold"
                    >
                      rezultate
                    </chakra.em>
                    , sve je usmereno na{" "}
                    <chakra.em
                      color="white"
                      fontStyle="normal"
                      fontWeight="semibold"
                    >
                      stvarne preglede
                    </chakra.em>
                    , pravu publiku i vidljive rezultate.
                  </Text>
                </FallInPlace>
              }
            >
              <FallInPlace delay={0.4}>
                <HStack pt="4" pb={{ base: 6, md: 12 }} spacing="8"></HStack>

                <ButtonGroup
                  spacing={{ base: 0, md: 6 }}
                  alignItems="center"
                  flexDirection={{ base: "column", sm: "column", md: "row" }}
                  width="full"
                >
                  <ButtonLink
                    href="/signup"
                    colorScheme="primary"
                    size={{ base: "md", md: "lg" }}
                    px={{ base: 8, md: 10 }}
                    py={{ base: 6, md: 7 }}
                    fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                    width={{ base: "full", md: "auto" }}
                    mb={{ base: 4, md: 0 }}
                    borderRadius="xl"
                    shadow="lg"
                    _hover={{ transform: "translateY(-2px)", shadow: "xl" }}
                    _active={{ transform: "translateY(0)" }}
                    transition="all 0.2s ease"
                  >
                    Zaradi kao kliper
                  </ButtonLink>

                  <ButtonLink
                    href="/kontakt"
                    size={{ base: "md", md: "lg" }}
                    variant="outline"
                    px={{ base: 8, md: 10 }}
                    py={{ base: 6, md: 7 }}
                    fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                    width={{ base: "full", md: "auto" }}
                    borderRadius="xl"
                    shadow="sm"
                    rightIcon={
                      <Icon
                        as={FiArrowRight}
                        transition="transform 0.2s ease"
                        _groupHover={{ transform: "translateX(4px)" }}
                      />
                    }
                    _hover={{ bg: "gray.50", _dark: { bg: "gray.700" } }}
                  >
                    Napravi svoju kampanju
                  </ButtonLink>
                </ButtonGroup>
              </FallInPlace>
            </Hero>
          </Box>

          <Box
            flex={{ base: "none", md: "0 1 50%" }}
            pl={{ base: 0, lg: 4 }}
            w="full"
            display="flex"
            justifyContent="center"
            alignItems="center"
            overflow="hidden"
            mt={{ base: 4, md: 0 }}
          >
            <FallInPlace delay={0.6}>
              <Box
                width="auto"
                overflow="hidden"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Image
                  src="/static/images/heroimg3.png"
                  alt="Snimak ekrana liste kampanja u Clipster-u"
                  quality={75}
                  priority
                  width={1080}
                  height={1350}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxWidth: "600px",
                    maxHeight: "500px",
                    objectFit: "contain"
                  }}
                />
              </Box>
            </FallInPlace>
          </Box>
        </Flex>
      </Container>

      <BoxFeatures
        w="full"
        maxW={{ base: "95%", md: "85%" }}
        mx="auto"
        px={{ base: 4, md: 6 }}
        mt={{ base: 12, md: 16 }}
        id="benefits"
        columns={{ base: 1, sm: 2, md: 4 }}
        iconSize={4}
        features={[
          {
            title: '100.000+',
            icon: DollarSign,
            description: 'Dinara isplaćeno kliperima',
            iconPosition: 'left',
            delay: 0,
          },
          {
            title: '400+',
            icon: User,
            description: 'Aktivnih klipera',
            iconPosition: 'left',
            delay: 0.2,
          },
          {
            title: '20M+',
            icon: EyeIcon,
            description: 'Organskih pregleda',
            iconPosition: 'left',
            delay: 0.4,
          },
          {
            title: '4',
            icon: ImBullhorn,
            description: 'Pokrenutih kampanja',
            iconPosition: 'left',
            delay: 0.6,
          },
        ]}
        reveal={FallInPlace}
      />
    </Flex>  )
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
            as="h1"
            fontSize={['32px', '44px', '56px']}
            bgGradient="linear(to-r, white, #10b981)"
            bgClip="text"
            textAlign="center"
            fontWeight="extrabold"
            mt={24}
            mb={12}
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
            description1:
              'Kreatori lako kreiraju kampanje sa jasnim pravilima i budžetom za klipere.',
            variant: 'inline',
            delay: 0
          },
          {
            title: 'Učestvovanje u kampanjama',
            icon: Search,
            description1:
              'Kliperi imaju pristup svim dostupnim kampanjama i mogu učestvovati u onima koje im najviše odgovaraju.',
            variant: 'inline',
            delay: 0.2
          },
          {
            title: 'Sigurna i brza isplata',
            icon: Shield,
            description1:
              'Kliperi dobijaju sigurnu i brzu isplatu za svaki pregled koji ostvare - bez čekanja i komplikacija.',
            variant: 'inline',
            delay: 0.4
          },
          {
            title: 'Kompletna statistika',
            icon: ChartLine,
            description1:
              'Kliperi u svakom trenutku imaju jasan pregled svoje zarade i broja pregleda.',
            variant: 'inline',
            delay: 0.6
          },
          {
            title: 'Mogucnost ostvarivanja bonusa',
            icon: BanknoteArrowUp,
            description1:
              'Kliperi mogu ostvariti dodatne bonuse zasnovane na rezultatima i aktivnostima u kampanjamas',
            variant: 'inline',
            delay: 0.8
          },
          {
            title: 'Direktna i jasna komunikacija',
            icon: Users,
            description1:
              'Kliperi imaju direktnu i jasnu komunikaciju sa timom, što omogućava brzo rešavanje problema.',
            variant: 'inline',
            delay: 1
          },
        ]}
      />
    )
}
const StepsSection = () => {
  return (
    <Steps
      title="Kako Clipify Funkcioniše"
      description=""
      steps={[
        {
          number: "1",
          title: "Brendovi pokreću kampanje za par minuta",
          description: "Brendovi postave ciljeve i odrede budžet, a kampanja je odmah spremna – bilo da je u pitanju Klipping, Muzicka, Logo ili UGC kampanja.",
          image: "/static/images/111.png",
          alt: ""
        },
        {
          number: "2",
          title: "Kliperi se uključuju i prave sadržaj",
          description: "Naša zajednica od preko 300 klipera bira kampanje koje im odgovaraju i objavljuje originalan, kvalitetan sadržaj na mrežama koje brendovi žele.",
          image: "/static/images/2222.png",
          alt: ""
        },
        {
          number: "3",
          title: "Clipify proverava rezultate",
          description: "Naša AI tehnologija proverava da li su pregledi i interakcije stvarni, uklanja lažne aktivnosti i daje ti jasne rezultate kampanje u realnom vremenu.",
          image: "/static/images/33.png",
          alt: ""
        },
        {
          number: "4",
          title: "Svi su na dobitku",
          description: "Brendovi plaćaju samo za ono što zaista daje rezultate, a kliperi odmah dobijaju isplatu za sadržaj koji donosi engagement.",
          image: "/static/images/4.png",
          alt: ""
        }
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
