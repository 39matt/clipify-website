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
import { FiHome, FiUsers, FiSettings, FiHelpCircle, FiCompass, FiUser, FiFlag } from 'react-icons/fi'
import { LayoutProvider, useLayoutContext } from './dashboard/context';
import { logout } from '../lib/firebase/auth';
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { RiAdminLine } from 'react-icons/ri'
import { MdAdminPanelSettings } from 'react-icons/md'
import { GrUserAdmin } from 'react-icons/gr'
import Cookies from 'js-cookie'
import { getIdToken } from '@firebase/auth'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <LayoutContent>{children}</LayoutContent>
    </LayoutProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading, discordUsername, isAdmin } = useLayoutContext();
  const [showAdmin, setShowAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setShowAdmin(isAdmin!);
  }, [isAdmin])

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
              src="/logo.svg"
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
              <NavItem _hover={{cursor:"pointer"}} icon={<FiUser />} onClick={()=>router.push('/dashboard/profile')} isActive={pathname.includes("/profile")}>Profil</NavItem>
              <NavItem _hover={{cursor:"pointer"}} icon={<FiCompass />} onClick={()=>router.push('/campaigns')} isActive={pathname.includes("/campaigns") && !pathname.includes("/finished")}>
                Aktivne kampanje
              </NavItem>
              {/*<NavItem _hover={{cursor:"pointer"}} icon={<FiFlag />} onClick={()=>router.push('/campaigns/finished')} isActive={pathname.includes("/campaigns/finished")}>*/}
              {/*  Završene kampanje*/}
              {/*</NavItem>*/}
              <NavItem _hover={{cursor:"pointer"}} icon={<FiSettings />} onClick={()=>router.push('/dashboard/accounts')} isActive={pathname.includes("/accounts")}>Vaši nalozi</NavItem>
              {showAdmin && <NavItem _hover={{cursor:"pointer"}} icon={<GrUserAdmin />} onClick={ async ()=>{
                router.push('/dashboard/admin')
              }} isActive={pathname.includes("/admin")}>Admin panel</NavItem>}

            </NavGroup>

            {/*<NavGroup title="Vaše kampanje" isCollapsible>*/}
            {/*  <NavItem>Baka Prase - Gamba</NavItem>*/}
            {/*  <NavItem>Guh Saiyan - IRL</NavItem>*/}
            {/*</NavGroup>*/}


          </SidebarSection>
        </Sidebar>
      }
    >
      <Flex
          ml={{ base: 0, md: '280px' }}
          justify="center"
          align="center"
      >
          {children}
      </Flex>
    </AppShell>
  );
}