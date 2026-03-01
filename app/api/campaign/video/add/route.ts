import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../../lib/firebase/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { video, campaignId, accId, uid } = body

    if (!video) {
      return NextResponse.json(
        { error: "Video data is required" },
        { status: 400 }
      );
    }
    if (!campaignId) {
      return NextResponse.json(
        { error: "Campaign ID is required" },
        { status: 400 }
      );
    }
    if (!accId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      );
    }
    if (!uid) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const videoColRef = adminDb.collection('campaigns').doc(campaignId).collection('videos');
    const userAccountRef = adminDb.collection('users').doc(uid).collection('accounts').doc(accId);


    const existingVideo = await videoColRef.where("link", "==", video.link).get();
    if (!existingVideo.empty) {
      return NextResponse.json(
        { error: 'Video already exists' },
        { status: 400 }
      );
    }
    const videoData = {
      ...video,
      userAccountRef: userAccountRef,
      accountName: accId,
      uid: uid,
      createdAt: new Date().toISOString(),
      approved: null
    };

    const newVideoDocRef = await videoColRef.add(videoData);

    const userVideoColRef = userAccountRef.collection("videos");
    await userVideoColRef.add({
      videoRef: newVideoDocRef,
      campaignId: campaignId,
      uploadedAt: new Date().toISOString(),
      link: video.link,
    });

    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/campaign/calculate-progress`, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        campaignId: campaignId,
      }),
    })

    return NextResponse.json({
      message: "Successfully added video!",
      videoId: newVideoDocRef.id
    }, { status: 201 }); // 201 for created


  } catch (error) {
    console.error('Error adding video:', error);

    return NextResponse.json(
      { error: 'Failed to add video' },
      { status: 500 }
    );
  }
}