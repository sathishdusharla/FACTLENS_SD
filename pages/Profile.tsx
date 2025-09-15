import React, { useState, useEffect } from 'react';
import { CheckCircleIcon, SpinnerIcon } from '../components/icons';
import { auth } from '../firebaseConfig';
import { getUserProfile, saveUserProfile, updateUserBio } from '../firestoreUtils';

const Profile: React.FC = () => {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      setEmail(user.email || '');
      const profile = await getUserProfile(user.uid);
      if (profile) {
        setUsername(profile.name || '');
        setBio(profile.bio || '');
      } else {
        setUsername(user.displayName || '');
        setBio('');
        // Save initial profile if not exists
        await saveUserProfile({
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || '',
          bio: '',
          createdAt: Date.now()
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const user = auth.currentUser;
    if (!user) return;
    await saveUserProfile({
      uid: user.uid,
      email: user.email || '',
      name: username,
      bio,
      createdAt: Date.now()
    });
    setIsSaving(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center flex-grow w-full text-center animate-fade-in">
        <SpinnerIcon className="w-10 h-10 text-blue-500" />
        <p className="mt-4 text-white">Loading profile...</p>
      </main>
    );
  }
  return (
    <main className="flex flex-col items-center justify-center flex-grow w-full text-center animate-fade-in">
      <div className="w-full max-w-2xl">
        <h1 className="mb-8 text-4xl md:text-5xl font-archivoblack text-white uppercase tracking-wide leading-tight drop-shadow-2xl">
          Edit Profile
        </h1>
        <div className="w-full p-px mx-auto rounded-2xl bg-gradient-to-b from-blue-500/50 via-blue-800/20 to-transparent shadow-2xl shadow-blue-900/40">
          <div className="bg-[#0c142b]/80 backdrop-blur-2xl rounded-[15px] p-8 text-white">
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3 text-gray-200 bg-[#080f21] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  className="w-full p-3 text-gray-400 bg-[#080f21]/50 border border-white/10 rounded-lg cursor-not-allowed"
                  disabled
                />
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  className="w-full p-3 text-gray-200 bg-[#080f21] border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full py-3 mt-2 font-bold text-white transition-all transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 shadow-[0_4px_20px_rgba(59,130,246,0.4)] hover:shadow-blue-500/50 flex items-center justify-center gap-2 disabled:opacity-70 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <SpinnerIcon className="w-5 h-5" />
                      <span>Saving...</span>
                    </>
                  ) : isSaved ? (
                    <>
                        <CheckCircleIcon className="w-5 h-5"/>
                        <span>Profile Saved!</span>
                    </>
                  ) : 'Update Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;