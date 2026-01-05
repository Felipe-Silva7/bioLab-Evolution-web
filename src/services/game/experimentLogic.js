import { EXPERIMENTS, QUESTIONS } from '../../utils/constants';

export class ExperimentLogic {
  constructor(gameState) {
    this.gameState = gameState;
  }

  canStartExperiment(experimentId) {
    const experiment = EXPERIMENTS[experimentId];
    if (!experiment) return false;

    // Check if already unlocked
    if (!this.gameState.unlockedExperiments.includes(experimentId)) {
      return { canStart: false, reason: 'Experimento não desbloqueado' };
    }

    // Check knowledge requirement
    if (experiment.requirements.knowledge > this.gameState.knowledge) {
      return { 
        canStart: false, 
        reason: `Requer ${experiment.requirements.knowledge} conhecimento` 
      };
    }

    // Check equipment requirements
    if (experiment.requirements.equipment) {
      const missingEquipment = experiment.requirements.equipment.filter(
        eq => !this.gameState.equipment[eq]?.owned
      );
      
      if (missingEquipment.length > 0) {
        return { 
          canStart: false, 
          reason: `Equipamento necessário: ${missingEquipment.join(', ')}` 
        };
      }
    }

    // Check if already completed (if it's a one-time experiment)
    if (experiment.once && this.gameState.completedExperiments.includes(experimentId)) {
      return { canStart: false, reason: 'Experimento já concluído' };
    }

    return { canStart: true, reason: '' };
  }

  getExperimentQuestions(experimentId) {
    return QUESTIONS[experimentId] || [];
  }

  calculateQuizResult(experimentId, answers) {
    const questions = this.getExperimentQuestions(experimentId);
    if (questions.length === 0) {
      return { passed: true, score: 100, correct: 0, total: 0 };
    }

    let correct = 0;
    let totalScore = 0;

    answers.forEach((answer, index) => {
      const question = questions[index];
      if (!question) return;

      if (answer.selected === question.correct) {
        correct++;
        totalScore += question.points || 10;
      }
    });

    const percentage = (correct / questions.length) * 100;
    const passed = percentage >= 70; // 70% minimum to pass

    return {
      passed,
      score: Math.round(percentage),
      correct,
      total: questions.length,
      totalScore,
    };
  }

  calculateMinigameResult(experimentId, performanceScore) {
    const experiment = EXPERIMENTS[experimentId];
    if (!experiment) return { success: false, score: 0 };

    // Base success chance
    let successChance = 0.7; // 70% base

    // Equipment bonuses
    if (experiment.requirements.equipment) {
      experiment.requirements.equipment.forEach(eqId => {
        const equip = this.gameState.equipment[eqId];
        if (equip?.owned) {
          successChance += 0.05 * (equip.level || 1);
        }
      });
    }

    // Performance multiplier
    successChance *= performanceScore;

    // Add some randomness
    successChance *= (0.9 + Math.random() * 0.2); // ±10% variation

    const success = Math.random() < Math.min(successChance, 0.95);
    const score = Math.round(performanceScore * 100);

    return { success, score };
  }

  calculateExperimentRewards(experimentId, quizResult, minigameResult) {
    const experiment = EXPERIMENTS[experimentId];
    if (!experiment) return {};

    const baseRewards = { ...experiment.rewards };
    let performanceMultiplier = 1;

    // Apply quiz performance bonus
    if (quizResult) {
      const quizBonus = quizResult.score / 100; // 0 to 1
      performanceMultiplier *= (0.8 + quizBonus * 0.4); // 0.8x to 1.2x
    }

    // Apply minigame performance bonus
    if (minigameResult) {
      const minigameBonus = minigameResult.score / 100; // 0 to 1
      performanceMultiplier *= (0.7 + minigameBonus * 0.6); // 0.7x to 1.3x
    }

    // Apply reputation bonus
    const reputationBonus = this.gameState.reputation / 100; // 0 to 1
    performanceMultiplier *= (0.9 + reputationBonus * 0.2); // 0.9x to 1.1x

    // Apply equipment bonuses
    let equipmentBonus = 1;
    if (experiment.requirements.equipment) {
      experiment.requirements.equipment.forEach(eqId => {
        const equip = this.gameState.equipment[eqId];
        if (equip?.owned) {
          equipmentBonus += 0.1 * (equip.level || 1);
        }
      });
    }

    // Calculate final rewards
    const finalRewards = {};
    Object.keys(baseRewards).forEach(key => {
      if (typeof baseRewards[key] === 'number') {
        let value = baseRewards[key];
        value *= performanceMultiplier;
        value *= equipmentBonus;
        
        // Add random variation (±15%)
        const variation = 0.85 + Math.random() * 0.3;
        value *= variation;
        
        finalRewards[key] = Math.round(value);
      } else {
        finalRewards[key] = baseRewards[key];
      }
    });

    // Add experience based on difficulty
    const difficultyMultiplier = {
      'Fácil': 1,
      'Médio': 1.5,
      'Difícil': 2,
      'Expert': 3,
    };

    if (!finalRewards.experience && experiment.difficulty) {
      finalRewards.experience = Math.round(
        100 * (difficultyMultiplier[experiment.difficulty] || 1) * 
        performanceMultiplier
      );
    }

    return finalRewards;
  }

