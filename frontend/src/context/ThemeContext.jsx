import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('hostelhub_theme');
    return saved ? saved === 'dark' : true; // Default to dark
  });

  useEffect(() => {
    const body = document.body;
    if (isDark) {
      body.classList.remove('light-mode');
    } else {
      body.classList.add('light-mode');
    }
    localStorage.setItem('hostelhub_theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
