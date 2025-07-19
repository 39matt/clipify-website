import { IVideo } from '../../models/video'
import { addDoc, collection, doc, getDocs, limit, query, where } from '@firebase/firestore'
import { db } from '../firebaseClient'

export async function getVideoInfo(videoId: string, platform: string, api_key: string) {
  try {
    const url =
      platform === 'Instagram'
        ? `https://instagram-looter2.p.rapidapi.com/post?id=${videoId}`
        : `https://tiktok-api23.p.rapidapi.com/api/post/detail?videoId=${videoId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': api_key,
        'x-rapidapi-host':
          platform === 'Instagram'
            ? 'instagram-looter2.p.rapidapi.com'
            : 'tiktok-api23.p.rapidapi.com',
      },
    });
    const parsedBody = await response.json();

    let videoInfo: IVideo | null = null;

    if (platform === 'Instagram') {
      const instagramData = parsedBody;

      videoInfo = {
        comments: instagramData.edge_media_to_parent_comment?.count || 0,
        createdAt: new Date(instagramData.taken_at_timestamp * 1000).toISOString(),
        likes: instagramData.edge_media_preview_like?.count || 0,
        link: `https://www.instagram.com/p/${instagramData.shortcode}/`,
        name: instagramData.edge_media_to_caption?.edges[0]?.node?.text || '',
        accountName: instagramData.owner?.username || '',
        shares: 0,
        views: instagramData.video_play_count || 0,
        coverUrl: instagramData.thumbnail_src || '',
      };
    } else if (platform === 'TikTok') {
      const tiktokData = parsedBody.itemInfo.itemStruct;

      videoInfo = {
        comments: tiktokData.stats?.commentCount || 0,
        createdAt: new Date(parseInt(tiktokData.createTime) * 1000).toISOString(),
        likes: tiktokData.stats?.diggCount || 0,
        link: `https://www.tiktok.com/@${tiktokData.author?.uniqueId}/video/${tiktokData.id}`,
        name: tiktokData.desc || '',
        accountName: tiktokData.author?.nickname || '',
        shares: tiktokData.stats?.shareCount || 0,
        views: tiktokData.stats?.playCount || 0,
        coverUrl: tiktokData.video.cover || '',
      };
    }

    return videoInfo
  } catch (error) {
    console.error('Error getting video info:', error);
    throw new Error('Failed to get video info');
  }
}

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

    const userVideoColRef = collection(video.userAccountRef, 'videos');

    const newVideoDocRef = await addDoc(videoColRef, video);
    const newUserVideoDocRef = await addDoc(userVideoColRef, {video: newVideoDocRef, campaignId: campaignId});
  } catch (error) {
    console.error('Error adding video:', error);
    throw new Error('Failed to add video');
  }
}