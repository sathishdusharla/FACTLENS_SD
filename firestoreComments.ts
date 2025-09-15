// Firestore comment utilities for Fact Wall
import { getFirestore, collection, addDoc, deleteDoc, doc, query, orderBy, onSnapshot } from "firebase/firestore";

const db = getFirestore();

export async function addComment(factId: string, userId: string, userName: string, text: string) {
  await addDoc(collection(db, `facts/${factId}/comments`), {
    userId,
    userName,
    text,
    createdAt: Date.now()
  });
}

export function subscribeComments(factId: string, callback: (comments: any[]) => void) {
  const q = query(collection(db, `facts/${factId}/comments`), orderBy("createdAt", "asc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
}

export async function deleteComment(factId: string, commentId: string) {
  await deleteDoc(doc(db, `facts/${factId}/comments/${commentId}`));
}