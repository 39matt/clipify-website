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

    // Get campaign data
    const campaignDocRef = adminDb.collection('campaigns').doc(campaignId) // Fixed collection name
    const campaignSnap = await campaignDocRef.get()

    if (!campaignSnap.exists) {
      return NextResponse.json({ error: 'Campaign not found!' }, { status: 404 });
    }

    const campaign = campaignSnap.data() as ICampaign

    // Get videos collection
    const videoColRef = campaignDocRef.collection('videos')
    const videosSnap = await videoColRef.get()

    // Calculate total views correctly
    const totalViews = videosSnap.docs.filter((video) => video.data()["approved"] !== false).reduce((accumulator, doc) => {
      const videoData = doc.data() as IVideo;
      return accumulator + (videoData.views || 0); // Add null check
    }, 0);

    // Calculate progress correctly
    // Progress should be: (money spent / total budget) * 100
    const moneySpent = totalViews / 1000000 * campaign.perMillion; // Views in millions * rate per million
    const progressPercentage = (moneySpent / campaign.budget) * 100;

    // Ensure progress doesn't exceed 100%
    const finalProgress = Math.min(progressPercentage, 100);

    // Update campaign progress
    await campaignDocRef.update({
      progress: finalProgress,
      // totalViews: totalViews, // Optional: store total views
      moneySpent: moneySpent  // Optional: store money spent
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