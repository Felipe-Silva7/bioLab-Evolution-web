import React from 'react';
import { Trophy, Star, TrendingUp, Target } from 'lucide-react';

const QuizResults = ({ score, totalQuestions, correctAnswers, timeSpent, onClose }) => {
  const percentage = (correctAnswers / totalQuestions) * 100;
  const stars = Math.min(3, Math.floor(percentage / 33.33));

  const getPerformance = () => {
    if (percentage >= 90) return { text: 'Excelente!', color: 'text-green-400' };
    if (percentage >= 70) return { text: 'Bom!', color: 'text-cyan-400' };
    if (percentage >= 50) return { text: 'Regular', color: 'text-yellow-400' };
    return { text: 'Precisa estudar mais', color: 'text-red-400' };
  };

  const performance = getPerformance();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-950 border-2 border-cyan-500/30 rounded-2xl max-w-md w-full p-8">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold mb-2">Quiz Concluído!</h2>
          <p className="text-gray-400">Veja seu desempenho</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Trophy className="text-yellow-400" />
                <span className="font-semibold">Pontuação Final</span>
              </div>
              <div className="text-2xl font-bold text-cyan-400">{score}</div>
            </div>
            
            <div className="flex justify-center gap-1 mb-2">
              {[...Array(3)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-8 h-8 ${
                    i < stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            
            <div className={`text-center text-lg font-bold ${performance.color}`}>
              {performance.text}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="text-green-400" />
                <span className="text-sm text-gray-400">Acertos</span>
              </div>
              <div className="text-2xl font-bold text-green-400">
                {correctAnswers}/{totalQuestions}
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-purple-400" />
                <span className="text-sm text-gray-400">Taxa</span>
              </div>
              <div className="text-2xl font-bold text-purple-400">
                {Math.round(percentage)}%
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="text-sm text-gray-400 mb-2">Tempo Gasto</div>
            <div className="text-xl font-bold text-cyan-400">
              {Math.floor(timeSpent / 60)}:{String(timeSpent % 60).padStart(2, '0')}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {percentage >= 70 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
              <p className="text-green-400 font-semibold">✓ Aprovado no quiz!</p>
              <p className="text-sm text-gray-300">Você pode prosseguir para o experimento</p>
            </div>
          )}

          {percentage < 70 && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
              <p className="text-yellow-400 font-semibold">⚠️ Pontuação mínima não atingida</p>
              <p className="text-sm text-gray-300">Estude mais e tente novamente</p>
            </div>
          )}

          <button
            onClick={onClose}
            className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            CONTINUAR
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;