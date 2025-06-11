import { NextRequest, NextResponse } from 'next/server';
import { addUser } from '../../../lib/firebase/firestore'


export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const websiteEmail = searchParams.get('email');

  if (!code || !websiteEmail) {
    return NextResponse.json({ error: 'Missing code or email' }, { status: 400 });
  }

  try {
    // Step 1: Exchange code for Discord token
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.DISCORD_REDIRECT_URI!,
      scope: 'identify email',
    });

    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'Failed to retrieve access token' }, { status: 400 });
    }

    // Step 2: Fetch user info from Discord
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const userData = await userRes.json();
    if (!userData.username) {
      return NextResponse.json({ error: 'Failed to retrieve Discord user info' }, { status: 400 });
    }

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