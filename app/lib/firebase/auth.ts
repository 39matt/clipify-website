import {
  createUserWithEmailAndPassword, EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithRedirect,
  sendEmailVerification, signInWithEmailAndPassword, signOut,
  updatePassword, User,
} from '@firebase/auth'
import { auth, db } from './firebaseClient'
import { clearIndexedDbPersistence } from '@firebase/firestore'

export async function signUp(email: string, password: string): Promise<any> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  )
  await sendEmailVerification(userCredential.user)
}


export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function logout() {
    await signOut(auth)
    await clearIndexedDbPersistence(db)
    console.log('Signed out successfully')
}

export async function changePassword(user: User, currentPassword: string, newPassword: string) {
  try {
    const credential = EmailAuthProvider.credential(user.email!, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword)
  }
  catch (error) {
    throw error
  }
}