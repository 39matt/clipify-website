import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../lib/firebase/firebaseAdmin'
import { IVideo } from '../../../lib/models/video'
import { ICampaign } from '../../../lib/models/campaign'

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { campaignId } = body

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is mandatory!' }, { status: 400 });
    }

    const campaignDocRef = adminDb.collection('campaigns').doc(campaignId) // Fixed collection name
    const campaignSnap = await campaignDocRef.get()

    if (!campaignSnap.exists) {
      return NextResponse.json({ error: 'Campaign not found!' }, { status: 404 });
    }

    const campaign = campaignSnap.data() as ICampaign

    const videoColRef = campaignDocRef.collection('videos')
    const videosSnap = await videoColRef.get()

    const totalViewsProgress = videosSnap.docs.filter((video) => video.data()["approved"] !== false).reduce((accumulator, doc) => {
      const videoData = doc.data() as IVideo;
      return accumulator + (Math.min(videoData.views, 1000000 * campaign.maxEarningsPerPost / campaign.perMillion) || 0);
    }, 0);

    const moneySpent = totalViewsProgress / 1000000 * campaign.perMillion
    const progressPercentage = (moneySpent / campaign.budget) * 100;

    const finalProgress = Math.min(progressPercentage, 100);


    const totalViews = videosSnap.docs.filter((video) => video.data()["approved"] !== false).reduce((accumulator, doc) => {
      const videoData = doc.data() as IVideo;
      return accumulator + (videoData.views || 0);
    }, 0);

    await campaignDocRef.update({
      progress: finalProgress,
      totalViews: totalViews,
      moneySpent: moneySpent
    });

    return NextResponse.json({
      message: 'Campaign progress updated successfully!',
      progress: finalProgress,
      totalViews: totalViews,
      moneySpent: moneySpent
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating campaign progress:', error);

    return NextResponse.json({ error: 'Error updating campaign progress' }, { status: 500 });
  }
}