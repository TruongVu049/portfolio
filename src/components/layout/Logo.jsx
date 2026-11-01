import { PROFILE } from '../../data/profile'

/** Italic monogram used in the top-left corner and the menu. */
export default function Logo({ className = '' }) {
  return (
    <span
      className={`select-none font-sans text-[22px] font-bold italic leading-none tracking-[-0.08em] ${className}`}
      aria-label={`${PROFILE.firstName} ${PROFILE.lastName}`}
    >
      {PROFILE.initials}
    </span>
  )
}
