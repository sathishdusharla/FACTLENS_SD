import React from 'react';
import { SparklesIcon, UserIcon, CheckCircleIcon } from '../components/icons';

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="flex flex-col items-center p-6 text-center bg-white/5 rounded-xl border border-white/10 h-full">
    <div className="flex items-center justify-center w-12 h-12 mb-4 text-blue-400 bg-blue-500/10 rounded-full">
      {icon}
    </div>
    <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
    <p className="text-sm text-gray-400">{children}</p>
  </div>
);


const About: React.FC = () => {
  const handleNavigate = (pathWithHash: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (window.location.hash !== pathWithHash) {
      window.location.hash = pathWithHash.substring(1);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center flex-grow w-full text-center animate-fade-in">
      <div className="w-full max-w-5xl">
        <h1 className="mb-6 text-4xl md:text-5xl font-archivoblack text-white uppercase tracking-wide leading-tight drop-shadow-2xl">
          Illuminating the Truth
        </h1>
        <p className="max-w-3xl mx-auto mb-12 text-lg text-gray-300">
          In an ocean of information, it's easy to get lost in the currents of misinformation. FactLens is your beacon, designed to cut through the depths of the internet and surface the truth.
        </p>

        <div className="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
          <FeatureCard
            icon={<SparklesIcon className="w-6 h-6" />}
            title="Advanced AI Analysis"
          >
            Leveraging Google's state-of-the-art Gemini model, our AI dissects content, identifies key claims, and cross-references them with a vast database of trusted sources.
          </FeatureCard>
          <FeatureCard
            icon={<UserIcon className="w-6 h-6" />}
            title="Community-Powered Verification"
          >
            Join a global network of Truth Seekers. Submit claims, review evidence on the Fact Wall, and climb the leaderboard by contributing to a more factual digital world.
          </FeatureCard>
          <FeatureCard
            icon={<CheckCircleIcon className="w-6 h-6" />}
            title="Transparent & Unbiased Results"
          >
            Receive clear, concise, and easy-to-understand reports. We provide a trust score, a simple verdict, and direct links to the sources we used, empowering you to make your own informed decisions.
          </FeatureCard>
        </div>

        <div className="p-8 mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-lg shadow-black/20 max-w-4xl">
           <h2 className="mb-4 text-3xl font-bold text-white font-archivoblack">
            Join the Mission
          </h2>
          <p className="mb-8 text-gray-300">
            Our goal is to empower individuals with the tools to critically evaluate information and combat the spread of fake news. By using FactLens, you're not just checking a fact—you're strengthening the integrity of our shared knowledge. Together, we can turn the tide against misinformation.
          </p>
          <a
            href="#/"
            onClick={handleNavigate('#/')}
            className="inline-block px-8 py-3 font-bold tracking-wider text-white transition-all transform rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:scale-105 shadow-lg shadow-blue-500/40"
          >
            ANALYZE YOUR FIRST ARTICLE
          </a>
        </div>
      </div>
    </main>
  );
};

export default About;
