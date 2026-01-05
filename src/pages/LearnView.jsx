import React from 'react';
import { BookOpen } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { EXPERIMENTS } from '../utils/constants';

export default function LearnView() {
  const { gameState } = useGame();

  return (
    <div className="space-y-6">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="text-blue-400" />
          Enciclopédia de Biotecnologia
        </h2>
        <p className="text-gray-400 text-sm">
          Conteúdo educacional desbloqueado através dos seus experimentos
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {gameState.completedExperiments.length > 0 ? (
          gameState.completedExperiments.map(expId => {
            const exp = EXPERIMENTS[expId];
            return (
              <div key={expId} className="bg-black/40 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-5xl">{exp.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg text-blue-400">{exp.name}</h3>
                    <p className="text-sm text-gray-400">{exp.description}</p>
                  </div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="text-xs uppercase tracking-wide text-blue-400 font-bold mb-2">
                    📚 O que você aprendeu
                  </div>
                  <p className="text-sm text-gray-300">
                    Experimento concluído com sucesso! Continue explorando para desbloquear mais conteúdo educacional.
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-30" />
            <p className="text-gray-500">Complete experimentos para desbloquear conteúdo educacional!</p>
          </div>
        )}
      </div>
    </div>
  );
}