import React, { useState, useEffect } from 'react';

const CRISPREditor = ({ onComplete }) => {
  const [dnaSequence, setDnaSequence] = useState('');
  const [targetSequence, setTargetSequence] = useState('');
  const [grna, setGrna] = useState('');
  const [cas9Position, setCas9Position] = useState(-1);
  const [score, setScore] = useState(100);
  const [attempts, setAttempts] = useState(3);
  const [result, setResult] = useState('');
  const [showPAM, setShowPAM] = useState(false);

  useEffect(() => {
    // Gerar sequência de DNA aleatória
    const generateSequence = (length) => {
      const bases = ['A', 'T', 'C', 'G'];
      return Array.from({ length }, () => bases[Math.floor(Math.random() * bases.length)]).join('');
    };
    
    const seq = generateSequence(50);
    setDnaSequence(seq);
    
    // Selecionar alvo aleatório (20 bases)
    const startPos = Math.floor(Math.random() * 30);
    const target = seq.substring(startPos, startPos + 20);
    setTargetSequence(target);
    
    // gRNA deve ser complementar ao alvo + PAM (NGG)
    const complement = target.split('').map(base => {
      if (base === 'A') return 'T';
      if (base === 'T') return 'A';
      if (base === 'C') return 'G';
      if (base === 'G') return 'C';
      return base;
    }).join('');
    
    setGrna(complement.substring(0, 17)); // gRNA de 17 bases
  }, []);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', 'cas9');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = Math.floor((x / rect.width) * dnaSequence.length);
    setCas9Position(position);
    
    // Verificar acerto
    const pamSequence = dnaSequence.substring(position - 3, position);
    const isPAM = pamSequence.endsWith('GG');
    const isNearTarget = Math.abs(position - dnaSequence.indexOf(targetSequence)) <= 5;
    
    if (isPAM && isNearTarget) {
      setScore(prev => Math.min(100, prev + 20));
      setResult('✓ Corte preciso! +20 pontos');
      setShowPAM(true);
    } else {
      setScore(prev => Math.max(0, prev - 25));
      setAttempts(prev => prev - 1);
      setResult('✗ Corte off-target! -25 pontos');
      
      if (attempts <= 1) {
        setTimeout(() => onComplete(false, score), 1000);
      }
    }
  };

  const handleComplete = () => {
    const finalScore = score;
    onComplete(finalScore >= 70, finalScore);
  };

  const renderSequence = () => {
    return dnaSequence.split('').map((base, index) => {
      const isTarget = index >= dnaSequence.indexOf(targetSequence) && 
                      index < dnaSequence.indexOf(targetSequence) + targetSequence.length;
      const isCas9Here = index >= cas9Position && index < cas9Position + 3;
      const isPAM = showPAM && index >= cas9Position - 3 && index < cas9Position;
      
      let className = 'inline-block w-6 h-8 text-center font-mono border-b-2 ';
      
      if (isPAM) className += 'bg-red-500/30 border-red-500';
      else if (isCas9Here) className += 'bg-cyan-500/30 border-cyan-500';
      else if (isTarget) className += 'bg-yellow-500/30 border-yellow-500';
      else className += 'bg-gray-800/50 border-gray-700';
      
      return (
        <span key={index} className={className}>
          {base}
        </span>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Score</div>
          <div className="text-2xl font-bold text-cyan-400">{score}%</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Tentativas</div>
          <div className="text-2xl font-bold text-purple-400">{attempts}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Precisão</div>
          <div className="text-2xl font-bold text-green-400">
            {cas9Position >= 0 ? 'Ativo' : '---'}
          </div>
        </div>
      </div>

      <div className="bg-black/60 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-4 text-center">Edição Genética CRISPR-Cas9</h3>
        
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">Sequência de DNA:</div>
          <div
            className="font-mono bg-gray-900/50 p-4 rounded-lg min-h-[80px] leading-8"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {renderSequence()}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Arraste o complexo Cas9 para o local de corte (próximo a sequência NGG)
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">Sequência Alvo:</div>
          <div className="font-mono bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/30">
            {targetSequence}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-2">gRNA (RNA guia):</div>
          <div className="font-mono bg-cyan-500/10 p-3 rounded-lg border border-cyan-500/30">
            {grna}
            <span className="text-red-400">NGG</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Complementar à sequência alvo + motivo PAM (NGG)
          </div>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-2">Complexo Cas9:</div>
          <div
            draggable
            onDragStart={handleDragStart}
            className="inline-flex items-center gap-2 bg-red-500/20 border-2 border-red-500 px-4 py-2 rounded-lg cursor-move hover:bg-red-500/30"
          >
            <span className="text-xl">✂️</span>
            <span className="font-semibold">Arraste para cortar</span>
          </div>
        </div>

        {result && (
          <div className={`p-3 rounded-lg text-center ${
            result.includes('✓') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}>
            {result}
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-yellow-500/30 border border-yellow-500"></div>
              <span className="text-gray-400">Alvo</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-cyan-500/30 border border-cyan-500"></div>
              <span className="text-gray-400">Cas9</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 bg-red-500/30 border border-red-500"></div>
              <span className="text-gray-400">PAM (NGG)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
        <div className="text-xs uppercase tracking-wide text-purple-400 font-bold mb-2">
          ✂️ Sobre Edição Genética CRISPR
        </div>
        <p className="text-sm text-gray-300">
          CRISPR-Cas9 é uma ferramenta de edição genética que usa um RNA guia (gRNA) para direcionar 
          a enzima Cas9 a um local específico no DNA. O corte ocorre próximo a sequências PAM (NGG).
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleComplete}
          disabled={attempts <= 0}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            score >= 70
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-105'
              : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
          }`}
        >
          {score >= 70 ? 'CONCLUIR EDIÇÃO' : `PRECISA ${70 - score} PONTOS`}
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

export default CRISPREditor;