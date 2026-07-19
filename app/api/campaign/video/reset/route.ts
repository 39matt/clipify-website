import { FieldValue } from 'firebase-admin/firestore'
import { NextRequest, NextResponse } from 'next/server'

import { adminAuth, adminDb } from '../../../../lib/firebase/firebaseAdmin'

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is missing' },
        { status: 400 },
      )
    }

    const idToken = authHeader.split('Bearer ')[1]
    if (!idToken) {
      return NextResponse.json(
        { error: 'Invalid Authorization header format' },
        { status: 400 },
      )
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken)
    if (!decodedToken.isAdmin) {
      return NextResponse.json(
        { error: 'Access denied: Admins only' },
        { status: 403 },
      )
    }

    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get('campaignId')
    const videoId = searchParams.get('videoId')

    if (!campaignId || !videoId) {
      return NextResponse.json(
        { error: 'Campaign id and video id are mandatory!' },
        { status: 400 },
      )
    }

    const videoRef = adminDb
      .collection('campaigns')
      .doc(campaignId)
      .collection('videos')
      .doc(videoId)

    if (!(await videoRef.get()).exists) {
      return NextResponse.json(
        { error: "Video doesn't exist!" },
        { status: 404 },
      )
    }

    await videoRef.update({ approved: FieldValue.delete() })

    return NextResponse.json({ message: 'Video returned to review!' })
  } catch (error) {
    console.error('Error resetting the video approval:', error)
    return NextResponse.json(
      { error: 'Error resetting the request' },
      { status: 500 },
    )
  }
}
