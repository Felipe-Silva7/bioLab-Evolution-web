import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

export default function PCRMinigame({ onComplete }) {
  const [phase, setPhase] = useState('denature');
  const [cycle, setCycle] = useState(0);
  const [temperature, setTemperature] = useState(95);
  const [score, setScore] = useState(100);
  const [isActive, setIsActive] = useState(false);
  const [message, setMessage] = useState('Clique INICIAR para começar o ciclo');
  
  const phases = {
    denature: { temp: 95, name: 'Desnaturação', color: 'red', next: 'anneal' },
    anneal: { temp: 55, name: 'Anelamento', color: 'blue', next: 'extension' },
    extension: { temp: 72, name: 'Extensão', color: 'green', next: 'denature' },
  };
  
  const targetTemp = phases[phase].temp;
  
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setTemperature(prev => {
        const diff = targetTemp - prev;
        if (Math.abs(diff) < 1) return targetTemp;
        return prev + diff * 0.1;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [isActive, targetTemp]);
  
  const handlePhaseComplete = () => {
    const accuracy = Math.abs(temperature - targetTemp);
    if (accuracy > 5) {
      setScore(prev => Math.max(0, prev - 10));
      setMessage('⚠️ Temperatura imprecisa! -10 pontos');
    } else {
      setMessage('✓ Fase completada com precisão!');
    }
    
    if (phase === 'extension') {
      const newCycle = cycle + 1;
      setCycle(newCycle);
      if (newCycle >= 3) {
        setTimeout(() => onComplete(score >= 50, score), 1000);
        return;
      }
    }
    
    setPhase(phases[phase].next);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Ciclo</div>
          <div className="text-3xl font-bold text-cyan-400">{cycle + 1}/3</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Temperatura</div>
          <div className="text-3xl font-bold text-orange-400">{Math.round(temperature)}°C</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Score</div>
          <div className="text-3xl font-bold text-green-400">{score}%</div>
        </div>
      </div>
      
      <div className="bg-black/60 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold">Fase Atual:</span>
          <span className={`text-xl font-bold text-${phases[phase].color}-400`}>
            {phases[phase].name}
          </span>
        </div>
        
        <div className="bg-black/40 rounded-full h-8 overflow-hidden mb-2">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-orange-500 to-red-500 transition-all duration-300"
            style={{ width: `${(temperature / 100) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-gray-400">
          <span>0°C</span>
          <span>Alvo: {targetTemp}°C</span>
          <span>100°C</span>
        </div>
      </div>
      
      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 text-center">
        <p className="text-sm text-cyan-400">{message}</p>
      </div>
      
      <div className="flex gap-4">
        {!isActive ? (
          <button
            onClick={() => setIsActive(true)}
            className="flex-1 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            INICIAR CICLO
          </button>
        ) : (
          <>
            <button
              onClick={handlePhaseComplete}
              disabled={Math.abs(temperature - targetTemp) > 2}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                Math.abs(temperature - targetTemp) <= 2
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-105'
                  : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
              }`}
            >
              CONFIRMAR FASE
            </button>
            <button
              onClick={() => onComplete(false, 0)}
              className="px-6 py-4 bg-red-500/20 border border-red-500 rounded-xl font-bold hover:bg-red-500/30"
            >
              CANCELAR
            </button>
          </>
        )}
      </div>
      
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <div className="text-xs uppercase tracking-wide text-blue-400 font-bold mb-2">
          📚 Como funciona a PCR
        </div>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• <strong>95°C:</strong> DNA dupla fita se separa</li>
          <li>• <strong>55°C:</strong> Primers se ligam ao DNA alvo</li>
          <li>• <strong>72°C:</strong> DNA polimerase sintetiza nova fita</li>
        </ul>
      </div>
    </div>
  );
}