'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner, Center, Text } from '@chakra-ui/react'

const DiscordCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const linkDiscordAccount = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const email = localStorage.getItem('userEmail'); // Retrieve the logged-in user's email

      if (!code || !email) {
        console.log(`email: ${email}`);
        console.log(`code: ${code}`);
        // alert('Missing code or email');
        router.push('/dashboard/profile');
        return;
      }

      try {
        const res = await fetch(`/api/discord/link?code=${code}&email=${email}`);
        const data = await res.json();

        if (res.ok) {
          // alert(`Discord account linked: ${data.discordUsername}`);
          router.push('/dashboard/profile');
        } else {
          // alert(data.error || 'Failed to link Discord account');
          router.push('/dashboard/profile');
        }
      } catch (error) {
        console.error('Error linking Discord account:', error);
        // alert('An error occurred while linking your Discord account.');
        router.push('/dashboard/profile');
      }
    };

    linkDiscordAccount();
  }, [router]);

  return (
    <Center minH="100vh">
      <Text>Povezivanje vašeg naloga...</Text>
      <Spinner />
    </Center>
  );
};

export default DiscordCallback;