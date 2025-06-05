import {
  Box,
  Badge,
  Text,
  Spacer,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem, Image, Heading,
} from '@chakra-ui/react'
import {
  AppShell,
  Sidebar,
  SidebarToggleButton,
  SidebarSection,
  NavItem,
  NavGroup,
  PersonaAvatar,
} from '@saas-ui/react'
import { FiHome, FiUsers, FiSettings, FiHelpCircle } from 'react-icons/fi'
import { NextPage } from 'next'

const Profile: NextPage = () => {
  return (
    <Box>
      <Heading textAlign='center' fontSize='48px'>
        User Profile
      </Heading>
    </Box>
  )
}
export default Profile