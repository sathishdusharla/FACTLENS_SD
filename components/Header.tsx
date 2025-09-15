import React, { useState, useEffect, useRef } from 'react';
import { WhalefinLogo, MenuIcon, XIcon, UserIcon } from './icons';

interface User {
  username: string;
  email: string;
}

interface HeaderProps {
  currentPath: string;
  isAuthenticated: boolean;
  onSignOut: () => void;
  user: User;
}

const Header: React.FC<HeaderProps> = ({ currentPath, isAuthenticated, onSignOut, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMenuOpen]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allNavItems = [
      { name: 'HOME', path: '#/'},
      { name: 'DASHBOARD', path: '#/dashboard', protected: true },
      { name: 'FACT WALL', path: '#/fact-wall'},
      { name: 'LEADERBOARD', path: '#/leaderboard', protected: true },
      { name: 'ABOUT', path: '#/about'},
      { name: 'SETTINGS', path: '#/settings', protected: true }
  ];

  const navItems = allNavItems.filter(item => !item.protected || isAuthenticated);
  
  const handleNavigate = (path: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.location.hash !== path) {
        window.location.hash = path.substring(1);
    }
    setIsMenuOpen(false);
  };

  const handleProfileLink = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.hash = path.substring(1);
    setIsProfileOpen(false);
  };

  const handleSignOut = () => {
    onSignOut();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }

  return (
    <>
      <header className="flex items-center justify-between w-full mb-12">
        <a href="#/" onClick={handleNavigate('#/')} className="w-40 z-50">
          <WhalefinLogo />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center p-1 space-x-2 text-sm font-semibold border border-white/10 rounded-full bg-white/5 backdrop-blur-sm shadow-[0_0_20px_rgba(100,180,255,0.15)]">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              onClick={handleNavigate(item.path)}
              className={`px-5 py-2 transition-all duration-300 rounded-full ${currentPath === item.path ? 'bg-white/10 text-white shadow-[0_0_15px_rgba(100,180,255,0.2)]' : 'text-gray-300 hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(100,180,255,0.2)]'}`}
            >
              {item.name}
            </a>
          ))}
        </nav>
        
        <div className="hidden md:block">
          {isAuthenticated ? (
            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <UserIcon className="w-6 h-6 text-white"/>
              </button>
              {isProfileOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 p-px rounded-xl bg-gradient-to-b from-blue-500/50 via-blue-800/20 to-transparent shadow-2xl shadow-blue-900/40 animate-fade-in">
                  <div className="bg-[#0c142b]/90 backdrop-blur-2xl rounded-[11px] p-4 text-white">
                    <div className="border-b border-white/10 pb-3 mb-3">
                        <p className="font-bold text-white truncate">{user.username}</p>
                        <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <a href="#/profile" onClick={handleProfileLink('#/profile')} className="block w-full text-left px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors">
                        Edit Profile
                      </a>
                    </div>
                    <div className="pt-1 border-t border-white/10">
                      <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors text-red-400">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
             <a href="#/signin" onClick={(e) => { e.preventDefault(); window.location.hash = '/signin';}} className="px-6 py-3 text-sm font-semibold text-white transition-all duration-300 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm hover:bg-white/10 shadow-[0_0_20px_rgba(100,180,255,0.15)] hover:border-white/20 hover:shadow-[0_0_25px_rgba(100,180,255,0.25)]">
              SIGN IN
            </a>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden z-50">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2" aria-label="Toggle Menu" aria-expanded={isMenuOpen}>
                {isMenuOpen ? <XIcon className="w-6 h-6 text-white" /> : <MenuIcon className="w-6 h-6 text-white" />}
            </button>
        </div>
      </header>
      
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-[#060c1f]/90 backdrop-blur-lg z-40 flex flex-col animate-fade-in">
          <div className="flex-1 flex flex-col items-center justify-start px-6 pt-2 pb-4 overflow-y-auto">
            <nav className="flex flex-col items-center space-y-4 w-full">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  onClick={handleNavigate(item.path)}
                  className={`px-5 py-2 text-xl transition-all duration-300 rounded-full w-full text-center ${currentPath === item.path ? 'bg-white/10 text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                >
                  {item.name}
                </a>
              ))}
            </nav>
            {isAuthenticated && (
              <div className="w-full mt-8 pt-4 border-t border-white/10">
                <div className="flex flex-col items-center mb-2">
                  <p className="font-bold text-white text-center text-base">{user.username}</p>
                  <p className="text-xs text-gray-400 text-center mb-2">{user.email}</p>
                </div>
                <a href="#/profile" onClick={handleNavigate('#/profile')} className="block w-full text-center py-2 mb-2 text-base font-semibold text-white transition-all duration-300 border border-white/20 rounded-full bg-white/10 hover:bg-white/20">
                  Edit Profile
                </a>
                <button onClick={handleSignOut} className="w-full py-2 text-base font-semibold text-red-400 transition-all duration-300 border border-red-400/20 rounded-full bg-red-500/10 backdrop-blur-sm hover:bg-red-500/20 mt-1">
                  Sign Out
                </button>
              </div>
            )}
            {!isAuthenticated && (
              <a href="#/signin" onClick={(e) => { e.preventDefault(); window.location.hash = '/signin'; setIsMenuOpen(false); }} className="block text-center mt-8 px-8 py-3 text-base font-semibold text-white transition-all duration-300 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm hover:bg-white/10 shadow-[0_0_20px_rgba(100,180,255,0.15)] hover:border-white/20 hover:shadow-[0_0_25px_rgba(100,180,255,0.25)]">
                SIGN IN
              </a>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Header;