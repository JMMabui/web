import type { FC } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
  className?: string
}

export const LoadingSpinner: FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'text-blue-600',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <output
        className={`${sizeClasses[size]} ${color} animate-spin rounded-full border-2 border-current border-t-transparent`}
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </output>
    </div>
  )
}
