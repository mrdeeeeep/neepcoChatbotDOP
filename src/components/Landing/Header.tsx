import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <header className="w-full bg-transparent absolute top-0 left-0 z-50 px-[5%] py-4 font-quicksand">
      <nav className="max-w-auto mx-auto flex items-center justify-end">
        {/* All navigation items on the right, ordered right-to-left */}
        <div className="flex items-center lg:space-x-4 flex-row-reverse lg:text-[95%]">
          {/* Live Demo Button - will appear on far right */}
          <Link 
            to="/chat" 
            className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            LIVE DEMO
          </Link>
          
          {/* Navigation Links - will appear right-to-left */}
          <button 
            onClick={() => scrollToSection('team')}
            className="lg:pr-[2rem] text-white font-medium hover:text-gray-200 transition-colors cursor-pointer bg-transparent border-none outline-none"
          >
            OUR TEAM
          </button>
          <button 
            onClick={() => scrollToSection('solution')}
            className="text-white font-medium hover:text-gray-200 transition-colors cursor-pointer bg-transparent border-none outline-none"
          >
            SOLUTION
          </button>
          <button 
            onClick={() => scrollToSection('what-is-dop')}
            className="text-white font-medium hover:text-gray-200 transition-colors cursor-pointer bg-transparent border-none outline-none"
          >
            WHAT IS DOP?
          </button>
          <button 
            onClick={() => scrollToSection('problem')}
            className="text-white font-medium hover:text-gray-200 transition-colors cursor-pointer bg-transparent border-none outline-none"
          >
            PROBLEM
          </button>
          <button 
            onClick={() => scrollToSection('home')}
            className="text-white font-medium hover:text-gray-200 transition-colors cursor-pointer bg-transparent border-none outline-none"
          >
            HOME
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
