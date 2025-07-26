import { adminAuth } from '../../../lib/firebase/firebaseAdmin'
import { NextRequest, NextResponse } from 'next/server'

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

    return NextResponse.json({ message: 'Admin verified successfully', isAdmin: true }, {status: 200});
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json({ error: 'Unauthorized', isAdmin: false}, {status: 401});
  }
}