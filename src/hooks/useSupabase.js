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