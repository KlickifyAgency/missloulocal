import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

type Props = {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'call'
  size?: 'md' | 'lg'
  icon?: LucideIcon
  fullWidth?: boolean
  disabled?: boolean
  className?: string
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'lg',
  icon: Icon,
  fullWidth = false,
  disabled = false,
  className,
}: Props) {
  const base = 'inline-flex items-center justify-center gap-3 font-semibold rounded-2xl transition-all active:scale-95 cursor-pointer border-0'

  const variants = {
    primary:   'bg-brand-600 text-white hover:bg-brand-700 shadow-card',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200',
    outline:   'border-2 border-brand-600 text-brand-600 hover:bg-brand-50',
    call:      'bg-green-600 text-white hover:bg-green-700 shadow-card',
  }

  const sizes = {
    md: 'h-[56px] px-6 text-senior-base',
    lg: 'h-[64px] px-8 text-senior-lg',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {Icon && <Icon size={22} strokeWidth={2} />}
      {children}
    </button>
  )
}
