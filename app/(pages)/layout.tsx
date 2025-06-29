'use client';

import {
  AppShell,
  Sidebar,
  SidebarToggleButton,
  SidebarSection,
  NavItem,
  NavGroup,
  PersonaAvatar,
} from '@saas-ui/react';
import {
  Badge,
  Text,
  Spacer,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
  Spinner,
  Center, Box, Flex,
} from '@chakra-ui/react';
import { FiHome, FiUsers, FiSettings, FiHelpCircle, FiCompass, FiUser } from 'react-icons/fi'
import { LayoutProvider, useLayoutContext } from './dashboard/context';
import { logout } from '../lib/firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <LayoutContent>{children}</LayoutContent>
    </LayoutProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, discordUsername } = useLayoutContext();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading || !user) {
    return (
      <Center minH="100vh">
        <Spinner />
      </Center>
    );
  }

  return (
    <AppShell
      sidebar={
        <Sidebar h="100vh" position="fixed" toggleBreakpoint="md" bg="gray.800" color="white">
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
                <MenuItem onClick={handleLogout}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          </SidebarSection>
          <SidebarSection flex="1">
            <NavGroup>
              <NavItem icon={<FiUser />} onClick={()=>router.push('/dashboard/profile')} isActive>Profil</NavItem>
              <NavItem icon={<FiCompass />} onClick={()=>router.push('/campaigns')}>
                Aktivne kampanje
              </NavItem>
              <NavItem icon={<FiSettings />} onClick={()=>router.push('/dashboard/accounts')}>Vaši nalozi</NavItem>
            </NavGroup>

            <NavGroup title="Vaše kampanje" isCollapsible>
              <NavItem>Baka Prase - Gamba</NavItem>
              <NavItem>Guh Saiyan - IRL</NavItem>
            </NavGroup>

            {/*<NavGroup title="Tags" isCollapsible>*/}
            {/*  <NavItem*/}
            {/*    icon={*/}
            {/*      <Badge bg="purple.500" boxSize="2" borderRadius="full" />*/}
            {/*    }*/}
            {/*  >*/}
            {/*    <Text>Lead</Text>*/}
            {/*    <Badge*/}
            {/*      opacity="0.6"*/}
            {/*      borderRadius="full"*/}
            {/*      bg="none"*/}
            {/*      ms="auto"*/}
            {/*    >*/}
            {/*      83*/}
            {/*    </Badge>*/}
            {/*  </NavItem>*/}
            {/*  <NavItem*/}
            {/*    icon={<Badge bg="cyan.500" boxSize="2" borderRadius="full" />}*/}
            {/*  >*/}
            {/*    <Text>Customer</Text>*/}
            {/*    <Badge*/}
            {/*      opacity="0.6"*/}
            {/*      borderRadius="full"*/}
            {/*      bg="none"*/}
            {/*      ms="auto"*/}
            {/*    >*/}
            {/*      210*/}
            {/*    </Badge>*/}
            {/*  </NavItem>*/}
            {/*</NavGroup>*/}
          </SidebarSection>
          {/*<SidebarSection>*/}
          {/*  <NavItem icon={<FiHelpCircle />}>Documentation</NavItem>*/}
          {/*</SidebarSection>*/}
        </Sidebar>
      }
    >
      <Flex
          ml={{ base: 0, md: '250px' }} // Offset for the sidebar
          justify="center" // Centers content horizontally
          align="center" // Centers content vertically
          p={6} // Padding for spacing
      >
          {children}
      </Flex>
    </AppShell>
  );
}