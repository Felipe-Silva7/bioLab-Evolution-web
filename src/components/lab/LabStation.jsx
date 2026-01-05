import React from 'react';
import { Beaker, Zap, Activity, Trophy, BookOpen } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { EQUIPMENT_SHOP } from '../../utils/constants';

export default function LabStation() {
  const { gameState } = useGame();

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Beaker className="text-cyan-400" />
            Bancada de Trabalho
          </h2>
          
          <div className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 rounded-xl p-8 border-2 border-cyan-500/30">
            <div className="text-center">
              <div className="text-8xl mb-4">🧫</div>
              <h3 className="text-xl font-bold mb-2">Pronto para experimentar?</h3>
              <p className="text-gray-400 mb-6">
                Selecione um experimento na aba "Experimentos" para começar
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-cyan-500/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-cyan-400" />
              <span className="text-gray-400">Experimentos</span>
            </div>
            <div className="text-3xl font-bold">{gameState.stats.totalExperiments}</div>
          </div>
          
          <div className="bg-black/40 backdrop-blur-xl rounded-xl border border-purple-500/30 p-6">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="text-purple-400" />
              <span className="text-gray-400">Precisão</span>
            </div>
            <div className="text-3xl font-bold">
              {gameState.stats.questionsAnswered > 0
                ? Math.round((gameState.stats.questionsCorrect / gameState.stats.questionsAnswered) * 100)
                : 0}%
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Zap className="text-purple-400" />
            Equipamentos Ativos
          </h3>
          
          <div className="space-y-3">
            {Object.entries(gameState.equipment)
              .filter(([_, eq]) => eq.owned)
              .map(([id, eq]) => (
                <div key={id} className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{EQUIPMENT_SHOP[id]?.icon}</span>
                      <span className="text-sm font-semibold">{EQUIPMENT_SHOP[id]?.name}</span>
                    </div>
                    <span className="text-xs text-green-400">✓ Ativo</span>
                  </div>
                </div>
              ))}
            
            {Object.values(gameState.equipment).every(eq => !eq.owned) && (
              <div className="text-center py-6 text-gray-500">
                <p className="text-sm">Nenhum equipamento ainda</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BookOpen className="text-green-400" />
            Dica Rápida
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed">
            💡 Complete experimentos para ganhar conhecimento e financiamento. 
            Responda perguntas corretamente para bônus extras!
          </p>
        </div>
      </div>
    </div>
  );
}