  getExperimentTime(experimentId) {
    const experiment = EXPERIMENTS[experimentId];
    if (!experiment) return 0;

    let time = experiment.duration || 180; // Default 3 minutes

    // Equipment time reduction
    if (experiment.requirements.equipment) {
      experiment.requirements.equipment.forEach(eqId => {
        const equip = this.gameState.equipment[eqId];
        if (equip?.owned) {
          time *= (1 - (0.05 * (equip.level || 1))); // 5% reduction per level
        }
      });
    }

    return Math.max(30, Math.round(time)); // Minimum 30 seconds
  }

  getExperimentDifficulty(experimentId) {
    const experiment = EXPERIMENTS[experimentId];
    if (!experiment) return 'Fácil';

    const baseDifficulty = experiment.difficulty || 'Fácil';
    
    // Adjust based on player stats
    let adjustment = 0;
    
    // Higher knowledge makes experiments easier
    if (this.gameState.knowledge > 1000) adjustment -= 0.5;
    if (this.gameState.knowledge > 5000) adjustment -= 1;
    
    // Missing equipment makes experiments harder
    if (experiment.requirements.equipment) {
      const missing = experiment.requirements.equipment.filter(
        eq => !this.gameState.equipment[eq]?.owned
      ).length;
      adjustment += missing * 0.5;
    }
    
    // Convert to final difficulty
    const difficultyLevels = ['Fácil', 'Médio', 'Difícil', 'Expert'];
    const baseIndex = difficultyLevels.indexOf(baseDifficulty);
    const finalIndex = Math.max(0, Math.min(3, baseIndex + adjustment));
    
    return difficultyLevels[Math.round(finalIndex)];
  }

  getExperimentTips(experimentId) {
    const tips = {
      'culture_growth': [
        'Mantenha o pH entre 6.5 e 7.5 para crescimento ideal',
        'Controle a temperatura em 37°C para maioria das bactérias',
        'Combine nutrientes do mesmo tipo para bônus extra',
      ],
      'pcr_amplification': [
        'A temperatura de desnaturação deve ser 95°C',
        'O anelamento ocorre em torno de 55°C',
        'A extensão acontece a 72°C',
        'Ciclos precisos aumentam a quantidade de DNA',
      ],
      'dna_sequencing': [
        'A sequência complementar é importante',
        'Verifique as ligações A-T e C-G',
        'Erros podem causar mutações',
      ],
      'fermentation': [
        'Mantenha o oxigênio em 30% para aerobiose',
        'Controle o pH para evitar acidificação',
        'Agitação adequada aumenta o rendimento',
      ],
      'crispr_editing': [
        'O corte ocorre próximo à sequência PAM (NGG)',
        'Precisão é crucial para evitar cortes off-target',
        'O gRNA deve ser complementar ao DNA alvo',
      ],
    };
    
    return tips[experimentId] || [
      'Leia atentamente as instruções',
      'Verifique todos os requisitos antes de começar',
      'Pratique para melhorar sua precisão',
    ];
  }

  validateExperimentSetup(experimentId, setup) {
    const experiment = EXPERIMENTS[experimentId];
    if (!experiment) return { valid: false, errors: ['Experimento não encontrado'] };

    const errors = [];

    // Check required parameters
    if (experiment.parameters) {
      Object.entries(experiment.parameters).forEach(([key, value]) => {
        if (value.required && !setup[key]) {
          errors.push(`Parâmetro obrigatório faltando: ${key}`);
        }
      });
    }

    // Validate values
    if (setup.temperature && (setup.temperature < 20 || setup.temperature > 100)) {
      errors.push('Temperatura fora do intervalo permitido (20-100°C)');
    }

    if (setup.ph && (setup.ph < 4 || setup.ph > 10)) {
      errors.push('pH fora do intervalo permitido (4-10)');
    }

    if (setup.time && setup.time < 30) {
      errors.push('Tempo mínimo de 30 segundos necessário');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}