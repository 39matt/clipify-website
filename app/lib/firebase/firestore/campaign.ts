import { collection, doc, getDoc, getDocs } from '@firebase/firestore'
import { db } from '../firebase'

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
