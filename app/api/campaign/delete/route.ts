import { NextRequest, NextResponse } from 'next/server'

import { adminDb } from '../../../lib/firebase/firebaseAdmin'

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 },
      )
    }

    const campaignRef = adminDb.collection('campaigns').doc(id)
    const campaignSnap = await campaignRef.get()

    if (!campaignSnap.exists) {
      return NextResponse.json({ error: 'Campaign not found' }, { status: 404 })
    }

    const videoDocs = await campaignRef.collection('videos').get()
    const snapshotDocs = await campaignRef.collection('snapshots').get()

    const batch = adminDb.batch()

    videoDocs.forEach((doc) => batch.delete(doc.ref))
    snapshotDocs.forEach((doc) => batch.delete(doc.ref))

    batch.delete(campaignRef)

    await batch.commit()

    return NextResponse.json(
      { message: 'Campaign and all subcollections deleted' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete campaign' },
      { status: 500 },
    )
  }
}
