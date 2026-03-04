import { NextRequest, NextResponse } from 'next/server'

import { adminDb } from '../../../../lib/firebase/firebaseAdmin'
import { ICampaign } from '../../../../lib/models/campaign'
import { ISnapshot } from '../../../../lib/models/snapshot'
import { IVideo } from '../../../../lib/models/video'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const groupId = searchParams.get('id')

    if (!groupId) {
      return NextResponse.json(
        { error: 'Group ID is required' },
        { status: 400 },
      )
    }

    const groupDoc = await adminDb
      .collection('campaignGroups')
      .doc(groupId)
      .get()

    if (!groupDoc.exists) {
      return NextResponse.json(
        { error: `Group with ID ${groupId} not found` },
        { status: 404 },
      )
    }

    const groupData = groupDoc.data()
    const memberCampaignIds: string[] = groupData?.memberCampaignIds || []

    const results = await Promise.all(
      memberCampaignIds.map(async (id) => {
        const campaignRef = adminDb.collection('campaigns').doc(id)

        const [campSnap, vidsSnap, snapsSnap] = await Promise.all([
          campaignRef.get(),
          campaignRef.collection('videos').get(),
          campaignRef.collection('snapshots').get(),
        ])

        if (!campSnap.exists) return null

        return {
          campaign: { id: campSnap.id, ...campSnap.data() } as ICampaign,
          videos: vidsSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as IVideo[],
          snapshots: snapsSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as ISnapshot[],
        }
      }),
    )

    const validResults = results.filter((r) => r !== null)

    const members = validResults.map((r) => r!.campaign)
    const videos = validResults.flatMap((r) => r!.videos)
    const snapshots = validResults.map((r) => r!.snapshots)

    return NextResponse.json(
      {
        group: { id: groupDoc.id, ...groupData },
        members,
        videos,
        snapshots,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error getting campaign group:', error)
    return NextResponse.json(
      { error: 'Failed to fetch campaign group' },
      { status: 500 },
    )
  }
}
