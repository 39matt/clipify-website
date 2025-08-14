import { addDoc, collection, deleteDoc, doc, getDocs } from '@firebase/firestore'
import { db } from '../firebaseClient'
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
//
// export async function removeVerification(uid: string) {
//   try {
//     const docRef = doc(db, 'users', uid);
//     const verificationColRef = collection(docRef, 'verifications');
//     const querySnapshot = await getDocs(verificationColRef);
//
//     if (!querySnapshot.empty) {
//       const verificationDocRef = querySnapshot.docs[0];
//       await deleteDoc(verificationDocRef.ref);
//       console.log('Verification removed successfully');
//     } else {
//       console.log('No verification found to remove');
//     }
//   } catch (error) {
//     console.error('Error deleting verification:', error);
//     throw new Error('Failed to remove verification');
//   }
// }
//
// export async function verifyVerification(uid: string, verification: IVerification, api_key: string) {
//   try {
//     const url =
//       verification.platform === 'Instagram'
//         ? `https://instagram-looter2.p.rapidapi.com/profile?username=${verification.username}`
//         : `https://tiktok-api23.p.rapidapi.com/api/user/info?uniqueId=${verification.username}`;
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: {
//         'x-rapidapi-key': api_key,
//         'x-rapidapi-host':
//           verification.platform === 'Instagram'
//             ? 'instagram-looter2.p.rapidapi.com'
//             : 'tiktok-api23.p.rapidapi.com',
//       },
//     });
//
//     const parsedBody = await response.json();
//
//     let bio: string | null = null;
//
//     if (verification.platform === 'Instagram') {
//       bio = parsedBody.biography || null;
//     } else if (verification.platform === 'TikTok') {
//       bio = parsedBody.userInfo?.user?.signature || null;
//     }
//
//     if (bio?.includes(verification.code.toString())) {
//       const account: IAccount = {
//         platform: verification.platform,
//         username: verification.username,
//         link:
//           verification.platform === 'Instagram'
//             ? `https://www.instagram.com/${verification.username}`
//             : `https://www.tiktok.com/@${verification.username}`,
//       };
//       await removeVerification(uid);
//       await addAccount(uid, account);
//     }
//     else {
//       throw new Error(`Kod se ne nalazi u bio-u (bio: ${bio})`);
//     }
//   } catch (error) {
//     console.error('Error verifying verification:', error);
//     throw new Error('Neuspešna verifikacija!');
//   }
// }
