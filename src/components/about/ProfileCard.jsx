import { ArrowUpRight, Mail, MapPin } from 'lucide-react'
import GlowCard from '../ui/GlowCard'
import { SOCIAL_ICONS } from '../ui/SocialIcons'
import { PROFILE } from '../../data/profile'
import LiveClock from './LiveClock'
import Critter from './Critter'

const CARD_SOCIALS = [
  { key: 'github', label: 'GitHub' },
  { key: 'linkedin', label: 'LinkedIn' },
].filter(({ key }) => PROFILE.socials[key])

function AvailabilityDot() {
  return (
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
    </span>
  )
}

export default function ProfileCard() {
  return (
    <GlowCard className="overflow-hidden p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-didone text-4xl leading-none tracking-tight text-white sm:text-5xl">
            {PROFILE.firstName} <span className="text-zinc-500">{PROFILE.lastName}</span>
          </h3>
          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-zinc-500">
            <MapPin size={14} /> {PROFILE.locationShort}
            <span className="text-zinc-700">•</span>
            <LiveClock timeZone={PROFILE.timeZone} className="font-mono tabular-nums" />
          </div>
        </div>
        {PROFILE.available && (
          <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-zinc-300">
            <AvailabilityDot /> Available
          </div>
        )}
      </div>

      <div className="relative mx-auto my-6 flex h-[300px] w-[220px] items-center justify-center">
        <Critter />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.08] pt-5">
        <div className="flex items-center gap-2">
          {CARD_SOCIALS.map(({ key, label }) => {
            const Icon = SOCIAL_ICONS[key]
            return (
              <a
                key={key}
                href={PROFILE.socials[key]}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:bg-accent/10 hover:text-white"
              >
                <Icon size={17} />
              </a>
            )
          })}
        </div>
        <a
          href={`mailto:${PROFILE.email}`}
          className="group inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white"
        >
          <Mail size={15} />
          <span className="hidden sm:inline">{PROFILE.email}</span>
          <span className="sm:hidden">Email me</span>
          <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </GlowCard>
  )
}
