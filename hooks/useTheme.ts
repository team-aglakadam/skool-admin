'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Get stored theme or default to system
    const storedTheme = localStorage.getItem('theme') as Theme
    if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
      setTheme(storedTheme)
    }
  }, [])

  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement
      
      if (theme === 'system') {
        const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        setResolvedTheme(systemDark ? 'dark' : 'light')
        
        if (systemDark) {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      } else {
        setResolvedTheme(theme)
        
        if (theme === 'dark') {
          root.classList.add('dark')
        } else {
          root.classList.remove('dark')
        }
      }
    }

    applyTheme()

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme()
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme])

  const setThemeAndStore = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  const toggleTheme = () => {
    if (resolvedTheme === 'light') {
      setThemeAndStore('dark')
    } else {
      setThemeAndStore('light')
    }
  }

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeAndStore,
    toggleTheme,
  }
} 