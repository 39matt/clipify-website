import { NextRequest, NextResponse } from 'next/server'

import { adminAuth, adminDb } from '../../../lib/firebase/firebaseAdmin'

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is missing' },
        { status: 400 },
      )
    }

    const idToken = authHeader.split('Bearer ')[1]
    const decodedToken = await adminAuth.verifyIdToken(idToken)

    if (!decodedToken.isAdmin) {
      return NextResponse.json(
        { error: 'Access denied: Admins only' },
        { status: 403 },
      )
    }

    const body = await req.json()
    const { uid, newBalance } = body // newBalance je sada opcioni

    if (!uid) {
      return NextResponse.json({ error: 'UID is required' }, { status: 400 })
    }

    const userDocRef = adminDb.collection('users').doc(uid)

    const targetBalance = typeof newBalance === 'number' ? newBalance : 0

    const updateData: any = {
      balance: targetBalance,
    }

    if (targetBalance === 0) {
      updateData.payoutRequested = ''
    }

    await userDocRef.set(updateData, { merge: true })

    return NextResponse.json(
      {
        message: `Successfully set balance to ${targetBalance}!`,
        newBalance: targetBalance,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('Error setting balance:', error)
    return NextResponse.json(
      { error: 'Failed to set balance' },
      { status: 500 },
    )
  }
}
