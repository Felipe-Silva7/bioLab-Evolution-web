import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';
import { Calculations } from '../../utils/calculations';
import { EQUIPMENT_SHOP } from '../../utils/constants';

export default function ShopGrid() {
  const { gameState, dispatch } = useGame();

  const buyEquipment = (equipId) => {
    const equipment = EQUIPMENT_SHOP[equipId];
    const ownedCount = Object.values(gameState.equipment).filter(eq => eq.owned).length;
    const adjustedCost = Calculations.calculateEquipmentCost(equipment.cost, ownedCount, gameState.level);
    if (gameState.funding >= adjustedCost) {
      dispatch({ type: 'SPEND_FUNDING', payload: adjustedCost });
      dispatch({ type: 'BUY_EQUIPMENT', payload: equipId });
    } else {
      alert('Financiamento insuficiente!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-green-500/30 p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <TrendingUp className="text-green-400" />
          Loja de Equipamentos
        </h2>
        <p className="text-gray-400 text-sm">
          Invista em equipamentos para desbloquear novos experimentos
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(EQUIPMENT_SHOP).map(([id, eq]) => {
          const owned = gameState.equipment[id]?.owned;
          const ownedCount = Object.values(gameState.equipment).filter(e => e.owned).length;
          const adjustedCost = Calculations.calculateEquipmentCost(eq.cost, ownedCount, gameState.level);
          const canBuy = gameState.funding >= adjustedCost && !owned;
          
          return (
            <div
              key={id}
              className={`rounded-2xl border-2 p-6 ${
                owned ? 'bg-green-500/10 border-green-500/50' :
                canBuy ? 'bg-black/40 border-cyan-500/50 hover:border-cyan-400' :
                'bg-black/20 border-gray-500/30 opacity-60'
              }`}
            >
              <div className="text-center mb-4">
                <div className="text-6xl mb-3">{eq.icon}</div>
                <h3 className="font-bold text-lg">{eq.name}</h3>
              </div>
              
              <p className="text-sm text-gray-400 mb-6 text-center">{eq.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">Custo:</span>
                <span className="text-2xl font-bold text-green-400">${adjustedCost}</span>
              </div>
              
              {owned ? (
                <div className="w-full py-3 bg-green-500/20 border border-green-500 rounded-lg text-center font-bold text-green-400">
                  ✓ ADQUIRIDO
                </div>
              ) : (
                <button
                  onClick={() => buyEquipment(id)}
                  disabled={!canBuy}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    canBuy
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105'
                      : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {canBuy ? 'COMPRAR' : 'INSUFICIENTE'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
