import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden font-quicksand">
      {/* Vector stack that stays inside this section */}
      <div aria-hidden className="relative w-full pointer-events-none">
        {/* 1) SIZER: one in-flow element to define height (pick the tallest/ widest SVG) */}
        <img
          src="/landing/VectorCenter.svg"
          alt=""
          className="block w-auto h-auto opacity-0"
        />

        {/* 2) LAYERS: positioned over the sizer */}
        <img
          src="/landing/VectorLeft.svg"
          alt="Left Vector"
          className="absolute top-0 right-0 w-auto h-auto"
        />
        <img
          src="/landing/VectorCenter.svg"
          alt="Center Vector"
          className="absolute top-0 right-0 w-auto h-auto"
        />
        <img
          src="/landing/VectorRight.svg"
          alt="Right Vector"
          className="absolute top-0 right-0 w-auto h-auto"
        />
        {/* Content */}
      <div className="absolute top-60 left-[5%] z-10 max-w-2xl">
        <div className="max-w-2xl">
          <h1 className="text-4xl lg:text-4xl text-gray-800 lg:leading-tight tracking-wide mb-8 font-quicksand lg:pr-[30%]">
            A RAG based approach for Information Retrieval from{' '}
            <span className="text-blue-600 font-normal">Corporate Policy Documents</span>
          </h1>
          <p className="text-lg text-gray-600 lg:text-2xl leading-relaxed max-w-xl font-quicksand font-bold">
            A project demonstrating the fine-tuning and implementation of generative language model for question-answering on NEEPCO's Delegation of Power (DOP) document.
          </p>
        </div>
      </div>
      </div>
    </section>
  );
};

export default Hero;
