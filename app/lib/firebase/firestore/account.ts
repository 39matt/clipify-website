import { collection, doc, getDoc, getDocs } from '@firebase/firestore'
import { db } from '../firebaseClient'
import { IAccount } from '../../models/account'

export async function getAllAccounts(uid: string) {
  try {
    const userDocRef = doc(db, 'users', uid)
    const accountColRef = collection(userDocRef, 'accounts')
    const snapshot = await getDocs(accountColRef)
    console.log("accounts", snapshot.docs.map(doc => doc.data()))
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as IAccount[]
  } catch (error) {
    throw new Error('Error getting all accounts')
  }
}

export async function getAccount(uid: string, accId: string): Promise<IAccount> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const accountDocRef = doc(userDocRef, 'accounts', accId);
    const snapshot = await getDoc(accountDocRef);

    if (!snapshot.exists()) {
      throw new Error('Account not found');
    }
    const accountData = snapshot.data();
    return { id: snapshot.id, username: accountData?.username || "", platform: accountData?.platform, link: accountData?.link } as IAccount;
  } catch (error) {
    console.error('Error getting account:', error);
    throw new Error('Error getting account');
  }
}

// export async function getAccountAndVideos(uid: string, accId: string): Promise<IAccount> {
//   try {
//     const userDocRef = doc(db, 'users', uid);
//     const accountDocRef = doc(userDocRef, 'accounts', accId);
//
//     const accountSnapshot = await getDoc(accountDocRef);
//
//     if (!accountSnapshot.exists()) {
//       throw new Error('Account not found');
//     }
//
//     const videoColRef = collection(accountDocRef, 'videos');
//     const videoSnapshot = await getDocs(videoColRef);
//
//     const videos: IVideo[] = videoSnapshot.empty
//       ? []
//       : videoSnapshot.docs.map((doc) => ({
//         uid: doc.id,
//         ...doc.data(),
//       })) as IVideo[];
//     return { id: accountSnapshot.id, ...accountSnapshot.data() } as IAccount;
//   } catch (error) {
//     console.error('Error getting account and videos:', error);
//     throw new Error('Error getting account and videos');
//   }
// }

// export async function addAccount(uid: string, account: IAccount) {
//   try {
//     const userAccountRef = doc(collection(doc(db, 'users', uid), 'accounts'), account.username);
//     await setDoc(userAccountRef, account);
//
//     const globalAccountRef = doc(db, 'accounts', account.username);
//     await setDoc(globalAccountRef, account);
//
//     console.log('Account added successfully');
//   } catch (error) {
//     console.error('Error adding account:', error);
//     throw new Error('Failed to add account');
//   }
// }

export async function accountExists(username: string, platform: string): Promise<boolean> {
  try {
    const accountRef = doc(db, 'accounts', username);
    const accountDoc = await getDoc(accountRef);

    if(accountDoc.exists()) {
      if(accountDoc.data()["platform"] === platform) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking if account exists:', error);
    throw new Error('Failed to check if account exists');
  }
}

export async function userAccountExists(uid: string, accountName: string, platform: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/user/account/get-all?uid=${uid}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
    })
    const accounts = await response.json() as IAccount[];
    for (const account of accounts) {
      if (account.username === accountName && account.platform === platform) {
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking if user account exists:', error);
    throw new Error('Failed to check if user account exists');
  }
}
