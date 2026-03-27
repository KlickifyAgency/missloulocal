import {
  Wrench, UtensilsCrossed, HeartPulse, Church,
  Home, CalendarDays, Scale, Car,
  Scissors, PawPrint, Settings, ShoppingBag,
  LucideIcon
} from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  Wrench,
  UtensilsCrossed,
  HeartPulse,
  Church,
  Home,
  CalendarDays,
  Scale,
  Car,
  Scissors,
  PawPrint,
  Settings,
  ShoppingBag,
}

type Props = {
  icon: string
  color: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function CategoryIcon({ icon, color, size = 'md', className }: Props) {
  const Icon = iconMap[icon] ?? Wrench

  const sizes = {
    sm: { container: 'w-10 h-10', icon: 18 },
    md: { container: 'w-14 h-14', icon: 24 },
    lg: { container: 'w-18 h-18', icon: 32 },
  }

  return (
    <div
      className={cn(
        'rounded-2xl flex items-center justify-center flex-shrink-0',
        sizes[size].container,
        className
      )}
      style={{ backgroundColor: color + '18', border: `1.5px solid ${color}30` }}
    >
      <Icon size={sizes[size].icon} style={{ color }} strokeWidth={1.8} />
    </div>
  )
}
