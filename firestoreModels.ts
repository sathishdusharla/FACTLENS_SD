// Firestore data models and utility functions
// User profile, dashboard, leaderboard, fact wall

export interface UserProfile {
  uid: string; // Firebase Auth UID
  email: string;
  name: string;
  bio?: string;
  createdAt: number;
}

export interface LeaderboardEntry {
  uid: string;
  name: string;
  score: number;
}

export interface Fact {
  id: string;
  content: string;
  authorUid: string;
  createdAt: number;
}

export interface DashboardData {
  uid: string;
  factsSubmitted: number;
  score: number;
  lastActive: number;
}

// Collections:
// users/{uid} : UserProfile
// leaderboard/{uid} : LeaderboardEntry
// facts/{id} : Fact
// dashboard/{uid} : DashboardData
