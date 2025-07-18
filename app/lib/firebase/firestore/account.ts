import { collection, doc, getDoc, getDocs, setDoc } from '@firebase/firestore'
import { db } from '../firebase'
import { IVideo } from '../../models/video'

export async function getAllAccounts(uid: string) {
  try {
    const userDocRef = doc(db, 'users', uid)
    const accountColRef = collection(userDocRef, 'accounts')
    const snapshot = await getDocs(accountColRef)
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
    return { id: snapshot.id, videos:[], username: accountData?.username || "", platform: accountData?.platform, link: accountData?.link } as IAccount;
  } catch (error) {
    console.error('Error getting account:', error);
    throw new Error('Error getting account');
  }
}

export async function getAccountAndVideos(uid: string, accId: string): Promise<IAccount> {
  try {
    const userDocRef = doc(db, 'users', uid);
    const accountDocRef = doc(userDocRef, 'accounts', accId);

    const accountSnapshot = await getDoc(accountDocRef);

    if (!accountSnapshot.exists()) {
      throw new Error('Account not found');
    }

    const videoColRef = collection(accountDocRef, 'videos');
    const videoSnapshot = await getDocs(videoColRef);

    const videos: IVideo[] = videoSnapshot.empty
      ? []
      : videoSnapshot.docs.map((doc) => ({
        uid: doc.id,
        ...doc.data(),
      })) as IVideo[];
    console.log(videos)
    return { id: accountSnapshot.id, videos, ...accountSnapshot.data() } as IAccount;
  } catch (error) {
    console.error('Error getting account and videos:', error);
    throw new Error('Error getting account and videos');
  }
}

export async function addAccount(uid: string, account: IAccount) {
  try {
    const userAccountRef = doc(collection(doc(db, 'users', uid), 'accounts'), account.username);
    await setDoc(userAccountRef, account);

    const globalAccountRef = doc(db, 'accounts', account.username);
    await setDoc(globalAccountRef, account);

    console.log('Account added successfully');
  } catch (error) {
    console.error('Error adding account:', error);
    throw new Error('Failed to add account');
  }
}

export async function accountExists(username: string) {
  try {
    const accountRef = doc(db, 'accounts', username);
    const accountDoc = await getDoc(accountRef);

    return accountDoc.exists();
  } catch (error) {
    console.error('Error checking if account exists:', error);
    throw new Error('Failed to check if account exists');
  }
}

export async function userAccountExists(uid: string, accountName: string, platform: string): Promise<boolean> {
  try {
    const accounts = await getAllAccounts(uid);
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
