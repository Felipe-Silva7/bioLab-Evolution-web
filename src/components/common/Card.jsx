import React from 'react';

const Card = ({ children, className = '', hover = false, border = false }) => {
  return (
    <div
      className={`
        bg-gray-900/50 backdrop-blur-sm rounded-xl p-6
        ${border ? 'border border-gray-800' : ''}
        ${hover ? 'hover:bg-gray-900/70 transition-colors' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;