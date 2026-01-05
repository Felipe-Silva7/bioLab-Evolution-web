import { GAME_CONFIG } from './constants';

export const Calculations = {
  // Knowledge calculations
  calculateKnowledgeGain(baseGain, multipliers = {}) {
    let gain = baseGain;
    
    // Apply equipment multipliers
    if (multipliers.equipment) {
      gain *= multipliers.equipment;
    }
    
    // Apply level multiplier (1% per level)
    if (multipliers.level) {
      gain *= (1 + (multipliers.level * 0.01));
    }
    
    // Apply reputation multiplier (up to 50% bonus at 100 reputation)
    if (multipliers.reputation) {
      gain *= (1 + (multipliers.reputation / 200));
    }
    
    // Apply random variation (±10%)
    const variation = 0.9 + (Math.random() * 0.2);
    gain *= variation;
    
    return Math.round(gain);
  },
  
  // Experience calculations
  calculateExperience(activity, baseXP, modifiers = {}) {
    let xp = baseXP;
    
    // Activity type multipliers
    const activityMultipliers = {
      experiment: 1.0,
      quiz: 0.5,
      purchase: 0.2,
      upgrade: 0.3,
      achievement: 2.0,
      daily: 1.5,
    };
    
    xp *= (activityMultipliers[activity] || 1);
    
    // Level scaling (higher levels get less XP)
    if (modifiers.level) {
      const levelPenalty = Math.max(0.5, 1 - (modifiers.level * 0.01));
      xp *= levelPenalty;
    }
    
    // Equipment bonuses
    if (modifiers.equipmentBonus) {
      xp *= (1 + modifiers.equipmentBonus);
    }
    
    // Performance bonus (0.5 to 1.5)
    if (modifiers.performance) {
      xp *= (0.5 + modifiers.performance);
    }
    
    return Math.round(xp);
  },
  
  // Level calculations
  calculateLevel(experience) {
    return Math.floor(experience / GAME_CONFIG.xpPerLevel) + 1;
  },
  
  calculateExperienceToNextLevel(experience) {
    const currentLevel = this.calculateLevel(experience);
    const experienceForCurrentLevel = (currentLevel - 1) * GAME_CONFIG.xpPerLevel;
    const experienceForNextLevel = currentLevel * GAME_CONFIG.xpPerLevel;
    
    return {
      current: experience - experienceForCurrentLevel,
      required: experienceForNextLevel - experienceForCurrentLevel,
      percentage: ((experience - experienceForCurrentLevel) / 
                  (experienceForNextLevel - experienceForCurrentLevel)) * 100
    };
  },
  
  // Equipment calculations
  calculateEquipmentCost(baseCost, ownedCount, level = 0) {
    if (GAME_CONFIG.godMode) {
      return 1;
    }
    const ownedMultiplier = Math.pow(GAME_CONFIG.costMultiplier, ownedCount);
    const levelMultiplier = Math.pow(1.25, level);
    let cost = baseCost * ownedMultiplier * levelMultiplier;
    
    // Round to nice numbers
    if (cost < 100) {
      cost = Math.ceil(cost / 5) * 5;
    } else if (cost < 1000) {
      cost = Math.ceil(cost / 10) * 10;
    } else {
      cost = Math.ceil(cost / 100) * 100;
    }
    
    return Math.round(cost);
  },
  
  calculateUpgradeCost(baseCost, currentLevel) {
    const multiplier = Math.pow(1.5, currentLevel);
    let cost = baseCost * multiplier;
    
    // Round to nice numbers
    if (cost < 1000) {
      cost = Math.ceil(cost / 50) * 50;
    } else {
      cost = Math.ceil(cost / 100) * 100;
    }
    
    return Math.round(cost);
  },
  
  calculateEquipmentBonus(equipment, bonusType) {
    let totalBonus = 0;
    
    if (equipment && typeof equipment === 'object') {
      Object.values(equipment).forEach(eq => {
        if (eq.owned && eq.level && eq[bonusType]) {
          totalBonus += eq[bonusType] * eq.level;
        }
      });
    }
    
    return totalBonus;
  },
  
  // Experiment calculations
  calculateExperimentDuration(baseDuration, equipmentBonus = 0) {
    let duration = baseDuration;
    
    // Equipment time reduction
    duration *= (1 - equipmentBonus);
    
    // Ensure minimum duration
    duration = Math.max(30, Math.round(duration));
    
    return duration;
  },
  
  calculateExperimentSuccess(baseSuccess, modifiers = {}) {
    let success = baseSuccess;
    
    // Knowledge bonus (up to +20%)
    if (modifiers.knowledge) {
      success += Math.min(0.2, modifiers.knowledge / 10000);
    }
    
    // Equipment bonus
    if (modifiers.equipmentBonus) {
      success += modifiers.equipmentBonus;
    }
    
    // Experience bonus (up to +15%)
    if (modifiers.experience) {
      success += Math.min(0.15, modifiers.experience * 0.01);
    }
    
    // Ensure reasonable bounds
    success = Math.max(0.1, Math.min(0.95, success));
    
    return success;
  },
  
  calculateExperimentRewards(baseRewards, successRate, performance = 1) {
    const rewards = { ...baseRewards };
    
    // Apply success rate
    Object.keys(rewards).forEach(key => {
      if (typeof rewards[key] === 'number') {
        rewards[key] *= successRate;
      }
    });
    
    // Apply performance multiplier (0.5 to 1.5)
    Object.keys(rewards).forEach(key => {
      if (typeof rewards[key] === 'number') {
        rewards[key] *= (0.5 + (performance * 0.5));
      }
    });
    
    // Round all numeric values
    Object.keys(rewards).forEach(key => {
      if (typeof rewards[key] === 'number') {
        rewards[key] = Math.round(rewards[key]);
      }
    });
    
    return rewards;
  },
  
  // Quiz calculations
  calculateQuizScore(correctAnswers, totalQuestions, timeBonus = 0) {
    const baseScore = (correctAnswers / totalQuestions) * 100;
    
    // Time bonus (up to 20% extra)
    const bonus = baseScore * (timeBonus * 0.2);
    
    const finalScore = Math.min(100, baseScore + bonus);
    
    return {
      baseScore,
      bonus,
      finalScore: Math.round(finalScore),
      passed: finalScore >= 70
    };
  },
  
  calculateTimeBonus(timeUsed, maxTime) {
    if (timeUsed <= 0 || maxTime <= 0) return 0;
    
    const timeRatio = timeUsed / maxTime;
    // Faster = higher bonus (linear from 1.0 to 0.0)
    const bonus = Math.max(0, 1 - timeRatio);
    
    return bonus;
  },
  
  // Passive income calculations
  calculatePassiveIncome(gameState, timeDelta) {
    let knowledgePerSecond = 0.1;
    let fundingPerSecond = 0.05;
    
    // Equipment bonuses
    if (gameState.equipment) {
      Object.values(gameState.equipment).forEach(eq => {
        if (eq.owned) {
          if (eq.passiveKnowledge) {
            knowledgePerSecond += eq.passiveKnowledge * (eq.level || 1);
          }
          if (eq.passiveFunding) {
            fundingPerSecond += eq.passiveFunding * (eq.level || 1);
          }
        }
      });
    }
    
    // Level bonus
    knowledgePerSecond *= (1 + (gameState.level * 0.005));
    fundingPerSecond *= (1 + (gameState.level * 0.005));
    
    // Reputation bonus
    const repBonus = gameState.reputation / 500;
    knowledgePerSecond *= (1 + repBonus);
    fundingPerSecond *= (1 + repBonus);
    
    // Calculate actual gains
    const knowledgeGain = knowledgePerSecond * timeDelta;
    const fundingGain = fundingPerSecond * timeDelta;
    
    return {
      knowledgeGain,
      fundingGain,
      perSecond: {
        knowledge: knowledgePerSecond,
        funding: fundingPerSecond
      }
    };
  },
  
  // Stat calculations
  calculateAccuracy(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  },
  
  calculateEfficiency(completed, attempted) {
    if (attempted === 0) return 0;
    return Math.round((completed / attempted) * 100);
  },
  
  calculateProgress(current, target) {
    if (target === 0) return 100;
    return Math.min(100, Math.round((current / target) * 100));
  },
  
  // Game economy calculations
  calculateReturnOnInvestment(investment, returns) {
    if (investment === 0) return 0;
    return Math.round(((returns - investment) / investment) * 100);
  },
  
  calculateTimeToAfford(cost, incomePerSecond) {
    if (incomePerSecond <= 0) return Infinity;
    return Math.ceil(cost / incomePerSecond);
  },
  
  // Utility calculations
  interpolate(start, end, progress) {
    return start + (end - start) * Math.min(1, Math.max(0, progress));
  },
  
  exponentialGrowth(base, rate, time) {
    return base * Math.pow(1 + rate, time);
  },
  
  logisticGrowth(max, growthRate, midpoint, time) {
    return max / (1 + Math.exp(-growthRate * (time - midpoint)));
  }
};
