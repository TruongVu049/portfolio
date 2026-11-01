import { useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const buttonRef = useRef(null)
  const isLight = theme === 'light'

  const handleClick = () => {
    const rect = buttonRef.current?.getBoundingClientRect()
    toggle(rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : undefined)
  }

  return (
    // z-50 like the menu header: the hero's lanyard canvas (z-40) covers the whole
    // viewport and would otherwise swallow clicks. The open menu panel, later in
    // the DOM at the same z-index, still covers the toggle.
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      className="theme-toggle fixed right-[7.5rem] top-4 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md hover:scale-105 active:scale-95 sm:right-[8rem] sm:top-5"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, scale: 0.4, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="flex"
        >
          {isLight ? <Sun size={20} strokeWidth={1.8} /> : <Moon size={20} strokeWidth={1.8} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}
