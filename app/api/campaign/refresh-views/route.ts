import { NextRequest, NextResponse } from 'next/server'

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const campaignId = searchParams.get('campaignId')
    if (!campaignId) {
      console.error('Campaign not found!')
      return NextResponse.json({ error: 'Campaign not found!' }, {status: 400})
    }

    return NextResponse.json({message: 'Successfully updated campaign views.'}, {status: 200});
  } catch (error) {
    console.error("Error calculating total views " + error);
    return NextResponse.json({ error: "Error calculating total views" }, {status: 500});
  }
}