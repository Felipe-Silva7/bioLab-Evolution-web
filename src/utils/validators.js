export const Validators = {
  // Game state validation
  validateGameState(gameState) {
    const errors = [];
    
    // Check required fields
    const requiredFields = ['knowledge', 'funding', 'reputation', 'experience', 'level'];
    requiredFields.forEach(field => {
      if (gameState[field] === undefined || gameState[field] === null) {
        errors.push(`Campo obrigatório faltando: ${field}`);
      }
    });
    
    // Validate ranges
    if (gameState.knowledge < 0) errors.push('Conhecimento não pode ser negativo');
    if (gameState.funding < 0) errors.push('Financiamento não pode ser negativo');
    if (gameState.reputation < 0 || gameState.reputation > 100) {
      errors.push('Reputação deve estar entre 0 e 100');
    }
    if (gameState.ethicsScore < 0 || gameState.ethicsScore > 100) {
      errors.push('Score ético deve estar entre 0 e 100');
    }
    if (gameState.level < 1) errors.push('Nível deve ser pelo menos 1');
    
    // Validate arrays
    if (!Array.isArray(gameState.completedExperiments)) {
      errors.push('completedExperiments deve ser um array');
    }
    if (!Array.isArray(gameState.unlockedExperiments)) {
      errors.push('unlockedExperiments deve ser um array');
    }
    
    // Validate equipment structure
    if (gameState.equipment && typeof gameState.equipment === 'object') {
      Object.values(gameState.equipment).forEach(equip => {
        if (equip && typeof equip === 'object') {
          if (equip.owned !== undefined && typeof equip.owned !== 'boolean') {
            errors.push('equip.owned deve ser booleano');
          }
          if (equip.level !== undefined && (equip.level < 0 || equip.level > 10)) {
            errors.push('equip.level deve estar entre 0 e 10');
          }
        }
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // Experiment validation
  validateExperiment(experiment) {
    const errors = [];
    
    if (!experiment.id) errors.push('ID do experimento é obrigatório');
    if (!experiment.name) errors.push('Nome do experimento é obrigatório');
    if (!experiment.type) errors.push('Tipo do experimento é obrigatório');
    
    if (experiment.duration && (experiment.duration < 30 || experiment.duration > 3600)) {
      errors.push('Duração deve estar entre 30 e 3600 segundos');
    }
    
    if (experiment.requirements) {
      if (experiment.requirements.knowledge && experiment.requirements.knowledge < 0) {
        errors.push('Requisito de conhecimento não pode ser negativo');
      }
    }
    
    if (experiment.rewards) {
      Object.entries(experiment.rewards).forEach(([key, value]) => {
        if (typeof value === 'number' && value < 0) {
          errors.push(`Recompensa ${key} não pode ser negativa`);
        }
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // Equipment validation
  validateEquipment(equipment) {
    const errors = [];
    
    if (!equipment.id) errors.push('ID do equipamento é obrigatório');
    if (!equipment.name) errors.push('Nome do equipamento é obrigatório');
    if (equipment.cost === undefined) errors.push('Custo do equipamento é obrigatório');
    
    if (equipment.cost < 0) errors.push('Custo não pode ser negativo');
    if (equipment.requiredLevel && equipment.requiredLevel < 1) {
      errors.push('Nível requerido deve ser pelo menos 1');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // Quiz question validation
  validateQuestion(question) {
    const errors = [];
    
    if (!question.id) errors.push('ID da pergunta é obrigatório');
    if (!question.question) errors.push('Texto da pergunta é obrigatório');
    if (!question.options || !Array.isArray(question.options)) {
      errors.push('Opções devem ser um array');
    }
    if (question.options && question.options.length < 2) {
      errors.push('Deve haver pelo menos 2 opções');
    }
    if (question.correct === undefined || question.correct === null) {
      errors.push('Resposta correta é obrigatória');
    }
    if (question.correct < 0 || question.correct >= (question.options?.length || 0)) {
      errors.push('Resposta correta fora do intervalo válido');
    }
    if (question.points && question.points < 0) {
      errors.push('Pontos não podem ser negativos');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },
  
  // User input validation
  validateUsername(username) {
    if (!username || username.trim().length === 0) {
      return { isValid: false, error: 'Nome de usuário é obrigatório' };
    }
    
    if (username.length < 3) {
      return { isValid: false, error: 'Nome deve ter pelo menos 3 caracteres' };
    }
    
    if (username.length > 20) {
      return { isValid: false, error: 'Nome deve ter no máximo 20 caracteres' };
    }
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { isValid: false, error: 'Use apenas letras, números e underscore' };
    }
    
    return { isValid: true };
  },
  
  validateEmail(email) {
    if (!email || email.trim().length === 0) {
      return { isValid: false, error: 'Email é obrigatório' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Email inválido' };
    }
    
    return { isValid: true };
  },
  
  validatePassword(password) {
    if (!password || password.length === 0) {
      return { isValid: false, error: 'Senha é obrigatória' };
    }
    
    if (password.length < 6) {
      return { isValid: false, error: 'Senha deve ter pelo menos 6 caracteres' };
    }
    
    return { isValid: true };
  },
  
  // Numeric validation
  validatePositiveNumber(value, fieldName = 'Valor') {
    if (value === undefined || value === null) {
      return { isValid: false, error: `${fieldName} é obrigatório` };
    }
    
    if (typeof value !== 'number') {
      return { isValid: false, error: `${fieldName} deve ser um número` };
    }
    
    if (value < 0) {
      return { isValid: false, error: `${fieldName} não pode ser negativo` };
    }
    
    return { isValid: true };
  },
  
  validatePercentage(value, fieldName = 'Porcentagem') {
    const numValidation = this.validatePositiveNumber(value, fieldName);
    if (!numValidation.isValid) return numValidation;
    
    if (value > 100) {
      return { isValid: false, error: `${fieldName} não pode exceder 100%` };
    }
    
    return { isValid: true };
  },
  
  // Game action validation
  validatePurchase(cost, availableFunding) {
    if (cost === undefined || cost === null) {
      return { isValid: false, error: 'Custo é obrigatório' };
    }
    
    if (availableFunding === undefined || availableFunding === null) {
      return { isValid: false, error: 'Financiamento disponível é obrigatório' };
    }
    
    if (cost < 0) {
      return { isValid: false, error: 'Custo não pode ser negativo' };
    }
    
    if (availableFunding < cost) {
      return { isValid: false, error: 'Financiamento insuficiente' };
    }
    
    return { isValid: true };
  },
  
  validateExperimentRequirements(requirements, gameState) {
    const errors = [];
    
    if (requirements.knowledge && gameState.knowledge < requirements.knowledge) {
      errors.push(`Requer ${requirements.knowledge} conhecimento`);
    }
    
    if (requirements.equipment && Array.isArray(requirements.equipment)) {
      requirements.equipment.forEach(eqId => {
        if (!gameState.equipment[eqId]?.owned) {
          errors.push(`Equipamento necessário: ${eqId}`);
        }
      });
    }
    
    if (requirements.reputation && gameState.reputation < requirements.reputation) {
      errors.push(`Requer ${requirements.reputation}% de reputação`);
    }
    
    if (requirements.level && gameState.level < requirements.level) {
      errors.push(`Requer nível ${requirements.level}`);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};