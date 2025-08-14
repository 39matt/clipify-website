import { NextRequest, NextResponse } from 'next/server';
import { IAccount } from '../../../../lib/models/account'
import { removeVerification } from '../remove/route'

export async function verifyVerification(
  uid: string,
  verification: IVerification,
  api_key: string
) {
  try {
    const url =
      verification.platform === 'Instagram'
        ? `https://instagram-looter2.p.rapidapi.com/profile?username=${verification.username}`
        : `https://tiktok-api23.p.rapidapi.com/api/user/info?uniqueId=${verification.username}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': api_key,
        'x-rapidapi-host':
          verification.platform === 'Instagram'
            ? 'instagram-looter2.p.rapidapi.com'
            : 'tiktok-api23.p.rapidapi.com',
      },
    });

    const parsedBody = await response.json();

    let bio: string | null = null;

    if (verification.platform === 'Instagram') {
      bio = parsedBody.biography || null;
    } else if (verification.platform === 'TikTok') {
      bio = parsedBody.userInfo?.user?.signature || null;
    }

    if (bio?.includes(verification.code.toString())) {
      const account: IAccount = {
        platform: verification.platform,
        username: verification.username,
        link:
          verification.platform === 'Instagram'
            ? `https://www.instagram.com/${verification.username}`
            : `https://www.tiktok.com/@${verification.username}`,

      };

      await removeVerification(uid);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

      await fetch(`${baseUrl}/api/user/account/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          account,
        }),
      });

      return { success: true, account };
    } else {
      return { success: false };
    }
  } catch (error) {
    console.error('Error verifying verification:', error);
    throw new Error('Verification failed!');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, verification, api_key } = body;

    if (!uid || !verification) {
      return NextResponse.json(
        { message: 'UID and verification are mandatory!' },
        { status: 400 }
      );
    }

    if (!api_key) {
      return NextResponse.json(
        { message: 'Missing RapidAPI key in environment variables' },
        { status: 400 }
      );
    }

    const result = await verifyVerification(uid, verification, api_key);

    return NextResponse.json(
      {
        result,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error verifying account:', err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Failed to verify account due to unknown error',
      },
      { status: 500 }
    );
  }
}