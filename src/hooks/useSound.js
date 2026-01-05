import { useState, useEffect, useCallback } from 'react';

const sounds = {
  click: '/assets/sounds/click.mp3',
  success: '/assets/sounds/success.mp3',
  error: '/assets/sounds/error.mp3',
  background: '/assets/sounds/background.mp3',
  complete: '/assets/sounds/complete.mp3',
  unlock: '/assets/sounds/unlock.mp3'
};

export const useSound = (soundName, options = {}) => {
  const { volume = 0.5, loop = false, autoplay = false } = options;
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (sounds[soundName]) {
      const newAudio = new Audio(sounds[soundName]);
      newAudio.volume = volume;
      newAudio.loop = loop;
      setAudio(newAudio);

      if (autoplay) {
        newAudio.play();
        setIsPlaying(true);
      }

      return () => {
        newAudio.pause();
        newAudio.currentTime = 0;
      };
    }
  }, [soundName, volume, loop, autoplay]);

  const play = useCallback(() => {
    if (audio) {
      audio.currentTime = 0;
      audio.play();
      setIsPlaying(true);
      
      audio.addEventListener('ended', () => setIsPlaying(false), { once: true });
    }
  }, [audio]);

  const pause = useCallback(() => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [audio]);

  const stop = useCallback(() => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
    }
  }, [audio]);

  const setVolume = useCallback((newVolume) => {
    if (audio) {
      audio.volume = Math.max(0, Math.min(1, newVolume));
    }
  }, [audio]);

  return {
    play,
    pause,
    stop,
    setVolume,
    isPlaying
  };
};

export const useSoundEffects = () => {
  const playClick = useSound('click', { volume: 0.3 });
  const playSuccess = useSound('success', { volume: 0.5 });
  const playError = useSound('error', { volume: 0.5 });
  const playComplete = useSound('complete', { volume: 0.6 });
  const playUnlock = useSound('unlock', { volume: 0.6 });

  return {
    playClick: playClick.play,
    playSuccess: playSuccess.play,
    playError: playError.play,
    playComplete: playComplete.play,
    playUnlock: playUnlock.play
  };
};