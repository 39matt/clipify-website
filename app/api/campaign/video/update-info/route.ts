import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../../lib/firebase/firebaseAdmin'

export async function PUT(req: NextRequest) {
  try {
    const {video, campaignId} = await req.json()
    if (!video) {
      return NextResponse.json({message: 'Empty video!'}, {status: 400});
    }

    const snap = await adminDb.collection('campaigns')
      .doc(campaignId).collection('videos')
      .where("link", "==", video.link).limit(1).get();
    if(snap.empty) {
      return NextResponse.json({message: 'Video not found!'}, {status: 400});
    }

    const videoRef = snap.docs[0].ref;
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