import { AlertCircle } from 'lucide-react'

interface ErrorComponentProps {
  message?: string
  onRetry?: () => void
}

export function ErrorComponent({
  message = 'Ocorreu um erro ao carregar os dados',
  onRetry,
}: ErrorComponentProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm rounded-xl border border-red-100">
      <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Ops! Algo deu errado
      </h3>
      <p className="text-gray-500 text-center mb-6">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
        >
          Tentar novamente
        </button>
      )}
    </div>
  )
}
