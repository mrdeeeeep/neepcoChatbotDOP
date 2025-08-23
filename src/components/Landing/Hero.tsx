import React from 'react';
import Illustration from '/public/landing/amico.svg';

const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-between px-[5%] relative overflow-hidden font-quicksand">
      {/* Background with positioned vectors */}
      <div className="absolute inset-0 -z-10">
        {/* Left Vector */}
        <div className="fixed top-0 left-0 w-auto h-auto flex flex-row-reverse lg:ml-[53.47%]">
          <img 
            src="/landing/VectorLeft.svg" 
            alt="Left Vector" 
            className="top-0 right-0 w-auto h-auto object-cover"
          />
        </div>
        
        {/* Center Vector */}
        <div className="fixed top-0 left-0 w-auto h-auto flex flex-row-reverse lg:ml-[57.54%]">
          <img 
            src="/landing/VectorCenter.svg" 
            alt="Center Vector" 
            className="top-0 right-0 w-auto h-auto object-cover"
          />
        </div>
        
        {/* Right Vector */}
        <div className="fixed top-0 left-0 w-auto h-auto flex flex-row-reverse lg:ml-[72.35%]">
          <img 
            src="/landing/VectorRight.svg" 
            alt="Right Vector" 
            className="top-0 right-0 w-auto h-auto object-cover"
          />
        </div>
      </div>
      
      {/* Left Content */}
      <div className="max-w-2xl z-10 lg:mt-[8rem]">
        <h1 className="text-4xl lg:text-4xl text-gray-800 lg:leading-tight tracking-wide mb-8 font-quicksand lg:pr-[30%]">
          A RAG based approach for Information Retrieval from{' '}
          <span className="text-blue-600 font-normal">
            Corporate Policy Documents
          </span>
        </h1>
        
        <p className="text-lg text-gray-600 lg:text-2xl leading-relaxed max-w-xl font-quicksand font-bold">
          A project demonstrating the fine-tuning and implementation of generative language model for question-answering on NEEPCO's Delegation of Power (DOP) document.
        </p>
      </div>

      {/* Right side - placeholder for your upcoming illustration */}
      {/* <div className="flex-1 flex justify-center relative z-10">
        <img 
            src={Illustration} 
            alt="Center Vector" 
            className="relative top-[6rem] right-[4rem] w-auto h-[32rem] object-cover"
          />
      </div> */}
    </section>
  );
};

export default Hero;
