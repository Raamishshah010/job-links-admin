import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Same Firebase project as the JobsLinks.pk website (joblinks-20464) — this
// is what makes the admin panel and the website "connected": one Auth user
// pool, one Firestore database, one `admins` allow-list gating both.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDmAVzU6FOmbdAgvDU5ATbb1Evk_9M1jjY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'joblinks-20464.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'joblinks-20464',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'joblinks-20464.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '351012321440',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:351012321440:web:e75aed96831f0c96dff1c5',
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
