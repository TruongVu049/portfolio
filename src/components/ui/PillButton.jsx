import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/cn'

export default function PillButton({ children, className, ...rest }) {
  return (
    <button
      className={cn(
        'group relative cursor-pointer overflow-hidden rounded-full bg-white px-4 py-3 text-center font-semibold text-black',
        className,
      )}
      {...rest}
    >
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-accent-deep transition-all duration-300 group-hover:scale-[100.8]" />
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
          {children}
        </span>
      </div>
      <div className="absolute top-0 left-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 text-[#ffffff]">
        <span>{children}</span>
        <ArrowRight size={18} />
      </div>
    </button>
  )
}
