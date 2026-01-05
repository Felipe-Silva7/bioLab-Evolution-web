export const GAME_CONFIG = {
  baseClickPower: 1,
  baseCost: 10,
  costMultiplier: 1.15,
  tickRate: 100,
  saveInterval: 5000,
  xpPerLevel: 1000,
};

export const EXPERIMENTS = {
  culture_growth: {
    id: 'culture_growth',
    name: 'Cultivo em Placa de Petri',
    icon: '🧫',
    type: 'match3',
    difficulty: 'Fácil',
    duration: 180,
    description: 'Aprenda os fundamentos do cultivo de micro-organismos',
    requirements: { knowledge: 0 },
    rewards: { knowledge: 50, funding: 50, experience: 100 },
    unlocks: ['pcr_amplification'],
  },
  pcr_amplification: {
    id: 'pcr_amplification',
    name: 'PCR - Amplificação de DNA',
    icon: '🧬',
    type: 'timing',
    difficulty: 'Médio',
    duration: 240,
    description: 'Domine os ciclos de temperatura da PCR',
    requirements: { knowledge: 100, equipment: ['thermocycler'] },
    rewards: { knowledge: 150, funding: 200, experience: 300 },
    unlocks: ['dna_sequencing'],
  },
  dna_sequencing: {
    id: 'dna_sequencing',
    name: 'Sequenciamento de DNA',
    icon: '🔬',
    type: 'puzzle',
    difficulty: 'Difícil',
    duration: 300,
    description: 'Decodifique sequências genéticas',
    requirements: { knowledge: 500, equipment: ['sequencer'] },
    rewards: { knowledge: 300, funding: 500, experience: 600 },
    unlocks: [],
  },
  fermentation: {
    id: 'fermentation',
    name: 'Fermentação Industrial',
    icon: '⚗️',
    type: 'management',
    difficulty: 'Difícil',
    duration: 480,
    description: 'Gerencie um biorreator em tempo real',
    requirements: { knowledge: 300, equipment: ['bioreactor'] },
    rewards: { knowledge: 250, funding: 800, experience: 500 },
    unlocks: [],
  },
};

export const QUESTIONS = {
  culture_growth: [
    {
      id: 'q_culture_1',
      question: 'Qual é a principal fonte de carbono para a maioria dos micro-organismos em cultura?',
      options: ['Glicose', 'Oxigênio', 'Nitrogênio', 'Água'],
      correct: 0,
      explanation: 'Glicose é a fonte de carbono mais comum, fornecendo energia e esqueleto de carbono para síntese de moléculas.',
      points: 10,
    },
    {
      id: 'q_culture_2',
      question: 'O que acontece quando a temperatura de incubação está muito alta?',
      options: ['Crescimento mais rápido', 'Desnaturação de proteínas', 'Maior produção', 'Nada muda'],
      correct: 1,
      explanation: 'Temperaturas excessivas desnатuram proteínas e enzimas essenciais, matando as células.',
      points: 15,
    },
  ],
  pcr_amplification: [
    {
      id: 'q_pcr_1',
      question: 'Qual é a temperatura de desnaturação na PCR?',
      options: ['55°C', '72°C', '95°C', '37°C'],
      correct: 2,
      explanation: 'A 95°C, as ligações de hidrogênio entre as fitas de DNA se rompem, separando a dupla hélice.',
      points: 15,
    },
    {
      id: 'q_pcr_2',
      question: 'O que são primers na PCR?',
      options: ['Enzimas', 'Pequenas sequências de DNA', 'Proteínas', 'Nutrientes'],
      correct: 1,
      explanation: 'Primers são oligonucleotídeos que se anelam ao DNA alvo e iniciam a síntese pela DNA polimerase.',
      points: 20,
    },
    {
      id: 'q_pcr_3',
      question: 'Quantas cópias de DNA são geradas após 30 ciclos de PCR?',
      options: ['30', '900', 'Milhões', 'Mais de 1 bilhão'],
      correct: 3,
      explanation: 'A PCR tem amplificação exponencial: 2^30 = ~1 bilhão de cópias do fragmento alvo!',
      points: 25,
    },
  ],
};

export const EQUIPMENT_SHOP = {
  microscope: { name: 'Microscópio Óptico', cost: 300, icon: '🔬', description: 'Observar células em detalhe' },
  incubator: { name: 'Incubadora', cost: 500, icon: '🌡️', description: 'Controle preciso de temperatura' },
  thermocycler: { name: 'Termociclador PCR', cost: 1000, icon: '🧬', description: 'Necessário para PCR' },
  bioreactor: { name: 'Biorreator', cost: 2500, icon: '⚗️', description: 'Fermentação em larga escala' },
  sequencer: { name: 'Sequenciador NGS', cost: 5000, icon: '💻', description: 'Sequenciamento de DNA' },
};