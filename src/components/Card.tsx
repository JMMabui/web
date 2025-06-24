import type { FC, ReactNode } from 'react'

interface CardProps {
  title?: string
  children?: ReactNode
  className?: string
  footer?: ReactNode
  value?: number
  icon: React.ElementType
  iconColor?: string
  onClick?: () => void
  valueFormatter?: (value: number) => string
}

const Card: FC<CardProps> = ({
  title,
  // children,
  className = '',
  footer,
  value,
  icon: Icon,
  iconColor,
  onClick,
  valueFormatter,
}) => {
  const isClickable = !!onClick
  const cardClasses = `bg-white rounded-lg shadow-md overflow-hidden ${className} ${
    isClickable
      ? 'cursor-pointer transition-transform duration-200 hover:scale-105 hover:shadow-lg'
      : ''
  }`

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      onKeyDown={e => {
        if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
          onClick()
        }
      }}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
    >
      {title && (
        <div className="bg-white p-6 rounded-lg flex items-center justify-between">
          <div>
            <h2 className="text-md font-semibold text-gray-800">{title}</h2>
            <p className="text-2xl font-bold text-gray-700">
              {value !== undefined
                ? valueFormatter
                  ? valueFormatter(value)
                  : new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'MZN',
                    }).format(value)
                : null}
            </p>
          </div>
          <Icon size={30} className={iconColor} />
        </div>
      )}

      {/* <div className="p-6">{children}</div> */}
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  )
}

export default Card
