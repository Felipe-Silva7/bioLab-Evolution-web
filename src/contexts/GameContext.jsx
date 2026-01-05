import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GAME_CONFIG } from '../utils/constants';

const GameContext = createContext();

const initialGameState = {
  knowledge: 50000,
  funding: 100000,
  reputation: 100,
  ethicsScore: 100,
  experience: 50000,
  level: 10,
  act: 1,
  completedExperiments: [],
  unlockedExperiments: ['culture_growth'],
  patents: {},
  samples: {
    aspergillus_niger: 0,
    penicillium: 0,
    ecoli: 0,
  },
  stats: {
    totalExperiments: 0,
    questionsAnswered: 0,
    questionsCorrect: 0,
    playtime: 0,
  },
  equipment: {
    petri_dish: { owned: true, level: 1 },
    microscope: { owned: false, level: 0 },
    incubator: { owned: false, level: 0 },
    thermocycler: { owned: false, level: 0 },
    bioreactor: { owned: false, level: 0 },
    sequencer: { owned: false, level: 0 },
  },
  currentExperiment: null,
  lastSave: Date.now(),
  startTime: Date.now(),
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'ADD_KNOWLEDGE':
      return { ...state, knowledge: state.knowledge + action.payload };
    case 'ADD_FUNDING':
      return { ...state, funding: state.funding + action.payload };
    case 'SPEND_FUNDING':
      return { ...state, funding: Math.max(0, state.funding - action.payload) };
    case 'ADD_REPUTATION':
      return { ...state, reputation: Math.min(100, state.reputation + action.payload) };
    case 'ADD_ETHICS':
      return { ...state, ethicsScore: Math.max(0, Math.min(100, state.ethicsScore + action.payload)) };
    case 'ADD_EXPERIENCE':
      const newExp = state.experience + action.payload;
      const newLevel = Math.floor(newExp / GAME_CONFIG.xpPerLevel) + 1;
      return { ...state, experience: newExp, level: newLevel };
    case 'ADD_SAMPLE':
      return {
        ...state,
        samples: {
          ...state.samples,
          [action.payload.type]: (state.samples[action.payload.type] || 0) + action.payload.amount
        }
      };
    case 'COMPLETE_EXPERIMENT':
      return {
        ...state,
        completedExperiments: [...state.completedExperiments, action.payload],
        stats: { ...state.stats, totalExperiments: state.stats.totalExperiments + 1 }
      };
    case 'UNLOCK_EXPERIMENT':
      if (state.unlockedExperiments.includes(action.payload)) return state;
      return {
        ...state,
        unlockedExperiments: [...state.unlockedExperiments, action.payload]
      };
    case 'ANSWER_QUESTION':
      return {
        ...state,
        stats: {
          ...state.stats,
          questionsAnswered: state.stats.questionsAnswered + 1,
          questionsCorrect: state.stats.questionsCorrect + (action.payload.correct ? 1 : 0),
        }
      };
    case 'BUY_EQUIPMENT':
      return {
        ...state,
        equipment: {
          ...state.equipment,
          [action.payload]: { owned: true, level: 1 }
        }
      };
    case 'START_EXPERIMENT':
      return { ...state, currentExperiment: action.payload };
    case 'END_EXPERIMENT':
      return { ...state, currentExperiment: null };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    case 'RESET_GAME':
      return initialGameState;
    case 'UPDATE_REPUTATION':
      return {
        ...state,
        reputation: Math.max(0, Math.min(100, state.reputation + action.payload))
      };
    case 'UPDATE_ETHICS':
      return {
        ...state,
        ethicsScore: Math.max(0, Math.min(100, state.ethicsScore + action.payload))
      };
    case 'ADD_SAMPLE':
      return {
        ...state,
        samples: {
          ...state.samples,
          [action.payload.type]: (state.samples[action.payload.type] || 0) + action.payload.amount
        }
      };
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  useEffect(() => {
    const saved = localStorage.getItem('biolab-v2-save');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: data });
      } catch (e) {
        console.error('Erro ao carregar save:', e);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem('biolab-v2-save', JSON.stringify(gameState));
    }, GAME_CONFIG.saveInterval);
    return () => clearInterval(interval);
  }, [gameState]);

  return (
    <GameContext.Provider value={{ gameState, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
}