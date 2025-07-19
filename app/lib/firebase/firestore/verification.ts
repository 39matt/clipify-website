import { addDoc, collection, deleteDoc, doc, getDocs } from '@firebase/firestore'
import { db } from '../firebaseClient'
import { addAccount } from './account'
import { IAccount } from '../../models/account'

export async function verificationExists(uid: string) {
  try {
    const docRef = doc(db, 'users', uid)
    const verificationColRef = collection(docRef, 'verifications')
    const querySnapshot = await getDocs(verificationColRef)
    if(!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as IVerification
    }
    return undefined
  } catch (error) {
    console.error('Error adding verification:', error)
    throw new Error('Failed to add verification')
  }
}

export async function addVerification(uid: string, accountLink: string) {
  try {
    const docRef = doc(db, 'users', uid)
    const verificationColRef = collection(docRef, 'verifications')


    let verification: IVerification = {
      platform: "Instagram",
      username: accountLink.split('@')[1],
      code: Math.floor(100000 + Math.random() * 900000)
    }
    if (accountLink.toLowerCase().includes('tiktok')) {
      verification.platform = 'TikTok'
    }

    await addDoc(verificationColRef, verification)

    return verification
  } catch (error) {
    console.error('Error adding verification:', error)
    throw new Error('Failed to add verification')
  }
}

export async function removeVerification(uid: string) {
  try {
    const docRef = doc(db, 'users', uid);
    const verificationColRef = collection(docRef, 'verifications');
    const querySnapshot = await getDocs(verificationColRef);

    if (!querySnapshot.empty) {
      const verificationDocRef = querySnapshot.docs[0];
      await deleteDoc(verificationDocRef.ref);
      console.log('Verification removed successfully');
    } else {
      console.log('No verification found to remove');
    }
  } catch (error) {
    console.error('Error deleting verification:', error);
    throw new Error('Failed to remove verification');
  }
}

export async function verifyVerification(uid: string, verification: IVerification, api_key: string) {
  try {
    const url =
      verification.platform === 'Instagram'
        ? `https://instagram-looter2.p.rapidapi.com/profile?username=${verification.username}`
        : `https://tiktok-api23.p.rapidapi.com/api/user/info?uniqueId=${verification.username}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': api_key,
        'x-rapidapi-host':
          verification.platform === 'Instagram'
            ? 'instagram-looter2.p.rapidapi.com'
            : 'tiktok-api23.p.rapidapi.com',
      },
    });

    const parsedBody = await response.json();

    let bio: string | null = null;

    if (verification.platform === 'Instagram') {
      bio = parsedBody.biography || null;
    } else if (verification.platform === 'TikTok') {
      bio = parsedBody.userInfo?.user?.signature || null;
    }

    if (bio?.includes(verification.code.toString())) {
      const account: IAccount = {
        platform: verification.platform,
        username: verification.username,
        link:
          verification.platform === 'Instagram'
            ? `https://www.instagram.com/${verification.username}`
            : `https://www.tiktok.com/@${verification.username}`,
      };
      await removeVerification(uid);
      await addAccount(uid, account);
    }
    else {
      throw new Error('Kod se ne nalazi u bio-u!');
    }
  } catch (error) {
    console.error('Error verifying verification:', error);
    throw new Error('Neuspešna verifikacija!');
  }
}
