import React, { useState } from 'react';

const Question = ({ question, onAnswer }) => {
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (index) => {
    if (answered) return;
    setSelected(index);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setAnswered(true);
    setTimeout(() => {
      onAnswer(selected);
    }, 1500);
  };

  const getOptionStyle = (index) => {
    if (!answered) {
      return selected === index
        ? 'bg-cyan-500/20 border-cyan-500'
        : 'bg-gray-800/50 border-gray-700 hover:bg-gray-700/50';
    }
    
    if (index === question.correct) {
      return 'bg-green-500/20 border-green-500';
    }
    
    if (index === selected && index !== question.correct) {
      return 'bg-red-500/20 border-red-500';
    }
    
    return 'bg-gray-800/30 border-gray-700 opacity-50';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${getOptionStyle(index)}`}
              disabled={answered}
            >
              <div className="flex items-center">
                <span className="mr-3 text-cyan-400 font-bold">
                  {String.fromCharCode(65 + index)}
                </span>
                <span>{option}</span>
                
                {answered && index === question.correct && (
                  <span className="ml-auto text-green-400">✓</span>
                )}
                {answered && index === selected && index !== question.correct && (
                  <span className="ml-auto text-red-400">✗</span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {answered && question.explanation && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="text-sm font-semibold text-blue-400 mb-2">
            💡 Explicação
          </div>
          <p className="text-sm text-gray-300">{question.explanation}</p>
        </div>
      )}

      {!answered ? (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className={`w-full py-3 rounded-xl font-bold transition-all ${
            selected !== null
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-105'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
        >
          CONFIRMAR RESPOSTA
        </button>
      ) : (
        <div className="text-center py-2">
          <div className={`text-lg font-bold ${
            selected === question.correct ? 'text-green-400' : 'text-red-400'
          }`}>
            {selected === question.correct ? 'Resposta Correta!' : 'Resposta Incorreta'}
          </div>
          <p className="text-sm text-gray-400 mt-1">
            +{selected === question.correct ? question.points : 0} pontos
          </p>
        </div>
      )}
    </div>
  );
};

export default Question;