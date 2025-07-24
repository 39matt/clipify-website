import { NextRequest, NextResponse } from 'next/server'
import {adminDb} from '../../../lib/firebase/firebaseAdmin'
import { IVideo } from '../../../lib/models/video'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get('id')

    let campaign: ICampaign | null = null
    let videos: IVideo[] | null = null
    if (campaignId) {
      const snapshot = await adminDb.collection('campaigns')
        .doc(campaignId).get();
      if (!snapshot.exists) {
        return NextResponse.json(
          { error: `Campaign with ID ${campaignId} not found` },
          { status: 404 }
        );
      }
      campaign = snapshot.data() as ICampaign;

      const videosSnapshot = await adminDb.collection('campaigns')
        .doc(campaignId).collection('videos').where("approved", "==", false).get();
      videos = videosSnapshot.docs.map((video) => {
        const vid: IVideo = video.data() as IVideo;
        vid.id = video.id
        return vid
      });
    }
    return NextResponse.json({ campaign, videos });
  } catch (error) {
    console.error('Error getting campaign:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}