import { MapPin, Search } from 'lucide-react'
import Link from 'next/link'

type Props = {
  showSearch?: boolean
  onSearchClick?: () => void
}

export default function Header({ showSearch = true, onSearchClick }: Props) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 safe-top">
      <div className="flex items-center justify-between px-4 h-[64px]">
        <Link href="/" className="flex items-center gap-2 min-h-0 h-auto">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <MapPin size={18} color="white" strokeWidth={2.5} />
          </div>
          <div className="leading-tight">
            <span className="font-bold text-brand-700 text-senior-base block leading-none">
              MissLou
            </span>
            <span className="font-bold text-accent-600 text-senior-base block leading-none">
              Local
            </span>
          </div>
        </Link>

        {showSearch && (
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 bg-slate-100 rounded-xl px-4 h-[48px] text-slate-500 text-senior-sm min-h-0 flex-1 mx-4 max-w-[240px]"
          >
            <Search size={18} strokeWidth={2} />
            <span>Search...</span>
          </button>
        )}
      </div>
    </header>
  )
}
