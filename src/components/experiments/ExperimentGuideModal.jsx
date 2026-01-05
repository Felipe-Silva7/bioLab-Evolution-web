import React from 'react';
import Modal from '../common/Modal';
import { Beaker, ThermometerSun, Dna, Factory, Scissors } from 'lucide-react';
import { EXPERIMENTS } from '../../utils/constants';

const GUIDE_CONTENT = {
  culture_growth: {
    icon: <Beaker className="w-6 h-6 text-cyan-400" />,
    title: 'Cultivo em Placa de Petri',
    steps: [
      'Combine 3 peças iguais para alimentar as células',
      'Evite a contaminação atingindo a pontuação mínima',
      'Use movimentos estratégicos para criar combos'
    ],
    tip: 'Priorize linhas com mais combinações para acelerar a pontuação'
  },
  pcr_amplification: {
    icon: <ThermometerSun className="w-6 h-6 text-red-400" />,
    title: 'PCR – Amplificação de DNA',
    steps: [
      'Controle a temperatura do termociclador',
      'Pare exatamente em 95°C, 55°C e 72°C',
      'Conclua ciclos precisos para amplificar o DNA'
    ],
    tip: 'Observe o indicador e corrija rápido se passar do ponto'
  },
  dna_sequencing: {
    icon: <Dna className="w-6 h-6 text-purple-400" />,
    title: 'Sequenciamento de DNA',
    steps: [
      'Monte a fita complementar ao molde',
      'Use o pareamento A–T e C–G',
      'Evite erros antes do tempo acabar'
    ],
    tip: 'Valide pares visualmente antes de confirmar'
  },
  fermentation: {
    icon: <Factory className="w-6 h-6 text-green-400" />,
    title: 'Fermentação Industrial',
    steps: [
      'Mantenha temperatura, pH, oxigênio e agitação na zona ideal',
      'Ajuste variáveis quando saírem do intervalo',
      'Evite colapsos mantendo estabilidade'
    ],
    tip: 'Ajuste pequenas variações para evitar oscilações'
  },
  crispr_editing: {
    icon: <Scissors className="w-6 h-6 text-pink-400" />,
    title: 'Edição Genética CRISPR',
    steps: [
      'Encontre a sequência PAM (NGG)',
      'Posicione a Cas9 exatamente no alvo',
      'Realize o corte guiado com precisão'
    ],
    tip: 'Verifique o padrão NGG antes de posicionar a enzima'
  }
};

export default function ExperimentGuideModal({ experimentId, onStart, onClose }) {
  const experiment = EXPERIMENTS[experimentId];
  const guide = GUIDE_CONTENT[experimentId];
  if (!experiment || !guide) return null;

  return (
    <Modal isOpen={true} onClose={onClose} title={guide.title} size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          {guide.icon}
          <div className="text-sm text-gray-400">{experiment.description}</div>
        </div>
        <div className="bg-black/30 border border-gray-800 rounded-xl p-4">
          <div className="text-sm font-semibold text-gray-300 mb-2">O que fazer</div>
          <ul className="text-sm text-gray-300 space-y-2">
            {guide.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400">•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-sm text-gray-400">
          Dica: <span className="text-cyan-400">{guide.tip}</span>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
          >
            Depois
          </button>
          <button
            onClick={onStart}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-medium transition-colors"
          >
            Começar
          </button>
        </div>
      </div>
    </Modal>
  );
}
