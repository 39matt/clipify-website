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
  MenuItem, Image,
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

export default function Layout(props: {children: React.ReactNode }) {
  return (
    <AppShell
      children={props.children}
      sidebar={
        <Sidebar toggleBreakpoint="sm">
          <SidebarToggleButton />
          <SidebarSection direction="row">
            <Image
              src="https://saas-ui.dev/favicons/favicon-96x96.png"
              boxSize="7"
            />
            <Spacer />
            <Menu>
              <MenuButton
                as={IconButton}
                icon={
                  <PersonaAvatar
                    presence="online"
                    size="xs"
                    src="/showcase-avatar.jpg"
                  />
                }
                variant="ghost"
              />
              <MenuList>
                <MenuItem>Sign out</MenuItem>
              </MenuList>
            </Menu>
          </SidebarSection>
          <SidebarSection flex="1" overflowY="auto">
            <NavGroup>
              <NavItem icon={<FiHome />} isActive>
                Home
              </NavItem>
              <NavItem icon={<FiUsers />}>Users</NavItem>
              <NavItem icon={<FiSettings />}>Settings</NavItem>
            </NavGroup>

            <NavGroup title="Teams" isCollapsible>
              <NavItem>Sales</NavItem>
              <NavItem>Support</NavItem>
            </NavGroup>

            <NavGroup title="Tags" isCollapsible>
              <NavItem
                icon={<Badge bg="purple.500" boxSize="2" borderRadius="full" />}
              >
                <Text>Lead</Text>
                <Badge opacity="0.6" borderRadius="full" bg="none" ms="auto">
                  83
                </Badge>
              </NavItem>
              <NavItem
                icon={<Badge bg="cyan.500" boxSize="2" borderRadius="full" />}
              >
                <Text>Customer</Text>
                <Badge opacity="0.6" borderRadius="full" bg="none" ms="auto">
                  210
                </Badge>
              </NavItem>
            </NavGroup>
          </SidebarSection>
          <SidebarSection>
            <NavItem icon={<FiHelpCircle />}>Documentation</NavItem>
          </SidebarSection>
        </Sidebar>
      }
    />
  )
}
