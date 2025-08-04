import React, { createContext, useContext, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
  setTheme: () => {},
});

// Defensive function to safely get initial theme
const getInitialTheme = (): Theme => {
  try {
    if (typeof window === 'undefined') return 'light';
    
    const stored = localStorage.getItem('theme') as Theme;
    if (stored && (stored === 'light' || stored === 'dark')) return stored;
    
    return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Defensive useState with fallback
  const useState = React.useState;
  if (!useState) {
    // Fallback when React hooks are not available
    console.error('React useState is not available');
    return <div className="light">{children}</div>;
  }
  
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const useEffectHook = React.useEffect;
  if (useEffectHook) {
    useEffectHook(() => {
      try {
        // Apply theme to document root
        const root = document.documentElement;
        if (root) {
          root.classList.remove('light', 'dark');
          root.classList.add(theme);
        }
        
        // Store preference safely
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('theme', theme);
        }
      } catch (error) {
        console.error('Error applying theme:', error);
      }
    }, [theme]);
  }

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
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