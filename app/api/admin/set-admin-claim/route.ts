import { setAdminClaim } from '../../../lib/firebase/firebaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {

  const { uid } = await req.json();

  if (!uid) {
    return NextResponse.json({ error: 'UID is required',  status: 400 });
  }

  try {
    await setAdminClaim(uid);
    NextResponse.json({ message: `Admin claim set for user with UID: ${uid}`,   status: 200 });
  } catch (error) {
    console.error('Error setting admin claim:', error);
    NextResponse.json({ error: 'Failed to set admin claim', status: 500 });
  }
}