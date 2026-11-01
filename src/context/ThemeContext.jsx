import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { flushSync } from 'react-dom'

const STORAGE_KEY = 'theme'
const META_COLORS = { dark: '#000000', light: '#f4f7fc' }
const REVEAL_MS = 750

const ThemeContext = createContext({ theme: 'dark', toggle: () => {} })

export const useTheme = () => useContext(ThemeContext)

function readInitialTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

/** Radius that covers the whole viewport from the given point. */
function coverRadius(x, y) {
  return Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(readInitialTheme)

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light')
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLORS[theme])
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Storage can be unavailable (private mode); the theme still works for this visit.
    }
  }, [theme])

  /** @param {{x:number, y:number} | undefined} origin point the circular reveal grows from */
  const toggle = useCallback(
    (origin) => {
      const next = theme === 'light' ? 'dark' : 'light'
      const root = document.documentElement
      const apply = () => {
        document.body.classList.toggle('light', next === 'light')
        flushSync(() => setTheme(next))
      }
      const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!document.startViewTransition || reduceMotion) {
        root.classList.add('theme-fade')
        apply()
        setTimeout(() => root.classList.remove('theme-fade'), REVEAL_MS - 50)
        return
      }

      const x = origin?.x ?? innerWidth / 2
      const y = origin?.y ?? 0
      const radius = coverRadius(x, y)
      document
        .startViewTransition(apply)
        .ready.then(() => {
          root.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            {
              duration: REVEAL_MS,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            },
          )
        })
        .catch(() => {
          // Transition was skipped (e.g. tab hidden) — the theme is already applied.
        })
    },
    [theme],
  )

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
