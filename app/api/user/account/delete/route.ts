import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '../../../../lib/firebase/firebaseAdmin'

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const accountId = searchParams.get('accountId');

    if (!accountId) {
      return NextResponse.json({ error: "Account id is mandatory!"}, {status: 400});
    }
    if (!userId) {
      return NextResponse.json({ error: "User id is mandatory!"}, {status: 400});
    }

    const accountRef = adminDb.collection("users").doc(userId).collection('accounts').doc(accountId);

    const campaignsQuery = await adminDb.collection('campaigns').get();

    for (let i = 0; i < campaignsQuery.docs.length; i++) {
      const campaignDoc = campaignsQuery.docs[i];
      const videosColRef = campaignDoc.ref.collection("videos").where("userAccountRef", "==", accountRef);
      const videosQuery = await videosColRef.get();
      for(let j = 0; j < videosQuery.docs.length; j++) {
        await videosQuery.docs[j].ref.delete();
      }
    }

    await accountRef.delete()
    await adminDb.collection('accounts').doc(accountId).delete();
    return NextResponse.json({message: "Successfully deleted account and its corresponding videos" }, {status: 200})
  } catch (error) {
    console.error("Error deleting account: " + error);
    return NextResponse.json({ message: "Error deleting account" }, {status: 500});
  }
}