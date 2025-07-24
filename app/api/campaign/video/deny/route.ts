import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/firebaseAdmin'


export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get('campaignId');
    const videoId = searchParams.get('videoId');

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign id is mandatory!"}, {status: 400});
    }
    if (!videoId) {
      return NextResponse.json({ error: "Video id is mandatory!"}, {status: 400});
    }

    const videoRef = adminDb.collection('campaigns')
      .doc(campaignId).collection('videos').doc(videoId)

    const videoSnap = await videoRef.get()
    if(!videoSnap.exists) {
      return NextResponse.json({ error: "Video doesn't exist!"}, {status: 404})
    }

    await videoRef.update({ approved: false });

    return NextResponse.json({ message: "Video denied successfully!" }, { status: 200 });
  } catch (error) {
    console.error("Error denying the video:" + error);
    return NextResponse.json({ error: "Error denying the request"}, {status: 500});
  }
}