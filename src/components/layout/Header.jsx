import React from 'react';
import { Dna } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/formatters';

export default function Header() {
  const { gameState } = useGame();

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-cyan-500/30 px-6 py-4 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Dna className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                BIO-LAB EVOLUTION
              </h1>
              <p className="text-xs text-gray-400">Ato {gameState.act} • Nível {gameState.level}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-sm text-gray-400">Conhecimento</div>
              <div className="text-xl font-bold text-cyan-400">{formatNumber(gameState.knowledge)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Financiamento</div>
              <div className="text-xl font-bold text-green-400">${formatNumber(gameState.funding)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-400">Reputação</div>
              <div className="text-xl font-bold text-purple-400">{gameState.reputation}%</div>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-500"
            style={{ width: `${(gameState.experience % 1000) / 10}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">
          {gameState.experience % 1000}/1000 XP para próximo nível
        </div>
      </div>
    </header>
  );
}