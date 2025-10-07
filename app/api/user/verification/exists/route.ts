import { NextRequest, NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'
import { adminDb } from '../../../../lib/firebase/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const uid = searchParams.get('uid');

    if (!uid || uid.trim() === '') {
      return NextResponse.json(
        { message: 'UID is mandatory!' },
        { status: 400 }
      );
    }

    const verificationColRef = adminDb
      .collection('users')
      .doc(uid.trim())
      .collection('verifications');

    const querySnapshot = await verificationColRef.get();

    if (!querySnapshot.empty) {
      const verification = querySnapshot.docs[0].data() as IVerification;
      return NextResponse.json(
        {
          status: 200,
          exists: true,
          verification,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        status: 200,
        exists: false,
        verification: null,
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