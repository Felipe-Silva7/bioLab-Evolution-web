import React from 'react';
import { useGame } from '../../contexts/GameContext';
import { EXPERIMENTS } from '../../utils/constants';
import PCRMinigame from './minigames/PCRMinigame';
import CultureGrowthGame from './minigames/CultureGrowthGame';
import DNASequencingPuzzle from './minigames/DNASequencingPuzzle';
import FermentationControl from './minigames/FermentationControl';
import CRISPREditor from './minigames/CRISPREditor';

export default function ExperimentModal({ experimentId, onClose }) {
  const { dispatch } = useGame();
  const experiment = EXPERIMENTS[experimentId];

  const handleComplete = (success, score) => {
    if (success) {
      dispatch({ type: 'ADD_KNOWLEDGE', payload: experiment.rewards.knowledge });
      dispatch({ type: 'ADD_FUNDING', payload: experiment.rewards.funding });
      dispatch({ type: 'ADD_EXPERIENCE', payload: experiment.rewards.experience });
      dispatch({ type: 'COMPLETE_EXPERIMENT', payload: experimentId });
      if (score >= 100) {
        dispatch({ type: 'PERFECT_EXPERIMENT' });
      }
      
      experiment.unlocks.forEach(unlockId => {
        dispatch({ type: 'UNLOCK_EXPERIMENT', payload: unlockId });
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-900 to-indigo-900 border-2 border-purple-400 rounded-3xl max-w-4xl w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">{experiment.icon}</div>
          <h2 className="text-3xl font-bold mb-2">{experiment.name}</h2>
          <p className="text-gray-400">{experiment.description}</p>
        </div>
        
        {experimentId === 'pcr_amplification' && (
          <PCRMinigame onComplete={handleComplete} />
        )}
        
        {experimentId === 'culture_growth' && (
          <CultureGrowthGame onComplete={handleComplete} />
        )}

        {experimentId === 'dna_sequencing' && (
          <DNASequencingPuzzle onComplete={handleComplete} />
        )}

        {experimentId === 'fermentation' && (
          <FermentationControl onComplete={handleComplete} />
        )}

        {experimentId === 'crispr_editing' && (
          <CRISPREditor onComplete={handleComplete} />
        )}
        
        {!['pcr_amplification', 'culture_growth', 'dna_sequencing', 'fermentation', 'crispr_editing'].includes(experimentId) && (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-6">Minigame em desenvolvimento</p>
            <button
              onClick={() => handleComplete(true, 100)}
              className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-bold hover:scale-105 transition-transform"
            >
              Simular Conclusão
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
