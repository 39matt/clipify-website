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

export async function addVideo(uid: string, accId: string, campaignId: string, video: IVideo) {
  try {

    const campaignDocRef = doc(db, 'campaigns', campaignId);
    const videoColRef = collection(campaignDocRef, 'videos');

    const userDocRef = doc(db, 'users', uid);
    video.userAccountRef = doc(userDocRef, 'accounts', accId);
    video.accountName = accId;
    video.uid = uid;
    video.approved = false;

    const userVideoColRef = collection(video.userAccountRef, 'videos');

    const newVideoDocRef = await addDoc(videoColRef, video);
    const newUserVideoDocRef = await addDoc(userVideoColRef, {video: newVideoDocRef, campaignId: campaignId});
  } catch (error) {
    console.error('Error adding video:', error);
    throw new Error('Failed to add video');
  }
}