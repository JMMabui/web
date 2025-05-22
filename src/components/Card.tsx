import type { FC, ReactNode } from 'react'

interface CardProps {
  title?: string
  children?: ReactNode
  className?: string
  footer?: ReactNode
  value?: number
  icon: React.ElementType
  iconColor?: string
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
  valueFormatter,
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
    >
      {title && (
        <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
          <div>
            <h2 className="text-md font-semibold text-gray-800">{title}</h2>
            <p className="text-2xl font-bold text-gray-700">
              {/* {valueFormatter
                ? valueFormatter(value || 0)
                : new Intl.NumberFormat('pt-MZ', {
                    style: 'currency',
                    currency: 'MZN',
                  }).format(value || 0)} */}
              {value}
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
