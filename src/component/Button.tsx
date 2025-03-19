import type React from 'react'

interface ButtonProps {
  onClick?: () => void // Função a ser chamada no clique
  children: React.ReactNode // Conteúdo dentro do botão (texto ou ícones)
  className?: string // Permite passar classes adicionais do Tailwind CSS
  variant?: 'primary' | 'secondary' | 'danger' // Definir o tipo do botão
  disabled?: boolean // Definir se o botão está desabilitado
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  className = '',
  variant = 'primary',
  disabled = false,
}) => {
  // Definir a classe base do botão
  const baseStyle =
    'px-4 py-2 rounded-md text-white font-semibold focus:outline-none'

  // Variantes de estilos
  const variantStyles = {
    primary:
      'bg-green-600 text-white py-2 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-blue-600 active:bg-blue-700',
    secondary:
      'bg-amber-500 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-amber-600 transition duration-300 active:bg-amber-700',
    danger: 'bg-red-500 hover:bg-red-600 active:bg-red-700',
  }

  // Combinar estilos
  const buttonStyles = `${baseStyle} ${variantStyles[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`

  return (
    <button
      type="button"
      onClick={onClick}
      className={buttonStyles}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button
