import { useState } from 'react'
import Button from './Button'

interface AttachmentViewerProps {
  url: string
  onClose: () => void
}

export function AttachmentViewer({ url, onClose }: AttachmentViewerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isPDF = url.toLowerCase().endsWith('.pdf')

  const handleLoad = () => {
    setIsLoading(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setError('Erro ao carregar o comprovante')
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Visualizar Comprovante</h3>
          <Button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <span className="sr-only">Fechar</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          )}

          {error ? (
            <div className="absolute inset-0 flex items-center justify-center text-red-600">
              {error}
            </div>
          ) : isPDF ? (
            <iframe
              src={url}
              className="w-full h-full"
              onLoad={handleLoad}
              onError={handleError}
              title="Visualizador de PDF"
            />
          ) : (
            <img
              src={url}
              alt="Comprovante de pagamento"
              className="w-full h-full object-contain"
              onLoad={handleLoad}
              onError={handleError}
            />
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <Button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  )
}
