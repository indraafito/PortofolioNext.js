"use client"; 
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  currentColor: string;
  changeTheme: (color: string, customHex?: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeColors = {
  purple: { primary: '258 90% 66%', glow: '258 100% 75%' },
  blue: { primary: '217 91% 60%', glow: '217 100% 70%' },
  pink: { primary: '330 81% 60%', glow: '330 100% 70%' },
  green: { primary: '142 71% 45%', glow: '142 80% 55%' },
  orange: { primary: '25 95% 53%', glow: '25 100% 63%' },
  cyan: { primary: '189 94% 43%', glow: '189 100% 53%' },
  red: { primary: '0 84% 60%', glow: '0 100% 70%' },
  yellow: { primary: '48 96% 53%', glow: '48 100% 63%' },
};

// Convert HEX to HSL
function hexToHSL(hex: string): { primary: string; glow: string } {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  
  return {
    primary: `${h} ${s}% ${l}%`,
    glow: `${h} ${Math.min(s + 10, 100)}% ${Math.min(l + 10, 100)}%`
  };
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentColor, setCurrentColor] = useState<string>('purple');

  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') || 'purple';
    const savedCustomHex = localStorage.getItem('portfolio-theme-custom-hex');
    setCurrentColor(savedTheme);
    applyTheme(savedTheme, savedCustomHex || undefined);
  }, []);

  const applyTheme = (color: string, customHex?: string) => {
    let theme;
    
    // If it's a custom color, convert hex to HSL
    if (customHex) {
      theme = hexToHSL(customHex);
    } else {
      theme = themeColors[color as keyof typeof themeColors] || themeColors.purple;
    }
    
    const root = document.documentElement;
    
    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--primary-glow', theme.glow);
    root.style.setProperty('--accent', theme.primary);
    root.style.setProperty('--ring', theme.primary);
    root.style.setProperty('--sidebar-primary', theme.primary);
    root.style.setProperty('--sidebar-ring', theme.primary);
    
    // Update glow effects
    root.style.setProperty('--glow-sm', `0 0 10px hsl(${theme.primary} / 0.5)`);
    root.style.setProperty('--glow-md', `0 0 20px hsl(${theme.primary} / 0.4), 0 0 40px hsl(${theme.primary} / 0.2)`);
    root.style.setProperty('--glow-lg', `0 0 30px hsl(${theme.primary} / 0.5), 0 0 60px hsl(${theme.primary} / 0.3), 0 0 90px hsl(${theme.primary} / 0.1)`);
  };

  const changeTheme = (color: string, customHex?: string) => {
    setCurrentColor(color);
    localStorage.setItem('portfolio-theme', color);
    
    if (customHex) {
      localStorage.setItem('portfolio-theme-custom-hex', customHex);
    } else {
      localStorage.removeItem('portfolio-theme-custom-hex');
    }
    
    applyTheme(color, customHex);
  };

  return (
    <ThemeContext.Provider value={{ currentColor, changeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};