import { GAME_CONFIG } from '../../utils/constants';

export class GameBalancing {
  constructor() {
    this.baseValues = {
      knowledgePerClick: 1,
      knowledgePerSecond: 0.1,
      fundingPerKnowledge: 0.5,
      experienceMultiplier: 1,
      equipmentCostMultiplier: 1.15,
      upgradeCostMultiplier: 1.25,
    };
  }

  // Knowledge calculations
  calculateKnowledgeGain(baseGain, modifiers = {}) {
    let gain = baseGain;
    
    // Equipment modifiers
    if (modifiers.equipment) {
      modifiers.equipment.forEach(eq => {
        if (eq.knowledgeBonus) gain *= (1 + eq.knowledgeBonus);
      });
    }
    
    // Level modifier
    if (modifiers.level) {
      gain *= (1 + (modifiers.level * 0.01));
    }
    
    // Reputation modifier
    if (modifiers.reputation) {
      gain *= (1 + (modifiers.reputation / 200));
    }
    
    // Random variation (±10%)
    const variation = 0.9 + (Math.random() * 0.2);
    gain *= variation;
    
    return Math.round(gain);
  }

  // Funding calculations
  calculateFundingGain(knowledgeGained, modifiers = {}) {
    let conversionRate = this.baseValues.fundingPerKnowledge;
    
    // Equipment modifiers
    if (modifiers.equipment) {
      modifiers.equipment.forEach(eq => {
        if (eq.fundingBonus) conversionRate *= (1 + eq.fundingBonus);
      });
    }
    
    // Reputation modifier
    if (modifiers.reputation) {
      conversionRate *= (1 + (modifiers.reputation / 500));
    }
    
    const funding = knowledgeGained * conversionRate;
    return Math.round(funding);
  }

  // Experience calculations
  calculateExperienceGain(activity, baseXP, modifiers = {}) {
    let xp = baseXP;
    
    // Activity type multipliers
    const activityMultipliers = {
      experiment: 1.0,
      quiz: 0.5,
      purchase: 0.2,
      upgrade: 0.3,
      achievement: 2.0,
    };
    
    xp *= (activityMultipliers[activity] || 1);
    
    // Level modifier (higher levels get less XP)
    if (modifiers.level) {
      const levelPenalty = Math.max(0.5, 1 - (modifiers.level * 0.01));
      xp *= levelPenalty;
    }
    
    // Equipment modifiers
    if (modifiers.equipment) {
      modifiers.equipment.forEach(eq => {
        if (eq.experienceBonus) xp *= (1 + eq.experienceBonus);
      });
    }
    
    return Math.round(xp);
  }

  // Equipment cost calculations
  calculateEquipmentCost(baseCost, ownedCount, level = 0) {
    const multiplier = Math.pow(this.baseValues.equipmentCostMultiplier, ownedCount);
    const levelMultiplier = Math.pow(this.baseValues.upgradeCostMultiplier, level);
    
    let cost = baseCost * multiplier * levelMultiplier;
    
    // Round to nice numbers
    if (cost < 100) {
      cost = Math.ceil(cost / 5) * 5;
    } else if (cost < 1000) {
      cost = Math.ceil(cost / 10) * 10;
    } else {
      cost = Math.ceil(cost / 100) * 100;
    }
    
    return cost;
  }

  // Upgrade cost calculations
  calculateUpgradeCost(baseCost, currentLevel) {
    const multiplier = Math.pow(this.baseValues.upgradeCostMultiplier, currentLevel);
    let cost = baseCost * multiplier;
    
    // Round to nice numbers
    if (cost < 100) {
      cost = Math.ceil(cost / 5) * 5;
    } else if (cost < 1000) {
      cost = Math.ceil(cost / 10) * 10;
    } else {
      cost = Math.ceil(cost / 100) * 100;
    }
    
    return cost;
  }

  // Experiment difficulty scaling
  calculateDifficultyScaling(baseDifficulty, playerLevel, completedSimilar) {
    let difficulty = baseDifficulty;
    
    // Scale with player level
    difficulty *= (1 + (playerLevel * 0.02));
    
    // Reduce difficulty with experience
    difficulty *= Math.max(0.5, 1 - (completedSimilar * 0.05));
    
    // Ensure minimum difficulty
    difficulty = Math.max(0.5, Math.min(3, difficulty));
    
    return difficulty;
  }

