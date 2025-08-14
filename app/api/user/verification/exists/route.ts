import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/firebaseAdmin'

async function verificationExists(uid: string): Promise<IVerification | undefined> {
  if (!uid || uid.trim() === '') {
    console.error('Invalid UID provided to verificationExists:', uid);
    throw new Error('UID is required and must be a non-empty string');
  }

  try {
    const cleanUid = uid.trim();
    console.log('Checking verification for UID:', cleanUid);

    const verificationColRef = adminDb
      .collection('users')
      .doc(cleanUid)
      .collection('verifications');

    const querySnapshot = await verificationColRef.get();

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as IVerification;
    }

    return undefined;
  } catch (error) {
    console.error('Error checking verification existence:', error);
    throw new Error('Failed to check verification existence');
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { message: 'UID is mandatory!' },
        { status: 400 }
      );
    }

    const verification = await verificationExists(uid);

    return NextResponse.json(
      {
        status: 200,
        exists: !!verification,
        verification: verification || null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error in verificationExists API:', err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Failed to check verification existence due to unknown error',
      },
      { status: 500 }
    );
  }
}