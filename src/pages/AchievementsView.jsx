import React from 'react';
import { Award, Lock, Star } from 'lucide-react';
import { useGame } from '../contexts/GameContext';

const ACHIEVEMENTS_LIST = [
  { id: 'first_culture', title: 'Primeira Cultura', description: 'Complete seu primeiro cultivo de células', icon: '🧫' },
  { id: 'millionaire', title: 'Magnata da Ciência', description: 'Acumule $1.000.000 em financiamento', icon: '💰' },
  { id: 'master_editor', title: 'Editor de Genes', description: 'Complete 10 edições CRISPR perfeitas', icon: '✂️' },
  { id: 'nobel_aspirant', title: 'Aspirante ao Nobel', description: 'Atinja 1000 de Reputação', icon: '🏆' },
];

export default function AchievementsView() {
  const { gameState } = useGame();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Award className="text-yellow-400" />
          Conquistas
        </h2>
        <div className="text-sm text-gray-400">
          Total desbloqueado: {0}/{ACHIEVEMENTS_LIST.length}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {ACHIEVEMENTS_LIST.map((achievement) => (
          <div key={achievement.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 flex items-center gap-4 opacity-75">
            <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-2xl grayscale">
              {achievement.icon}
            </div>
            <div>
              <h3 className="font-bold text-gray-300">{achievement.title}</h3>
              <p className="text-sm text-gray-500">{achievement.description}</p>
            </div>
            <div className="ml-auto">
              <Lock className="text-gray-600" size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
