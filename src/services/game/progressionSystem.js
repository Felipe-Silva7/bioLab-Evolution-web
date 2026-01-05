import { EXPERIMENTS } from '../../utils/constants';

export class ProgressionSystem {
  constructor(gameState) {
    this.gameState = gameState;
  }

  getCurrentAct() {
    const totalKnowledge = this.gameState.knowledge;
    
    if (totalKnowledge >= 10000) return 4; // Nobel
    if (totalKnowledge >= 5000) return 3; // Empresário-Cientista
    if (totalKnowledge >= 2000) return 2; // Pesquisador
    return 1; // Estagiário
  }

  getAvailableExperiments() {
    const currentAct = this.getCurrentAct();
    const available = [];
    
    Object.values(EXPERIMENTS).forEach(experiment => {
      // Check if unlocked
      if (!this.gameState.unlockedExperiments.includes(experiment.id)) {
        return;
      }
      
      // Check knowledge requirements
      if (experiment.requirements.knowledge > this.gameState.knowledge) {
        return;
      }
      
      // Check equipment requirements
      if (experiment.requirements.equipment) {
        const hasEquipment = experiment.requirements.equipment.every(eq => 
          this.gameState.equipment[eq]?.owned
        );
        if (!hasEquipment) return;
      }
      
      // Check act requirements (simplified)
      const experimentAct = this.getExperimentAct(experiment.id);
      if (experimentAct > currentAct) return;
      
      available.push(experiment);
    });
    
    return available;
  }

  getExperimentAct(experimentId) {
    const actMapping = {
      'culture_growth': 1,
      'pcr_amplification': 2,
      'dna_sequencing': 2,
      'fermentation': 3,
      'crispr_editing': 4,
    };
    
    return actMapping[experimentId] || 1;
  }

  getNextMilestone() {
    const currentKnowledge = this.gameState.knowledge;
    const milestones = [
      { knowledge: 100, description: 'Primeira Patente' },
      { knowledge: 500, description: 'Laboratório Intermediário' },
      { knowledge: 1000, description: 'Equipe de Pesquisa' },
      { knowledge: 2000, description: 'Biorreator Industrial' },
      { knowledge: 5000, description: 'Prêmio de Inovação' },
      { knowledge: 10000, description: 'Prêmio Nobel' },
    ];
    
    return milestones.find(m => m.knowledge > currentKnowledge) || 
           { knowledge: Infinity, description: 'Conquista Máxima Alcançada' };
  }

  calculateMilestoneProgress() {
    const next = this.getNextMilestone();
    const current = this.gameState.knowledge;
    const progress = Math.min(100, (current / next.knowledge) * 100);
    
    return {
      current,
      target: next.knowledge,
      progress,
      description: next.description,
    };
  }

  getUnlockableContent() {
    const unlockables = [];
    const currentAct = this.getCurrentAct();
    
    // Check for new experiments to unlock
    Object.values(EXPERIMENTS).forEach(experiment => {
      if (this.gameState.unlockedExperiments.includes(experiment.id)) return;
      
      const canUnlock = 
        experiment.requirements.knowledge <= this.gameState.knowledge &&
        (!experiment.requirements.equipment || 
         experiment.requirements.equipment.every(eq => 
           this.gameState.equipment[eq]?.owned
         )) &&
        this.getExperimentAct(experiment.id) <= currentAct;
      
      if (canUnlock) {
        unlockables.push({
          type: 'experiment',
          id: experiment.id,
          name: experiment.name,
          requirements: experiment.requirements,
        });
      }
    });
    
    // Check for act progression
    const nextAct = currentAct + 1;
    if (nextAct <= 4) {
      const actRequirements = this.getActRequirements(nextAct);
      const hasRequirements = actRequirements.knowledge <= this.gameState.knowledge &&
                            actRequirements.experiments <= this.gameState.completedExperiments.length;
      
      if (hasRequirements) {
        unlockables.push({
          type: 'act',
          id: `act_${nextAct}`,
          name: `Ato ${nextAct}`,
          requirements: actRequirements,
        });
      }
    }
    
    return unlockables;
  }

  getActRequirements(act) {
    const requirements = {
      2: { knowledge: 2000, experiments: 5 },
      3: { knowledge: 5000, experiments: 15 },
      4: { knowledge: 10000, experiments: 30 },
    };
    
    return requirements[act] || { knowledge: 0, experiments: 0 };
  }

