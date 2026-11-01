import { ArrowUpRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { NOTES } from '../../data/profile'

const pad = (n) => String(n).padStart(2, '0')

function NoteBody({ note, index }) {
  const published = Boolean(note.href)
  return (
    <div className="grid gap-4 py-8 md:grid-cols-[3rem_minmax(0,1fr)_auto] md:items-start md:gap-8">
      <span className="font-mono text-[11px] text-accent-soft md:pt-2">{pad(index + 1)}</span>
      <div>
        <h3
          className={`font-display text-3xl leading-tight tracking-tight sm:text-4xl ${published ? 'text-white transition-transform duration-500 group-hover:translate-x-1' : 'text-zinc-300'}`}
        >
          {note.title}
        </h3>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500 sm:text-[15px]">{note.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-600">
          {note.topics.map((topic) => (
            <li key={topic}>#{topic}</li>
          ))}
        </ul>
      </div>
      {published ? (
        <span className="inline-flex items-center gap-1.5 text-sm text-zinc-300 group-hover:text-white md:pt-3">
          Read <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      ) : (
        <span className="w-fit rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 md:mt-3">
          In draft
        </span>
      )}
    </div>
  )
}

export default function Notes() {
  return (
    <section id="Notes" className="relative bg-black px-5 py-20 sm:px-8 lg:px-12">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="bg-lines mask-radial absolute inset-0 opacity-40" />
      </div>

      <div className="relative mx-auto max-w-[80rem]">
        <SectionHeading
          index="05"
          eyebrow="Engineering notes"
          title="Writing it down"
          accent="to understand it."
          description="Notes from learning backend and system design: official docs, code I wrote myself, and lessons from real projects."
        />

        <ol className="border-b border-white/[0.08]">
          {NOTES.map((note, i) => (
            <li key={note.title} className="border-t border-white/[0.08]">
              <Reveal delay={i * 0.05} amount={0.4}>
                {note.href ? (
                  <a href={note.href} target="_blank" rel="noreferrer" className="group block">
                    <NoteBody note={note} index={i} />
                  </a>
                ) : (
                  <NoteBody note={note} index={i} />
                )}
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
