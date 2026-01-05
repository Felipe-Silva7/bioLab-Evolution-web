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