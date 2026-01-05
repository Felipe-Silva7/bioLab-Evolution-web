import { supabase } from './client';

export const storageService = {
  async uploadFile(bucket, path, file) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return { 
        data: { ...data, publicUrl: urlData.publicUrl }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error };
    }
  },

  async downloadFile(bucket, path) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .download(path);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async listFiles(bucket, path = '', options = {}) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(path, options);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteFile(bucket, path) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getPublicUrl(bucket, path) {
    try {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Game-specific storage methods
  async uploadSaveFile(userId, gameData) {
    const fileName = `save_${userId}_${Date.now()}.json`;
    const file = new Blob([JSON.stringify(gameData)], { type: 'application/json' });
    
    return this.uploadFile('game-saves', `${userId}/${fileName}`, file);
  },

  async downloadLatestSave(userId) {
    try {
      // List save files for user
      const { data: files, error: listError } = await this.listFiles('game-saves', userId, {
        sortBy: { column: 'created_at', order: 'desc' },
        limit: 1,
      });

      if (listError) throw listError;
      if (!files || files.length === 0) {
        return { data: null, error: { message: 'No save files found' } };
      }

      // Download latest file
      const latestFile = files[0];
      const { data, error: downloadError } = await this.downloadFile(
        'game-saves',
        `${userId}/${latestFile.name}`
      );

      if (downloadError) throw downloadError;

      // Parse JSON
      const text = await data.text();
      const gameData = JSON.parse(text);

      return { data: gameData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async uploadAchievementImage(file, achievementId) {
    const fileName = `achievement_${achievementId}.png`;
    return this.uploadFile('achievements', fileName, file);
  },

  async uploadProfileImage(userId, file) {
    const fileName = `avatar_${userId}.png`;
    return this.uploadFile('profiles', fileName, file);
  },
};