  // Reward scaling
  calculateRewardScaling(baseReward, difficulty, performance) {
    let reward = baseReward;
    
    // Difficulty multiplier
    const difficultyMultipliers = {
      'Fácil': 1.0,
      'Médio': 1.5,
      'Difícil': 2.0,
      'Expert': 3.0,
    };
    
    reward *= (difficultyMultipliers[difficulty] || 1);
    
    // Performance multiplier (0.5 to 1.5)
    reward *= (0.5 + performance);
    
    return Math.round(reward);
  }

  // Time scaling for experiments
  calculateTimeScaling(baseTime, playerLevel, equipmentBonus = 0) {
    let time = baseTime;
    
    // Reduce time with level
    time *= Math.max(0.3, 1 - (playerLevel * 0.01));
    
    // Equipment time reduction
    time *= (1 - equipmentBonus);
    
    // Ensure minimum time
    time = Math.max(30, Math.round(time));
    
    return time;
  }

  // Success chance calculation
  calculateSuccessChance(baseChance, playerStats, equipmentBonus = 0) {
    let chance = baseChance;
    
    // Knowledge bonus (up to +20%)
    chance += Math.min(0.2, playerStats.knowledge / 10000);
    
    // Reputation bonus (up to +10%)
    chance += playerStats.reputation / 1000;
    
    // Equipment bonus
    chance += equipmentBonus;
    
    // Completed experiments bonus (up to +15%)
    chance += Math.min(0.15, playerStats.completedExperiments * 0.01);
    
    // Ensure reasonable bounds
    chance = Math.max(0.1, Math.min(0.95, chance));
    
    return chance;
  }

  // Level requirements
  calculateLevelRequirement(level) {
    return GAME_CONFIG.xpPerLevel * level;
  }

  // Act progression requirements
  calculateActRequirements(act) {
    const requirements = {
      1: { knowledge: 0, experiments: 0, reputation: 0 },
      2: { knowledge: 2000, experiments: 5, reputation: 30 },
      3: { knowledge: 5000, experiments: 15, reputation: 60 },
      4: { knowledge: 10000, experiments: 30, reputation: 85 },
    };
    
    return requirements[act] || requirements[4];
  }

  // Shop item unlocking
  calculateUnlockLevel(itemTier) {
    const tierLevels = {
      basic: 1,
      common: 5,
      rare: 10,
      epic: 15,
      legendary: 20,
    };
    
    return tierLevels[itemTier] || 1;
  }

  // Passive income calculations
  calculatePassiveIncome(gameState) {
    let knowledgePerSecond = this.baseValues.knowledgePerSecond;
    let fundingPerSecond = 0;
    
    // Equipment bonuses
    Object.values(gameState.equipment).forEach(equip => {
      if (equip.owned) {
        if (equip.passiveKnowledge) {
          knowledgePerSecond += equip.passiveKnowledge * (equip.level || 1);
        }
        if (equip.passiveFunding) {
          fundingPerSecond += equip.passiveFunding * (equip.level || 1);
        }
      }
    });
    
    // Level bonus
    knowledgePerSecond *= (1 + (gameState.level * 0.005));
    
    // Reputation bonus
    const repBonus = gameState.reputation / 500;
    knowledgePerSecond *= (1 + repBonus);
    fundingPerSecond *= (1 + repBonus);
    
    return {
      knowledgePerSecond,
      fundingPerSecond,
      knowledgePerMinute: knowledgePerSecond * 60,
      fundingPerMinute: fundingPerSecond * 60,
    };
  }

  // Achievement requirements scaling
  calculateAchievementRequirements(achievementTier, index) {
    const tierMultipliers = {
      bronze: 1,
      silver: 3,
      gold: 10,
      platinum: 30,
    };
    
    const base = 100;
    const multiplier = tierMultipliers[achievementTier] || 1;
    
    return base * multiplier * (1 + (index * 0.5));
  }

  // Game speed balancing
  calculateGameSpeed(gameState) {
    let speed = 1.0;
    
    // Equipment speed bonuses
    if (gameState.equipment.sequencer?.owned) {
      speed += 0.1 * (gameState.equipment.sequencer.level || 1);
    }
    
    // Level speed bonus
    speed += (gameState.level - 1) * 0.005;
    
    // Cap maximum speed
    speed = Math.min(2.0, Math.max(0.5, speed));
    
    return speed;
  }
}