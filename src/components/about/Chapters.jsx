import { useRef } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

/** Vertical timeline whose glowing line fills as you scroll. */
export default function Chapters({ chapters, label = 'Chapter' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.75', 'end 0.6'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })

  return (
    <div ref={ref} className="relative mt-10 pl-8 sm:pl-10">
      <div className="absolute bottom-2 left-[5px] top-2 w-px bg-white/10" />
      <motion.div
        style={{ scaleY: fill }}
        className="absolute bottom-2 left-[5px] top-2 w-px origin-top bg-linear-to-b from-accent-soft via-accent to-accent-deep"
      />
      <ol className="space-y-12">
        {chapters.map((chapter) => (
          <motion.li
            key={chapter.n}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative"
          >
            <motion.span
              initial={{ scale: 0.4, backgroundColor: '#27272a' }}
              whileInView={{ scale: 1, backgroundColor: '#93c5fd' }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6 }}
              className="absolute -left-8 top-2 h-[11px] w-[11px] rounded-full shadow-[0_0_14px_2px_rgba(59,130,246,0.6)] sm:-left-10"
            />
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">{label} {chapter.n}</p>
            <h3 className="mt-2 font-display text-3xl text-white sm:text-4xl">{chapter.title}</h3>
            <p className="mt-3 max-w-lg text-sm leading-7 text-zinc-500 sm:text-base">{chapter.body}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  )
}
