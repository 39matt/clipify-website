import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../lib/firebase/firebaseAdmin'
import { IUser } from '../../../lib/models/user'

export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const uid = searchParams.get('uid')

    if (!uid) {
      return NextResponse.json({message: "UID is mandatory!"}, {status: 400})
    }
    const userDocRef = adminDb.collection('users').doc(uid);
    const userSnapshot = await userDocRef.get()
    const user = userSnapshot.data() as IUser
    if (user.balance! < 10) {
      return NextResponse.json({message: "User has to have at least $3 balance!"}, {status: 400})
    }
    await adminDb.collection('users').doc(uid)
      .set({
        payoutRequested: new Date(Date.now()).toISOString(),
      }, {merge:true});
    return NextResponse.json({message: "Successfully requested payout!"}, {status: 200})

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, {status: 500});
  }
}