import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const themes = {
  dark: {
    name: 'dark',
    colors: {
      primary: '#0ea5e9', // cyan-500
      secondary: '#8b5cf6', // purple-500
      success: '#10b981', // emerald-500
      danger: '#ef4444', // red-500
      warning: '#f59e0b', // amber-500
      background: '#0f172a', // slate-900
      surface: '#1e293b', // slate-800
      text: '#f1f5f9', // slate-100
      textSecondary: '#94a3b8', // slate-400
      border: '#334155', // slate-700
    },
  },
  light: {
    name: 'light',
    colors: {
      primary: '#0284c7', // cyan-600
      secondary: '#7c3aed', // purple-600
      success: '#059669', // emerald-600
      danger: '#dc2626', // red-600
      warning: '#d97706', // amber-600
      background: '#f8fafc', // slate-50
      surface: '#ffffff',
      text: '#1e293b', // slate-800
      textSecondary: '#64748b', // slate-500
      border: '#e2e8f0', // slate-200
    },
  },
  blue: {
    name: 'blue',
    colors: {
      primary: '#3b82f6', // blue-500
      secondary: '#6366f1', // indigo-500
      success: '#10b981', // emerald-500
      danger: '#ef4444', // red-500
      warning: '#f59e0b', // amber-500
      background: '#1e40af', // blue-800
      surface: '#1e3a8a', // blue-900
      text: '#dbeafe', // blue-100
      textSecondary: '#93c5fd', // blue-300
      border: '#2563eb', // blue-600
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('biolab-theme');
    return savedTheme ? themes[savedTheme] || themes.dark : themes.dark;
  });

  useEffect(() => {
    localStorage.setItem('biolab-theme', theme.name);
    
    // Apply theme to document
    const root = document.documentElement;
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    root.classList.add(`theme-${theme.name}`);
    
    // Remove other theme classes
    Object.keys(themes).forEach(themeName => {
      if (themeName !== theme.name) {
        root.classList.remove(`theme-${themeName}`);
      }
    });
  }, [theme]);

  const toggleTheme = () => {
    const themeNames = Object.keys(themes);
    const currentIndex = themeNames.indexOf(theme.name);
    const nextIndex = (currentIndex + 1) % themeNames.length;
    setTheme(themes[themeNames[nextIndex]]);
  };

  const setThemeByName = (themeName) => {
    if (themes[themeName]) {
      setTheme(themes[themeName]);
    }
  };

  const value = {
    theme,
    themes,
    toggleTheme,
    setTheme: setThemeByName,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};