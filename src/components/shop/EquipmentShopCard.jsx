import React from 'react';
import { ShoppingBag, Zap, TrendingUp, Shield } from 'lucide-react';
import { useGame } from '../../contexts/GameContext';

const EquipmentShopCard = ({ equipment, onBuy }) => {
  const { gameState } = useGame();
  
  const isOwned = gameState.equipment[equipment.id]?.owned;
  const canAfford = gameState.funding >= equipment.cost;
  const meetsLevel = gameState.level >= (equipment.requiredLevel || 1);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'microscope': return '🔬';
      case 'incubator': return '🌡️';
      case 'thermocycler': return '🧬';
      case 'bioreactor': return '⚗️';
      case 'sequencer': return '💻';
      case 'centrifuge': return '🌀';
      case 'spectrometer': return '📊';
      default: return '⚙️';
    }
  };

  const getBenefits = () => {
    const benefits = [];
    if (equipment.knowledgeBonus) benefits.push(`+${equipment.knowledgeBonus}% conhecimento`);
    if (equipment.successBonus) benefits.push(`+${equipment.successBonus}% sucesso`);
    if (equipment.timeReduction) benefits.push(`-${equipment.timeReduction}% tempo`);
    return benefits;
  };

  const benefits = getBenefits();

  return (
    <div
      className={`rounded-xl border-2 p-5 transition-all ${
        isOwned
          ? 'bg-green-500/10 border-green-500/50'
          : canAfford && meetsLevel
          ? 'bg-gray-900/50 border-cyan-500/50 hover:border-cyan-400 hover:scale-[1.02] cursor-pointer'
          : 'bg-gray-900/30 border-gray-700 opacity-60'
      }`}
      onClick={() => !isOwned && canAfford && meetsLevel && onBuy(equipment)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{getIcon(equipment.icon)}</div>
          <div>
            <h3 className="font-bold text-lg">{equipment.name}</h3>
            <p className="text-sm text-gray-400">{equipment.description}</p>
          </div>
        </div>
        
        {isOwned && (
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
            ✓ ADQUIRIDO
          </span>
        )}
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400">Custo:</span>
          <span className="text-2xl font-bold text-green-400">
            ${equipment.cost}
          </span>
        </div>
        
        {equipment.requiredLevel && (
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Nível necessário:</span>
            <span className={`font-bold ${
              meetsLevel ? 'text-cyan-400' : 'text-red-400'
            }`}>
              {equipment.requiredLevel}
            </span>
          </div>
        )}
      </div>

      {benefits.length > 0 && (
        <div className="mb-4 p-3 bg-gray-800/50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-semibold">Benefícios:</span>
          </div>
          <ul className="text-sm text-gray-300 space-y-1">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-green-400" />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!isOwned && (
        <button
          className={`w-full py-3 rounded-lg font-bold transition-all ${
            canAfford && meetsLevel
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!canAfford || !meetsLevel}
        >
          {!meetsLevel
            ? `NÍVEL ${equipment.requiredLevel} NECESSÁRIO`
            : !canAfford
            ? `FALTAM $${equipment.cost - gameState.funding}`
            : 'COMPRAR EQUIPAMENTO'}
        </button>
      )}

      {isOwned && (
        <div className="text-center text-sm text-gray-400 mt-2">
          <Shield className="w-4 h-4 inline-block mr-1" />
          Equipamento ativo no laboratório
        </div>
      )}
    </div>
  );
};

export default EquipmentShopCard;