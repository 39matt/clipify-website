import { addDoc, collection, deleteDoc, doc, getDocs } from '@firebase/firestore'
import { db } from '../firebaseClient'
import { addAccount } from './account'
import { IAccount } from '../../models/account'

export async function verificationExists(uid: string): Promise<IVerification | undefined> {
  // Add input validation
  if (!uid || uid.trim() === '') {
    console.error('Invalid UID provided to verificationExists:', uid);
    throw new Error('UID is required and must be a non-empty string');
  }

  try {
    const cleanUid = uid.trim();
    console.log('Checking verification for UID:', cleanUid); // Debug log

    const docRef = doc(db, 'users', cleanUid);
    const verificationColRef = collection(docRef, 'verifications');
    const querySnapshot = await getDocs(verificationColRef);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as IVerification;
    }

    return undefined;
  } catch (error) {
    console.error('Error checking verification existence:', error);
    throw new Error('Failed to check verification existence');
  }
}
export async function addVerification(uid: string, accountLink: string): Promise<IVerification> {
  // Validate inputs
  if (!uid || typeof uid !== 'string' || uid.trim() === '') {
    throw new Error('UID is required and must be a non-empty string');
  }

  if (!accountLink || typeof accountLink !== 'string' || accountLink.trim() === '') {
    throw new Error('Account link is required and must be a non-empty string');
  }

  try {
    const cleanUid = uid.trim();
    const cleanAccountLink = accountLink.trim();

    console.log('Adding verification for UID:', cleanUid, 'Link:', cleanAccountLink);

    const docRef = doc(db, 'users', cleanUid);
    const verificationColRef = collection(docRef, 'verifications');

    // Extract username properly
    let username = '';
    let platform = 'Instagram';

    if (cleanAccountLink.toLowerCase().includes('tiktok')) {
      platform = 'TikTok';

      // Handle TikTok URLs with or without @
      if (cleanAccountLink.includes('@')) {
        username = cleanAccountLink.split('@')[1].split('/')[0]; // Remove any trailing path
      } else {
        // Extract from URL path: https://tiktok.com/username
        const parts = cleanAccountLink.split('/').filter(part => part !== '');
        username = parts[parts.length - 1];
      }
    } else {
      // Handle Instagram URLs
      const parts = cleanAccountLink.split('/').filter(part => part !== '');
      username = parts[parts.length - 1];
    }

    // Validate extracted username
    if (!username || username.trim() === '') {
      throw new Error('Could not extract username from account link');
    }

    const verification: IVerification = {
      platform: platform as 'Instagram' | 'TikTok',
      username: username.trim(),
      code: Math.floor(100000 + Math.random() * 900000)
    };

    console.log('Creating verification:', verification);

    await addDoc(verificationColRef, verification);

    return verification;
  } catch (error) {
    console.error('Error adding verification:', error);
    throw new Error(`Failed to add verification: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
      throw new Error(`Kod se ne nalazi u bio-u (bio: ${bio})`);
    }
  } catch (error) {
    console.error('Error verifying verification:', error);
    throw new Error('Neuspešna verifikacija!');
  }
}
