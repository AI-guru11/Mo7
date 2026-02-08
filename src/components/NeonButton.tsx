import { ButtonHTMLAttributes } from 'react'
import { cn } from '../lib/utils'

interface NeonButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'purple' | 'blue' | 'pink' | 'cyan'
  size?: 'sm' | 'md' | 'lg'
}

export function NeonButton({
  children,
  variant = 'purple',
  size = 'md',
  className,
  ...props
}: NeonButtonProps) {
  const variantClasses = {
    purple: 'bg-neon-purple/20 text-neon-purple border-neon-purple hover:shadow-neon-purple',
    blue: 'bg-neon-blue/20 text-neon-blue border-neon-blue hover:shadow-neon-blue',
    pink: 'bg-neon-pink/20 text-neon-pink border-neon-pink hover:shadow-neon-pink',
    cyan: 'bg-neon-cyan/20 text-neon-cyan border-neon-cyan hover:shadow-neon-cyan',
  }

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={cn(
        'rounded-lg border-2 font-semibold',
        'transition-all duration-300',
        'hover:scale-105 active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
