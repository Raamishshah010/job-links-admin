import { useEffect, useState } from 'react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../firebase'

// Live-subscribes to a whole Firestore collection. Used across the Job
// Portal pages (companies, jobs, advertisements) so the admin panel and the
// public website are always looking at the exact same data, not a copy of it.
export function useFirestoreCollection(name, { orderByField, orderDirection = 'desc' } = {}) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const ref = collection(db, name)
    const q = orderByField ? query(ref, orderBy(orderByField, orderDirection)) : ref
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        setError(err.message)
        setLoading(false)
      }
    )
    return unsub
  }, [name, orderByField, orderDirection])

  return { items, loading, error }
}
