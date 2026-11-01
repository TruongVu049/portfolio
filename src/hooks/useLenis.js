import { useEffect } from 'react'
import { useReducedMotion } from 'framer-motion'
import Lenis from 'lenis'
import { leaveCaseStudy, readCaseStudySlug } from './useCaseStudyRoute'

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Smooth wheel scrolling; the instance is exposed on window for scroll-to links.
 * Skipped with reduced motion, so the page scrolls natively; follows the OS setting live.
 */
export function useLenis() {
  const reduceMotion = useReducedMotion()
  useEffect(() => {
    if (reduceMotion) return undefined
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true })
    let frameId
    const loop = (time) => {
      lenis.raf(time)
      frameId = requestAnimationFrame(loop)
    }
    frameId = requestAnimationFrame(loop)
    window.lenis = lenis
    return () => {
      cancelAnimationFrame(frameId)
      lenis.destroy()
      if (window.lenis === lenis) delete window.lenis
    }
  }, [reduceMotion])
}

/** Scroll to a section id using Lenis when available. */
export function scrollToId(id) {
  const target = document.getElementById(id)
  if (!target) {
    // Home sections are not mounted while a case study is open.
    if (readCaseStudySlug()) leaveCaseStudy(id)
    return
  }
  if (window.lenis) window.lenis.scrollTo(target, { duration: 1.4 })
  else target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
}

/** Jump without animation: `id` of a section, or the top of the page when omitted. */
export function jumpTo(id) {
  const target = id ? document.getElementById(id) : 0
  if (target === null) return
  if (window.lenis) {
    window.lenis.resize()
    window.lenis.scrollTo(target, { immediate: true, force: true })
  } else if (target === 0) window.scrollTo(0, 0)
  else target.scrollIntoView()
}
