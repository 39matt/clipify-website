import { NextRequest, NextResponse } from 'next/server';



import { adminDb } from '../../../../lib/firebase/firebaseAdmin';


function parseSocialLink(accountLink) {
  let platform = 'Unknown'
  let username: string | undefined = '';
  const cleanAccountLink = accountLink.trim()

  try {
    const urlString = cleanAccountLink.startsWith('http')
      ? cleanAccountLink
      : `https://${cleanAccountLink}`

    const parsedUrl = new URL(urlString)
    const hostname = parsedUrl.hostname.toLowerCase()
    const pathname = parsedUrl.pathname

    if (hostname.includes('tiktok.com')) {
      platform = 'TikTok'
      const match = pathname.match(/@([^/]+)/)
      username = match ? match[1] : pathname.split('/').filter(Boolean).pop()
    } else if (hostname.includes('instagram.com')) {
      platform = 'Instagram'
      username = pathname.split('/').filter(Boolean).pop()
    } else if (
      hostname.includes('youtube.com') ||
      hostname.includes('youtu.be')
    ) {
      platform = 'YouTube'
      const match = pathname.match(/@([^/]+)/)
      username = match ? match[1] : pathname.split('/').filter(Boolean).pop()
    }
  } catch (error) {
    platform = 'Invalid'
  }

  return { platform, username }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, accountLink } = body;

    if (!uid || uid.trim() === '') {
      return NextResponse.json(
        { message: 'UID is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!accountLink || accountLink.trim() === '') {
      return NextResponse.json(
        { message: 'Account link is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const cleanUid = uid.trim();
    const cleanAccountLink = accountLink.trim();

    console.log(
      'Adding verification for UID:',
      cleanUid,
      'Link:',
      cleanAccountLink
    );

    let { username, platform } = parseSocialLink(cleanAccountLink);

    // if (cleanAccountLink.toLowerCase().includes('tiktok')) {
    //   platform = 'TikTok';
    //   if (cleanAccountLink.includes('@')) {
    //     username = cleanAccountLink.split('@')[1].split('/')[0];
    //   } else {
    //     const parts = cleanAccountLink.split('/').filter((part) => part !== '');
    //     username = parts[parts.length - 1];
    //   }
    // } else if (cleanAccountLink.toLowerCase().includes('instagram')) {
    //   platform = 'Instagram'
    //   const parts = cleanAccountLink.split('/').filter((part) => part !== '');
    //   username = parts[parts.length - 1];
    // } else {
    //   platform = 'YouTube'
    //   const parts = accountLink.split('@').filter((part) => part !== '')
    //   username = parts[parts.length - 1].includes('?')
    //     ? parts[parts.length - 1].split('?')[0]
    //     : parts[parts.length - 1]
    // }

    if (!username || username.trim() === '') {
      return NextResponse.json(
        { message: 'Could not extract username from account link' },
        { status: 400 }
      );
    }

    const verification: IVerification = {
      platform,
      username: username.trim(),
      code: Math.floor(100000 + Math.random() * 900000),
    };

    await adminDb
      .collection('users')
      .doc(cleanUid)
      .collection('verifications')
      .add(verification);

    return NextResponse.json(
      {
        status: 200,
        verification,
        message: 'Verification added successfully!',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error adding verification:', err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Failed to add verification due to unknown error',
      },
      { status: 500 }
    );
  }
}