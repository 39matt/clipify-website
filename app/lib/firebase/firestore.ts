import {
  collection,
  doc,
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