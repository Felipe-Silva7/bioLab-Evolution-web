import React from 'react';
import { Trophy, Star, Award, Crown } from 'lucide-react';

const AchievementCard = ({ achievement, unlocked }) => {
  const getIcon = (tier) => {
    switch (tier) {
      case 'bronze': return <Trophy className="text-amber-700" />;
      case 'silver': return <Star className="text-gray-300" />;
      case 'gold': return <Award className="text-yellow-400" />;
      case 'platinum': return <Crown className="text-cyan-300" />;
      default: return <Trophy className="text-gray-400" />;
    }
  };

  const getBorderColor = (tier) => {
    switch (tier) {
      case 'bronze': return 'border-amber-700/50';
      case 'silver': return 'border-gray-400/50';
      case 'gold': return 'border-yellow-500/50';
      case 'platinum': return 'border-cyan-400/50';
      default: return 'border-gray-700';
    }
  };

  const getBgColor = (tier) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-700/10';
      case 'silver': return 'bg-gray-400/10';
      case 'gold': return 'bg-yellow-500/10';
      case 'platinum': return 'bg-cyan-400/10';
      default: return 'bg-gray-800/50';
    }
  };

  return (
    <div
      className={`rounded-xl p-4 border ${getBorderColor(achievement.tier)} ${getBgColor(achievement.tier)} ${
        unlocked ? 'opacity-100' : 'opacity-50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">
          {getIcon(achievement.tier)}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h4 className="font-bold">{achievement.name}</h4>
            {unlocked && (
              <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                ✓ Desbloqueada
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-400 mb-2">
            {achievement.description}
          </p>
          
          <div className="flex items-center justify-between text-xs">
            <span className={`capitalize px-2 py-1 rounded ${
              achievement.tier === 'bronze' ? 'bg-amber-700/20 text-amber-400' :
              achievement.tier === 'silver' ? 'bg-gray-400/20 text-gray-300' :
              achievement.tier === 'gold' ? 'bg-yellow-500/20 text-yellow-400' :
              'bg-cyan-400/20 text-cyan-300'
            }`}>
              {achievement.tier}
            </span>
            
            {!unlocked && (
              <span className="text-gray-500">
                🔒 Bloqueada
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;