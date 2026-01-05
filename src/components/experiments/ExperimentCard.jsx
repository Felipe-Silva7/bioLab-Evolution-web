import React from 'react';
import { useGame } from '../../contexts/GameContext';

export default function ExperimentCard({ experiment, onStart }) {
  const { gameState } = useGame();
  
  const isUnlocked = gameState.unlockedExperiments.includes(experiment.id);
  const meetsRequirements = experiment.requirements.knowledge <= gameState.knowledge;
  const hasEquipment = !experiment.requirements.equipment || 
    experiment.requirements.equipment.every(eq => gameState.equipment[eq]?.owned);
  const canStart = isUnlocked && meetsRequirements && hasEquipment;
  
  return (
    <div
      className={`rounded-2xl border-2 p-6 transition-all ${
        canStart
          ? 'bg-cyan-500/10 border-cyan-500/50 hover:border-cyan-400 hover:scale-105 cursor-pointer'
          : 'bg-black/20 border-gray-500/30 opacity-60'
      }`}
      onClick={() => canStart && onStart(experiment.id)}
    >
      <div className="text-center mb-4">
        <div className="text-6xl mb-3">{experiment.icon}</div>
        <h3 className="font-bold text-lg mb-1">{experiment.name}</h3>
        <span className={`text-xs px-3 py-1 rounded-full ${
          experiment.difficulty === 'Fácil' ? 'bg-green-500/20 text-green-400' :
          experiment.difficulty === 'Médio' ? 'bg-yellow-500/20 text-yellow-400' :
          experiment.difficulty === 'Difícil' ? 'bg-orange-500/20 text-orange-400' :
          'bg-red-500/20 text-red-400'
        }`}>
          {experiment.difficulty}
        </span>
      </div>
      
      <p className="text-sm text-gray-400 mb-4 text-center">{experiment.description}</p>
      
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Duração:</span>
          <span className="text-cyan-400">{Math.floor(experiment.duration / 60)}min</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Recompensa:</span>
          <span className="text-green-400">+{experiment.rewards.knowledge} 🧠</span>
        </div>
      </div>
      
      {!isUnlocked && (
        <div className="mt-4 text-center text-xs text-red-400">
          🔒 Bloqueado
        </div>
      )}
      
      {isUnlocked && !meetsRequirements && (
        <div className="mt-4 text-center text-xs text-yellow-400">
          ⚠️ Requer {experiment.requirements.knowledge} conhecimento
        </div>
      )}
      
      {isUnlocked && meetsRequirements && !hasEquipment && (
        <div className="mt-4 text-center text-xs text-orange-400">
          🛠️ Equipamento necessário
        </div>
      )}
      
      {canStart && (
        <button className="w-full mt-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-bold hover:scale-105 transition-transform">
          INICIAR EXPERIMENTO
        </button>
      )}
    </div>
  );
}