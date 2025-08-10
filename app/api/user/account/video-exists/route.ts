import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/firebaseAdmin';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId');
    const videoLink = searchParams.get('videoLink');

    if (!campaignId || !videoLink) {
      return NextResponse.json(
        { error: 'Missing required query parameters' },
        { status: 400 }
      );
    }

    const videoSnap = await adminDb
      .collection('campaigns')
      .doc(campaignId)
      .collection('videos')
      .where('link', '==', videoLink)
      .limit(1)
      .get();

    return NextResponse.json({ exists: !videoSnap.empty });
  } catch (error) {
    console.error('Error validating video:', error);
    return NextResponse.json(
      { error: 'Failed to validate video' },
      { status: 500 }
    );
  }
}