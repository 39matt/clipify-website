import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '../../../lib/firebase/firebaseAdmin';

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is missing' },
        { status: 401 }
      );
    }

    const idToken = authHeader.split('Bearer ')[1];
    if (!idToken) {
      return NextResponse.json(
        { error: 'Invalid Authorization header format' },
        { status: 401 }
      );
    }

    // Fix: Check admin status with proper headers
    const adminCheckResponse = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/admin/check`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}` // Pass the token properly
        },
        body: JSON.stringify({ idToken })
      }
    );

    const isAdminResult = await adminCheckResponse.json();
    if (!isAdminResult.isAdmin) {
      return NextResponse.json(
        { error: 'Access denied: Admins only' },
        { status: 403 }
      );
    }

    // Fix: Get targetUid from URL params OR request body
    const url = new URL(req.url);
    const targetUidFromQuery = url.searchParams.get('targetUid');

    let targetUid = targetUidFromQuery;

    // If not in query params, try request body
    if (!targetUid) {
      const body = await req.json();
      targetUid = body.targetUid;
    }

    if (!targetUid) {
      return NextResponse.json(
        { error: 'Target UID is required' },
        { status: 400 }
      );
    }

    await adminAuth.setCustomUserClaims(targetUid, { isAdmin: true });

    return NextResponse.json(
      { message: `Admin claim set for user with UID: ${targetUid}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error setting admin claim:', error);
    return NextResponse.json(
      { error: 'Error setting admin claim' },
      { status: 500 }
    );
  }
}