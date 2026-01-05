import React from 'react';
import { useGame } from '../../contexts/GameContext';

const EquipmentCard = ({ equipment }) => {
  const { dispatch } = useGame();
  
  const upgradeCost = Math.floor(100 * Math.pow(1.5, equipment.level));

  const handleUpgrade = () => {
    if (gameState.funding >= upgradeCost) {
      dispatch({ type: 'SPEND_FUNDING', payload: upgradeCost });
      // Aqui adicionaria lógica de upgrade
    }
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {equipment.id === 'microscope' && '🔬'}
              {equipment.id === 'incubator' && '🌡️'}
              {equipment.id === 'thermocycler' && '🧬'}
              {equipment.id === 'bioreactor' && '⚗️'}
              {!['microscope', 'incubator', 'thermocycler', 'bioreactor'].includes(equipment.id) && '⚙️'}
            </span>
            <div>
              <h4 className="font-semibold text-sm">
                {equipment.id.replace('_', ' ')}
              </h4>
              <p className="text-xs text-gray-400">Nível {equipment.level}</p>
            </div>
          </div>
          
          {equipment.durability && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Durabilidade</span>
                <span>{equipment.durability}%</span>
              </div>
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500"
                  style={{ width: `${equipment.durability}%` }}
                />
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={handleUpgrade}
          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded text-xs font-medium transition-colors"
          disabled={gameState.funding < upgradeCost}
        >
          ↑ Nível
        </button>
      </div>
    </div>
  );
};

export default EquipmentCard;