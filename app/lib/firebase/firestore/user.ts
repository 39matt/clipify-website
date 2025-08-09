import { collection, doc, getDoc, getDocs, limit, query, setDoc, where } from '@firebase/firestore'
import { db } from '../firebaseClient'

export async function getUserId(email: string): Promise<string> {
  try {
    const usersCollection = collection(db, 'users')

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

export async function checkUsernameAvailability(username: string): Promise<boolean> {
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