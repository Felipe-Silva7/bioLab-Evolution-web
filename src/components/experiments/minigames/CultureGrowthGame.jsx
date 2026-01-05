import React, { useState, useEffect } from 'react';

export default function CultureGrowthGame({ onComplete }) {
  const [grid, setGrid] = useState(() => 
    Array(5).fill(null).map(() => 
      Array(5).fill(null).map(() => 
        ['glucose', 'aminoacid', 'mineral', 'vitamin'][Math.floor(Math.random() * 4)]
      )
    )
  );
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(15);
  const [contamination, setContamination] = useState(0);
  
  const elements = {
    glucose: { icon: '🍬', color: 'yellow', name: 'Glicose' },
    aminoacid: { icon: '🧪', color: 'blue', name: 'Aminoácido' },
    mineral: { icon: '💎', color: 'purple', name: 'Mineral' },
    vitamin: { icon: '💊', color: 'green', name: 'Vitamina' },
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setContamination(prev => Math.min(100, prev + 2));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (contamination >= 100) {
      onComplete(false, score);
    }
  }, [contamination, onComplete, score]);
  
  useEffect(() => {
    if (moves === 0) {
      onComplete(score >= 500, score);
    }
  }, [moves, score, onComplete]);
  
  const handleCellClick = (row, col) => {
    if (selected) {
      const [selRow, selCol] = selected;
      const rowDiff = Math.abs(row - selRow);
      const colDiff = Math.abs(col - selCol);
      
      if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
        const newGrid = grid.map(r => [...r]);
        [newGrid[row][col], newGrid[selRow][selCol]] = [newGrid[selRow][selCol], newGrid[row][col]];
        setGrid(newGrid);
        setSelected(null);
        setMoves(prev => prev - 1);
        
        checkMatches(newGrid);
      } else {
        setSelected([row, col]);
      }
    } else {
      setSelected([row, col]);
    }
  };
  
  const checkMatches = (currentGrid) => {
    let matchCount = 0;
    
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 3; col++) {
        if (currentGrid[row][col] === currentGrid[row][col + 1] &&
            currentGrid[row][col] === currentGrid[row][col + 2]) {
          matchCount++;
        }
      }
    }
    
    for (let col = 0; col < 5; col++) {
      for (let row = 0; row < 3; row++) {
        if (currentGrid[row][col] === currentGrid[row + 1][col] &&
            currentGrid[row][col] === currentGrid[row + 2][col]) {
          matchCount++;
        }
      }
    }
    
    if (matchCount > 0) {
      setScore(prev => prev + matchCount * 100);
      setContamination(prev => Math.max(0, prev - 15));
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Score</div>
          <div className="text-2xl font-bold text-cyan-400">{score}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Movimentos</div>
          <div className="text-2xl font-bold text-purple-400">{moves}</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Contaminação</div>
          <div className="text-2xl font-bold text-red-400">{contamination}%</div>
        </div>
      </div>
      
      <div className="bg-black/60 rounded-xl p-4">
        <div className="bg-black/40 rounded-full h-3 overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all"
            style={{ width: `${contamination}%` }}
          />
        </div>
      </div>
      
      <div className="bg-black/60 rounded-xl p-6">
        <div className="grid grid-cols-5 gap-2">
          {grid.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <button
                key={`${rowIdx}-${colIdx}`}
                onClick={() => handleCellClick(rowIdx, colIdx)}
                className={`aspect-square text-4xl rounded-lg border-2 transition-all ${
                  selected && selected[0] === rowIdx && selected[1] === colIdx
                    ? 'border-cyan-400 bg-cyan-500/30 scale-110'
                    : 'border-gray-600 bg-black/40 hover:bg-black/60'
                }`}
              >
                {elements[cell].icon}
              </button>
            ))
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2 text-xs">
        {Object.entries(elements).map(([key, el]) => (
          <div key={key} className="bg-black/40 rounded-lg p-2 text-center border border-gray-600">
            <div className="text-2xl mb-1">{el.icon}</div>
            <div className="text-gray-400">{el.name}</div>
          </div>
        ))}
      </div>
      
      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="text-xs uppercase tracking-wide text-green-400 font-bold mb-2">
          📚 Como jogar e Aprender
        </div>
        <div className="text-sm text-gray-300 leading-relaxed space-y-2">
          <p>
            <strong>Objetivo:</strong> Alimente as células para que elas cresçam antes que a contaminação (barra vermelha) tome conta!
          </p>
          <p>
            <strong>Como jogar:</strong> Clique em um nutriente e depois em outro vizinho para trocá-los de lugar. Forme linhas ou colunas de 3 iguais.
          </p>
          <ul className="list-disc pl-4 space-y-1 mt-2 text-xs text-gray-400">
            <li>🍬 <strong>Glicose:</strong> Energia vital para a célula.</li>
            <li>🧪 <strong>Aminoácidos:</strong> "Tijolos" para construir proteínas.</li>
            <li>💎 <strong>Minerais:</strong> Ajudam as enzimas a funcionar.</li>
          </ul>
          <p className="mt-2 font-semibold text-green-400">
            Dica: Você precisa de 500 pontos para passar de nível e desbloquear o Termociclador!
          </p>
        </div>
      </div>
      
      <div className="flex gap-4">
        <button
          onClick={() => onComplete(score >= 500, score)}
          disabled={score < 500}
          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
            score >= 500
              ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-105'
              : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
          }`}
        >
          {score >= 500 ? 'CONCLUIR EXPERIMENTO' : `PRECISA ${500 - score} PONTOS`}
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
}