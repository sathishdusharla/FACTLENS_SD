// Firestore vote utilities for Fact Wall
import { getFirestore, collection, setDoc, doc, query, onSnapshot, deleteDoc } from "firebase/firestore";

const db = getFirestore();

export async function setVote(factId: string, userId: string, vote: "up" | "down" | "agree" | "disagree") {
  await setDoc(doc(db, `facts/${factId}/votes/${userId}`), {
    userId,
    vote,
    updatedAt: Date.now()
  });
}

export function subscribeVotes(factId: string, callback: (votes: any[]) => void) {
  const q = query(collection(db, `facts/${factId}/votes`));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  });
}

export async function removeVote(factId: string, userId: string) {
  await deleteDoc(doc(db, `facts/${factId}/votes/${userId}`));
}