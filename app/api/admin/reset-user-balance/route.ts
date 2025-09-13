import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '../../../lib/firebase/firebaseAdmin'

export async function POST(req: NextRequest) {
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

    const body = await req.json()
    const { uid } = body

    if (!uid) {
      return NextResponse.json(
        { error: "UID is required" },
        { status: 400 }
      );
    }

    const userDocRef = adminDb.collection('users').doc(uid);

    await userDocRef.set(
      {
        balance: 0,
        payoutRequested: ""
      },
      {merge:true}
    )
    return NextResponse.json({
      message: "Successfully reset balance!",
    }, { status: 201 }); // 201 for created


  } catch (error) {
    console.error('Error reseting balance:', error);

    return NextResponse.json(
      { error: 'Failed to reset balance' },
      { status: 500 }
    );
  }
}