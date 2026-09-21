import { useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { AuthContext } from './auth-context'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (!fbUser) {
        setUser(null)
        setAuthLoading(false)
        return
      }
      // Same admin allow-list as the website: a Firestore doc keyed by UID
      // in /admins, only creatable via the Firebase Console or Admin SDK.
      // Signing in with Firebase Auth alone is not enough to reach this
      // panel — the account also has to be on that list.
      try {
        const adminSnap = await getDoc(doc(db, 'admins', fbUser.uid))
        if (!adminSnap.exists()) {
          await signOut(auth)
          setUser(null)
        } else {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Admin',
          })
        }
      } catch {
        setUser(null)
      }
      setAuthLoading(false)
    })
    return unsubscribe
  }, [])

  const login = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password)
    const adminSnap = await getDoc(doc(db, 'admins', cred.user.uid))
    if (!adminSnap.exists()) {
      await signOut(auth)
      throw new Error("This account isn't authorized for the admin panel.")
    }
    return cred.user
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
