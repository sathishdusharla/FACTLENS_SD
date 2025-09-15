// Firestore like utilities for Fact Wall
import { getFirestore, collection, setDoc, doc, query, onSnapshot, deleteDoc } from "firebase/firestore";

const db = getFirestore();

export async function setLike(factId: string, userId: string) {
  await setDoc(doc(db, `facts/${factId}/likes/${userId}`), {
    userId,
    likedAt: Date.now()
  });
}

export function subscribeLikes(factId: string, callback: (likes: any[]) => void) {
  const q = query(collection(db, `facts/${factId}/likes`));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
}

export async function removeLike(factId: string, userId: string) {
  await deleteDoc(doc(db, `facts/${factId}/likes/${userId}`));
}