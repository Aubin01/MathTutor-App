/**
 * useTheme — custom hook for managing dark/light mode.
 * 
 */
import { useState, useEffect } from 'react';

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored !== null) return JSON.parse(stored);
    return typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    localStorage.setItem('darkMode', JSON.stringify(newValue));
  };

  return { isDarkMode, toggleDarkMode };
}


