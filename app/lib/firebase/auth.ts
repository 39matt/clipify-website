import {
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification, signInWithEmailAndPassword, signOut,
} from '@firebase/auth'

import { useEffect, useState } from 'react'

import { auth } from './firebase'
import { useRouter } from 'next/navigation'

export async function signUp(email: string, password: string): Promise<any> {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  )
  await sendEmailVerification(userCredential.user)
}

export async function signIn(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password)
  // const idToken = await userCredential.user.getIdToken()

  // await fetch('/api/sessionLogin', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ idToken }),
  // })
}

// export function useAuthUser() {
//   const [user, setUser] = useState<User | null>(null)
//   const [loading, setLoading] = useState(true)
//
//   useEffect(() => {
//     return onAuthStateChanged(auth, (user) => {
//       setUser(user)
//       setLoading(false)
//     })
//   }, [])
//   return { user, loading }
// }


export async function logout() {
    await signOut(auth)
    console.log('Signed out successfully')
}