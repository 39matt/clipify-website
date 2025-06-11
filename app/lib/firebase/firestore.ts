import { collection, doc, getDoc, getDocs, query, setDoc, where } from '@firebase/firestore'
import { db } from './firebase'


export async function getUserId(email: string): Promise<string> {
  const usersCollection = collection(db, 'users')
  const q = query(usersCollection, where('email', '==', email));

  const userSnapshot = await getDocs(q);
  return userSnapshot.docs[0].id;
}

export async function addUser(email: string, discordUsername: string) {
  const userDocRef = doc(db, 'users', discordUsername);

  await setDoc(
    userDocRef,
    {
      email,
      discordUsername,
      connected: true,
    },
    { merge: true }
  );
}

export async function isUserLinked(uid: string): Promise<boolean> {
  try {
    const userDocRef = doc(db, 'users', uid);

    const userDoc = await getDoc(userDocRef);

    return userDoc.exists() && userDoc.data()?.connected === true;
    // const usersCollection = collection(db, 'users');
    //
    // const q = query(usersCollection, where('email', '==', email), where('connected', '==', true));
    //
    // const querySnapshot = await getDocs(q);
    //
    // return !querySnapshot.empty;
  } catch (error) {
    console.error('Error checking if user is linked:', error);
    throw new Error('Failed to check user linkage');
  }
}