


import React, { useState, useEffect } from 'react';
import { subscribeFactWall, getDashboardData } from '../firestoreUtils';
import { subscribeLikes, setLike, removeLike } from '../firestoreLikes';
import { auth } from '../firebaseConfig';
import { collection, addDoc, Timestamp, getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { CheckCircleIcon, InfoIcon, XCircleIcon } from '../components/icons';

interface FactWallProps {
  isAuthenticated: boolean;
}

const FactWall: React.FC<FactWallProps> = ({ isAuthenticated }) => {
  const [showForm, setShowForm] = useState(false);
  const [claim, setClaim] = useState('');
  const [evidence, setEvidence] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [facts, setFacts] = useState<any[]>([]);
  // Comments removed. Only likes supported.
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [likesMap, setLikesMap] = useState<Record<string, any[]>>({});
  const [loadingLikes, setLoadingLikes] = useState(false);

  useEffect(() => {
    const unsub = subscribeFactWall(async (facts) => {
      setFacts(facts);
      // Fetch contributor names for all unique UIDs
      const uniqueUids = Array.from(new Set(facts.map(f => f.authorUid)));
      const userMap: Record<string, string> = {};
      await Promise.all(uniqueUids.map(async (uid) => {
        try {
          const res = await fetch(`/api/userProfile?uid=${uid}`);
          if (res.ok) {
            const data = await res.json();
            userMap[uid] = data.name || uid;
          } else {
            userMap[uid] = uid;
          }
        } catch {
          userMap[uid] = uid;
        }
      }));
      setUserMap(userMap);
      // Subscribe to likes for each fact
      facts.forEach(fact => {
        subscribeLikes(fact.id, (likes) => {
          setLikesMap(prev => ({ ...prev, [fact.id]: likes }));
        });
      });
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) return;
    const db = getFirestore();
    // Add fact
    await addDoc(collection(db, 'facts'), {
      content: claim,
      evidence,
      authorUid: user.uid,
      createdAt: Timestamp.now()
    });
    // Award 24 points for submission
    const dashRef = doc(db, 'dashboard', user.uid);
    const dashSnap = await getDoc(dashRef);
    let score = 24;
    let factsSubmitted = 1;
    let lastActive = Date.now();
    // Weekly activity logic
    let weeklyActivity = [0,0,0,0,0,0,0];
    // Get current day index (0=Mon, 6=Sun)
    const now = new Date();
    let dayIdx = now.getDay() - 1;
    if (dayIdx < 0) dayIdx = 6; // Sunday as last index
    if (dashSnap.exists()) {
      const data = dashSnap.data();
      score = (data.score || 0) + 24;
      factsSubmitted = (data.factsSubmitted || 0) + 1;
      lastActive = Date.now();
      weeklyActivity = Array.isArray(data.weeklyActivity) && data.weeklyActivity.length === 7 ? [...data.weeklyActivity] : [0,0,0,0,0,0,0];
    }
    weeklyActivity[dayIdx] = (weeklyActivity[dayIdx] || 0) + 1;
    await setDoc(dashRef, { score, factsSubmitted, lastActive, weeklyActivity }, { merge: true });
    // Update leaderboard to always match dashboard score and ensure all fields
    const lbRef = doc(db, 'leaderboard', user.uid);
    // Fetch user name for leaderboard
    let name = user.displayName || user.email || user.uid;
    try {
      const userProfileRes = await fetch(`/api/userProfile?uid=${user.uid}`);
      if (userProfileRes.ok) {
        const userProfile = await userProfileRes.json();
        name = userProfile.name || user.displayName || user.email || user.uid;
      }
    } catch {}
    await setDoc(lbRef, {
      uid: user.uid,
      name,
      score
    }, { merge: true });
    setSubmitted(true);
    setClaim('');
    setEvidence('');
    setTimeout(() => {
      setSubmitted(false);
      setShowForm(false);
    }, 2000);
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'Verified': return <CheckCircleIcon className="w-6 h-6 text-green-400" />;
      case 'False': return <XCircleIcon className="w-6 h-6 text-red-400" />;
      case 'Needs Context':
      default: return <InfoIcon className="w-6 h-6 text-yellow-400" />;
    }
  };

  return (
    <main className="flex flex-col items-center justify-center flex-grow w-full text-center animate-fade-in">
      <div className="w-full max-w-4xl">
        <h1 className="mb-4 text-4xl md:text-5xl font-archivoblack text-white uppercase tracking-wide leading-tight drop-shadow-2xl">
          Community Fact Wall
        </h1>
        <div className="my-6 p-px rounded-2xl bg-gradient-to-b from-blue-500/30 via-blue-800/10 to-transparent">
          <div className="bg-[#0c142b]/80 backdrop-blur-2xl rounded-[15px] p-6 text-white transition-all duration-500">
            {!showForm ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {isAuthenticated ? (
                  <>
                    <p>Have a claim you want the community to verify?</p>
                    <button onClick={() => setShowForm(true)} className="px-6 py-2 text-sm font-semibold text-white transition-all transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-blue-500/50 flex-shrink-0">
                      Submit a Fact-Check
                    </button>
                  </>
                ) : (
                  <>
                    <p>Sign in to submit a fact-check to the community.</p>
                    <button disabled className="px-6 py-2 text-sm font-semibold text-white rounded-lg bg-white/10 cursor-not-allowed opacity-50 flex-shrink-0">
                      Submit a Fact-Check
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="animate-fade-in">
                {submitted ? (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <CheckCircleIcon className="w-12 h-12 text-green-400 mb-4" />
                    <h3 className="text-xl font-bold">Thank You!</h3>
                    <p className="text-gray-300">Your submission has been received.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold text-left">Submit a Fact-Check</h3>
                    <div>
                      <label htmlFor="claim" className="block text-sm font-medium text-gray-300 text-left mb-1">Claim Text or URL</label>
                      <input 
                        type="text" 
                        id="claim"
                        value={claim}
                        onChange={(e) => setClaim(e.target.value)}
                        placeholder="Paste an article URL or claim text"
                        className="w-full p-3 text-gray-200 bg-[#080f21] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="evidence" className="block text-sm font-medium text-gray-300 text-left mb-1">Evidence</label>
                      <input 
                        type="text" 
                        id="evidence"
                        value={evidence}
                        onChange={(e) => setEvidence(e.target.value)}
                        placeholder="Paste a link to a source or evidence"
                        className="w-full p-3 text-gray-200 bg-[#080f21] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        required
                      />
                    </div>
                    <div className="flex justify-end gap-4">
                      <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-sm font-semibold text-gray-300 transition-all rounded-lg bg-white/5 hover:bg-white/10">Cancel</button>
                      <button type="submit" className="px-6 py-2 text-sm font-semibold text-white transition-all transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-blue-500/50">Submit</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          {facts.map((post, index) => (
            <div key={post.id || index} className="w-full p-px rounded-xl bg-gradient-to-b from-blue-500/30 via-blue-800/10 to-transparent">
              <div className="bg-[#0c142b]/80 backdrop-blur-2xl rounded-[11px] p-5 text-left space-y-3">
                <p className="text-lg font-semibold text-white">"{post.content}"</p>
                <div className="flex items-center gap-2 font-bold">
                  <span className="text-yellow-400">Community Verdict: Needs Context</span>
                </div>
                <p className="text-sm text-gray-400"><span className="font-semibold text-gray-300">Sources:</span> {post.evidence || "N/A"}</p>
                <div className="text-xs text-right text-gray-500">
                  Contributed by {userMap[post.authorUid] || post.authorUid}
                </div>
                {/* Like Section Only */}
                <div className="mt-2 flex gap-4 items-center">
                  <span className="text-sm text-gray-300">Likes:</span>
                  <span className="font-bold text-blue-400">{(likesMap[post.id || index] || []).length}</span>
                  {isAuthenticated && (() => {
                    const user = auth.currentUser;
                    const factId = post.id || index;
                    const hasLiked = (likesMap[factId] || []).some(like => like.userId === user?.uid);
                    return (
                      <>
                        <button
                          className={`px-3 py-1 rounded text-xs font-semibold ${hasLiked ? 'bg-gray-400 text-white' : 'bg-blue-600 text-white'}`}
                          disabled={loadingLikes || hasLiked}
                          onClick={async () => {
                            if (!user || hasLiked) return;
                            setLoadingLikes(true);
                            try {
                              await setLike(post.id, user.uid);
                              // Award points to fact author for received like
                              const db = getFirestore();
                              const dashRef = doc(db, 'dashboard', post.authorUid);
                              const dashSnap = await getDoc(dashRef);
                              let score = 5;
                              if (dashSnap.exists()) {
                                const data = dashSnap.data();
                                score = (data.score || 0) + 5;
                              }
                              await setDoc(dashRef, { score }, { merge: true });
                              // Update leaderboard to always match dashboard score and ensure all fields
                              const lbRef = doc(db, 'leaderboard', post.authorUid);
                              // Fetch user name for leaderboard
                              let name = post.authorUid;
                              try {
                                const userProfileRes = await fetch(`/api/userProfile?uid=${post.authorUid}`);
                                if (userProfileRes.ok) {
                                  const userProfile = await userProfileRes.json();
                                  name = userProfile.name || post.authorUid;
                                }
                              } catch {}
                              await setDoc(lbRef, {
                                uid: post.authorUid,
                                name,
                                score
                              }, { merge: true });
                            } catch (err) {
                              alert('Failed to like. Please try again.');
                            }
                            setLoadingLikes(false);
                          }}
                        >{hasLiked ? 'Liked' : 'Like'}</button>
                        <button
                          className="px-2 py-1 rounded bg-gray-700 text-white text-xs ml-2"
                          disabled={loadingLikes || !hasLiked}
                          onClick={async () => {
                            if (!user || !hasLiked) return;
                            setLoadingLikes(true);
                            try {
                              await removeLike(post.id, user.uid);
                              // Deduct points from fact author for removed like
                              const db = getFirestore();
                              const dashRef = doc(db, 'dashboard', post.authorUid);
                              const dashSnap = await getDoc(dashRef);
                              let score = 0;
                              if (dashSnap.exists()) {
                                const data = dashSnap.data();
                                score = Math.max(0, (data.score || 0) - 5);
                              }
                              await setDoc(dashRef, { score }, { merge: true });
                              // Update leaderboard to always match dashboard score
                              const lbRef = doc(db, 'leaderboard', post.authorUid);
                              let name = post.authorUid;
                              try {
                                const userProfileRes = await fetch(`/api/userProfile?uid=${post.authorUid}`);
                                if (userProfileRes.ok) {
                                  const userProfile = await userProfileRes.json();
                                  name = userProfile.name || post.authorUid;
                                }
                              } catch {}
                              await setDoc(lbRef, {
                                uid: post.authorUid,
                                name,
                                score
                              }, { merge: true });
                            } catch (err) {
                              alert('Failed to remove like. Please try again.');
                            }
                            setLoadingLikes(false);
                          }}
                        >Remove Like</button>
                      </>
                    );
                  })()}
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


export default FactWall;