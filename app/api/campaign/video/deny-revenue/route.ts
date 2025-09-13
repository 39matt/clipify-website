import { adminAuth, adminDb } from '../../../../lib/firebase/firebaseAdmin';
import { NextRequest, NextResponse } from 'next/server';
import { IVideo } from '../../../../lib/models/video'
import { IUser } from '../../../../lib/models/user'
import { ICampaign } from '../../../../lib/models/campaign'

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

    const { searchParams } = new URL(req.url);
    const campaignId = searchParams.get('campaignId');
    const videoId = searchParams.get('videoId');

    if (!campaignId) {
      return NextResponse.json({ error: 'Campaign id is mandatory!' }, { status: 400 });
    }
    if (!videoId) {
      return NextResponse.json({ error: 'Video id is mandatory!' }, { status: 400 });
    }

    const videoRef = adminDb.collection('campaigns')
      .doc(campaignId).collection('videos').doc(videoId);

    const videoSnap = await videoRef.get();
    if (!videoSnap.exists) {
      return NextResponse.json({ error: "Video doesn't exist!" }, { status: 404 });
    }

    const video = videoSnap.data() as IVideo;
    const userRef = adminDb.doc(video.userAccountRef?.parent.parent?.path!);

    if(video.revenueStatus == "Denied") {
      return NextResponse.json({ message: 'Video revenue already denied!' }, { status: 200 });
    }

    //TODO PROMENITI DA SE U BAZU VIDEO DODAJE SA REVENUESTATUS=AWAITING
    if(video.revenueStatus == "Approved") {
      const userSnap = await userRef.get();
      const user = userSnap.data() as IUser;

      const campaignSnap = await adminDb.collection('campaigns').doc(campaignId).get();
      const campaign = campaignSnap.data() as ICampaign;

      const revenuePerView = campaign.perMillion / 1000000;
      const videoRevenue = video.views * revenuePerView;
      await userRef.update({ balance: parseFloat((user.balance - videoRevenue).toFixed(2)) });
    }
    await videoRef.update({ revenueStatus: "Denied", deniedReason: 'Denied' });

    return NextResponse.json({ message: 'Video revenue denied successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error denying the video revenue:', error);
    return NextResponse.json({ error: 'Error approving the request' }, { status: 500 });
  }
}