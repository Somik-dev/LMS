// src/lib/theme.js

export const THEMES = {
    LIGHT: "light",
    DARK: "dark",
    SYSTEM: "system",
  }
  
  export const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEMES.DARK
      : THEMES.LIGHT
  }
  
  export const applyThemeClass = (theme) => {
    const root = document.documentElement
    root.classList.remove(THEMES.LIGHT, THEMES.DARK)
  
    if (theme === THEMES.SYSTEM) {
      root.classList.add(getSystemTheme())
    } else {
      root.classList.add(theme)
    }
  }
  
  