  getSkillTree() {
    const skills = {
      microbiology: {
        name: 'Microbiologia',
        level: this.calculateSkillLevel('microbiology'),
        xp: this.getSkillXP('microbiology'),
        nextLevelXP: 1000,
        bonuses: ['+10% cultivo', '+5% rendimento fermentação'],
      },
      molecularBiology: {
        name: 'Biologia Molecular',
        level: this.calculateSkillLevel('molecularBiology'),
        xp: this.getSkillXP('molecularBiology'),
        nextLevelXP: 1000,
        bonuses: ['+15% PCR', '+10% sequenciamento'],
      },
      fermentation: {
        name: 'Fermentação',
        level: this.calculateSkillLevel('fermentation'),
        xp: this.getSkillXP('fermentation'),
        nextLevelXP: 1000,
        bonuses: ['+20% produção', '-10% contaminação'],
      },
      bioinformatics: {
        name: 'Bioinformática',
        level: this.calculateSkillLevel('bioinformatics'),
        xp: this.getSkillXP('bioinformatics'),
        nextLevelXP: 1000,
        bonuses: ['+25% análise DNA', '+15% precisão CRISPR'],
      },
    };
    
    return skills;
  }

  calculateSkillLevel(skill) {
    const completedExperiments = this.gameState.completedExperiments;
    let xp = 0;
    
    completedExperiments.forEach(expId => {
      const experiment = EXPERIMENTS[expId];
      if (!experiment) return;
      
      // Assign XP based on experiment type
      switch (experiment.type) {
        case 'match3': // Culture growth
          if (skill === 'microbiology') xp += 100;
          break;
        case 'timing': // PCR
          if (skill === 'molecularBiology') xp += 150;
          break;
        case 'puzzle': // DNA sequencing
          if (skill === 'molecularBiology') xp += 100;
          if (skill === 'bioinformatics') xp += 50;
          break;
        case 'management': // Fermentation
          if (skill === 'fermentation') xp += 200;
          break;
        case 'precision': // CRISPR
          if (skill === 'molecularBiology') xp += 100;
          if (skill === 'bioinformatics') xp += 150;
          break;
      }
    });
    
    return Math.floor(xp / 1000) + 1;
  }

  getSkillXP(skill) {
    const completedExperiments = this.gameState.completedExperiments;
    let xp = 0;
    
    completedExperiments.forEach(expId => {
      const experiment = EXPERIMENTS[expId];
      if (!experiment) return;
      
      // Assign XP based on experiment type
      switch (experiment.type) {
        case 'match3': // Culture growth
          if (skill === 'microbiology') xp += 100;
          break;
        case 'timing': // PCR
          if (skill === 'molecularBiology') xp += 150;
          break;
        case 'puzzle': // DNA sequencing
          if (skill === 'molecularBiology') xp += 100;
          if (skill === 'bioinformatics') xp += 50;
          break;
        case 'management': // Fermentation
          if (skill === 'fermentation') xp += 200;
          break;
        case 'precision': // CRISPR
          if (skill === 'molecularBiology') xp += 100;
          if (skill === 'bioinformatics') xp += 150;
          break;
      }
    });
    
    return xp % 1000;
  }

  getTotalProgress() {
    const totalExperiments = Object.keys(EXPERIMENTS).length;
    const completed = this.gameState.completedExperiments.length;
    const knowledge = this.gameState.knowledge;
    const maxKnowledge = 15000; // Maximum knowledge for 100%
    
    const experimentProgress = (completed / totalExperiments) * 40; // 40% weight
    const knowledgeProgress = (knowledge / maxKnowledge) * 40; // 40% weight
    const equipmentProgress = this.calculateEquipmentProgress() * 20; // 20% weight
    
    const total = experimentProgress + knowledgeProgress + equipmentProgress;
    
    return {
      total: Math.min(100, total),
      breakdown: {
        experiments: experimentProgress,
        knowledge: knowledgeProgress,
        equipment: equipmentProgress,
      },
      details: {
        experiments: `${completed}/${totalExperiments}`,
        knowledge: `${Math.round(knowledge)}/${maxKnowledge}`,
        equipment: `${this.countEquipment()}/10`, // Assuming 10 total equipment
      },
    };
  }

  calculateEquipmentProgress() {
    const totalEquipment = 10; // Total equipment slots
    const ownedEquipment = Object.values(this.gameState.equipment)
      .filter(eq => eq.owned)
      .length;
    
    return ownedEquipment / totalEquipment;
  }

  countEquipment() {
    return Object.values(this.gameState.equipment)
      .filter(eq => eq.owned)
      .length;
  }
}