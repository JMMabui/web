import { forwardRef } from 'react'

type Option = {
  label: string
  value: string | number
}

type SelectFieldProps = {
  label?: string
  id?: string
  error?: string
  options: Option[]
  helperText?: string
} & React.SelectHTMLAttributes<HTMLSelectElement>

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  (
    { label, id, options, error, helperText, className = '', ...props },
    ref
  ) => {
    return (
      <div>
        {label && (
          <label htmlFor={id} className="block text-gray-600 mb-1">
            {label}
          </label>
        )}
        <select
          id={id}
          ref={ref} // Adiciona o ref aqui
          className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-gray-300'
          } ${className}`}
          {...props}
        >
          <option value="">Selecione uma opção</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    )
  }
)

SelectField.displayName = 'SelectField'

export default SelectField
