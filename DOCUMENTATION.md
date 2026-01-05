# 🧬 BIO-LAB EVOLUTION - DOCUMENTAÇÃO TÉCNICA COMPLETA

**Versão:** 2.0.0  
**Data:** Janeiro 2026  
**Autor:** Projeto Educacional de Biotecnologia  

---

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Projeto](#arquitetura-do-projeto)
3. [Estado do Jogo](#estado-do-jogo)
4. [Mecânicas Implementadas](#mecânicas-implementadas)
5. [Dados do Jogo](#dados-do-jogo)
6. [Integração Supabase](#integração-supabase)
7. [Minigames - Guia de Implementação](#minigames-guia-de-implementação)
8. [Sistema de Progressão](#sistema-de-progressão)
9. [Roadmap de Desenvolvimento](#roadmap-de-desenvolvimento)
10. [Deploy e Build](#deploy-e-build)

---

## 🎯 VISÃO GERAL

### Conceito
BIO-LAB EVOLUTION é um jogo educacional de biotecnologia que combina:
- **Experimentos interativos** (minigames)
- **Sistema de perguntas** para validar conhecimento
- **Progressão RPG** (níveis, experiência, equipamentos)
- **Conteúdo educacional** contextualizado

### Diferencial
❌ **NÃO É** um idle clicker simples  
✅ **É** um simulador educacional com mecânicas ativas

### Objetivo Educacional
Ensinar biotecnologia através de:
1. Perguntas científicas contextualizadas
2. Simulação de processos laboratoriais reais
3. Tomada de decisões técnicas e éticas
4. Progressão gradual de conceitos básicos → avançados

---

## 🏗️ ARQUITETURA DO PROJETO

### Estrutura de Pastas Recomendada

```
biolab-evolution/
├── public/
│   ├── index.html
│   ├── assets/
│   │   ├── sounds/
│   │   │   ├── click.mp3
│   │   │   ├── success.mp3
│   │   │   ├── error.mp3
│   │   │   └── background.mp3
│   │   ├── images/
│   │   │   ├── equipment/
│   │   │   ├── organisms/
│   │   │   └── ui/
│   │   └── fonts/
│   └── manifest.json
│
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── ProgressBar.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Notification.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── lab/
│   │   │   ├── LabStation.jsx
│   │   │   ├── Equipment.jsx
│   │   │   ├── EquipmentCard.jsx
│   │   │   └── ResourceDisplay.jsx
│   │   │
│   │   ├── experiments/
│   │   │   ├── ExperimentCard.jsx
│   │   │   ├── ExperimentModal.jsx
│   │   │   ├── minigames/
│   │   │   │   ├── PCRMinigame.jsx
│   │   │   │   ├── CultureGrowthGame.jsx
│   │   │   │   ├── DNASequencingPuzzle.jsx
│   │   │   │   ├── FermentationControl.jsx
│   │   │   │   └── CRISPREditor.jsx
│   │   │   └── ExperimentResult.jsx
│   │   │
│   │   ├── quiz/
│   │   │   ├── QuizModal.jsx
│   │   │   ├── Question.jsx
│   │   │   ├── QuizResults.jsx
│   │   │   └── ExplanationCard.jsx
│   │   │
│   │   ├── progress/
│   │   │   ├── StatsPanel.jsx
│   │   │   ├── AchievementCard.jsx
│   │   │   ├── LeaderboardTable.jsx
│   │   │   └── ProfileCard.jsx
│   │   │
│   │   └── shop/
│   │       ├── ShopGrid.jsx
│   │       └── EquipmentShopCard.jsx
│   │
│   ├── hooks/
│   │   ├── useGameState.js
│   │   ├── useSupabase.js
│   │   ├── useTimer.js
│   │   ├── useLocalStorage.js
│   │   ├── useSound.js
│   │   ├── useNotification.js
│   │   └── useAuth.js
│   │
│   ├── contexts/
│   │   ├── GameContext.jsx
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── services/
│   │   ├── supabase/
│   │   │   ├── client.js          # Configuração do cliente
│   │   │   ├── auth.js            # Autenticação
│   │   │   ├── database.js        # Operações de DB
│   │   │   └── storage.js         # File storage
│   │   │
│   │   ├── game/
│   │   │   ├── gameEngine.js      # Loop principal
│   │   │   ├── progressionSystem.js
│   │   │   ├── experimentLogic.js
│   │   │   ├── achievementSystem.js
│   │   │   └── balancing.js       # Cálculos de economia
│   │   │
│   │   └── api/
│   │       └── analytics.js       # Tracking opcional
│   │
│   ├── data/
│   │   ├── experiments.json       # Definições de experimentos
│   │   ├── questions.json         # Banco de perguntas
│   │   ├── equipment.json         # Equipamentos disponíveis
│   │   ├── patents.json           # Patentes (se usar)
│   │   ├── achievements.json      # Conquistas
│   │   └── storyline.json         # Narrativa por ato
│   │
│   ├── utils/
│   │   ├── formatters.js          # Formatação de números
│   │   ├── validators.js          # Validações
│   │   ├── calculations.js        # Cálculos do jogo
│   │   ├── constants.js           # Constantes globais
│   │   └── helpers.js             # Funções auxiliares
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   ├── animations.css
│   │   └── tailwind.config.js
│   │
│   ├── types/                     # TypeScript (opcional)
│   │   ├── game.types.ts
│   │   ├── experiment.types.ts
│   │   └── api.types.ts
│   │
│   ├── App.jsx
│   ├── index.jsx
│   └── routes.jsx
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── .env.local
├── .gitignore
├── package.json
├── README.md
└── DOCUMENTATION.md (este arquivo)
```

---

## 🎮 ESTADO DO JOGO

### Estrutura do GameState

```javascript
{
  // ==================== RECURSOS ====================
  knowledge: Number,           // Pontos de pesquisa (PP)
  funding: Number,             // Dinheiro ($)
  reputation: Number,          // 0-100, afeta colaborações
  ethicsScore: Number,         // 0-100, decisões éticas
  experience: Number,          // XP para level up
  
  // ==================== AMOSTRAS ====================
  samples: {
    aspergillus_niger: Number,
    penicillium: Number,
    ecoli: Number,
    saccharomyces: Number,
    bacillus: Number,
    // ... outras cepas
  },
  
  // ==================== PROGRESSÃO ====================
  level: Number,               // Nível do jogador
  act: Number,                 // 1-4, ato da história
  completedExperiments: Array, // IDs dos experimentos completos
  unlockedExperiments: Array,  // IDs dos experimentos desbloqueados
  
  // ==================== PATENTES ====================
  patents: {
    [patentId]: {
      owned: Boolean,
      registeredAt: Timestamp,
      citations: Number,       // Quantas vezes foi "citada"
    }
  },
  
  // ==================== EQUIPAMENTOS ====================
  equipment: {
    [equipmentId]: {
      owned: Boolean,
      level: Number,           // 0-5, upgrades
      durability: Number,      // 0-100, manutenção
    }
  },
  
  // ==================== EQUIPE ====================
  team: [
    {
      id: String,
      name: String,
      role: String,            // 'microbiologist', 'bioinfo', etc
      skill: Number,           // 1-10
      efficiency: Number,      // Multiplicador 0.8-2.0
      salary: Number,
    }
  ],
  
  // ==================== ESTATÍSTICAS ====================
  stats: {
    totalExperiments: Number,
    questionsAnswered: Number,
    questionsCorrect: Number,
    playtime: Number,          // Segundos
    highestCombo: Number,
    perfectExperiments: Number,
    ethicalChoicesMade: Number,
  },
  
  // ==================== META ====================
  currentExperiment: String | null,
  lastSave: Timestamp,
  startTime: Timestamp,
  version: String,
}
```

### GameState Reducer Actions

```javascript
// Recursos
{ type: 'ADD_KNOWLEDGE', payload: Number }
{ type: 'ADD_FUNDING', payload: Number }
{ type: 'SPEND_FUNDING', payload: Number }
{ type: 'ADD_REPUTATION', payload: Number }
{ type: 'ADD_ETHICS', payload: Number }
{ type: 'ADD_EXPERIENCE', payload: Number }

// Amostras
{ type: 'ADD_SAMPLE', payload: { type: String, amount: Number } }
{ type: 'CONSUME_SAMPLE', payload: { type: String, amount: Number } }

// Experimentos
{ type: 'START_EXPERIMENT', payload: String }
{ type: 'COMPLETE_EXPERIMENT', payload: String }
{ type: 'FAIL_EXPERIMENT', payload: String }
{ type: 'UNLOCK_EXPERIMENT', payload: String }

// Quiz
{ type: 'ANSWER_QUESTION', payload: { correct: Boolean, points: Number } }

// Equipamentos
{ type: 'BUY_EQUIPMENT', payload: String }
{ type: 'UPGRADE_EQUIPMENT', payload: String }

// Equipe
{ type: 'HIRE_MEMBER', payload: TeamMember }
{ type: 'FIRE_MEMBER', payload: String }

// Sistema
{ type: 'LOAD_STATE', payload: GameState }
{ type: 'RESET_GAME' }
{ type: 'ADVANCE_ACT' }
```

---

## ⚙️ MECÂNICAS IMPLEMENTADAS (V2.0)

### ✅ Atualmente Funcionando

1. **Sistema de Recursos**
   - Knowledge, Funding, Reputation, Ethics
   - Experiência e níveis
   - Formatação de números grandes (K, M, B)

2. **Quiz de Perguntas**
   - Modal de perguntas antes dos experimentos
   - Validação de 60% de acertos
   - Feedback imediato com explicações
   - Pontos bônus por acerto

3. **Experimentos Base**
   - Sistema de requisitos (knowledge, equipment)
   - Desbloqueio progressivo
   - Recompensas configuráveis

4. **Minigames Implementados**
   - **PCR Minigame**: Controle de temperatura em 3 ciclos
   - **Culture Growth**: Match-3 com nutrientes
   - Sistema de score e contamination

5. **Loja de Equipamentos**
   - Compra com funding
   - Status de posse
   - Requisitos para experimentos

6. **Sistema de Progressão**
   - Levels baseados em XP
   - Estatísticas detalhadas
   - Tracking de performance

7. **Save/Load**
   - Auto-save a cada 5s
   - LocalStorage
   - Recuperação de estado

8. **UI/UX**
   - 5 tabs navegáveis
   - Notificações contextuais
   - Design responsivo (básico)
   - Feedback visual

---

## 📊 DADOS DO JOGO

### Estrutura de Experimento

```javascript
{
  id: String,                  // Identificador único
  name: String,                // Nome exibido
  icon: String,                // Emoji ou SVG
  type: String,                // 'timing', 'match3', 'puzzle', etc
  difficulty: String,          // 'Fácil', 'Médio', 'Difícil', 'Expert'
  duration: Number,            // Segundos (para UI)
  description: String,         // Descrição curta
  
  requirements: {
    knowledge: Number,         // PP necessário
    funding: Number,           // $ necessário
    equipment: Array<String>,  // IDs de equipamentos
    patents: Array<String>,    // IDs de patentes (opcional)
    samples: Object,           // { sampleType: quantidade }
  },
  
  rewards: {
    knowledge: Number,
    funding: Number,
    experience: Number,
    reputation: Number,
    samples: Object,           // { sampleType: quantidade }
  },
  
  unlocks: Array<String>,      // IDs de experimentos desbloqueados
  
  educational: {
    concept: String,           // Conceito principal
    description: String,       // Explicação detalhada
    realWorld: String,         // Aplicação real
    phases: Array<String>,     // Fases do processo (opcional)
  },
  
  minigameParams: Object,      // Parâmetros específicos do minigame
}
```

### Estrutura de Pergunta

```javascript
{
  id: String,
  category: String,            // 'microbiologia', 'biologia_molecular', etc
  question: String,
  options: Array<String>,      // 4 opções
  correct: Number,             // Índice da resposta correta (0-3)
  explanation: String,         // Explicação da resposta
  difficulty: String,          // 'easy', 'medium', 'hard'
  points: Number,              // Pontos por acerto
  unlockRequirement: String | null, // Patent/Experiment necessário
  
  // Para perguntas de cálculo
  type: String,                // 'multiple_choice', 'calculation', 'scenario'
  correctAnswer: Number,       // Para cálculos
  tolerance: Number,           // Margem de erro (para cálculos)
  
  // Para decisões éticas
  scenario: String,
  choices: Array<{
    text: String,
    consequence: String,
    ethics: Number,
    reputation: Number,
    funding: Number,
  }>,
}
```

### Estrutura de Equipamento

```javascript
{
  id: String,
  name: String,
  icon: String,
  description: String,
  cost: Number,                // $ para comprar
  
  // Upgrades (opcional)
  maxLevel: Number,
  upgradeCost: Function,       // (level) => cost
  
  // Efeitos
  effects: {
    knowledgeMultiplier: Number,
    experimentSpeedBonus: Number,
    successChanceBonus: Number,
  },
  
  // Manutenção (opcional)
  durabilityLoss: Number,      // Por uso
  repairCost: Number,
}
```

---

## 🗄️ INTEGRAÇÃO SUPABASE

### 1. Setup Inicial

```bash
npm install @supabase/supabase-js
```

### 2. Arquivo: `src/services/supabase/client.js`

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 3. Schema SQL (Completo)

```sql
-- ==================== PROFILES ====================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP DEFAULT NOW()
);

-- ==================== GAME SAVES ====================
CREATE TABLE game_saves (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  game_state JSONB NOT NULL,
  version TEXT DEFAULT '2.0.0',
  playtime_minutes INT DEFAULT 0,
  last_save TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Índice para busca rápida
CREATE INDEX idx_game_saves_user ON game_saves(user_id);

-- ==================== ACHIEVEMENTS ====================
CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  tier TEXT CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
  secret BOOLEAN DEFAULT FALSE
);

-- Inserir conquistas básicas
INSERT INTO achievements (code, name, description, icon, tier) VALUES
('first_experiment', 'Primeiro Experimento', 'Complete seu primeiro experimento', '🧪', 'bronze'),
('perfect_quiz', 'Quiz Perfeito', 'Acerte todas as perguntas de um quiz', '💯', 'silver'),
('lvl_10', 'Pesquisador Experiente', 'Alcance o nível 10', '⭐', 'gold'),
('all_equipment', 'Laboratório Completo', 'Adquira todos os equipamentos', '🏆', 'platinum');

-- ==================== USER ACHIEVEMENTS ====================
CREATE TABLE user_achievements (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id INT REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- ==================== LEADERBOARD ====================
CREATE TABLE leaderboard (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT NOT NULL,
  total_knowledge BIGINT DEFAULT 0,
  total_funding BIGINT DEFAULT 0,
  level INT DEFAULT 1,
  patents_count INT DEFAULT 0,
  experiments_completed INT DEFAULT 0,
  reputation INT DEFAULT 50,
  rank INT,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_knowledge ON leaderboard(total_knowledge DESC);
CREATE INDEX idx_leaderboard_level ON leaderboard(level DESC);

-- ==================== EXPERIMENT LOGS ====================
CREATE TABLE experiment_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  experiment_id TEXT NOT NULL,
  success BOOLEAN,
  score INT,
  duration_seconds INT,
  completed_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_experiment_logs_user ON experiment_logs(user_id);
CREATE INDEX idx_experiment_logs_experiment ON experiment_logs(experiment_id);

-- ==================== QUIZ HISTORY ====================
CREATE TABLE quiz_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  correct BOOLEAN,
  time_taken_seconds INT,
  answered_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_quiz_history_user ON quiz_history(user_id);

-- ==================== ROW LEVEL SECURITY ====================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiment_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_history ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can manage own saves" 
  ON game_saves FOR ALL 
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view achievements" 
  ON achievements FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Users can view own achievements" 
  ON user_achievements FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view leaderboard" 
  ON leaderboard FOR SELECT 
  TO authenticated USING (true);

CREATE POLICY "Users can update own leaderboard" 
  ON leaderboard FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs" 
  ON experiment_logs FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz history" 
  ON quiz_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
```

### 4. Arquivo: `src/services/supabase/database.js`

```javascript
import { supabase } from './client';

// ==================== SAVE GAME ====================
export async function saveGame(userId, gameState) {
  try {
    const { data, error } = await supabase
      .from('game_saves')
      .upsert({
        user_id: userId,
        game_state: gameState,
        playtime_minutes: Math.floor(gameState.stats.playtime / 60),
        last_save: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving game:', error);
    return { success: false, error };
  }
}

// ==================== LOAD GAME ====================
export async function loadGame(userId) {
  try {
    const { data, error } = await supabase
      .from('game_saves')
      .select('game_state, playtime_minutes')
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return { success: true, gameState: data.game_state };
  } catch (error) {
    console.error('Error loading game:', error);
    return { success: false, error };
  }
}

// ==================== UPDATE LEADERBOARD ====================
export async function updateLeaderboard(userId, username, stats) {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .upsert({
        user_id: userId,
        username: username,
        total_knowledge: stats.knowledge,
        total_funding: stats.funding,
        level: stats.level,
        experiments_completed: stats.totalExperiments,
        reputation: stats.reputation,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id'
      });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating leaderboard:', error);
    return { success: false, error };
  }
}

// ==================== GET LEADERBOARD ====================
export async function getLeaderboard(orderBy = 'total_knowledge', limit = 100) {
  try {
    const { data, error} = await supabase
      .from('leaderboard')
      .select('*')
      .order(orderBy, { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return { success: false, error };
  }
}

// ==================== LOG EXPERIMENT ====================
export async function logExperiment(userId, experimentId, success, score, duration) {
  try {
    const { error } = await supabase
      .from('experiment_logs')
      .insert({
        user_id: userId,
        experiment_id: experimentId,
        success: success,
        score: score,
        duration_seconds: duration,
      });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error logging experiment:', error);
    return { success: false, error };
  }
}

// ==================== LOG QUIZ ANSWER ====================
export async function logQuizAnswer(userId, questionId, correct, timeTaken) {
  try {
    const { error } = await supabase
      .from('quiz_history')
      .insert({
        user_id: userId,
        question_id: questionId,
        correct: correct,
        time_taken_seconds: timeTaken,
      });
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error logging quiz answer:', error);
    return { success: false, error };
  }
}

// ==================== UNLOCK ACHIEVEMENT ====================
export async function unlockAchievement(userId, achievementCode) {
  try {
    // Buscar ID da conquista
    const { data: achievement, error: fetchError } = await supabase
      .from('achievements')
      .select('id')
      .eq('code', achievementCode)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Inserir conquista (ignora se já existe)
    const { error: insertError } = await supabase
      .from('user_achievements')
      .insert({
        user_id: userId,
        achievement_id: achievement.id,
      })
      .select();
    
    // Ignora erro de duplicata
    if (insertError && !insertError.message.includes('duplicate')) {
      throw insertError;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return { success: false, error };
  }
}

// ==================== GET USER ACHIEVEMENTS ====================
export async function getUserAchievements(userId) {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        achievement_id,
        unlocked_at,
        achievements (code, name, description, icon, tier)
      `)
      .eq('user_id', userId);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching achievements:', error);
    return { success: false, error };
  }
}
```

### 5. Hook Personalizado: `src/hooks/useSupabase.js`

```javascript
import { useState, useEffect } from 'react';
import { supabase } from '../services/supabase/client';
import { 
  saveGame, 
  loadGame, 
  updateLeaderboard,
  logExperiment,
  logQuizAnswer,
} from '../services/supabase/database';

export function useSupabase() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    
    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    return () => subscription.unsubscribe();
  }, []);
  
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };
  
  const signUp = async (email, password, username) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
        },
      },
    });
    return { data, error };
  };
  
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };
  
  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    saveGame: (gameState) => saveGame(user?.id, gameState),
    loadGame: () => loadGame(user?.id),
    updateLeaderboard: (username, stats) => updateLeaderboard(user?.id, username, stats),
    logExperiment: (expId, success, score, duration) => 
      logExperiment(user?.id, expId, success, score, duration),
    logQuizAnswer: (qId, correct, time) => 
      logQuizAnswer(user?.id, qId, correct, time),
  };
}
```

---

## 🎮 MINIGAMES - GUIA DE IMPLEMENTAÇÃO

### Template de Minigame

```javascript
function MinigameTemplate({ onComplete, experimentData }) {
  const [gameState, setGameState] = useState({
    // Estado específico do minigame