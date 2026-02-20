import { NextRequest, NextResponse } from 'next/server';



import { adminDb } from '../../../lib/firebase/firebaseAdmin';
import { ICampaign } from '../../../lib/models/campaign';
import { IVideo } from '../../../lib/models/video';


export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { campaignId } = body


    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign ID is mandatory!' }, { status: 400 });
    }

    const campaignDocRef = adminDb.collection('campaigns').doc(campaignId)
    const campaignSnap = await campaignDocRef.get()

    if (!campaignSnap.exists) {
      return NextResponse.json({ error: 'Campaign not found!' }, { status: 404 });
    }

    const campaign = campaignSnap.data() as ICampaign

    const videoColRef = campaignDocRef.collection('videos')
    const videosSnap = await videoColRef.get()

    const perMillion = campaign.perMillion || 0
    const budget = campaign.budget || 1
    const maxEarningsPerPost = campaign.maxEarningsPerPost || Infinity

    const totalViewsProgress = videosSnap.docs
      .filter((video) => video.data()['approved'] !== false)
      .reduce((acc, doc) => {
        const videoData = doc.data() as IVideo
        const capped = Math.min(
          videoData.views || 0,
          (1000000 * maxEarningsPerPost) / perMillion,
        )
        return acc + (capped || 0)
      }, 0)

    const moneySpent = totalViewsProgress / 1000000 * perMillion
    const progressPercentage = (moneySpent / budget) * 100;

    const finalProgress = Math.min(progressPercentage, 100);


    const totalViews = videosSnap.docs.filter((video) => video.data()["approved"] !== false).reduce((accumulator, doc) => {
      const videoData = doc.data() as IVideo;
      return accumulator + (videoData.views || 0);
    }, 0);
    const totalLikes = videosSnap.docs.filter((video) => video.data()["approved"] !== false).reduce((accumulator, doc) => {
      const videoData = doc.data() as IVideo;
      return accumulator + (videoData.likes || 0);
    }, 0);
    const totalComments = videosSnap.docs.filter((video) => video.data()["approved"] !== false).reduce((accumulator, doc) => {
      const videoData = doc.data() as IVideo;
      return accumulator + (videoData.comments || 0);
    }, 0);
    const totalShares = videosSnap.docs.filter((video) => video.data()["approved"] !== false).reduce((accumulator, doc) => {
      const videoData = doc.data() as IVideo;
      return accumulator + (videoData.shares || 0);
    }, 0);


    await campaignDocRef.update({
      progress: finalProgress ,
      totalViews: totalViews,
      moneySpent: moneySpent || 0,
      totalLikes: totalLikes,
      totalComments: totalComments,
      totalShares: totalShares,
      lastUpdatedAt: new Date().toISOString(),
    });

    await campaignDocRef.collection('snapshots').add({
      date: new Date().toISOString(),
      totalViews: totalViews,
      totalLikes: totalLikes,
      totalComments: totalComments,
      totalShares: totalShares,
      progress: finalProgress,
    })

    return NextResponse.json({
      message: 'Campaign progress updated successfully!',
      progress: finalProgress,
      totalViews: totalViews,
      moneySpent: moneySpent,
      totalLikes: totalLikes,
      totalComments: totalComments,
      totalShares: totalShares,
    }, { status: 200 });

  } catch (error) {
    console.error('Error updating campaign progress:', error);

    return NextResponse.json({ error: 'Error updating campaign progress' }, { status: 500 });
  }
}