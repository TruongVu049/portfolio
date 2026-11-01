import { useEffect, useState } from 'react'

/** hh:mm:ss AM/PM in the given IANA time zone, ticking every second. */
export default function LiveClock({ timeZone, className = '' }) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const text = now.toLocaleTimeString('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  return <time className={className}>{text}</time>
}
