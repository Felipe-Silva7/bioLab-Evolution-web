import React from 'react';
import { useGame } from '../../contexts/GameContext';

const Equipment = () => {
  const { gameState } = useGame();

  const equipmentList = Object.entries(gameState.equipment)
    .filter(([_, eq]) => eq.owned)
    .map(([id, eq]) => ({ id, ...eq }));

  if (equipmentList.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Nenhum equipamento adquirido ainda</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {equipmentList.map((equip) => (
        <div
          key={equip.id}
          className="bg-gray-900/50 border border-gray-800 rounded-xl p-4"
        >
          <div className="text-3xl mb-2">
            {equip.id === 'microscope' && '🔬'}
            {equip.id === 'incubator' && '🌡️'}
            {equip.id === 'thermocycler' && '🧬'}
            {equip.id === 'bioreactor' && '⚗️'}
            {equip.id === 'sequencer' && '💻'}
            {!['microscope', 'incubator', 'thermocycler', 'bioreactor', 'sequencer'].includes(equip.id) && '⚙️'}
          </div>
          <h4 className="font-semibold capitalize">
            {equip.id.replace('_', ' ')}
          </h4>
          <div className="text-xs text-gray-400 mt-2">
            Nível {equip.level}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Equipment;