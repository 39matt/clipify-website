import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import { adminDb } from '../../../../lib/firebase/firebaseAdmin'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { error: 'UID is required' },
        { status: 400 }
      );
    }

    const snapshot = await adminDb.collection('users').doc(uid).collection('accounts').get()
    return NextResponse.json(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    console.error('Error getting user accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user accounts: ' + error },
      { status: 500 }
    );
  }
}