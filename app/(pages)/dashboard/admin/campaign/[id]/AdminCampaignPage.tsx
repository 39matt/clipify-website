'use client';

import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  SimpleGrid,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  Switch,
  Text,
  VStack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { getDownloadURL, uploadBytes } from 'firebase/storage'
import { usePathname, useRouter } from 'next/navigation';
import { FiAlertCircle, FiDollarSign, FiLink, FiSave, FiSettings, FiTrash2 } from 'react-icons/fi';



import { useEffect, useState } from 'react';



import { deleteImageFromStorage, uploadCampaignImage } from '../../../../../lib/firebase/storage';
import { ICampaign } from '../../../../../lib/models/campaign';


interface AdminCampaignPageProps {
  idToken: string
}

const AdminCampaignPage: React.FC<AdminCampaignPageProps> = ({ idToken }) => {
  const pathname = usePathname()
  const campaignId = pathname.split('/').pop()
  const [campaign, setCampaign] = useState<ICampaign | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)
  const router = useRouter()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [confirmName, setConfirmName] = useState('')
  const [deleting, setDeleting] = useState(false)

  const cardBg = useColorModeValue('white', 'gray.800')
  const inputBg = useColorModeValue(
    'rgba(0,0,0,0.03)',
    'rgba(255,255,255,0.05)',
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (!campaignId) return
        const responseJson = await fetch(`/api/campaign/get?id=${campaignId}`)
        const data = await responseJson.json()
        setCampaign(data.campaign)
      } catch (err) {
        toast({
          title: 'Greška',
          description: 'Neuspešno učitavanje',
          status: 'error',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [campaignId, toast])

  const handleChange = (field: keyof ICampaign, value: any) => {
    if (campaign) {
      setCampaign({ ...campaign, [field]: value })
    }
  }


  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !campaign) return

    try {
      setSaving(true)

      if (campaign.imageUrl) {
        setImageToDelete(campaign.imageUrl)
      }

      const newUrl = await uploadCampaignImage(file);

      handleChange('imageUrl', newUrl)

      toast({ title: 'Nova slika spremna za čuvanje!', status: 'info' })
    } catch (err) {
      toast({ title: 'Greška pri uploadu', status: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch(`/api/campaign/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaign }),
      })

      if (response.ok) {
        if (imageToDelete) {
          await deleteImageFromStorage(imageToDelete)
          setImageToDelete(null)
        }
        toast({ title: 'Promene sačuvane!', status: 'success' })
      }
    } catch (err) {
      toast({ title: 'Greška pri čuvanju', status: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (confirmName !== campaign?.influencer) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/campaign/delete?id=${campaignId}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        toast({ title: 'Kampanja obrisana', status: 'success' })
        router.push('/dashboard/admin')
      }
    } catch (err) {
      toast({ title: 'Greška pri brisanju', status: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  if (loading || !campaign) {
    return (
      <Center minH="100vh">
        <VStack>
          <Spinner size="xl" color="green.400" />
          <Text>Učitavanje detalja kampanje...</Text>
        </VStack>
      </Center>
    )
  }

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(4px)" />
        <ModalContent>
          <ModalHeader>Potvrdi brisanje</ModalHeader>
          <ModalBody>
            <VStack spacing={4} align="start">
              <Text fontSize="sm">
                Da biste obrisali kampanju <strong>{campaign.influencer}</strong>, unesite ime kampanje ispod:
              </Text>
              <Input
                placeholder="Unesite ime ovde..."
                value={confirmName}
                onChange={(e) => setConfirmName(e.target.value)}
                focusBorderColor="red.400"
              />
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>Odustani</Button>
            <Button
              colorScheme="red"
              isDisabled={confirmName !== campaign.influencer}
              isLoading={deleting}
              onClick={handleDelete}
            >
              Trajno obriši
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Box
      minH="100vh"
      py={10}
      px={{ base: 4, md: 8 }}
      bgGradient="linear(to-br, gray.900, gray.800)"
    >
      <VStack spacing={8} maxW="1400px" mx="auto" align="stretch">
        {/* Header Section */}
        <HStack justify="space-between" wrap="wrap" spacing={4}>
          <VStack align="start" spacing={0}>
            <Heading size="lg" color="gray.700">
              {campaign.influencer}
            </Heading>
            <Text color="gray.500" fontWeight="medium">
              {campaign.activity}
            </Text>
          </VStack>
        </HStack>

        {/* Read Only Stats */}
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          <ReadOnlyStat label="Ukupno Pregleda" value={campaign.totalViews} />
          <ReadOnlyStat label="Lajkovi" value={campaign.totalLikes} />
          <ReadOnlyStat
            label="Potrošeno"
            value={`$${campaign.moneySpent.toFixed(2)}`}
          />
          <ReadOnlyStat label="Progress" value={`${campaign.progress}%`} />
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, xl: 3 }} spacing={8}>
          <VStack spacing={8} gridColumn={{ xl: 'span 2' }}>
            {/* Primary Settings */}
            <Box
              w="full"
              bg={cardBg}
              p={6}
              borderRadius="2xl"
              shadow="sm"
              borderWidth="1px"
            >
              <Heading
                size="sm"
                mb={6}
                textTransform="uppercase"
                color="gray.400"
                letterSpacing="wider"
              >
                <Icon as={FiSettings} mr={2} /> Osnovna Podešavanja
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">
                    Influencer Name
                  </FormLabel>
                  <Input
                    value={campaign.influencer}
                    bg={inputBg}
                    onChange={(e) => handleChange('influencer', e.target.value)}
                  />
                </FormControl>

                <FormControl gridColumn={{ md: "span 2" }}>
                  <FormLabel fontSize="xs" fontWeight="bold">
                    Cover Slika Kampanje
                  </FormLabel>
                  <HStack spacing={6} align="center" bg={inputBg} p={4} borderRadius="xl" borderWidth="1px" borderStyle={imageToDelete ? "dashed" : "solid"} borderColor={imageToDelete ? "orange.300" : "inherit"}>
                    <Box position="relative">
                      <Image
                        src={campaign.imageUrl || 'https://via.placeholder.com/150'}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="lg"
                        fallbackSrc="https://via.placeholder.com/150"
                        shadow="md"
                      />
                      {imageToDelete && (
                        <Badge position="absolute" top="-2" right="-2" colorScheme="orange" variant="solid" borderRadius="full">
                          New
                        </Badge>
                      )}
                    </Box>

                    <VStack align="start" flex={1} spacing={2}>
                      <Text fontSize="xs" color="gray.500">
                        Kliknite ispod da biste izabrali novu sliku. Stara slika će biti obrisana tek kada kliknete na <strong>"Sačuvaj izmene"</strong>.
                      </Text>
                      <Input
                        type="file"
                        accept="image/*"
                        p={1}
                        height="auto"
                        variant="unstyled"
                        onChange={handleImageUpload}
                        disabled={saving}
                      />
                      {imageToDelete && (
                        <HStack color="orange.500" spacing={1}>
                          <Icon as={FiAlertCircle} boxSize={3} />
                          <Text fontSize="10px" fontWeight="bold">Promena nije sačuvana u bazi!</Text>
                        </HStack>
                      )}
                    </VStack>
                  </HStack>
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">
                    Activity Name
                  </FormLabel>
                  <Input
                    value={campaign.activity}
                    bg={inputBg}
                    onChange={(e) => handleChange('activity', e.target.value)}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel fontSize="xs" fontWeight="bold">
                    Discord Invite Link
                  </FormLabel>
                  <InputGroup>
                    <InputLeftAddon bg="blue.500" color="white">
                      <FiLink />
                    </InputLeftAddon>
                    <Input
                      value={campaign.discordInvite}
                      bg={inputBg}
                      onChange={(e) =>
                        handleChange('discordInvite', e.target.value)
                      }
                    />
                  </InputGroup>
                </FormControl>

                <HStack spacing={4} pt={6}>
                  <FormControl
                    display="flex"
                    alignItems="center"
                    bg={inputBg}
                    p={3}
                    borderRadius="lg"
                  >
                    <FormLabel mb="0" fontSize="sm" flex="1">
                      Active
                    </FormLabel>
                    <Switch
                      colorScheme="green"
                      isChecked={campaign.isActive}
                      onChange={(e) =>
                        handleChange('isActive', e.target.checked)
                      }
                    />
                  </FormControl>
                  <FormControl
                    display="flex"
                    alignItems="center"
                    bg={inputBg}
                    p={3}
                    borderRadius="lg"
                  >
                    <FormLabel mb="0" fontSize="sm" flex="1">
                      Pot System
                    </FormLabel>
                    <Switch
                      colorScheme="purple"
                      isChecked={campaign.isPot}
                      onChange={(e) => handleChange('isPot', e.target.checked)}
                    />
                  </FormControl>
                </HStack>
              </SimpleGrid>
            </Box>

            {/* Financials & Limits */}
            <Box
              w="full"
              bg={cardBg}
              p={6}
              borderRadius="2xl"
              shadow="sm"
              borderWidth="1px"
            >
              <Heading
                size="sm"
                mb={6}
                textTransform="uppercase"
                color="gray.400"
                letterSpacing="wider"
              >
                <Icon as={FiDollarSign} mr={2} /> Isplate i Ograničenja
              </Heading>

              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                <InputField
                  label="Total Budget ($)"
                  value={campaign.budget}
                  onChange={(v) => handleChange('budget', v)}
                />
                <InputField
                  label="Per Million ($)"
                  value={campaign.perMillion}
                  onChange={(v) => handleChange('perMillion', v)}
                />
                <InputField
                  label="Min Views/Payout"
                  value={campaign.minViewsForPayout}
                  onChange={(v) => handleChange('minViewsForPayout', v)}
                />

                <InputField
                  label="Max Earnings ($)"
                  value={campaign.maxEarnings}
                  onChange={(v) => handleChange('maxEarnings', v)}
                />
                <InputField
                  label="Max / Post ($)"
                  value={campaign.maxEarningsPerPost}
                  onChange={(v) => handleChange('maxEarningsPerPost', v)}
                />
                <InputField
                  label="Max Submissions"
                  value={campaign.maxSubmissions}
                  onChange={(v) => handleChange('maxSubmissions', v)}
                />
              </SimpleGrid>

              {campaign.isPot && (
                <FormControl mt={6}>
                  <FormLabel fontSize="xs" fontWeight="bold" color="purple.500">
                    Pot System Text (Per Million Text)
                  </FormLabel>
                  <Input
                    value={campaign.perMillionText}
                    borderColor="purple.200"
                    placeholder="e.g. $500 shared pot"
                    onChange={(e) =>
                      handleChange('perMillionText', e.target.value)
                    }
                  />
                </FormControl>
              )}
            </Box>
            <Button
              leftIcon={<FiSave />}
              colorScheme="green"
              size="lg"
              isLoading={saving}
              onClick={handleSave}
              px={10}
            >
              Sačuvaj izmene
            </Button>
          </VStack>

          {/* Navigation Sidebar */}
          <VStack spacing={4} w="full">
            <Box w="full" p={6} bg="gray.800" borderRadius="2xl" color="white">
              <Text fontWeight="bold" mb={4} fontSize="sm" color="gray.400">
                ADMIN AKCIJE
              </Text>
              <VStack spacing={3}>
                <NavButton
                  label="Svi Videi"
                  colorScheme="whiteAlpha"
                  onClick={() =>
                    router.push(
                      `/dashboard/admin/campaign/${campaignId}/all-videos`,
                    )
                  }
                />
                <NavButton
                  label="Neodobreni Videi"
                  colorScheme="orange"
                  onClick={() =>
                    router.push(
                      `/dashboard/admin/campaign/${campaignId}/unapproved-videos`,
                    )
                  }
                />
                <NavButton
                  label="Unovčavanje"
                  colorScheme="green"
                  onClick={() =>
                    router.push(
                      `/dashboard/admin/campaign/${campaignId}/revenue-approval`,
                    )
                  }
                />
              </VStack>
              <Divider my={6} opacity={0.2} />
              <Button
                w="full"
                variant="outline"
                color="white"
                _hover={{ bg: 'whiteAlpha.200' }}
                onClick={() =>
                  window.open(`/client/dashboard/${campaignId}`, '_blank')
                }
              >
                Klijent Dashboard
              </Button>
            </Box>

            <HStack
              bg="orange.50"
              p={4}
              borderRadius="xl"
              border="1px solid"
              borderColor="orange.200"
              spacing={3}
            >
              <Icon as={FiAlertCircle} color="orange.400" />
              <Text fontSize="xs" color="orange.800">
                Pregledi, lajkovi i ostale statistike se automatski sinhronizuju
                i ne mogu se menjati ručno.
              </Text>
            </HStack>
          </VStack>
        </SimpleGrid>
        <Box w="full" mt={10} p={6} border="1px solid" borderColor="red.200" borderRadius="2xl" bg="red.100">
          <HStack justify="space-between">
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" color="red.600">Danger Zone</Text>
              <Text fontSize="xs" color="red.500">Ova akcija je trajna i obrisala bi sve video snimke i statistiku.</Text>
            </VStack>
            <Button leftIcon={<FiTrash2 />} bg={"red.500"} color={"whiteAlpha.500"} variant="outline" onClick={onOpen}>
              Obriši kampanju
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
      </>
  )
}

// Helper Components
const ReadOnlyStat = ({
  label,
  value,
}: {
  label: string
  value: string | number
}) => (
  <Stat p={4} shadow="sm" borderRadius="xl" borderWidth="1px">
    <StatLabel color="gray.500" fontSize="xs" textTransform="uppercase">
      {label}
    </StatLabel>
    <StatNumber fontSize="xl" fontWeight="bold">
      {value}
    </StatNumber>
  </Stat>
)

const InputField = ({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (v: number) => void
}) => (
  <FormControl>
    <FormLabel fontSize="xs" fontWeight="bold" color="gray.600">
      {label}
    </FormLabel>
    <NumberInput
      value={value}
      onChange={(_, val) => onChange(val)}
      precision={2}
    >
      <NumberInputField bg="rgba(0,0,0,0.03)" />
    </NumberInput>
  </FormControl>
)

const NavButton = ({ label, onClick, colorScheme = 'blue' }: any) => (
  <Button
    w="full"
    size="lg"
    colorScheme={colorScheme}
    onClick={onClick}
    fontSize="sm"
  >
    {label}
  </Button>
)

export default AdminCampaignPage
