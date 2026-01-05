import React, { useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import LabStation from './components/lab/LabStation';
import ExperimentCard from './components/experiments/ExperimentCard';
import ExperimentModal from './components/experiments/ExperimentModal';
import QuizModal from './components/quiz/QuizModal';
import ShopGrid from './components/shop/ShopGrid';
import StatsPanel from './components/progress/StatsPanel';
import { EXPERIMENTS } from './utils/constants';
import { Activity, BookOpen } from 'lucide-react';
import { useGame } from './contexts/GameContext';

function ExperimentsView() {
  const [showQuiz, setShowQuiz] = useState(null);
  const [activeExperiment, setActiveExperiment] = useState(null);
  const { gameState } = useGame();

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
              setActiveExperiment(showQuiz.experimentId);
            }
          }}
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

function LearnView() {
  const { gameState } = useGame();

  return (
    <div className="space-y-6">
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6">
        <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <BookOpen className="text-blue-400" />
          Enciclopédia de Biotecnologia
        </h2>
        <p className="text-gray-400 text-sm">
          Conteúdo educacional desbloqueado através dos seus experimentos
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {gameState.completedExperiments.length > 0 ? (
          gameState.completedExperiments.map(expId => {
            const exp = EXPERIMENTS[expId];
            return (
              <div key={expId} className="bg-black/40 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-5xl">{exp.icon}</span>
                  <div>
                    <h3 className="font-bold text-lg text-blue-400">{exp.name}</h3>
                    <p className="text-sm text-gray-400">{exp.description}</p>
                  </div>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="text-xs uppercase tracking-wide text-blue-400 font-bold mb-2">
                    📚 O que você aprendeu
                  </div>
                  <p className="text-sm text-gray-300">
                    Experimento concluído com sucesso! Continue explorando para desbloquear mais conteúdo educacional.
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-500 opacity-30" />
            <p className="text-gray-500">Complete experimentos para desbloquear conteúdo educacional!</p>
          </div>
        )}
      </div>
    </div>
  );
}

function GameContent() {
  const [activeTab, setActiveTab] = useState('lab');

  return (
    <>
      <Header />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'lab' && <LabStation />}
        {activeTab === 'experiments' && <ExperimentsView />}
        {activeTab === 'shop' && <ShopGrid />}
        {activeTab === 'progress' && <StatsPanel />}
        {activeTab === 'learn' && <LearnView />}
      </main>
    </>
  );
}

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
        <GameContent />
      </div>
    </GameProvider>
  );
}

export default App;