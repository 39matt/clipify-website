import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../lib/firebase/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { walletAddress, discordUsername } = body

    if (!walletAddress) {
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
        walletAddress: walletAddress,
      },
      {merge:true}
    )
    return NextResponse.json({
      message: "Successfully changed wallet address!",
    }, { status: 201 }); // 201 for created


  } catch (error) {
    console.error('Error changing wallet address:', error);

    return NextResponse.json(
      { error: 'Failed to change wallet address' },
      { status: 500 }
    );
  }
}