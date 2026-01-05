import { GAME_CONFIG } from '../../utils/constants';

export class GameEngine {
  constructor(gameState, updateCallback) {
    this.gameState = gameState;
    this.updateCallback = updateCallback;
    this.tickInterval = null;
    this.lastTick = Date.now();
    this.isRunning = false;
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastTick = Date.now();
    
    this.tickInterval = setInterval(() => {
      this.tick();
    }, GAME_CONFIG.tickRate);
  }

  stop() {
    if (!this.isRunning) return;

    this.isRunning = false;
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  tick() {
    const now = Date.now();
    const deltaTime = (now - this.lastTick) / 1000; // Convert to seconds
    this.lastTick = now;

    // Update playtime
    this.gameState.stats.playtime += deltaTime;

    // Process passive income
    this.processPassiveIncome(deltaTime);

    // Process equipment effects
    this.processEquipmentEffects(deltaTime);

    // Update callback
    this.updateCallback(this.gameState);
  }

  processPassiveIncome(deltaTime) {
    let passiveKnowledge = 0;
    let passiveFunding = 0;

    // Base passive income
    passiveKnowledge += 0.1 * deltaTime;
    passiveFunding += 0.05 * deltaTime;

    // Equipment bonuses
    const equipment = this.gameState.equipment;
    
    if (equipment.microscope?.owned) {
      passiveKnowledge += 0.2 * deltaTime * (equipment.microscope.level || 1);
    }
    
    if (equipment.incubator?.owned) {
      passiveKnowledge += 0.15 * deltaTime * (equipment.incubator.level || 1);
    }
    
    if (equipment.bioreactor?.owned) {
      passiveFunding += 0.1 * deltaTime * (equipment.bioreactor.level || 1);
    }

    // Apply passive income
    this.gameState.knowledge += passiveKnowledge;
    this.gameState.funding += passiveFunding;
  }

  processEquipmentEffects(deltaTime) {
    // Equipment degradation
    Object.keys(this.gameState.equipment).forEach(key => {
      const equip = this.gameState.equipment[key];
      if (equip.owned && equip.durability !== undefined) {
        // Decrease durability over time
        equip.durability = Math.max(0, equip.durability - (0.01 * deltaTime));
        
        // Efficiency decreases with lower durability
        if (equip.durability < 30) {
          // Apply penalty to equipment effectiveness
          const penalty = 1 - (equip.durability / 100);
          // This would affect calculations in other systems
        }
      }
    });
  }

  calculateExperimentSuccess(experiment, playerSkills) {
    const baseSuccess = 0.7; // 70% base chance
    
    // Equipment bonuses
    let equipmentBonus = 0;
    experiment.requirements.equipment?.forEach(eqId => {
      const equip = this.gameState.equipment[eqId];
      if (equip?.owned) {
        equipmentBonus += 0.1 * (equip.level || 1);
      }
    });

    // Skill bonuses based on completed experiments
    const completedSimilar = this.gameState.completedExperiments.filter(
      exp => exp.type === experiment.type
    ).length;
    const experienceBonus = Math.min(0.3, completedSimilar * 0.05);

    // Reputation bonus
    const reputationBonus = this.gameState.reputation / 200; // Up to 0.5

    const totalSuccess = Math.min(0.95, 
      baseSuccess + equipmentBonus + experienceBonus + reputationBonus
    );

    return totalSuccess;
  }

  calculateExperimentRewards(experiment, successRate, performanceScore = 1) {
    const baseRewards = { ...experiment.rewards };
    
    // Apply performance multiplier
    Object.keys(baseRewards).forEach(key => {
      if (typeof baseRewards[key] === 'number') {
        baseRewards[key] = Math.round(baseRewards[key] * performanceScore);
      }
    });

    // Equipment yield bonuses
    let yieldBonus = 1;
    experiment.requirements.equipment?.forEach(eqId => {
      const equip = this.gameState.equipment[eqId];
      if (equip?.owned) {
        yieldBonus += 0.1 * (equip.level || 1);
      }
    });

    // Apply yield bonus to numerical rewards
    Object.keys(baseRewards).forEach(key => {
      if (typeof baseRewards[key] === 'number') {
        baseRewards[key] = Math.round(baseRewards[key] * yieldBonus);
      }
    });

    // Add random variation (±10%)
    Object.keys(baseRewards).forEach(key => {
      if (typeof baseRewards[key] === 'number') {
        const variation = 0.9 + Math.random() * 0.2; // 0.9 to 1.1
        baseRewards[key] = Math.round(baseRewards[key] * variation);
      }
    });

    return baseRewards;
  }

  calculateLevelUp() {
    const xpPerLevel = GAME_CONFIG.xpPerLevel;
    const newLevel = Math.floor(this.gameState.experience / xpPerLevel) + 1;
    
    if (newLevel > this.gameState.level) {
      const levelsGained = newLevel - this.gameState.level;
      
      // Level up rewards
      const rewards = {
        knowledge: levelsGained * 100,
        funding: levelsGained * 500,
        reputation: Math.min(5 * levelsGained, 100 - this.gameState.reputation),
      };

      this.gameState.level = newLevel;
      return rewards;
    }

    return null;
  }

  getGameSpeed() {
    // Base speed is 1x
    let speed = 1;

    // Equipment bonuses to game speed
    if (this.gameState.equipment.sequencer?.owned) {
      speed += 0.1 * (this.gameState.equipment.sequencer.level || 1);
    }

    // Level-based speed bonus
    speed += (this.gameState.level - 1) * 0.01;

    return Math.min(speed, 2); // Cap at 2x speed
  }

  destroy() {
    this.stop();
    this.gameState = null;
    this.updateCallback = null;
  }
}