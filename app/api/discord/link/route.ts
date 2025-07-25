import { NextRequest, NextResponse } from 'next/server';
import { addUser } from '../../../lib/firebase/firestore/user'


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const websiteEmail = searchParams.get('email');

  if (!code || !websiteEmail) {
    return NextResponse.json({ error: 'Missing code or email' }, { status: 400 });
  }

  try {
    // Step 1: Exchange code for Discord token
    console.log(1);
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID!,
      client_secret: process.env.NEXT_PUBLIC_DISCORD_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI!,
      scope: 'identify email',
    });
    console.log(2);

    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });
    console.log(3);

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'Failed to retrieve access token' }, { status: 400 });
    }
    console.log(4);

    // Step 2: Fetch user info from Discord
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    console.log(5);

    const userData = await userRes.json();
    if (!userData.username) {
      return NextResponse.json({ error: 'Failed to retrieve Discord user info' }, { status: 400 });
    }
    console.log(6);

    // Step 3: Use Discord username as document ID
    const discordUsername = userData.username;

    // Step 4: Link Discord account to Firestore
    await addUser(websiteEmail, discordUsername);

    // Step 5: Return success response
    return NextResponse.json({ success: true, discordUsername });
  } catch (error) {
    console.error('Error linking Discord account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}