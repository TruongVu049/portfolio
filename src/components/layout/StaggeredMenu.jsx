import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Plus } from 'lucide-react'
import Logo from './Logo'
import { scrollToId } from '../../hooks/useLenis'

const LAYER_COLORS = ['#93c5fd', '#1d4ed8']
// The open panel is white in both themes, so the toggle turns dark.
const OPEN_BUTTON_COLOR = '#0b0b0f'

/**
 * Off-canvas navigation: two coloured pre-layers sweep in, then the panel,
 * then the items stagger up. Closing reverses everything in one quick tween.
 *
 * @param {{ items: {label:string, target:string}[], socials: {label:string, href:string}[], buttonColor?: string }} props
 */
export default function StaggeredMenu({ items, socials, buttonColor = '#fff' }) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const layersRef = useRef([])
  const iconRef = useRef(null)
  const labelRef = useRef(null)
  const timelineRef = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([panelRef.current, ...layersRef.current], { xPercent: 100 })
    })
    return () => ctx.revert()
  }, [])

  const playOpen = useCallback(() => {
    timelineRef.current?.kill()
    const panel = panelRef.current
    const labels = panel.querySelectorAll('[data-menu-label]')
    const numbers = panel.querySelectorAll('[data-menu-number]')
    const extras = panel.querySelectorAll('[data-menu-extra]')

    gsap.set(labels, { yPercent: 140, rotate: 10 })
    gsap.set([numbers, extras], { opacity: 0, y: 12 })

    const tl = gsap.timeline()
    layersRef.current.forEach((layer, i) => {
      tl.fromTo(layer, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07)
    })
    const panelStart = layersRef.current.length * 0.07 + 0.08
    tl.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.65, ease: 'power4.out' }, panelStart)
    tl.to(labels, { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: 0.1 }, panelStart + 0.1)
    tl.to(numbers, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08 }, panelStart + 0.25)
    tl.to(extras, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.06 }, panelStart + 0.45)
    timelineRef.current = tl
  }, [])

  const playClose = useCallback(() => {
    timelineRef.current?.kill()
    timelineRef.current = gsap.to([panelRef.current, ...layersRef.current], {
      xPercent: 100,
      duration: 0.32,
      ease: 'power3.in',
    })
  }, [])

  useEffect(() => {
    gsap.to(iconRef.current, { rotate: open ? 225 : 0, duration: open ? 0.8 : 0.35, ease: open ? 'power4.out' : 'power3.inOut' })
    gsap.to(labelRef.current, { yPercent: open ? -50 : 0, duration: 0.5, ease: 'power4.out' })
    if (open) playOpen()
    else playClose()
    if (window.lenis) open ? window.lenis.stop() : window.lenis.start()
  }, [open, playOpen, playClose])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const handleNavigate = (target) => {
    setOpen(false)
    // Let Lenis resume before scrolling.
    setTimeout(() => scrollToId(target), 350)
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-6 sm:px-6">
        <button
          type="button"
          onClick={() => handleNavigate('Home')}
          className="pointer-events-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white"
          aria-label="Back to top"
        >
          <Logo />
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-menu-panel"
          className="pointer-events-auto flex cursor-pointer items-center gap-1.5 text-[19px] font-medium"
          style={{ color: open ? OPEN_BUTTON_COLOR : buttonColor }}
        >
          <span className="relative inline-block h-[1.2em] overflow-hidden leading-[1.2]">
            <span ref={labelRef} className="flex flex-col">
              <span>Menu</span>
              <span>Close</span>
            </span>
          </span>
          <span ref={iconRef} className="flex">
            <Plus size={22} strokeWidth={2.4} />
          </span>
        </button>
      </header>

      {LAYER_COLORS.map((color, i) => (
        <div
          key={color}
          ref={(el) => (layersRef.current[i] = el)}
          className="absolute inset-y-0 right-0 w-full sm:w-[clamp(320px,40vw,460px)]"
          style={{ background: color }}
          aria-hidden="true"
        />
      ))}

      <aside
        id="site-menu-panel"
        ref={panelRef}
        aria-hidden={!open}
        // Literal colours (not theme tokens): the panel stays white with dark text in both themes.
        className={`absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto bg-[#ffffff] px-8 pb-10 pt-32 text-[#0b0b0f] sm:w-[clamp(320px,40vw,460px)] ${open ? 'pointer-events-auto' : ''}`}
      >
        <ul className="flex flex-col gap-1">
          {items.map((item, i) => (
            <li key={item.target} className="relative overflow-hidden">
              <button
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => handleNavigate(item.target)}
                className="group flex w-full cursor-pointer items-start text-left"
              >
                <span
                  data-menu-label
                  className="inline-block text-[3.4rem] font-semibold uppercase leading-none tracking-[-0.04em] transition-colors group-hover:text-accent-deep sm:text-[3.8rem]"
                >
                  {item.label}
                </span>
                <span data-menu-number className="ml-2 mt-1 text-sm font-normal text-accent-deep">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-10">
          <h3 data-menu-extra className="mb-3 text-sm font-medium text-accent-deep">
            Links
          </h3>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {socials.map((social) => (
              <li key={social.label} data-menu-extra>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  tabIndex={open ? 0 : -1}
                  className="text-lg font-medium hover:text-accent-deep"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
