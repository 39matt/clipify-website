import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/firebaseAdmin'


export async function removeVerification(uid: string): Promise<void> {
  if (!uid || uid.trim() === '') {
    throw new Error('UID is required and must be a non-empty string');
  }

  const cleanUid = uid.trim();
  const verificationsRef = adminDb
    .collection('users')
    .doc(cleanUid)
    .collection('verifications');

  const snapshot = await verificationsRef.get();

  if (snapshot.empty) {
    console.log(`No verifications found for UID: ${cleanUid}`);
    return;
  }

  const batch = adminDb.batch();
  snapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });

  await batch.commit();
  console.log(`Removed all verifications for UID: ${cleanUid}`);
}

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

    await removeVerification(uid);

    return NextResponse.json(
      {
        status: 200,
        message: 'All verifications removed successfully!',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error removing verifications:', err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Failed to remove verifications due to unknown error',
      },
      { status: 500 }
    );
  }
}