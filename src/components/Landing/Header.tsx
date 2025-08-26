import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
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
          <a href="#team" className="lg:pr-[2rem] text-white font-medium hover:text-gray-200 transition-colors">
            OUR TEAM
          </a>
          <a href="#what-is-dop" className="text-white font-medium hover:text-gray-200 transition-colors">
            SOLUTION
          </a>
          <a href="#solution" className="text-white font-medium hover:text-gray-200 transition-colors">
            WHAT IS DOP?
          </a>
          <a href="#problem" className="text-white font-medium hover:text-gray-200 transition-colors">
            PROBLEM
          </a>
          <Link to="/" className="text-white font-medium hover:text-gray-200 transition-colors">
            HOME
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
