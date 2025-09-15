import React from 'react';
import FactCheckWidget from '../components/FactCheckWidget';

const Home: React.FC = () => {
  const handleNavigate = (pathWithHash: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.location.hash !== pathWithHash) {
      window.location.hash = pathWithHash.substring(1);
    }
  };

  return (
    <>
      <main className="flex flex-col items-center justify-center flex-grow w-full text-center">
        <div className="flex items-center mb-6 text-sm border border-white/10 rounded-full bg-white/5 backdrop-blur-sm shadow-lg shadow-black/20">
          <span className="px-5 py-2 text-gray-300">AI-POWERED FACT CHECKING</span>
          <div className="w-px h-4 bg-white/20"></div>
          <a href="#analyzer" className="px-5 py-2 font-semibold text-white transition-opacity hover:opacity-80">
            ANALYZE NOW &rarr;
          </a>
        </div>
        <h1 className="mb-12 text-5xl sm:text-6xl md:text-8xl font-archivoblack text-white uppercase tracking-wide leading-tight drop-shadow-2xl">
          Deep Dive
          <br />
          Into Facts
        </h1>
        <div id="analyzer" className="w-full">
          <FactCheckWidget />
        </div>
      </main>

      <footer className="w-full mt-12 text-center">
        <a 
          href="#/fact-wall" 
          onClick={handleNavigate('#/fact-wall')}
          className="inline-block px-8 py-3 text-sm font-semibold text-white transition-all border border-white/10 rounded-full bg-white/5 backdrop-blur-sm hover:bg-white/10 shadow-lg shadow-black/20 hover:border-white/20">
            COMMUNITY FACT WALL
        </a>
      </footer>
    </>
  );
};

export default Home;