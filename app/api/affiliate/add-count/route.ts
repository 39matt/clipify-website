import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../lib/firebase/firebaseAdmin'

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    if (!code) {
      return NextResponse.json({ error: 'Code is mandatory!' }, { status: 400 });
    }

    const affiliatesRef = adminDb.collection('affiliates').doc(code);
    const affiliateDoc = await affiliatesRef.get();

    if (!affiliateDoc.exists) {
      await affiliatesRef.set({ count: 1 });
      return NextResponse.json({ message: 'Affiliate created with count 1' });
    }

    const count = affiliateDoc.data()!["count"] || 0;
    await affiliatesRef.update({ count: count + 1 });

    return NextResponse.json({ message: 'Referral count updated' });
  } catch (err) {
    console.error('Error adding referral count:', err);
    return NextResponse.json({ error: 'Error adding referral count' }, { status: 500 });
  }
}
