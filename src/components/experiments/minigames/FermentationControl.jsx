import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const FermentationControl = ({ onComplete }) => {
  const [temperature, setTemperature] = useState(37);
  const [ph, setPH] = useState(6.5);
  const [oxygen, setOxygen] = useState(30);
  const [agitation, setAgitation] = useState(50);
  const [time, setTime] = useState(0);
  const [biomass, setBiomass] = useState(10);
  const [product, setProduct] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [targets] = useState({
    temp: 37,
    pH: 6.5,
    o2: 30,
    agitation: 50
  });

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prev => prev + 1);
        
        // Simular crescimento
        const tempError = Math.abs(temperature - targets.temp);
        const phError = Math.abs(ph - targets.pH);
        const o2Error = Math.abs(oxygen - targets.o2);
        const agError = Math.abs(agitation - targets.agitation);
        
        const totalError = (tempError + phError + o2Error + agError) / 4;
        const growthRate = Math.max(0.1, 1 - (totalError / 50));
        
        setBiomass(prev => prev + growthRate);
        setProduct(prev => prev + growthRate * 0.3);
        
        // Contaminar se condições ruins
        if (totalError > 20) {
          setBiomass(prev => prev * 0.95);
        }
        
        // Concluir após 2 minutos
        if (time >= 120) {
          setIsRunning(false);
          const score = Math.min(100, Math.round(product * 10));
          onComplete(product >= 15, score);
        }
      }, 500);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, temperature, ph, oxygen, agitation, time, targets, product, onComplete]);

  const ControlSlider = ({ label, value, setValue, min, max, unit, color }) => (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-sm text-gray-400">{label}</span>
        <span className={`font-bold ${color}`}>{value}{unit}</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => setValue(Math.max(min, value - 1))} className="p-1">
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="flex-1"
          disabled={!isRunning}
        />
        <button onClick={() => setValue(Math.min(max, value + 1))} className="p-1">
          <TrendingUp className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Tempo</div>
          <div className="text-2xl font-bold text-cyan-400">
            {Math.floor(time / 60)}:{String(time % 60).padStart(2, '0')}
          </div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Biomassa</div>
          <div className="text-2xl font-bold text-green-400">{biomass.toFixed(1)}g/L</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Produto</div>
          <div className="text-2xl font-bold text-purple-400">{product.toFixed(1)}g/L</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400 text-sm mb-1">Estado</div>
          <div className={`text-lg font-bold ${isRunning ? 'text-green-400' : 'text-yellow-400'}`}>
            {isRunning ? 'ATIVO' : 'PARADO'}
          </div>
        </div>
      </div>

      <div className="bg-black/60 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-6 text-center">Controle de Fermentação</h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <ControlSlider
              label="Temperatura"
              value={temperature}
              setValue={setTemperature}
              min={20}
              max={50}
              unit="°C"
              color={Math.abs(temperature - targets.temp) < 2 ? 'text-green-400' : 'text-red-400'}
            />
            <ControlSlider
              label="pH"
              value={ph}
              setValue={setPH}
              min={4}
              max={9}
              unit="pH"
              color={Math.abs(ph - targets.pH) < 0.3 ? 'text-green-400' : 'text-red-400'}
            />
          </div>
          
          <div className="space-y-6">
            <ControlSlider
              label="Oxigênio"
              value={oxygen}
              setValue={setOxygen}
              min={10}
              max={100}
              unit="%"
              color={Math.abs(oxygen - targets.o2) < 5 ? 'text-green-400' : 'text-red-400'}
            />
            <ControlSlider
              label="Agitação"
              value={agitation}
              setValue={setAgitation}
              min={0}
              max={100}
              unit="%"
              color={Math.abs(agitation - targets.agitation) < 10 ? 'text-green-400' : 'text-red-400'}
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Condições Ideais</div>
            <div className="space-y-1 text-sm">
              <div>Temp: {targets.temp}°C</div>
              <div>pH: {targets.pH}</div>
              <div>O₂: {targets.o2}%</div>
              <div>Agitação: {targets.agitation}%</div>
            </div>
          </div>
          
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <div className="text-sm text-gray-400 mb-1">Seus Valores</div>
            <div className="space-y-1 text-sm">
              <div className={Math.abs(temperature - targets.temp) < 2 ? 'text-green-400' : 'text-red-400'}>
                Temp: {temperature}°C
              </div>
              <div className={Math.abs(ph - targets.pH) < 0.3 ? 'text-green-400' : 'text-red-400'}>
                pH: {ph}
              </div>
              <div className={Math.abs(oxygen - targets.o2) < 5 ? 'text-green-400' : 'text-red-400'}>
                O₂: {oxygen}%
              </div>
              <div className={Math.abs(agitation - targets.agitation) < 10 ? 'text-green-400' : 'text-red-400'}>
                Agitação: {agitation}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
        <div className="text-xs uppercase tracking-wide text-green-400 font-bold mb-2">
          ⚗️ Sobre Fermentação Industrial
        </div>
        <p className="text-sm text-gray-300">
          Fermentação controlada é usada para produzir antibióticos, enzimas, etanol e proteínas recombinantes.
          Condições ideais maximizam rendimento e pureza do produto.
        </p>
      </div>

      <div className="flex gap-4">
        {!isRunning ? (
          <button
            onClick={() => setIsRunning(true)}
            className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold hover:scale-105 transition-transform"
          >
            INICIAR FERMENTAÇÃO
          </button>
        ) : (
          <button
            onClick={() => setIsRunning(false)}
            className="flex-1 py-3 bg-red-500/20 border border-red-500 rounded-xl font-bold hover:bg-red-500/30"
          >
            PARAR FERMENTAÇÃO
          </button>
        )}
        
        <button
          onClick={() => onComplete(product >= 15, Math.round(product * 10))}
          className="px-6 py-3 bg-cyan-500/20 border border-cyan-500 rounded-xl font-bold hover:bg-cyan-500/30"
        >
          FINALIZAR
        </button>
      </div>
    </div>
  );
};

export default FermentationControl;