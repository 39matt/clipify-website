import {
  addDoc,
  collection, deleteDoc,
  doc, DocumentReference,
  getDoc,
  getDocs,
  limit,
  query,
  setDoc,
  where,
} from '@firebase/firestore'

import { db } from './firebase'

export async function getUserId(email: string): Promise<string> {
  try {
    const usersCollection = collection(db, 'users')

    console.log(`email: ${email}`)
    const q = query(usersCollection, where('email', '==', email), limit(1))

    const userSnapshot = await getDocs(q)

    if (userSnapshot.empty) {
      throw new Error(`No user found with email: ${email}`)
    }

    return userSnapshot.docs[0].id
  } catch (error) {
    console.error('Error fetching user ID:', error)
    throw new Error('Failed to fetch user ID')
  }
}

export async function checkUsernameAvailability(
  username: string,
): Promise<boolean> {
  const usersCollection = collection(db, 'users')

  const q = query(usersCollection, where('username', '==', username), limit(1))

  const querySnapshot = await getDocs(q)

  return !querySnapshot.empty
}

export async function addUser(email: string, discordUsername: string) {
  const userDocRef = doc(db, 'users', discordUsername)

  await setDoc(
    userDocRef,
    {
      email,
      connected: true,
    },
    { merge: true },
  )
}

export async function isUserLinked(uid: string): Promise<boolean> {
  try {
    const userDocRef = doc(db, 'users', uid)

    const userDoc = await getDoc(userDocRef)

    return userDoc.exists() && userDoc.data()?.connected === true
    // const usersCollection = collection(db, 'users');
    //
    // const q = query(usersCollection, where('email', '==', email), where('connected', '==', true));
    //
    // const querySnapshot = await getDocs(q);
    //
    // return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if user is linked:', error)
    throw new Error('Failed to check user linkage')
  }
}

export const updateWalletAddress = async (
  uid: string,
  walletAddress: string,
) => {
  const userDocRef = doc(db, 'users', uid)
  await setDoc(
    userDocRef,
    {
      walletAddress,
    },
    { merge: true },
  )
}

export async function getAllCampaigns() {
  try {
    const campaignsCollection = collection(db, 'campaigns') // Replace 'campaigns' with your collection name
    const snapshot = await getDocs(campaignsCollection)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ICampaign[]
  } catch (error) {
    throw new Error('Error getting all campaigns')
  }
}

export async function getCampaign(id: string): Promise<ICampaign | null> {
  try {
    const docRef = doc(db, 'campaigns', id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        influencer: data.influencer,
        activity: data.activity,
        imageUrl: data.imageUrl,
        progress: data.progress,
        budget: data.budget,
        perMillion: data.per_million,
        createdAt: data.createdAt,
        maxEarnings: data.max_earnings,
        maxEarningsPerPost: data.max_earnings_per_post,
        maxSubmissions: data.max_submissions,
        minViewsPerPayout: data.min_views_for_payout,
      }
    } else {
      console.log('Could not find campaign')
      return null
    }
  } catch (err) {
    throw new Error('Došlo je do greške prilikom učitavanja kampanje.')
  }
}

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
        videos: []
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

export async function addVideo(uid: string, accId: string, video: IVideo) {
  try {
    const userDocRef = doc(db, 'users', uid);
    const accountDocRef = doc(userDocRef, 'accounts', accId);
    const videoColRef = collection(accountDocRef, 'videos');

    const newVideoDocRef = await addDoc(videoColRef, video);
  } catch (error) {
    console.error('Error adding video:', error);
    throw new Error('Failed to add video');
  }
}