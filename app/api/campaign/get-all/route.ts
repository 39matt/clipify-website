import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '../../../lib/firebase/firebaseAdmin'

export async function GET() {
  try {
    const snapshot = await adminDb.collection('campaigns').get();

    return NextResponse.json(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    console.error('Error getting campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns: ' + error },
      { status: 500 }
    );
  }
}