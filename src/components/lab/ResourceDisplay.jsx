import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { Brain, DollarSign, Award, Users, Beaker } from 'lucide-react';

const ResourceDisplay = () => {
  const { gameState } = useGame();

  const resources = [
    { icon: Brain, label: 'Conhecimento', value: gameState.knowledge, color: 'text-cyan-400' },
    { icon: DollarSign, label: 'Financiamento', value: `$${gameState.funding}`, color: 'text-green-400' },
    { icon: Award, label: 'Reputação', value: `${gameState.reputation}%`, color: 'text-purple-400' },
    { icon: Beaker, label: 'Amostras', value: Object.values(gameState.samples).reduce((a, b) => a + b, 0), color: 'text-yellow-400' },
    { icon: Users, label: 'Ética', value: `${gameState.ethicsScore}%`, color: 'text-blue-400' }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {resources.map((res) => (
        <div key={res.label} className="bg-gray-900/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <res.icon className="w-4 h-4" />
            <span className="text-xs text-gray-400">{res.label}</span>
          </div>
          <div className={`text-xl font-bold ${res.color}`}>
            {res.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourceDisplay;