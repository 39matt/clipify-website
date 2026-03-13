import { NextRequest, NextResponse } from 'next/server'

import { adminDb } from '../../../lib/firebase/firebaseAdmin'
import { ICampaign } from '../../../lib/models/campaign'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const campaignRef = adminDb.collection('campaigns').doc()
    const newId = campaignRef.id

    const campaignData: ICampaign = {
      id: newId,
      influencer: body.influencer || '',
      activity: body.activity || '',
      budget: Number(body.budget) || 0,
      perMillion: Number(body.perMillion) || 0,
      minViewsPerPayout: Number(body.minViewsPerPayout) || 0,
      maxEarnings: Number(body.maxEarnings) || 0,
      maxEarningsPerPost: Number(body.maxEarningsPerPost) || 0,
      maxSubmissions: Number(body.maxSubmissions) || 0,
      discordInvite: body.discordInvite || '',
      isActive: body.isActive ?? true,
      isPot: body.isPot ?? false,
      perMillionText: body.perMillionText || '',

      progress: 0,
      moneySpent: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalShares: 0,

      imageUrl: body.imageUrl || '',
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
    }

    await campaignRef.set(campaignData)

    return NextResponse.json(
      {
        message: 'Campaign created successfully!',
        id: newId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating campaign:', error)
    return NextResponse.json(
      { error: 'Error creating campaign' },
      { status: 500 },
    )
  }
}
