import React, { useState, useEffect } from 'react';

const DNASequencingPuzzle = ({ onComplete }) => {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [score, setScore] = useState(100);
  const [timer, setTimer] = useState(180);
  const [feedback, setFeedback] = useState('');

  const nucleotides = ['A', 'T', 'C', 'G'];

  useEffect(() => {
    // Gerar sequência alvo
    const target = Array.from({ length: 8 }, () => 
      nucleotides[Math.floor(Math.random() * nucleotides.length)]
    );
    setSequence(target);
    setUserSequence(Array(8).fill(''));
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      onComplete(false, score);
      return;
    }

    const interval = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, onComplete, score]);

  const handleNucleotideClick = (nucleotide, position) => {
    const newUserSequence = [...userSequence];
    newUserSequence[position] = nucleotide;
    setUserSequence(newUserSequence);

    // Verificar acerto
    if (nucleotide === sequence[position]) {
      setScore(prev => Math.min(100, prev + 5));
      setFeedback('✓ Correto!');
    } else {
      setScore(prev => Math.max(0, prev - 10));
      setFeedback('✗ Errado! -10 pontos');
    }

    // Verificar conclusão
    if (!newUserSequence.includes('')) {
      const correct = newUserSequence.filter((nuc, idx) => nuc === sequence[idx]).length;
      const accuracy = (correct / sequence.length) * 100;
      setTimeout(() => onComplete(accuracy >= 70, Math.round(accuracy)), 1000);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Tempo</div>
          <div className={`text-2xl font-bold ${timer < 30 ? 'text-red-400' : 'text-cyan-400'}`}>
            {formatTime(timer)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Precisão</div>
          <div className="text-2xl font-bold text-green-400">{score}%</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Completado</div>
          <div className="text-2xl font-bold text-purple-400">
            {userSequence.filter(n => n !== '').length}/{sequence.length}
          </div>
        </div>
      </div>

      <div className="bg-black/60 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-center">Sequenciamento de DNA</h3>
        
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">Sequência Alvo:</div>
          <div className="flex justify-center gap-2">
            {sequence.map((nuc, idx) => (
              <div
                key={idx}
                className="w-12 h-12 bg-blue-500/20 border-2 border-blue-500 rounded-lg flex items-center justify-center text-xl font-bold"
              >
                {nuc}
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">Sua Sequência:</div>
          <div className="flex justify-center gap-2">
            {userSequence.map((nuc, idx) => (
              <div
                key={idx}
                className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center text-xl font-bold cursor-pointer transition-all ${
                  nuc === ''
                    ? 'border-gray-600 bg-gray-800/50 hover:bg-gray-700/50'
                    : nuc === sequence[idx]
                    ? 'border-green-500 bg-green-500/20'
                    : 'border-red-500 bg-red-500/20'
                }`}
                onClick={() => handleNucleotideClick(nuc, idx)}
              >
                {nuc || '?'}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3 mb-4">
          {nucleotides.map(nuc => (
            <button
              key={nuc}
              onClick={() => {
                const emptyIndex = userSequence.findIndex(n => n === '');
                if (emptyIndex !== -1) {
                  handleNucleotideClick(nuc, emptyIndex);
                }
              }}
              className="w-14 h-14 bg-cyan-500/20 border-2 border-cyan-500 rounded-lg text-2xl font-bold hover:bg-cyan-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!userSequence.includes('')}
            >
              {nuc}
            </button>
          ))}
        </div>

        {feedback && (
          <div className={`text-center py-2 rounded-lg ${
            feedback.includes('✓') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {feedback}
          </div>
        )}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="text-xs uppercase tracking-wide text-blue-400 font-bold mb-2">
          🧬 Sobre Sequenciamento de DNA
        </div>
        <p className="text-sm text-gray-300">
          A sequência de nucleotídeos (A, T, C, G) determina a informação genética. 
          O sequenciamento é fundamental para diagnóstico de doenças, pesquisa e terapia gênica.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => onComplete(score >= 70, score)}
          className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl font-bold hover:scale-105 transition-transform"
        >
          CONCLUIR SEQUENCIAMENTO
        </button>
        <button
          onClick={() => onComplete(false, score)}
          className="px-6 py-3 bg-red-500/20 border border-red-500 rounded-xl font-bold hover:bg-red-500/30"
        >
          DESISTIR
        </button>
      </div>
    </div>
  );
};

export default DNASequencingPuzzle;