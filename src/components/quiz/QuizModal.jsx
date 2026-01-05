import React, { useState } from 'react';
import { useGame } from '../../contexts/GameContext';
import { QUESTIONS } from '../../utils/constants';

export default function QuizModal({ experimentId, onComplete }) {
  const { dispatch } = useGame();
  const questions = QUESTIONS[experimentId] || [];
  const [currentQ, setCurrentQ] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  if (questions.length === 0) {
    onComplete(true);
    return null;
  }

  const question = questions[currentQ];

  const handleAnswer = (answerIdx) => {
    const isCorrect = answerIdx === question.correct;
    setSelectedAnswer(answerIdx);
    setShowExplanation(true);
    
    dispatch({ type: 'ANSWER_QUESTION', payload: { correct: isCorrect } });
    
    if (isCorrect) {
      dispatch({ type: 'ADD_KNOWLEDGE', payload: question.points });
      setCorrect(correct + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setShowExplanation(false);
      setSelectedAnswer(null);
    } else {
      const totalCorrect = correct;
      const percentage = (totalCorrect / questions.length) * 100;
      onComplete(percentage >= 60);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 border-2 border-cyan-400 rounded-3xl max-w-2xl w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-cyan-400">
            Avaliação de Conhecimento
          </h2>
          <div className="text-sm text-gray-400">
            Pergunta {currentQ + 1}/{questions.length}
          </div>
        </div>
        
        <div className="bg-black/40 rounded-xl p-6 mb-6">
          <p className="text-lg mb-6 leading-relaxed">
            {question.question}
          </p>
          
          {!showExplanation ? (
            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className="w-full p-4 bg-cyan-500/10 hover:bg-cyan-500/20 border-2 border-cyan-500/30 hover:border-cyan-400 rounded-xl text-left transition-all font-semibold"
                >
                  <span className="text-cyan-400 mr-3">{String.fromCharCode(65 + idx)}.</span>
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                {question.options.map((option, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border-2 ${
                      idx === question.correct
                        ? 'bg-green-500/20 border-green-500'
                        : idx === selectedAnswer
                        ? 'bg-red-500/20 border-red-500'
                        : 'bg-gray-500/10 border-gray-500/30'
                    }`}
                  >
                    <span className="mr-3">{String.fromCharCode(65 + idx)}.</span>
                    {option}
                    {idx === question.correct && ' ✓'}
                    {idx === selectedAnswer && idx !== question.correct && ' ✗'}
                  </div>
                ))}
              </div>
              
              <div className="bg-blue-500/20 border border-blue-500 rounded-lg p-4">
                <div className="font-bold text-blue-400 mb-2">💡 Explicação:</div>
                <p className="text-sm text-gray-300">{question.explanation}</p>
              </div>
              
              <button
                onClick={handleNext}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-bold hover:scale-105 transition-transform"
              >
                {currentQ < questions.length - 1 ? 'PRÓXIMA PERGUNTA' : 'FINALIZAR QUIZ'}
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div>
            Pontos por resposta: <span className="text-green-400 font-bold">+{question.points}</span>
          </div>
          <div>
            Acertos: <span className="text-cyan-400 font-bold">{correct}/{currentQ + (showExplanation ? 1 : 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}