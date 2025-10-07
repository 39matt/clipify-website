// pages/api/affiliates.ts or app/api/affiliates/route.ts
import { NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase/firebaseAdmin';

export async function GET() {
  try {
    const affiliatesSnapshot = await adminDb.collection('affiliates').get();

    const affiliates = affiliatesSnapshot.docs.map(doc => ({
      code: doc.id,
      count: doc.data().count || 0
    }));

    return NextResponse.json({ affiliates });
  } catch (error) {
    console.error('Error fetching affiliates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch affiliates' },
      { status: 500 }
    );
  }
}