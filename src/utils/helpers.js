export const Helpers = {
  // Array helpers
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },
  
  sampleArray(array, count = 1) {
    if (array.length <= count) return [...array];
    
    const shuffled = this.shuffleArray(array);
    return shuffled.slice(0, count);
  },
  
  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
  
  // Object helpers
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  },
  
  mergeObjects(target, source) {
    return { ...target, ...source };
  },
  
  filterObject(obj, predicate) {
    return Object.fromEntries(
      Object.entries(obj).filter(([key, value]) => predicate(value, key))
    );
  },
  
  mapObject(obj, mapper) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, mapper(value, key)])
    );
  },
  
  // Game helpers
  generateId(prefix = '') {
    return `${prefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },
  
  formatGameTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  },
  
  calculatePlaytime(startTime) {
    const now = Date.now();
    return Math.floor((now - startTime) / 1000);
  },
  
  getRandomWeighted(choices) {
    const totalWeight = choices.reduce((sum, choice) => sum + (choice.weight || 1), 0);
    let random = Math.random() * totalWeight;
    
    for (const choice of choices) {
      random -= (choice.weight || 1);
      if (random <= 0) {
        return choice;
      }
    }
    
    return choices[choices.length - 1];
  },
  
  // UI helpers
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },
  
  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },
  
  // Math helpers
  clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  },
  
  lerp(start, end, t) {
    return start * (1 - t) + end * t;
  },
  
  normalize(value, min, max) {
    return (value - min) / (max - min);
  },
  
  // String helpers
  capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },
  
  camelToTitle(text) {
    return text
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  },
  
  slugify(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
  
  // Local storage helpers
  saveToLocalStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      return false;
    }
  },
  
  loadFromLocalStorage(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      return defaultValue;
    }
  },
  
  removeFromLocalStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error removing from localStorage:', error);
      return false;
    }
  },
  
  // Date helpers
  formatDate(date, format = 'short') {
    const d = new Date(date);
    
    if (format === 'short') {
      return d.toLocaleDateString('pt-BR');
    } else if (format === 'long') {
      return d.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else if (format === 'relative') {
      const now = new Date();
      const diffMs = now - d;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'agora mesmo';
      if (diffMins < 60) return `${diffMins} min atrás`;
      if (diffHours < 24) return `${diffHours} h atrás`;
      if (diffDays < 7) return `${diffDays} dias atrás`;
      return this.formatDate(d, 'short');
    }
    
    return d.toISOString();
  },
  
  isToday(date) {
    const today = new Date();
    const compare = new Date(date);
    
    return today.toDateString() === compare.toDateString();
  },
  
  isWithinDays(date, days) {
    const now = new Date();
    const compare = new Date(date);
    const diffTime = Math.abs(now - compare);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= days;
  },
  
  // Validation helpers
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },
  
  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  },
  
  // Game specific helpers
  getExperimentIcon(type) {
    const icons = {
      match3: '🧫',
      timing: '🧬',
      puzzle: '🔬',
      management: '⚗️',
      precision: '✂️'
    };
    
    return icons[type] || '🧪';
  },
  
  getDifficultyColor(difficulty) {
    const colors = {
      'Fácil': 'bg-green-500',
      'Médio': 'bg-yellow-500',
      'Difícil': 'bg-orange-500',
      'Expert': 'bg-red-500'
    };
    
    return colors[difficulty] || 'bg-gray-500';
  },
  
  getTierColor(tier) {
    const colors = {
      bronze: 'bg-amber-700',
      silver: 'bg-gray-400',
      gold: 'bg-yellow-500',
      platinum: 'bg-cyan-400'
    };
    
    return colors[tier] || 'bg-gray-600';
  },
  
  // Animation helpers
  easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },
  
  easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  },
  
  easeIn(t) {
    return t * t;
  },
  
  // Performance helpers
  measurePerformance(name, func) {
    const start = performance.now();
    const result = func();
    const end = performance.now();
    
    console.log(`${name} took ${end - start}ms`);
    return result;
  },
  
  async measureAsyncPerformance(name, asyncFunc) {
    const start = performance.now();
    const result = await asyncFunc();
    const end = performance.now();
    
    console.log(`${name} took ${end - start}ms`);
    return result;
  }
};