import { NextRequest, NextResponse } from 'next/server';
import { IAccount } from '../../../../lib/models/account'
import { adminDb } from '../../../../lib/firebase/firebaseAdmin'

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
        { message: 'Missing RapidAPI key' },
        { status: 400 }
      );
    }

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

      const verificationsRef = adminDb
        .collection('users')
        .doc(uid)
        .collection('verifications');

      const snapshot = await verificationsRef.get();
      const batch = adminDb.batch();
      snapshot.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();

      const userAccountRef = adminDb
        .collection('users')
        .doc(uid)
        .collection('accounts')
        .doc(`${account.username}_${account.platform}`);
      await userAccountRef.set(account);

      const globalAccountRef = adminDb
        .collection('accounts')
        .doc(`${account.username}_${account.platform}`);
      await globalAccountRef.set(account);

      return NextResponse.json(
        { success: true, account, message: 'Verification successful' },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { success: false, message: 'Verification code not found in bio' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying account:', error);
    return NextResponse.json(
      { error: 'Verification failed!' },
      { status: 500 }
    );
  }
}