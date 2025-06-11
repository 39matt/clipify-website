import { User } from '@firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'

import { createContext, useContext, useEffect, useState } from 'react'

import { auth } from '../lib/firebase/firebase'
import { getUserId } from '../lib/firebase/firestore'

interface AuthContextType {
  user: User | null
  loading: boolean
  discordUsername: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  discordUsername: null,
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [discordUsername, setDiscordUsername] = useState('')

  useEffect(() => {
    const fetchUserIdAndSubscribe = async () => {
      if (user?.email) {
        try {
          const userId = await getUserId(user.email)
          setDiscordUsername(userId) // Set the username (or userId)
        } catch (error) {
          console.error('Error fetching userId:', error)
        }
      }

      return onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser)
        setLoading(false)
      })
    }

    const unsubscribePromise = fetchUserIdAndSubscribe()

    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (typeof unsubscribe === 'function') {
          unsubscribe()
        }
      })
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, discordUsername }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}