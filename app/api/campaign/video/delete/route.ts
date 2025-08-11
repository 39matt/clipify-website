import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/firebaseAdmin';
import { IVideo } from '../../../../lib/models/video'

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { videoId, campaignId } = body;


    if (!campaignId || !videoId) {
      return NextResponse.json(
        { error: 'Missing required body parameters' },
        { status: 400 }
      );
    }
    const videoSnap = await adminDb
      .collection('campaigns')
      .doc(campaignId)
      .collection('videos')
      .doc(videoId)
      .get()
    const video = videoSnap.data() as IVideo;

    await adminDb
      .collection('campaigns')
      .doc(campaignId)
      .collection('videos')
      .doc(videoId)
      .delete();

    // const userVideosRef = adminDb
    //   .collection('users')
    //   .doc(video.uid!)
    //   .collection('accounts')
    //   .doc(video.accountName)
    //   .collection('videos');
    const userVideosRef = adminDb
      .doc(video.userAccountRef!.path)
      .collection('videos');

    const snapshot = await userVideosRef
      .where('videoRef', '!=', null)
      .get();

    for (const doc of snapshot.docs) {
      const data = doc.data();
      if (data.videoRef?.id === videoId) {
        await doc.ref.delete();
      }
    }

    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/campaign/calculate-progress`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        campaignId: campaignId,
      }),
    })

    return NextResponse.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    return NextResponse.json(
      { error: 'Failed to delete video' },
      { status: 500 }
    );
  }
}