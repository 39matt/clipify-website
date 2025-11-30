import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '../../../../lib/firebase/firebaseAdmin'

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

    const {video, campaignId, videoId} = await req.json()
    if (!video) {
      return NextResponse.json({message: 'Empty video!'}, {status: 200});
    }

    const snap = await adminDb.collection('campaigns')
      .doc(campaignId).collection('videos').doc(videoId).get();
      // .where("link", "==", video.link).limit(1).get();
    if(!snap.exists) {
      return NextResponse.json({message: 'Video not found!'}, {status: 400});
    }

    const videoRef = snap.ref;
    const wr = await videoRef.update(video);
    if (!wr) {
      return  NextResponse.json({message: 'Error writing video!'});
    }
    return NextResponse.json({message: 'Successfully updated video'}, {status: 200});
  } catch (error) {
    console.error('Error updating video:', error);
    return NextResponse.json(
      { error: 'Failed to update video' },
      { status: 500 }
    );
  }
}