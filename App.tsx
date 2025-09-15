import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import { CoralLeft, CoralRight, PolygonIcon, WhaleLeft, WhaleRight } from './components/icons';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import FactWall from './pages/FactWall';
import Leaderboard from './pages/Leaderboard';
import About from './pages/About';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import SplashScreen from './components/SplashScreen';
import { auth } from './firebaseConfig';
import { getUserProfile } from './firestoreUtils';

interface User {
  username: string;
  bio: string;
  email: string;
}

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>({ username: 'Truth Seeker', bio: 'Diving deep into facts and surfacing the truth.', email: 'user@factlens.com' });
  const [isLoading, setIsLoading] = useState(true);

    // Persist Firebase Auth state across refresh
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          setIsAuthenticated(true);
          // Fetch user profile from Firestore
          const profile = await getUserProfile(currentUser.uid);
          if (profile) {
            setUser({ username: profile.name, bio: profile.bio || '', email: profile.email });
          } else {
            setUser({ username: currentUser.displayName || '', bio: '', email: currentUser.email || '' });
          }
          // Create leaderboard entry for user if missing, but do not overwrite score if it exists
          const { getFirestore, doc, getDoc, setDoc } = await import('firebase/firestore');
          const db = getFirestore();
          const lbRef = doc(db, 'leaderboard', currentUser.uid);
          const lbSnap = await getDoc(lbRef);
          if (!lbSnap.exists()) {
            await setDoc(lbRef, {
              uid: currentUser.uid,
              name: currentUser.displayName || currentUser.email || 'User',
              score: 0
            });
          }
        } else {
          setIsAuthenticated(false);
          setUser({ username: 'Truth Seeker', bio: 'Diving deep into facts and surfacing the truth.', email: 'user@factlens.com' });
        }
      });
      return () => unsubscribe();
    }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3500); // Animation is 3s, fade-out is 0.5s

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSignIn = async () => {
    setIsAuthenticated(true);
    // Fetch user profile from Firestore
    const currentUser = auth.currentUser;
    if (currentUser) {
      const profile = await getUserProfile(currentUser.uid);
      if (profile) {
        setUser({ username: profile.name, bio: profile.bio || '', email: profile.email });
      } else {
        setUser({ username: currentUser.displayName || '', bio: '', email: currentUser.email || '' });
      }
      // Always create or update leaderboard entry for user
      const { getFirestore, doc, setDoc } = await import('firebase/firestore');
      const db = getFirestore();
      const lbRef = doc(db, 'leaderboard', currentUser.uid);
      await setDoc(lbRef, {
        uid: currentUser.uid,
        name: currentUser.displayName || currentUser.email || 'User',
        score: 0
      }, { merge: true });
    }
    window.location.hash = '/';
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    window.location.hash = '/signin';
  };

  const handleProfileUpdate = (newProfile: { username: string; bio: string; }) => {
    setUser(prev => ({ ...prev, ...newProfile }));
  };
  
  const protectedRoutes: { [key: string]: React.FC<any> } = {
    '/dashboard': Dashboard,
    '/leaderboard': Leaderboard,
    '/profile': (props) => <Profile {...props} user={user} onUpdateProfile={handleProfileUpdate} />,
    '/settings': (props) => <Settings {...props} onSignOut={handleSignOut} isAuthenticated={isAuthenticated} />,
  };
  
  const publicRoutes: { [key: string]: React.FC<any> } = {
    '/': Home,
    '/fact-wall': (props) => <FactWall {...props} isAuthenticated={isAuthenticated} />,
    '/about': About,
    '/signin': (props) => <SignIn {...props} onSignIn={handleSignIn} />,
  };

  let CurrentPage;
  const isProtectedRoute = Object.keys(protectedRoutes).includes(currentPath);

  if (isProtectedRoute && !isAuthenticated) {
    CurrentPage = publicRoutes['/signin'];
  } else {
    const allRoutes = { ...publicRoutes, ...protectedRoutes };
    CurrentPage = allRoutes[currentPath] || publicRoutes['/'];
  }

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#060c1f] text-gray-200">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1c3a6e]/40 via-[#0a1224]/30 to-[#060c1f]"></div>
      <div className="absolute inset-0">
        <CoralLeft className="absolute bottom-0 left-0 w-1/4 md:w-1/5 text-[#040814] opacity-80" />
        <CoralRight className="absolute bottom-0 right-0 w-1/4 md:w-1/5 text-[#040814] opacity-80" />
        <WhaleLeft className="absolute bottom-[10%] left-[-5%] w-[40%] md:w-[30%] text-blue-400/80 opacity-15" />
        <WhaleRight className="absolute top-[25%] right-[-5%] w-[40%] md:w-[30%] text-blue-400/80 opacity-15" />
        
        <GlowingOrb className="top-[25%] left-[15%]" size="w-20 h-20" delay="1.2s"/>
        <GlowingOrb className="top-[20%] right-[20%]" size="w-16 h-16" delay="1s" />
        <GlowingOrb className="top-[40%] right-[10%]" size="w-24 h-24" delay="2.5s" showIcon/>
        <GlowingOrb className="top-[55%] left-[20%]" size="w-12 h-12" delay="1.5s" />
        <GlowingOrb className="top-[70%] right-[8%]" size="w-16 h-16" delay="3.5s"/>
        <GlowingOrb className="top-[80%] left-[8%]" size="w-40 h-40" delay="0.2s" showIcon/>
        <GlowingOrb className="bottom-[15%] right-[15%]" size="w-36 h-36" delay="0.5s" showIcon/>
        <GlowingOrb className="bottom-[35%] left-[30%]" size="w-12 h-12" delay="3s" />
        <GlowingOrb className="bottom-[10%] left-[45%]" size="w-16 h-16" delay="1.8s" />
      </div>

      <div className="relative z-10 flex flex-col items-center w-full min-h-screen px-4 py-8 mx-auto max-w-7xl">
        <Header 
          currentPath={'#' + currentPath} 
          isAuthenticated={isAuthenticated}
          onSignOut={handleSignOut}
          user={user}
        />
        <CurrentPage />
      </div>
    </div>
  );
};

const GlowingOrb: React.FC<{className?: string; size: string; delay?: string; showIcon?: boolean}> = ({className, size, delay, showIcon = false}) => {
    const iconSize = showIcon ? 'w-1/2 h-1/2' : '';
    return (
        <div className={`absolute ${className} ${size} bg-blue-500/10 rounded-full blur-2xl flex items-center justify-center animate-float`} style={{animationDelay: delay}}>
            <div className={`${iconSize} bg-blue-400/20 rounded-full blur-xl flex items-center justify-center`}>
                 {showIcon && <PolygonIcon className="w-2/3 h-2/3 text-white/30 opacity-50" />}
            </div>
        </div>
    )
}

export default App;