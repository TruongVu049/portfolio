import Reveal from '../ui/Reveal'
import { EXPERTISE } from '../../data/expertise'
import { findProject } from '../../data/projects'
import { caseStudyHref } from '../../hooks/useCaseStudyRoute'

const pad = (n) => String(n).padStart(2, '0')

function UsedIn({ slugs }) {
  const projects = slugs.map(findProject).filter(Boolean)
  if (projects.length === 0) return null
  return (
    <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-zinc-500">
      <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">Used in</span>
      {projects.map((project) => (
        <a key={project.slug} href={caseStudyHref(project.slug)} className="text-zinc-400 underline-offset-4 hover:text-white hover:underline">
          {project.short}
        </a>
      ))}
    </p>
  )
}

/** Skills grouped by depth of experience, each tied to where it was used. */
export default function ExpertiseList() {
  return (
    <ol className="border-b border-white/[0.08]">
      {EXPERTISE.map((group, i) => (
        <li key={group.group} className="border-t border-white/[0.08]">
          <Reveal delay={i * 0.05} amount={0.4} className="grid gap-4 py-7 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-10">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[11px] text-accent-soft">{pad(i + 1)}</span>
              <div>
                <h3 className="font-display text-3xl tracking-tight text-white sm:text-4xl">{group.group}</h3>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-400">{group.level}</p>
              </div>
            </div>
            <div className="pl-9 md:pl-0">
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-[13px] text-zinc-200">
                    {item}
                  </li>
                ))}
              </ul>
              {group.note && <p className="mt-3 text-[13px] leading-6 text-zinc-500">{group.note}</p>}
              <UsedIn slugs={group.usedIn} />
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  )
}
