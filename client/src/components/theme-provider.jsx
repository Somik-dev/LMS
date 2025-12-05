import { createContext, useContext, useLayoutEffect, useState, useCallback } from "react"
import { THEMES, getSystemTheme } from "../lib/theme"

const ThemeProviderContext = createContext({
  theme: THEMES.SYSTEM,
  setTheme: () => null,
})

export function ThemeProvider({
  children,
  defaultTheme = THEMES.SYSTEM,
  storageKey = "vite-ui-theme",
  ...props
}) {
  const [theme, setThemeState] = useState(THEMES.SYSTEM)

  // ✅ Memoized version to avoid unnecessary re-runs
  const applyThemeClass = useCallback((theme) => {
    const root = document.documentElement
    root.classList.remove(THEMES.LIGHT, THEMES.DARK)

    if (theme === THEMES.SYSTEM) {
      root.classList.add(getSystemTheme())
    } else {
      root.classList.add(theme)
    }
  }, [])

  useLayoutEffect(() => {
    const storedTheme = localStorage.getItem(storageKey)
    const resolvedTheme = storedTheme || defaultTheme

    setThemeState(resolvedTheme)
    applyThemeClass(resolvedTheme)
  }, [storageKey, defaultTheme, applyThemeClass]) // ✅ All dependencies included

  const setTheme = (newTheme) => {
    localStorage.setItem(storageKey, newTheme)
    setThemeState(newTheme)
    applyThemeClass(newTheme)
  }

  const value = { theme, setTheme }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}


