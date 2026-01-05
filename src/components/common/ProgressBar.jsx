import React from 'react';

const ProgressBar = ({ value, max = 100, color = 'cyan', showLabel = true, size = 'md' }) => {
  const percentage = Math.min(100, (value / max) * 100);
  
  const colors = {
    cyan: 'bg-cyan-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  };

  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Progresso</span>
          <span className="font-semibold">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`bg-gray-800 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${colors[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;