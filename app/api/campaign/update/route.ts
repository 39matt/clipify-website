import { NextRequest, NextResponse } from 'next/server'

import { adminDb } from '../../../lib/firebase/firebaseAdmin'
import { ICampaign } from '../../../lib/models/campaign'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { campaign }: { campaign: ICampaign } = body

    if (!campaign || !campaign.id) {
      return NextResponse.json(
        { error: 'Campaign data or ID is missing!' },
        { status: 400 },
      )
    }

    const campaignDocRef = adminDb.collection('campaigns').doc(campaign.id)
    const campaignSnap = await campaignDocRef.get()

    if (!campaignSnap.exists) {
      return NextResponse.json(
        { error: 'Campaign not found!' },
        { status: 404 },
      )
    }

    const updateData: Partial<ICampaign> = {
      influencer: campaign.influencer,
      activity: campaign.activity,
      budget: Number(campaign.budget),
      progress: Number(campaign.progress),
      isActive: Boolean(campaign.isActive),
      isPot: Boolean(campaign.isPot),
      perMillion: Number(campaign.perMillion),
      perMillionText: campaign.perMillionText || '',
      maxEarnings: Number(campaign.maxEarnings),
      maxEarningsPerPost: Number(campaign.maxEarningsPerPost),
      maxSubmissions: Number(campaign.maxSubmissions),
      minViewsForPayout: Number(campaign.minViewsForPayout),
      discordInvite: campaign.discordInvite || '',
      lastUpdatedAt: new Date().toISOString(),
      imageUrl: campaign.imageUrl,
    }

    await campaignDocRef.update(updateData)

    return NextResponse.json(
      {
        message: 'Campaign updated successfully!',
        updatedFields: updateData,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error updating campaign:', error)
    return NextResponse.json(
      { error: 'Error updating campaign' },
      { status: 500 },
    )
  }
}
