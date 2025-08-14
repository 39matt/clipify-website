import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/firebaseAdmin'

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid } = body;

    if (!uid) {
      return NextResponse.json(
        { message: 'UID is mandatory!' },
        { status: 400 }
      );
    }

    if (!uid || uid.trim() === '') {
      return NextResponse.json(
        { message: 'UID is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const cleanUid = uid.trim();
    const verificationsRef = adminDb
      .collection('users')
      .doc(cleanUid)
      .collection('verifications')

    const snapshot = await verificationsRef.get();

    if (snapshot.empty) {
      console.log(`No verification found for UID: ${cleanUid}`);
      return;
    }

    await snapshot.docs[0].ref.delete();

    return NextResponse.json(
      {
        message: 'Verification removed successfully!',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error removing verification:', err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Failed to remove verification due to unknown error',
      },
      { status: 500 }
    );
  }
}