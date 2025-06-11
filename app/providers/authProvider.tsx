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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    // if we're logged out, clear the username
    if (!user?.email) {
      setDiscordUsername('')
      return
    }
    // otherwise fetch
    let cancelled = false
    getUserId(user.email)
      .then((id) => {
        if (!cancelled) {
          setDiscordUsername(id)
        }
      })
      .catch((err) => {
        console.error('Error fetching userId:', err)
      })
    return () => {
      cancelled = true
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