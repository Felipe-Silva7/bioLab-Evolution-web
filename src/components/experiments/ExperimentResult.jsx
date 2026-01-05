import React from 'react';
import { CheckCircle, XCircle, Award, TrendingUp } from 'lucide-react';

const ExperimentResult = ({ experiment, success, score, rewards, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-cyan-500/30 rounded-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">
            {success ? '🎉' : '😔'}
          </div>
          
          <h2 className="text-2xl font-bold mb-2">
            {success ? 'Experimento Concluído!' : 'Experimento Falhou'}
          </h2>
          
          <div className="text-lg mb-4">
            {experiment.name}
          </div>
          
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${
            success 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {success ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Sucesso
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4" />
                Falha
              </>
            )}
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="text-yellow-400" />
              <span className="font-semibold">Pontuação</span>
            </div>
            <div className="text-3xl font-bold text-center text-cyan-400">
              {score}%
            </div>
          </div>

          {success && rewards && (
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="text-green-400" />
                <span className="font-semibold">Recompensas</span>
              </div>
              
              <div className="space-y-2">
                {rewards.knowledge && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Conhecimento</span>
                    <span className="text-green-400 font-bold">+{rewards.knowledge}</span>
                  </div>
                )}
                
                {rewards.funding && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Financiamento</span>
                    <span className="text-green-400 font-bold">+${rewards.funding}</span>
                  </div>
                )}
                
                {rewards.experience && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Experiência</span>
                    <span className="text-purple-400 font-bold">+{rewards.experience} XP</span>
                  </div>
                )}
                
                {rewards.samples && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Amostras</span>
                    <span className="text-yellow-400 font-bold">+{rewards.samples}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-bold hover:scale-105 transition-transform"
        >
          CONTINUAR
        </button>
      </div>
    </div>
  );
};

export default ExperimentResult;