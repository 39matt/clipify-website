import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../../lib/firebase/firebaseAdmin'

async function addVerification(
  uid: string,
  accountLink: string
): Promise<IVerification> {
  if (!uid || uid.trim() === '') {
    throw new Error('UID is required and must be a non-empty string');
  }

  if (
    !accountLink ||
    accountLink.trim() === ''
  ) {
    throw new Error('Account link is required and must be a non-empty string');
  }

  const cleanUid = uid.trim();
  const cleanAccountLink = accountLink.trim();

  console.log(
    'Adding verification for UID:',
    cleanUid,
    'Link:',
    cleanAccountLink
  );

  let username = '';
  let platform: 'Instagram' | 'TikTok' = 'Instagram';

  if (cleanAccountLink.toLowerCase().includes('tiktok')) {
    platform = 'TikTok';
    if (cleanAccountLink.includes('@')) {
      username = cleanAccountLink.split('@')[1].split('/')[0];
    } else {
      const parts = cleanAccountLink.split('/').filter((part) => part !== '');
      username = parts[parts.length - 1];
    }
  } else {
    const parts = cleanAccountLink.split('/').filter((part) => part !== '');
    username = parts[parts.length - 1];
  }

  if (!username || username.trim() === '') {
    throw new Error('Could not extract username from account link');
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

  return verification;
}


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, accountLink } = body;

    if (!uid || !accountLink) {
      return NextResponse.json(
        { message: 'UID and accountLink are mandatory!' },
        { status: 400 }
      );
    }

    const verification = await addVerification(uid, accountLink);

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
