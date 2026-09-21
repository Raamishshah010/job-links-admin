import { addDoc, collection, deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'

export function addDocument(collectionName, data) {
  return addDoc(collection(db, collectionName), { ...data, createdAt: serverTimestamp() })
}

export function updateDocument(collectionName, id, data) {
  return updateDoc(doc(db, collectionName, id), data)
}

export function removeDocument(collectionName, id) {
  return deleteDoc(doc(db, collectionName, id))
}
