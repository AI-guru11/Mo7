import { ReactNode } from 'react'
import { cn } from '../lib/utils'

interface GlassCardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <div
      className={cn(
        'glass rounded-xl p-6',
        'bg-white/5 backdrop-blur-md border border-white/10',
        hover && 'transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-neon-purple',
        className
      )}
    >
      {children}
    </div>
  )
}
