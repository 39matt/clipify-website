import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../lib/firebase/firebaseAdmin'
import { IUser } from '../../../lib/models/user'

export async function GET(req: NextRequest) {
    try {
      const params = new URL(req.url).searchParams
      const uid = params.get('uid')
      if(!uid) {
        return NextResponse.json({error: "UID is mandatory!"}, {status: 400})
      }
      const response = await adminDb.collection('users').doc(uid).get();

      const user = response.data() as IUser;

      return NextResponse.json({ user }, { status: 200});

    } catch (error) {
      console.error("Error getting user", error);
      return NextResponse.json({ error: "Error getting user" }, {status: 500});
    }
}