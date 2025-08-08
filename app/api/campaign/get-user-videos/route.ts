import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase/firebaseAdmin'
import { IVideo } from '../../../lib/models/video'


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get('campaignId');
    const userId = searchParams.get('userId');

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign id is mandatory!"}, {status: 400});
    }
    if (!userId) {
      return NextResponse.json({ error: "User id is mandatory!"}, {status: 400});
    }

    const videosQ = adminDb.collection('campaigns')
      .doc(campaignId).collection('videos').where("uid", "==", userId);

    const videosSnap = await videosQ.get()
    if(videosSnap.empty) {
      return NextResponse.json({ message: "No videos found!"}, {status: 200})
    }

    return NextResponse.json({ videos: videosSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) }, { status: 200 });
  } catch (error) {
    console.error("Error getting user videos for campaign:" + error);
    return NextResponse.json({ error: "Error getting user videos for campaign"}, {status: 500});
  }
}