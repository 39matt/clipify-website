import { User } from '@firebase/auth'
import { onAuthStateChanged } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'

import { auth } from '../lib/firebase/firebaseClient'
import { getUserId } from '../lib/firebase/firestore/user'

interface AuthContextType {
  user: User | null
  loading: boolean
  discordUsername: string | null
  isAdmin: boolean
  adminLoading: boolean // Add this
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  discordUsername: null,
  isAdmin: false,
  adminLoading: true, // Add this
})

export function AuthProvider({ children }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [discordUsername, setDiscordUsername] = useState<string | null>(null)
  const [isAdmin, setAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(true) // Add this

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken()
          const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'
          Cookies.set('authToken', token, {
            expires: 1/24,
            secure: !isLocalhost,
            sameSite: 'lax',
            path: '/'
          })
          console.log("Initial token set:", Cookies.get('authToken'))

        } catch (error) {
          console.error('Error getting initial ID token:', error)
          Cookies.remove('authToken', { path: '/' })
        }
      } else {
        // Remove cookie when user logs out
        Cookies.remove('authToken', { path: '/' })
        setAdminLoading(false) // No user = no admin check needed
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!user?.email) {
      setDiscordUsername(null)
      setAdmin(false)
      setAdminLoading(false) // No user = no admin loading
      return
    }

    setAdminLoading(true) // Start admin loading
    let cancelled = false

    getUserId(user.email)
      .then(async (id) => {
        if (cancelled) return

        setDiscordUsername(id)

        try {
          const idToken = await user.getIdToken()
          const response = await fetch('/api/admin/check', {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${idToken}`
            },
          })

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }

          const adminData = await response.json()

          if (!cancelled) {
            setAdmin(adminData.isAdmin)
            setAdminLoading(false) // Admin check complete
          }
        } catch (error) {
          console.error('Error checking admin status:', error)
          if (!cancelled) {
            setAdmin(false)
            setAdminLoading(false) // Admin check complete (failed)
          }
        }
      })
      .catch((err) => {
        console.error('Error fetching userId:', err)
        if (!cancelled) {
          setDiscordUsername(null)
          setAdmin(false)
          setAdminLoading(false) // Admin check complete (failed)
        }
      })

    return () => {
      cancelled = true
    }
  }, [user])

  useEffect(() => {
    if (!user) return

    // Set up token refresh interval
    const interval = setInterval(async () => {
      try {
        const newToken = await user.getIdToken(true) // Force refresh
        const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost'
        Cookies.set('authToken', newToken, {
          expires: 1/24,
          secure: !isLocalhost,
          sameSite: 'lax',
          path: '/'
        })
      } catch (error) {
        console.error('Error refreshing token:', error)
        Cookies.remove('authToken', { path: '/' })
      }
    }, 55 * 60 * 1000) // Refresh every 55 minutes

    return () => clearInterval(interval)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, discordUsername, isAdmin, adminLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}