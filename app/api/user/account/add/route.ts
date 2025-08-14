import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '../../../../lib/firebase/firebaseAdmin'
import { IAccount } from '../../../../lib/models/account'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, account } = body as { uid: string; account: IAccount };

    if (!uid || uid.trim() === '') {
      return NextResponse.json(
        { message: 'UID is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    if (!account || !account.username || !account.platform || !account.link) {
      return NextResponse.json(
        { message: 'Account object is missing required fields' },
        { status: 400 }
      );
    }

    const cleanUid = uid.trim();

    const userAccountRef = adminDb
      .collection('users')
      .doc(cleanUid)
      .collection('accounts')
      .doc(`${account.username}_${account.platform}`);

    await userAccountRef.set(account);

    const globalAccountRef = adminDb
      .collection('accounts')
      .doc(`${account.username}_${account.platform}`);

    await globalAccountRef.set(account);

    console.log('Account added successfully');

    return NextResponse.json(
      {
        status: 200,
        account,
        message: 'Account added successfully!',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error adding account:', err);

    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : 'Failed to add account due to unknown error',
      },
      { status: 500 }
    );
  }
}