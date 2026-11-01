import { useEffect, useState } from 'react'

/**
 * True while the element is on (or near) the screen. Used to pause
 * animation loops, physics and WebGL rendering for off-screen sections.
 *
 * @param {import('react').RefObject<Element>} ref
 * @param {string} rootMargin extra margin so work resumes just before the element scrolls in
 */
export function useInViewport(ref, rootMargin = '200px') {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return inView
}
