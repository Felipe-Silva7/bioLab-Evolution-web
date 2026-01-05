import React from 'react';
import { BookOpen, Lightbulb, AlertCircle } from 'lucide-react';

const ExplanationCard = ({ type = 'info', title, content, points }) => {
  const icons = {
    info: { icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    tip: { icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
    warning: { icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  };

  const config = icons[type] || icons.info;
  const Icon = config.icon;

  return (
    <div className={`rounded-xl p-5 border ${config.bg} ${config.border}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`p-2 rounded-lg ${config.bg}`}>
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-lg mb-1">{title}</h4>
          {points && (
            <div className="text-sm text-gray-400 mb-2">
              Pontos: <span className="text-green-400 font-bold">+{points}</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-gray-300 leading-relaxed">
        {content}
      </div>
    </div>
  );
};

export default ExplanationCard;