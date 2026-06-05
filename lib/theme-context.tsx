'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

export interface ThemeConfig {
  fontFamily: 'sans' | 'serif' | 'mono' | 'cursive' | 'system'
  fontSize: 'small' | 'medium' | 'large'
  backgroundColor: string
  accentColor: string
  mode: 'light' | 'dark'
}

interface ThemeContextType {
  theme: ThemeConfig
  updateTheme: (config: Partial<ThemeConfig>) => void
  resetTheme: () => void
}

const DEFAULT_THEME: ThemeConfig = {
  fontFamily: 'sans',
  fontSize: 'medium',
  backgroundColor: '#f8f8f8',
  accentColor: '#3b82f6',
  mode: 'light',
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const FONT_FAMILIES = {
  sans: '"Geist", system-ui, sans-serif',
  serif: '"Georgia", serif',
  mono: '"Courier New", monospace',
  cursive: '"Brush Script MT", cursive',
  system: 'system-ui, -apple-system, sans-serif',
}

const FONT_SIZES = {
  small: '13px',
  medium: '14px',
  large: '16px',
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(DEFAULT_THEME)
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('appTheme')
    if (savedTheme) {
      try {
        setTheme(JSON.parse(savedTheme))
      } catch (e) {
        setTheme(DEFAULT_THEME)
      }
    }
    setMounted(true)
  }, [])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const html = document.documentElement
    const bodyEl = document.body

    // Set font family
    html.style.fontFamily = FONT_FAMILIES[theme.fontFamily]
    bodyEl.style.fontFamily = FONT_FAMILIES[theme.fontFamily]

    // Set font size
    html.style.fontSize = FONT_SIZES[theme.fontSize]

    // Set background color with !important
    html.style.setProperty('background-color', theme.backgroundColor, 'important')
    bodyEl.style.setProperty('background-color', theme.backgroundColor, 'important')

    // Create or update dynamic style tag for accent color overrides
    let styleTag = document.getElementById('theme-style-overrides')
    if (!styleTag) {
      styleTag = document.createElement('style')
      styleTag.id = 'theme-style-overrides'
      document.head.appendChild(styleTag)
    }

    // Convert hex to RGB for better compatibility
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '59, 130, 246'
    }

    const accentRgb = hexToRgb(theme.accentColor)
    const accentCss = `
      :root {
        --color-accent: ${theme.accentColor} !important;
        --accent-rgb: ${accentRgb};
      }
      
      html, body {
        background-color: ${theme.backgroundColor} !important;
      }
      
      .bg-accent {
        background-color: ${theme.accentColor} !important;
      }
      
      .text-accent {
        color: ${theme.accentColor} !important;
      }
      
      .border-accent {
        border-color: ${theme.accentColor} !important;
      }
      
      .hover\\:bg-accent:hover {
        background-color: ${theme.accentColor} !important;
      }
      
      .focus\\:ring-accent:focus {
        --tw-ring-color: ${theme.accentColor} !important;
      }
      
      button.bg-accent:hover {
        opacity: 0.9;
      }
    `
    styleTag.textContent = accentCss

    // Set mode class
    if (theme.mode === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }

    // Save to localStorage
    localStorage.setItem('appTheme', JSON.stringify(theme))
  }, [theme, mounted])

  const updateTheme = useCallback((config: Partial<ThemeConfig>) => {
    setTheme((prev) => ({ ...prev, ...config }))
  }, [])

  const resetTheme = useCallback(() => {
    setTheme(DEFAULT_THEME)
    localStorage.removeItem('appTheme')
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  const value: ThemeContextType = {
    theme,
    updateTheme,
    resetTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
