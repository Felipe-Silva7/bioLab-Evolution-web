import React from 'react';
import { BookOpen } from 'lucide-react';
import { useGame } from '../contexts/GameContext';
import { EXPERIMENTS } from '../utils/constants';

export default function LearnView() {
  const { gameState } = useGame();
  
  const LEARNING_SUMMARY = {
    culture_growth: [
      'Células precisam de nutrientes específicos (glicose, aminoácidos, minerais) para crescer.',
      'Contaminação compete pelos recursos e reduz a viabilidade do cultivo.',
      'Balanceamento de nutrientes e movimentos estratégicos aumentam a eficiência do crescimento.'
    ],
    pcr_amplification: [
      'A PCR possui três etapas térmicas: 95°C (desnaturação), 55°C (anelamento), 72°C (extensão).',
      'Primers definem a região alvo; Taq polimerase sintetiza novas fitas de DNA.',
      'Precisão nos ciclos aumenta a quantidade de DNA de forma exponencial.'
    ],
    dna_sequencing: [
      'Pareamento de bases: A–T e C–G define a complementaridade das fitas.',
      'Sequenciar é reconstruir a fita complementar ao molde com precisão.',
      'Conceitos básicos de genética dependem da correta leitura das bases.'
    ],
    fermentation: [
      'Manter temperatura, pH, oxigênio e agitação na zona ideal evita colapsos.',
      'Homeostase do bioprocesso é essencial para produtividade e rendimento.',
      'Ajustes finos e constantes estabilizam o sistema em escala industrial.'
    ],
    crispr_editing: [
      'Cas9 reconhece a sequência PAM (NGG) para realizar o corte específico.',
      'O gRNA guia a enzima até o alvo correto no genoma.',
      'Precisão e ética são fundamentais na edição genética.'
    ]
  };
  
  const MANUAL_ANCHORS = {
    culture_growth: '#cultivo',
    pcr_amplification: '#pcr',
    dna_sequencing: '#sequenciamento',
    fermentation: '#fermentacao',
    crispr_editing: '#crispr'
  };

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
                  {LEARNING_SUMMARY[expId] ? (
                    <ul className="text-sm text-gray-300 space-y-2">
                      {LEARNING_SUMMARY[expId].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-400">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-300">
                      Conteúdo educacional em breve para este experimento.
                    </p>
                  )}
                  <div className="mt-3">
                    <a
                      href={`/manual.html${MANUAL_ANCHORS[expId] || ''}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-blue-400 hover:text-blue-300 text-sm font-semibold"
                    >
                      Saiba mais →
                    </a>
                  </div>
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
