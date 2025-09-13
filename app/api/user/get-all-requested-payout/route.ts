import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../lib/firebase/firebaseAdmin'
import { IUser } from '../../../lib/models/user'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const querySnapshot = await adminDb
      .collection('users')
      // .where("payoutRequested", "!=", false)
      // .where("balance", ">", 0)
      .get()

    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(users, { status: 200});

  } catch (error) {
    console.error("Error getting users with requested payout", error);
    return NextResponse.json({ error: "Error getting users with requested payout" }, {status: 500});
  }
}