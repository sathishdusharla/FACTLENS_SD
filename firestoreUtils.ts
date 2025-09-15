// Utility functions for Firestore CRUD operations
import { getFirestore, doc, setDoc, getDoc, updateDoc, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { UserProfile, LeaderboardEntry, Fact, DashboardData } from "./firestoreModels";
import { auth } from "./firebaseConfig";

const db = getFirestore();

// User profile
export async function saveUserProfile(profile: UserProfile) {
  await setDoc(doc(db, "users", profile.uid), profile, { merge: true });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const docSnap = await getDoc(doc(db, "users", uid));
  return docSnap.exists() ? (docSnap.data() as UserProfile) : null;
}

export async function updateUserBio(uid: string, bio: string) {
  await updateDoc(doc(db, "users", uid), { bio });
}

// Leaderboard
export function subscribeLeaderboard(callback: (entries: LeaderboardEntry[]) => void) {
  const q = query(collection(db, "leaderboard"), orderBy("score", "desc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => doc.data() as LeaderboardEntry));
  });
}

// Fact Wall
export function subscribeFactWall(callback: (facts: Fact[]) => void) {
  const q = query(collection(db, "facts"), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Fact)));
  });
}

// Dashboard
export async function getDashboardData(uid: string): Promise<DashboardData | null> {
  const docSnap = await getDoc(doc(db, "dashboard", uid));
  return docSnap.exists() ? (docSnap.data() as DashboardData) : null;
}

export async function saveDashboardData(data: DashboardData) {
  await setDoc(doc(db, "dashboard", data.uid), data, { merge: true });
}
