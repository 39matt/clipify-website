import { IVideo } from '../../models/video'
import { addDoc, collection, doc, getDocs, limit, query, where } from '@firebase/firestore'
import { db } from '../firebaseClient'

export async function accountVideoExists(uid: string, accountName:string, platform :string, videoLink: string): Promise<boolean> {
  try {
    const userDocRef = doc(db, 'users', uid)
    const accountColRef = collection(userDocRef, 'accounts')
    const accountDocQ = query(accountColRef, where("username", "==", accountName), where("platform", "==", platform), limit(1));
    const accountQSnap = await getDocs(accountDocQ);
    const videosColRef = collection(accountQSnap.docs[0].ref, 'videos');
    const videoDocQ = query(videosColRef, where("link", "==", videoLink), limit(1));
    const videoQSnap = await getDocs(videoDocQ);
    return !videoQSnap.empty;
  } catch (error) {
    console.error('Error validating video:', error);
    throw new Error('Failed to validate video');
  }
}