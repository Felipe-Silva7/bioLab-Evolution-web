import { GAME_CONFIG } from '../../utils/constants';

export class AchievementSystem {
  constructor(gameState) {
    this.gameState = gameState;
    this.achievements = this.loadAchievements();
  }

  loadAchievements() {
    return {
      // Knowledge achievements
      'first_steps': {
        id: 'first_steps',
        name: 'Primeiros Passos',
        description: 'Alcance 100 pontos de conhecimento',
        icon: '🧠',
        tier: 'bronze',
        condition: (state) => state.knowledge >= 100,
        reward: { knowledge: 50, funding: 100 },
      },
      'knowledgeable': {
        id: 'knowledgeable',
        name: 'Conhecedor',
        description: 'Alcance 1.000 pontos de conhecimento',
        icon: '📚',
        tier: 'silver',
        condition: (state) => state.knowledge >= 1000,
        reward: { knowledge: 200, reputation: 10 },
      },
      'expert': {
        id: 'expert',
        name: 'Especialista',
        description: 'Alcance 5.000 pontos de conhecimento',
        icon: '🎓',
        tier: 'gold',
        condition: (state) => state.knowledge >= 5000,
        reward: { knowledge: 500, funding: 1000, reputation: 20 },
      },
      'genius': {
        id: 'genius',
        name: 'Gênio',
        description: 'Alcance 10.000 pontos de conhecimento',
        icon: '⚛️',
        tier: 'platinum',
        condition: (state) => state.knowledge >= 10000,
        reward: { knowledge: 1000, funding: 5000, reputation: 50 },
      },

      // Experiment achievements
      'first_experiment': {
        id: 'first_experiment',
        name: 'Primeiro Experimento',
        description: 'Complete seu primeiro experimento',
        icon: '🧪',
        tier: 'bronze',
        condition: (state) => state.completedExperiments.length >= 1,
        reward: { knowledge: 100, funding: 200 },
      },
      'lab_rat': {
        id: 'lab_rat',
        name: 'Rato de Laboratório',
        description: 'Complete 10 experimentos',
        icon: '🐁',
        tier: 'silver',
        condition: (state) => state.completedExperiments.length >= 10,
        reward: { knowledge: 300, funding: 500, reputation: 15 },
      },
      'research_leader': {
        id: 'research_leader',
        name: 'Líder de Pesquisa',
        description: 'Complete 25 experimentos',
        icon: '👨‍🔬',
        tier: 'gold',
        condition: (state) => state.completedExperiments.length >= 25,
        reward: { knowledge: 1000, funding: 2000, reputation: 30 },
      },

      // Equipment achievements
      'equipment_collector': {
        id: 'equipment_collector',
        name: 'Colecionador de Equipamentos',
        description: 'Possua 5 equipamentos diferentes',
        icon: '⚙️',
        tier: 'silver',
        condition: (state) => {
          const owned = Object.values(state.equipment).filter(eq => eq.owned);
          return owned.length >= 5;
        },
        reward: { knowledge: 400, funding: 1000 },
      },
      'fully_equipped': {
        id: 'fully_equipped',
        name: 'Totalmente Equipado',
        description: 'Possua todos os equipamentos',
        icon: '🏭',
        tier: 'platinum',
        condition: (state) => {
          const owned = Object.values(state.equipment).filter(eq => eq.owned);
          return owned.length >= 8; // Assuming 8 total equipment
        },
        reward: { knowledge: 2000, funding: 5000, reputation: 40 },
      },

      // Quiz achievements
      'quick_learner': {
        id: 'quick_learner',
        name: 'Aprendiz Rápido',
        description: 'Responda 10 perguntas corretamente',
        icon: '⚡',
        tier: 'bronze',
        condition: (state) => state.stats.questionsCorrect >= 10,
        reward: { knowledge: 150, reputation: 5 },
      },
      'quiz_master': {
        id: 'quiz_master',
        name: 'Mestre do Quiz',
        description: 'Mantenha 90% de taxa de acerto em 50 perguntas',
        icon: '🏆',
        tier: 'gold',
        condition: (state) => 
          state.stats.questionsAnswered >= 50 &&
          (state.stats.questionsCorrect / state.stats.questionsAnswered) >= 0.9,
        reward: { knowledge: 800, funding: 1500, reputation: 25 },
      },

      // Special achievements
      'perfect_experiment': {
        id: 'perfect_experiment',
        name: 'Perfeição Científica',
        description: 'Complete um experimento com 100% de precisão',
        icon: '⭐',
        tier: 'gold',
        condition: (state) => state.stats.perfectExperiments >= 1,
        reward: { knowledge: 500, reputation: 20 },
      },
      'ethical_scientist': {
        id: 'ethical_scientist',
        name: 'Cientista Ético',
        description: 'Mantenha score ético acima de 90%',
        icon: '⚖️',
        tier: 'silver',
        condition: (state) => state.ethicsScore >= 90,
        reward: { reputation: 30, funding: 1000 },
      },
      'renowned_researcher': {
        id: 'renowned_researcher',
        name: 'Pesquisador Renomado',
        description: 'Alcance 100% de reputação',
        icon: '🌟',
        tier: 'platinum',
        condition: (state) => state.reputation >= 100,
        reward: { knowledge: 1500, funding: 3000 },
      },

      // Time-based achievements
      'dedicated_scientist': {
        id: 'dedicated_scientist',
        name: 'Cientista Dedicado',
        description: 'Jogue por mais de 1 hora',
        icon: '⏱️',
        tier: 'bronze',
        condition: (state) => state.stats.playtime >= 3600,
        reward: { knowledge: 300, funding: 500 },
      },
      'lab_marathon': {
        id: 'lab_marathon',
        name: 'Maratona no Laboratório',
        description: 'Jogue por mais de 10 horas',
        icon: '🏃',
        tier: 'gold',
        condition: (state) => state.stats.playtime >= 36000,
        reward: { knowledge: 2000, funding: 4000, reputation: 30 },
      },
    };
  }

