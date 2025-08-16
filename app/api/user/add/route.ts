import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../lib/firebase/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, discordUsername } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    if (!discordUsername) {
      return NextResponse.json(
        { error: "Discord username is required" },
        { status: 400 }
      );
    }

    const userDocRef = adminDb.collection('users').doc(discordUsername);

    await userDocRef.set(
      {
        email,
        connected: true,
      },
    )
    return NextResponse.json({
      message: "Successfully added user!",
      videoId: userDocRef.id
    }, { status: 201 }); // 201 for created


  } catch (error) {
    console.error('Error adding video:', error);

    return NextResponse.json(
      { error: 'Failed to add video' },
      { status: 500 }
    );
  }
}