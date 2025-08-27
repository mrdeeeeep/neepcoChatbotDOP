import React from 'react';
import Header from '../components/Landing/Header';
import Hero from '../components/Landing/Hero';
import InfoChallenge from '../components/Landing/InfoChallenge';
import DOPSection from '@/components/Landing/DOPSection';
import OurSolution from '@/components/Landing/OurSolution';
import OurTeam from '@/components/Landing/OurTeam';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main>
        <section id="home">
          <Hero />
        </section>
        <section id="problem">
          <InfoChallenge />
        </section>
        <section id="what-is-dop">
          <DOPSection />
        </section>
        <section id="solution">
          <OurSolution />
        </section>
        <section id="team">
          <OurTeam />
        </section>
      </main>
    </div>
  );
};

export default Landing;
