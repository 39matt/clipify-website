import { NextRequest, NextResponse } from 'next/server'
import {adminDb} from '../../../lib/firebase/firebaseAdmin'
import { IVideo } from '../../../lib/models/video'
import { ICampaign } from '../../../lib/models/campaign'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get('id')

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      );
    }

    const snapshot = await adminDb.collection('campaigns')
      .doc(campaignId).get();

    if (!snapshot.exists) {
      return NextResponse.json(
        { error: `Campaign with ID ${campaignId} not found` },
        { status: 404 }
      );
    }

    const campaign = {
      id: snapshot.id,
      ...snapshot.data()
    } as ICampaign;

    const videosSnapshot = await adminDb.collection('campaigns')
      .doc(campaignId).collection('videos').get();
    const videos = videosSnapshot.docs.map((video) => ({
      id: video.id,
      ...video.data()
    })) as IVideo[];

    return NextResponse.json({ campaign, videos }, { status: 200, headers: { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json",} });
  } catch (error) {
    console.error('Error getting campaign:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}