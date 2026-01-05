import React from 'react';
import { Trophy } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { formatNumber } from '../../utils/formatters';

export default function StatsPanel() {
  const { gameState } = useGame();

  return (
    <div className="space-y-6">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-purple-500/30 p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Trophy className="text-purple-400" />
          Seu Progresso
        </h2>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6">
          <h3 className="text-lg font-bold mb-4 text-cyan-400">Estatísticas Gerais</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Nível Atual</span>
              <span className="text-2xl font-bold text-cyan-400">{gameState.level}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Experiência Total</span>
              <span className="text-xl font-bold text-purple-400">{formatNumber(gameState.experience)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Experimentos Completos</span>
              <span className="text-xl font-bold text-green-400">{gameState.stats.totalExperiments}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6">
          <h3 className="text-lg font-bold mb-4 text-green-400">Desempenho em Quiz</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Perguntas Respondidas</span>
              <span className="text-xl font-bold text-cyan-400">{gameState.stats.questionsAnswered}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Respostas Corretas</span>
              <span className="text-xl font-bold text-green-400">{gameState.stats.questionsCorrect}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Taxa de Acerto</span>
              <span className="text-2xl font-bold text-purple-400">
                {gameState.stats.questionsAnswered > 0
                  ? Math.round((gameState.stats.questionsCorrect / gameState.stats.questionsAnswered) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-yellow-500/30 p-6">
          <h3 className="text-lg font-bold mb-4 text-yellow-400">Reputação & Ética</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Reputação Científica</span>
                <span className="text-purple-400 font-bold">{gameState.reputation}%</span>
              </div>
              <div className="bg-black/40 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${gameState.reputation}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Score Ético</span>
                <span className="text-green-400 font-bold">{gameState.ethicsScore}%</span>
              </div>
              <div className="bg-black/40 rounded-full h-3 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  style={{ width: `${gameState.ethicsScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-orange-500/30 p-6">
          <h3 className="text-lg font-bold mb-4 text-orange-400">Amostras Coletadas</h3>
          <div className="space-y-2">
            {Object.entries(gameState.samples).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-gray-400 capitalize">{type.replace('_', ' ')}</span>
                <span className="text-xl font-bold text-cyan-400">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}