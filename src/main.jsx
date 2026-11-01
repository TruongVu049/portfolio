import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from './context/ThemeContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* "user": with prefers-reduced-motion, Framer drops transform animations and keeps fades. */}
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MotionConfig>
  </StrictMode>,
)
