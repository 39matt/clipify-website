import { NextRequest, NextResponse } from 'next/server'
import {adminAuth} from "../../../lib/firebase/firebaseAdmin";

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