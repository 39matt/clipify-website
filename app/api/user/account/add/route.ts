import { NextRequest, NextResponse } from 'next/server';
import { IAccount } from '../../../../lib/models/account'
import { adminDb } from '../../../../lib/firebase/firebaseAdmin'

async function addAccount(uid: string, account: IAccount) {
  try {
    const userAccountRef = adminDb
      .collection('users')
      .doc(uid)
      .collection('accounts')
      .doc(account.username);

    await userAccountRef.set(account);

    const globalAccountRef = adminDb.collection('accounts').doc(account.username);
    await globalAccountRef.set(account);

    console.log('Account added successfully');
    return account;
  } catch (error) {
    console.error('Error adding account:', error);
    throw new Error('Failed to add account');
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { uid, account } = body;

    if (!uid || !account) {
      return NextResponse.json(
        { message: 'UID and account are mandatory!' },
        { status: 400 }
      );
    }

    const addedAccount = await addAccount(uid, account);

    return NextResponse.json(
      {
        status: 200,
        account: addedAccount,
        message: 'Account added successfully!',
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error in addAccount API:', err);

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