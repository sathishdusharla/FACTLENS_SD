import React, { useEffect, useState } from 'react';
import { subscribeLeaderboard } from '../firestoreUtils';

const Leaderboard: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);

  useEffect(() => {
    let unsub: any;
    async function fetchLeaderboard() {
      unsub = subscribeLeaderboard(async (entries) => {
        // For each entry, if name is missing or is UID, fetch user profile
        const updatedEntries = await Promise.all(entries.map(async (entry, idx) => {
          let displayName = entry.name;
          if (!displayName || displayName === entry.uid) {
            // Try to fetch user profile for display name
            try {
              const res = await fetch(`/api/userProfile?uid=${entry.uid}`);
              if (res.ok) {
                const data = await res.json();
                displayName = data.name || entry.uid;
              } else {
                displayName = entry.uid;
              }
            } catch {
              displayName = entry.uid;
            }
          }
          return {
            rank: idx + 1,
            name: displayName,
            points: typeof entry.score === 'number' ? entry.score : 0,
            isUser: false
          };
        }));
        setLeaderboardData(updatedEntries);
      });
    }
    fetchLeaderboard();
    return () => unsub && unsub();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center flex-grow w-full text-center animate-fade-in">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-4xl md:text-5xl font-archivoblack text-white uppercase tracking-wide leading-tight drop-shadow-2xl">
          Leaderboard
        </h1>
        <div className="w-full p-px mx-auto rounded-2xl bg-gradient-to-b from-blue-500/50 via-blue-800/20 to-transparent shadow-2xl shadow-blue-900/40">
            <div className="bg-[#0c142b]/80 backdrop-blur-2xl rounded-[15px] p-6 text-white">
                <div className="flow-root">
                    <div className="-my-2 divide-y divide-white/10">
          {leaderboardData.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-lg">No users found.</div>
          ) : leaderboardData.map((user) => (
            <div key={user.rank} className={`py-4 flex items-center space-x-4 ${user.isUser ? 'bg-blue-500/10 rounded-lg px-4 -mx-4' : ''}`}> 
              <div className="text-lg font-bold text-gray-400 w-8">{user.rank}</div>
              <div className="flex-1 min-w-0">
                <p className="text-md font-semibold text-white truncate">{user.name}</p>
              </div>
              <div className="text-lg font-bold text-blue-400">{user.points.toLocaleString()} pts</div>
            </div>
          ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
};

export default Leaderboard;
