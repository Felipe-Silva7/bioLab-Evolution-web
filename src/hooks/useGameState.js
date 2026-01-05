import { useCallback } from 'react';
import { useGame } from '../contexts/GameContext';

export const useGameState = () => {
  const { gameState, dispatch } = useGame();

  const addKnowledge = useCallback((amount) => {
    dispatch({ type: 'ADD_KNOWLEDGE', payload: amount });
  }, [dispatch]);

  const addFunding = useCallback((amount) => {
    dispatch({ type: 'ADD_FUNDING', payload: amount });
  }, [dispatch]);

  const spendFunding = useCallback((amount) => {
    if (gameState.funding >= amount) {
      dispatch({ type: 'SPEND_FUNDING', payload: amount });
      return true;
    }
    return false;
  }, [dispatch, gameState.funding]);

  const addReputation = useCallback((amount) => {
    dispatch({ type: 'ADD_REPUTATION', payload: amount });
  }, [dispatch]);

  const addEthics = useCallback((amount) => {
    dispatch({ type: 'ADD_ETHICS', payload: amount });
  }, [dispatch]);

  const addExperience = useCallback((amount) => {
    dispatch({ type: 'ADD_EXPERIENCE', payload: amount });
  }, [dispatch]);

  const completeExperiment = useCallback((experimentId) => {
    dispatch({ type: 'COMPLETE_EXPERIMENT', payload: experimentId });
  }, [dispatch]);

  const unlockExperiment = useCallback((experimentId) => {
    dispatch({ type: 'UNLOCK_EXPERIMENT', payload: experimentId });
  }, [dispatch]);

  const buyEquipment = useCallback((equipmentId) => {
    dispatch({ type: 'BUY_EQUIPMENT', payload: equipmentId });
  }, [dispatch]);

  const addSample = useCallback((type, amount = 1) => {
    dispatch({ type: 'ADD_SAMPLE', payload: { type, amount } });
  }, [dispatch]);

  const canAfford = useCallback((cost) => {
    if (cost.funding && gameState.funding < cost.funding) return false;
    if (cost.knowledge && gameState.knowledge < cost.knowledge) return false;
    return true;
  }, [gameState]);

  const hasEquipment = useCallback((equipmentId) => {
    return gameState.equipment[equipmentId]?.owned || false;
  }, [gameState]);

  const hasUnlocked = useCallback((experimentId) => {
    return gameState.unlockedExperiments.includes(experimentId);
  }, [gameState]);

  const getProgress = useCallback(() => {
    const totalExperiments = 5; // Atualizar conforme adicionar mais
    const completed = gameState.completedExperiments.length;
    return {
      completed,
      total: totalExperiments,
      percentage: Math.round((completed / totalExperiments) * 100)
    };
  }, [gameState]);

  return {
    // Estado
    gameState,
    
    // Ações
    addKnowledge,
    addFunding,
    spendFunding,
    addReputation,
    addEthics,
    addExperience,
    completeExperiment,
    unlockExperiment,
    buyEquipment,
    addSample,
    
    // Verificações
    canAfford,
    hasEquipment,
    hasUnlocked,
    
    // Estatísticas
    getProgress,
    
    // Atalhos comuns
    currentLevel: gameState.level,
    currentKnowledge: gameState.knowledge,
    currentFunding: gameState.funding,
    currentReputation: gameState.reputation,
    currentEthics: gameState.ethicsScore
  };
};