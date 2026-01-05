import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { GAME_CONFIG } from '../utils/constants';
import { AchievementSystem } from '../services/game/achievementSystem';
import patentsData from '../data/patents.json';

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
  unlockedAchievements: [],
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
    perfectExperiments: 0
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
  notifications: [],
  notificationHistory: []
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
    case 'PERFECT_EXPERIMENT':
      return {
        ...state,
        stats: { ...state.stats, perfectExperiments: state.stats.perfectExperiments + 1 }
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
    case 'UNLOCK_ACHIEVEMENTS':
      return {
        ...state,
        unlockedAchievements: [...new Set([...(state.unlockedAchievements || []), ...action.payload.ids])],
        knowledge: state.knowledge + (action.payload.rewards?.knowledge || 0),
        funding: state.funding + (action.payload.rewards?.funding || 0),
        reputation: Math.min(100, state.reputation + (action.payload.rewards?.reputation || 0))
      };
    case 'FILE_PATENT':
      return {
        ...state,
        funding: Math.max(0, state.funding - action.payload.cost),
        patents: {
          ...state.patents,
          [action.payload.id]: {
            status: 'pending',
            filedAt: action.payload.filedAt,
            readyAt: action.payload.readyAt
          }
        }
      };
    case 'ACTIVATE_PATENT':
      return {
        ...state,
        patents: {
          ...state.patents,
          [action.payload.id]: {
            ...(state.patents[action.payload.id] || {}),
            status: 'active',
            activatedAt: Date.now()
          }
        },
        funding: state.funding + (action.payload.rewards?.funding || 0),
        reputation: Math.min(100, state.reputation + (action.payload.rewards?.reputation || 0))
      };
    case 'PUSH_NOTIFICATION':
      {
        const msg = (action.payload?.message || '').trim();
        if (msg && (state.notificationHistory || []).includes(msg)) {
          return state;
        }
        const existsInQueue = (state.notifications || []).some(n => (n.message || '').trim() === msg && n.type === action.payload.type);
        if (existsInQueue) {
          return state;
        }
        return {
          ...state,
          notifications: [...(state.notifications || []), action.payload],
          notificationHistory: msg ? [...(state.notificationHistory || []), msg] : (state.notificationHistory || [])
        };
      }
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: (state.notifications || []).filter(n => n.id !== action.payload)
      };
    case 'CLEAR_NOTIFICATIONS':
      return { ...state, notifications: [] };
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
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const patentTimerRef = useRef(null);
  const passiveTimerRef = useRef(null);

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

  useEffect(() => {
    const system = new AchievementSystem(gameState);
    const { unlocked, rewards } = system.checkAchievements();
    if (unlocked.length > 0) {
      dispatch({ type: 'UNLOCK_ACHIEVEMENTS', payload: { ids: unlocked, rewards } });
      unlocked.forEach(id => {
        const info = system.getAchievementInfo(id);
        dispatch({ type: 'PUSH_NOTIFICATION', payload: { id: Date.now() + Math.random(), type: 'success', message: `Conquista desbloqueada: ${info?.name || id}` } });
      });
    }
  }, [gameState.knowledge, gameState.reputation, gameState.ethicsScore, gameState.stats, gameState.completedExperiments, gameState.equipment]);

  useEffect(() => {
    if (passiveTimerRef.current) clearInterval(passiveTimerRef.current);
    passiveTimerRef.current = setInterval(() => {
      let passiveFunding = 0;
      Object.keys(gameState.patents || {}).forEach(id => {
        const status = gameState.patents[id]?.status;
        if (status === 'active') {
          const patent = patentsData.patents.find(p => p.id === id);
          if (patent?.rewards?.passiveIncome) {
            const levelFactor = Math.min(2, 1 + (gameState.level || 1) * 0.02);
            passiveFunding += (patent.rewards.passiveIncome / 60) * levelFactor;
          }
        }
      });
      if (passiveFunding > 0) {
        dispatch({ type: 'ADD_FUNDING', payload: passiveFunding });
      }
      dispatch({ type: 'ADD_EXPERIENCE', payload: 0 });
    }, 1000);
    return () => clearInterval(passiveTimerRef.current);
  }, [gameState.patents]);

  useEffect(() => {
    if (patentTimerRef.current) clearInterval(patentTimerRef.current);
    patentTimerRef.current = setInterval(() => {
      const now = Date.now();
      Object.keys(gameState.patents || {}).forEach(id => {
        const entry = gameState.patents[id];
        if (entry?.status === 'pending' && entry.readyAt <= now) {
          const patent = patentsData.patents.find(p => p.id === id);
          const rewards = patent?.rewards || {};
          dispatch({ type: 'ACTIVATE_PATENT', payload: { id, rewards } });
          dispatch({ type: 'PUSH_NOTIFICATION', payload: { id: Date.now() + Math.random(), type: 'success', message: `Patente ativada: ${patent?.name || id}` } });
        }
      });
    }, 2000);
    return () => clearInterval(patentTimerRef.current);
  }, [gameState.patents]);

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
