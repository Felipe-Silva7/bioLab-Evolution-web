import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Carregando...' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-gray-800 border-t-cyan-500`}
      />
      {text && <p className="mt-4 text-gray-400">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;