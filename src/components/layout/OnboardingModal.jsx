import React, { useState, useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';
import { BookOpen, X, ChevronRight, Check } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    title: 'Bem-vindo ao BioLab Evolution! 🧬',
    content: 'Você é um cientista iniciante com o sonho de construir o maior laboratório de biotecnologia do mundo. Sua jornada começa agora!',
    icon: <BookOpen className="text-cyan-400 w-12 h-12" />,
  },
  {
    title: 'Seu Laboratório 🧫',
    content: 'Aqui é sua base de operações. Use a Bancada de Trabalho para acessar seus experimentos ativos e gerenciar seus recursos.',
    icon: <BookOpen className="text-green-400 w-12 h-12" />,
  },
  {
    title: 'Realizando Experimentos 🧪',
    content: 'Vá até a aba "Experimentos" no menu lateral para iniciar pesquisas. Comece com o Cultivo em Placa de Petri para ganhar seus primeiros fundos.',
    icon: <BookOpen className="text-purple-400 w-12 h-12" />,
  },
  {
    title: 'Loja de Equipamentos 🛍️',
    content: 'Use o dinheiro ganho para comprar equipamentos melhores na Loja. O Termociclador, por exemplo, é essencial para desbloquear experimentos de PCR.',
    icon: <BookOpen className="text-yellow-400 w-12 h-12" />,
  },
  {
    title: 'Aprenda e Evolua 🧠',
    content: 'Cada experimento ensina conceitos reais de biologia. Preste atenção nas dicas e nos quizzes para maximizar seu ganho de Conhecimento!',
    icon: <BookOpen className="text-blue-400 w-12 h-12" />,
  }
];

export default function OnboardingModal() {
  const { gameState, dispatch } = useGame();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if user has seen tutorial (using local storage or game state flag if available)
    // For now, let's assume if knowledge is 0 (new game) or specifically flagged, we show it.
    // Since we boosted resources, let's use a specific localStorage flag for the tutorial.
    const hasSeenTutorial = localStorage.getItem('biolab-tutorial-completed');
    if (!hasSeenTutorial) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < TUTORIAL_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('biolab-tutorial-completed', 'true');
  };

  if (!isOpen) return null;

  const step = TUTORIAL_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
        
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 p-32 bg-cyan-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 p-32 bg-purple-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

        <div className="p-8 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="bg-gray-800/80 p-4 rounded-full border border-gray-700 shadow-inner">
              {step.icon}
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-white mb-4">
            {step.title}
          </h2>
          
          <p className="text-gray-300 text-center leading-relaxed mb-8">
            {step.content}
          </p>

          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {TUTORIAL_STEPS.map((_, index) => (
                <div 
                  key={index} 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep ? 'w-8 bg-cyan-500' : 'w-2 bg-gray-700'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-cyan-500/20"
            >
              {currentStep === TUTORIAL_STEPS.length - 1 ? (
                <>Começar <Check size={18} /></>
              ) : (
                <>Próximo <ChevronRight size={18} /></>
              )}
            </button>
          </div>
        </div>

        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>
    </div>
  );
}
