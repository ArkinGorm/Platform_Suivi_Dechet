import React from 'react';

const TestTailwind = () => {
  return (
    <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
      <div className="shrink-0">
        <div className="h-12 w-12 bg-green-500 rounded-full"></div>
      </div>
      <div>
        <div className="text-xl font-medium text-black">Tailwind CSS</div>
        <p className="text-gray-500">Si tu vois ce message avec du style, Tailwind fonctionne !</p>
      </div>
    </div>
  );
};

export default TestTailwind;