import type { FC, ForwardedRef } from 'react'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  fullWidth?: boolean
}

const Input: FC<InputProps> = forwardRef(
  (
    { label, error, helperText, fullWidth = false, className = '', ...props },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const widthClass = fullWidth ? 'w-full' : ''

    return (
      <div className={`${widthClass}`}>
        {label && <label className="block text-gray-600">{label}</label>}
        <input
          ref={ref}
          className={`p-2 border rounded-lg
            block w-full border-gray-300 shadow-sm
            focus:border-blue-500 focus:ring-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
