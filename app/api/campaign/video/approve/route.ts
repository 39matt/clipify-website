import { adminAuth, adminDb } from '../../../../lib/firebase/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header is missing' }, { status: 400 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ error: 'Invalid Authorization header format' }, { status: 400 });
    }
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    if (!decodedToken.isAdmin) {
      return NextResponse.json({ error: 'Access denied: Admins only' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId');
    const videoId = searchParams.get('videoId');

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign id is mandatory!' }, { status: 400 });
    }
    if (!videoId) {
      return NextResponse.json({ error: 'Video id is mandatory!' }, { status: 400 });
    }

    const videoRef = adminDb.collection('campaigns')
      .doc(campaignId).collection('videos').doc(videoId);

    const videoSnap = await videoRef.get();
    if (!videoSnap.exists) {
      return NextResponse.json({ error: "Video doesn't exist!" }, { status: 404 });
    }

    await videoRef.update({ approved: true });

    return NextResponse.json({ message: 'Video approved successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error approving the video:', error);
    return NextResponse.json({ error: 'Error approving the request' }, { status: 500 });
  }
}