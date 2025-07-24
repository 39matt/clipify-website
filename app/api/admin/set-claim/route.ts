import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '../../../lib/firebase/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
    }

    const idToken = authHeader.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json({ error: 'Invalid Authorization header format' }, { status: 401 });
    }

    const isAdmin = await fetch('/api/admin/check', {method:"POST", body: JSON.stringify(idToken)}).then(res => res.json());

    if (!isAdmin) {
      return NextResponse.json({ error: 'Access denied: Admins only' }, { status: 403 });
    }

    const { targetUid } = await req.json();
    if (!targetUid) {
      return NextResponse.json({ error: 'Target UID is required' }, { status: 400 });
    }

    await adminAuth.setCustomUserClaims(targetUid, { isAdmin: true });

    return NextResponse.json({ message: `Admin claim set for user with UID: ${targetUid}` }, { status: 200 });
  } catch (error) {
    console.error('Error setting admin claim:', error);
    return NextResponse.json({ error: 'Error setting admin claim' }, { status: 500 });
  }
}