  checkAchievements() {
    const unlocked = [];
    const rewards = { knowledge: 0, funding: 0, reputation: 0 };

    Object.values(this.achievements).forEach(achievement => {
      // Skip if already unlocked (you'd track this in game state)
      if (this.gameState.unlockedAchievements?.includes(achievement.id)) {
        return;
      }

      if (achievement.condition(this.gameState)) {
        unlocked.push(achievement.id);
        
        // Add rewards
        if (achievement.reward.knowledge) {
          rewards.knowledge += achievement.reward.knowledge;
        }
        if (achievement.reward.funding) {
          rewards.funding += achievement.reward.funding;
        }
        if (achievement.reward.reputation) {
          rewards.reputation += achievement.reward.reputation;
        }
      }
    });

    return { unlocked, rewards };
  }

  getProgress(achievementId) {
    const achievement = this.achievements[achievementId];
    if (!achievement) return { progress: 0, total: 0 };

    // For numeric achievements, calculate progress
    if (achievementId === 'first_steps' || achievementId === 'knowledgeable' || 
        achievementId === 'expert' || achievementId === 'genius') {
      const targets = { first_steps: 100, knowledgeable: 1000, expert: 5000, genius: 10000 };
      const current = this.gameState.knowledge;
      const target = targets[achievementId];
      return { progress: Math.min(current, target), total: target };
    }

    if (achievementId === 'first_experiment' || achievementId === 'lab_rat' || 
        achievementId === 'research_leader') {
      const targets = { first_experiment: 1, lab_rat: 10, research_leader: 25 };
      const current = this.gameState.completedExperiments.length;
      const target = targets[achievementId];
      return { progress: Math.min(current, target), total: target };
    }

    if (achievementId === 'quick_learner' || achievementId === 'quiz_master') {
      const targets = { quick_learner: 10, quiz_master: 50 };
      const current = this.gameState.stats.questionsCorrect;
      const target = targets[achievementId];
      return { progress: Math.min(current, target), total: target };
    }

    if (achievementId === 'dedicated_scientist' || achievementId === 'lab_marathon') {
      const targets = { dedicated_scientist: 3600, lab_marathon: 36000 };
      const current = this.gameState.stats.playtime;
      const target = targets[achievementId];
      return { progress: Math.min(current, target), total: target };
    }

    // For boolean achievements
    return { progress: achievement.condition(this.gameState) ? 1 : 0, total: 1 };
  }

  getAchievementInfo(achievementId) {
    const achievement = this.achievements[achievementId];
    if (!achievement) return null;

    const progress = this.getProgress(achievementId);
    const isUnlocked = this.gameState.unlockedAchievements?.includes(achievementId) || false;

    return {
      ...achievement,
      progress: progress.progress,
      total: progress.total,
      percentage: Math.min(100, (progress.progress / progress.total) * 100),
      unlocked: isUnlocked,
    };
  }

  getAllAchievements() {
    return Object.values(this.achievements).map(achievement => 
      this.getAchievementInfo(achievement.id)
    );
  }

  getAchievementsByTier() {
    const byTier = {
      bronze: [],
      silver: [],
      gold: [],
      platinum: [],
    };

    this.getAllAchievements().forEach(achievement => {
      if (achievement && byTier[achievement.tier]) {
        byTier[achievement.tier].push(achievement);
      }
    });

    return byTier;
  }

  getUnlockedCount() {
    const allAchievements = this.getAllAchievements();
    return allAchievements.filter(a => a.unlocked).length;
  }

  getTotalCount() {
    return Object.keys(this.achievements).length;
  }

  getCompletionRate() {
    const unlocked = this.getUnlockedCount();
    const total = this.getTotalCount();
    return total > 0 ? Math.round((unlocked / total) * 100) : 0;
  }

  getNextAchievements(limit = 5) {
    const allAchievements = this.getAllAchievements();
    const notUnlocked = allAchievements
      .filter(a => !a.unlocked)
      .sort((a, b) => b.percentage - a.percentage);
    
    return notUnlocked.slice(0, limit);
  }

  getRecentUnlocks(limit = 3) {
    // This would track timestamps in real implementation
    const allAchievements = this.getAllAchievements();
    const unlocked = allAchievements
      .filter(a => a.unlocked)
      .sort((a, b) => (b.unlockedAt || 0) - (a.unlockedAt || 0));
    
    return unlocked.slice(0, limit);
  }

  calculateTotalRewards() {
    const allAchievements = this.getAllAchievements();
    const unlocked = allAchievements.filter(a => a.unlocked);
    
    const totals = { knowledge: 0, funding: 0, reputation: 0 };
    
    unlocked.forEach(achievement => {
      const ach = this.achievements[achievement.id];
      if (ach?.reward) {
        if (ach.reward.knowledge) totals.knowledge += ach.reward.knowledge;
        if (ach.reward.funding) totals.funding += ach.reward.funding;
        if (ach.reward.reputation) totals.reputation += ach.reward.reputation;
      }
    });
    
    return totals;
  }
}