import React from 'react';
import Header from '../components/Landing/Header';
import Hero from '../components/Landing/Hero';
import InfoChallenge from '../components/Landing/InfoChallenge';
import DOPSection from '@/components/Landing/DOPSection';
import OurSolution from '@/components/Landing/OurSolution';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main>
        <Hero />
        <InfoChallenge />
        <DOPSection />
        <OurSolution />
        {/* You can add more sections here like Problem, Solution, Team, etc. */}
      </main>
    </div>
  );
};

export default Landing;
