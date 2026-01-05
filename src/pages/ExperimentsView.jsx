import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { EXPERIMENTS } from '../utils/constants';
import ExperimentCard from '../components/experiments/ExperimentCard';
import ExperimentModal from '../components/experiments/ExperimentModal';
import QuizModal from '../components/quiz/QuizModal';
import ExperimentGuideModal from '../components/experiments/ExperimentGuideModal';

export default function ExperimentsView() {
  const { gameState } = useGame();
  const [showQuiz, setShowQuiz] = useState(null);
  const [activeExperiment, setActiveExperiment] = useState(null);
  const [guideExperiment, setGuideExperiment] = useState(null);

  const startExperiment = (expId) => {
    const exp = EXPERIMENTS[expId];
    
    if (exp.requirements.knowledge > gameState.knowledge) {
      alert('Conhecimento insuficiente!');
      return;
    }
    
    if (exp.requirements.equipment) {
      const hasEquipment = exp.requirements.equipment.every(eq => 
        gameState.equipment[eq]?.owned
      );
      if (!hasEquipment) {
        alert('Equipamento necessário não disponível!');
        return;
      }
    }
    
    setShowQuiz({ experimentId: expId });
  };

  return (
    <div className="space-y-6">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <Activity className="text-cyan-400" />
          Experimentos Disponíveis
        </h2>
        <p className="text-gray-400 text-sm">
          Cada experimento testa seus conhecimentos e habilidades práticas em biotecnologia
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(EXPERIMENTS).map(exp => (
          <ExperimentCard 
            key={exp.id}
            experiment={exp}
            onStart={startExperiment}
          />
        ))}
      </div>

      {showQuiz && (
        <QuizModal 
          experimentId={showQuiz.experimentId}
          onComplete={(passed) => {
            setShowQuiz(null);
            if (passed) {
              setGuideExperiment(showQuiz.experimentId);
            }
          }}
        />
      )}

      {guideExperiment && (
        <ExperimentGuideModal
          experimentId={guideExperiment}
          onStart={() => {
            setActiveExperiment(guideExperiment);
            setGuideExperiment(null);
          }}
          onClose={() => setGuideExperiment(null)}
        />
      )}

      {activeExperiment && (
        <ExperimentModal
          experimentId={activeExperiment}
          onClose={() => setActiveExperiment(null)}
        />
      )}
    </div>
  );
}
