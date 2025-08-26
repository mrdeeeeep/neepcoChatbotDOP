import React from 'react';

const InfoChallenge: React.FC = () => {
  return (
    <section className="px-[5%] py-16 font-quicksand">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl lg:text-4xl text-gray-800 font-semibold mb-8">
          The{' '}
          <span className="text-[#3570BD] underline decoration-2 underline-offset-4">
            Information Accessibility Challenge
          </span>
        </h2>

        <p className="text-gray-600 font-bold text-base lg:text-2xl md:text-lg leading-relaxed mb-6">
          In large organizations like{' '}
          <span className="text-red-500">NEEPCO</span>, employees often need to refer to internal documents that are extensive and complex. One such document is the Delegation of Power (DOP), which clearly defines the{' '}
          <span className="text-red-500">levels of authority</span> assigned to different roles for taking various{' '}
          <span className="text-red-500">administrative</span> and{' '}
          <span className="text-red-500">financial decisions</span>.
        </p>

        <p className="text-gray-600 text-base lg:text-2xl font-bold md:text-lg leading-relaxed mb-6">
          However, due to its <span className="text-red-500">length</span> and detailed structure, locating specific information within the DOP can be a tedious and{' '}
          <span className="text-red-500">time-consuming</span> task. Employees typically have to manually scan through multiple sections to find the exact clause or rule applicable to their query, which can slow down workflows and reduce overall efficiency.
        </p>

        <p className="text-gray-600 text-base md:text-lg lg:text-2xl font-bold leading-relaxed">
          This project was undertaken to address this challenge by developing a solution that enables {' '}
          <span className="text-red-500">quicker access</span> to the DOP. The goal was to <span className="text-red-500">build</span> a specialized <span className="text-red-500">chatbot</span> to make finding information in the DOP document much easier and faster.
        </p>
      </div>
    </section>
  );
};

export default InfoChallenge;
