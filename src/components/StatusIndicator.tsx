import { cn } from '../lib/utils'

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'loading'
  label?: string
  className?: string
}

export function StatusIndicator({ status, label, className }: StatusIndicatorProps) {
  const statusConfig = {
    online: {
      color: 'bg-green-500',
      glow: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
      text: 'System Online',
    },
    offline: {
      color: 'bg-red-500',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
      text: 'System Offline',
    },
    loading: {
      color: 'bg-yellow-500',
      glow: 'shadow-[0_0_20px_rgba(234,179,8,0.5)]',
      text: 'Initializing...',
    },
  }

  const config = statusConfig[status]

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className="relative">
        <div
          className={cn(
            'w-3 h-3 rounded-full',
            config.color,
            config.glow,
            status === 'online' && 'animate-pulse'
          )}
        />
        {status === 'online' && (
          <div
            className={cn(
              'absolute inset-0 w-3 h-3 rounded-full',
              config.color,
              'animate-ping opacity-75'
            )}
          />
        )}
      </div>
      <span className="text-sm font-medium text-white/90">
        {label || config.text}
      </span>
    </div>
  )
}
