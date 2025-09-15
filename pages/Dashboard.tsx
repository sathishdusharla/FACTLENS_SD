import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { getDashboardData } from '../firestoreUtils';

const StatCard: React.FC<{title: string; value: string; description: string}> = ({title, value, description}) => (
    <div className="bg-[#0c142b]/80 backdrop-blur-2xl rounded-xl p-6 border border-white/10 text-center">
        <p className="text-sm text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-bold text-white my-2">{value}</p>
        <p className="text-sm text-gray-300">{description}</p>
    </div>
);

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

import { doc, onSnapshot, getFirestore } from 'firebase/firestore';
const db = getFirestore();

const ActivityChart: React.FC = () => {
    const [activityData, setActivityData] = useState<{ day: string; claims: number }[]>(daysOfWeek.map(day => ({ day, claims: 0 })));

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) return;
        const unsub = onSnapshot(doc(db, 'dashboard', user.uid), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Assume data.weeklyActivity is an array of 7 numbers (claims per day)
                if (Array.isArray(data.weeklyActivity)) {
                    setActivityData(daysOfWeek.map((day, idx) => ({ day, claims: data.weeklyActivity[idx] || 0 })));
                }
            }
        });
        return () => unsub();
    }, []);

    const maxClaims = Math.max(...activityData.map(d => d.claims), 0) + 2;
    return (
        <div className="w-full h-56 p-4">
            <svg width="100%" height="100%" viewBox="0 0 350 150" preserveAspectRatio="xMidYMid meet">
                <g className="grid" stroke="#fff" strokeOpacity="0.1" strokeWidth="1">
                    <line x1="25" x2="350" y1="130" y2="130"></line>
                    <line x1="25" x2="350" y1="90" y2="90"></line>
                    <line x1="25" x2="350" y1="50" y2="50"></line>
                    <line x1="25" x2="350" y1="10" y2="10"></line>
                </g>
                 <g className="labels" fill="#8899aa" fontSize="10px">
                    <text x="0" y="134">0</text>
                    <text x="0" y="54">{Math.round(maxClaims / 2)}</text>
                    <text x="0" y="14">{maxClaims - 2}</text>
                </g>
                {activityData.map((data, index) => {
                    const barHeight = (data.claims / maxClaims) * 120;
                    const x = 40 + index * 45;
                    return (
                        <g key={data.day} className="bar-group">
                            <defs>
                                <linearGradient id={`grad-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" style={{stopColor: 'rgba(59, 130, 246, 0.8)', stopOpacity:1}} />
                                <stop offset="100%" style={{stopColor: 'rgba(59, 130, 246, 0.2)', stopOpacity:1}} />
                                </linearGradient>
                            </defs>
                            <rect
                                x={x}
                                y={130 - barHeight}
                                width="25"
                                height={barHeight}
                                fill={`url(#grad-${index})`}
                                rx="3"
                                ry="3"
                                className="transition-all duration-500 hover:opacity-80"
                            />
                            <text x={x + 12.5} y="145" textAnchor="middle" fill="#aaa" fontSize="11px">{data.day}</text>
                        </g>
                    )
                })}
            </svg>
        </div>
    );
};

// Removed duplicate ActivityChart definition. Only Firestore-powered version remains above.


const Dashboard: React.FC = () => {
    const [dashboard, setDashboard] = useState<{ factsSubmitted: number; score: number; lastActive: number } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            const user = auth.currentUser;
            if (!user) return;
            const data = await getDashboardData(user.uid);
            setDashboard(data);
            setLoading(false);
        };
        fetchDashboard();
    }, []);

    return (
        <main className="flex flex-col items-center justify-center flex-grow w-full text-center animate-fade-in">
            <div className="w-full max-w-4xl">
                <h1 className="mb-8 text-4xl md:text-5xl font-archivoblack text-white uppercase tracking-wide leading-tight drop-shadow-2xl">
                    Your Dashboard
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="Points Earned" value={dashboard ? dashboard.score.toLocaleString() : "-"} description="Keep up the great work!"/>
                    <StatCard title="Claims Reviewed" value={dashboard ? dashboard.factsSubmitted.toLocaleString() : "-"} description="You're a fact-finding machine."/>
                    <StatCard title="Last Active" value={dashboard ? new Date(dashboard.lastActive).toLocaleDateString() : "-"} description="Recent activity."/>
                </div>
                <div className="mt-4 text-sm text-gray-400 text-left">
                  <strong>Points System:</strong> Analyzer score = points for each submission. Each like received on your fact = +5 points.
                </div>
                {/* ...existing code... */}
                <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg shadow-black/20">
                    <h2 className="text-2xl font-bold text-white mb-4 text-left">Your Badges</h2>
                    <div className="flex flex-wrap gap-4">
                        {/* Badge logic based on score */}
                        {(() => {
                            const score = dashboard?.score || 0;
                            if (score >= 5000) {
                                return (
                                    <div className="flex items-center gap-3 p-3 bg-[#0c142b]/80 rounded-lg">
                                        <span className="text-2xl">🏆</span>
                                        <span className="font-semibold">Legendary Diver</span>
                                    </div>
                                );
                            } else if (score >= 2000) {
                                return (
                                    <div className="flex items-center gap-3 p-3 bg-[#0c142b]/80 rounded-lg">
                                        <span className="text-2xl">🐋</span>
                                        <span className="font-semibold">Whale of Truth</span>
                                    </div>
                                );
                            } else if (score >= 1000) {
                                return (
                                    <div className="flex items-center gap-3 p-3 bg-[#0c142b]/80 rounded-lg">
                                        <span className="text-2xl">🔍</span>
                                        <span className="font-semibold">Investigator</span>
                                    </div>
                                );
                            } else if (score >= 500) {
                                return (
                                    <div className="flex items-center gap-3 p-3 bg-[#0c142b]/80 rounded-lg">
                                        <span className="text-2xl">🏅</span>
                                        <span className="font-semibold">Truth Seeker</span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="flex items-center gap-3 p-3 bg-[#0c142b]/80 rounded-lg">
                                        <span className="text-2xl">🌱</span>
                                        <span className="font-semibold">New Diver</span>
                                    </div>
                                );
                            }
                        })()}
                        {/* Streak badge example */}
                        {dashboard?.factsSubmitted >= 50 && (
                            <div className="flex items-center gap-3 p-3 bg-[#0c142b]/80 rounded-lg">
                                <span className="text-2xl">🔥</span>
                                <span className="font-semibold">50 Claims Streak</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-8 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg shadow-black/20">
                    <h2 className="text-2xl font-bold text-white mb-4 text-left">Weekly Activity</h2>
                    <ActivityChart />
                </div>
            </div>
        </main>
    );
};

export default Dashboard;