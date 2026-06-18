import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../lib/firebase/firebaseAdmin'


export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const snapshot = await adminDb.collection('users').get()
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 },
    )
  }
}
