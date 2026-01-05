import React from 'react';
import { User, Calendar, Clock, Target, Award } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/formatters';

const ProfileCard = () => {
  const { gameState } = useGame();

  const stats = [
    { icon: Calendar, label: 'Jogando desde', value: 'Hoje' },
    { 
      icon: Clock, 
      label: 'Tempo total', 
      value: `${Math.floor(gameState.stats.playtime / 60)}h ${gameState.stats.playtime % 60}m` 
    },
    { 
      icon: Target, 
      label: 'Taxa de acerto', 
      value: gameState.stats.questionsAnswered > 0 
        ? `${Math.round((gameState.stats.questionsCorrect / gameState.stats.questionsAnswered) * 100)}%`
        : '0%' 
    },
    { 
      icon: Award, 
      label: 'Experimentos', 
      value: gameState.stats.totalExperiments 
    },
  ];

  const specialties = [
    { name: 'Microbiologia', level: 85, color: 'bg-cyan-500' },
    { name: 'Biologia Molecular', level: 70, color: 'bg-purple-500' },
    { name: 'Fermentação', level: 60, color: 'bg-green-500' },
    { name: 'Bioinformática', level: 45, color: 'bg-yellow-500' },
  ];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-950 rounded-2xl border border-gray-800 p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
          <User className="w-10 h-10 text-white" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold">Cientista</h2>
          <p className="text-gray-400">Nível {gameState.level} • Ato {gameState.act}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
              Reputação: {gameState.reputation}%
            </span>
            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">
              Ética: {gameState.ethicsScore}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-gray-800/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <stat.icon className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">{stat.label}</span>
            </div>
            <div className="text-lg font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-bold mb-3">Especialidades</h3>
        <div className="space-y-3">
          {specialties.map((spec) => (
            <div key={spec.name}>
              <div className="flex justify-between text-sm mb-1">
                <span>{spec.name}</span>
                <span className="font-bold">{spec.level}%</span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${spec.color} rounded-full`}
                  style={{ width: `${spec.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800/30 rounded-lg p-4">
        <h4 className="font-bold mb-2">Equipamentos Principais</h4>
        <div className="flex flex-wrap gap-2">
          {Object.entries(gameState.equipment)
            .filter(([_, eq]) => eq.owned)
            .map(([id, eq]) => (
              <span
                key={id}
                className="px-3 py-1 bg-gray-700/50 rounded-full text-sm"
              >
                {id.replace('_', ' ')} Nv.{eq.level}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;