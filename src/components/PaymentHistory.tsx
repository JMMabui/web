import { useState } from 'react'
import type { Payment } from '@/http/finances/payments'
import { AttachmentViewer } from './AttachmentViewer'
import Button from './Button'

interface PaymentHistoryProps {
  payments: Payment[]
}

export function PaymentHistory({ payments }: PaymentHistoryProps) {
  const [selectedAttachment, setSelectedAttachment] = useState<string | null>(
    null
  )

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'MZN',
    })
  }

  const getMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      DINHEIRO: 'Dinheiro',
      CARTAO_CREDITO: 'Cartão de Crédito',
      CARTAO_DEBITO: 'Cartão de Débito',
      TRANSFERENCIA: 'Transferência',
      DEPOSITO: 'Depósito',
      OUTROS: 'Outros',
    }
    return methods[method] || method
  }

  const getStatusLabel = (status: string) => {
    const statuses: Record<string, { label: string; color: string }> = {
      PENDING: { label: 'Pendente', color: 'text-yellow-600 bg-yellow-100' },
      CONFIRMED: { label: 'Confirmado', color: 'text-green-600 bg-green-100' },
      FAILED: { label: 'Falhou', color: 'text-red-600 bg-red-100' },
    }
    return (
      statuses[status] || { label: status, color: 'text-gray-600 bg-gray-100' }
    )
  }

  return (
    <div className="bg-white border rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Referência
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comprovante
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Nenhum pagamento registrado
                </td>
              </tr>
            ) : (
              payments.map(payment => {
                const status = getStatusLabel(payment.status)
                return (
                  <tr key={payment.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(payment.paymentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatAmount(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getMethodLabel(payment.method)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.reference || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.attachmentUrl ? (
                        <Button
                          onClick={() =>
                            setSelectedAttachment(payment.attachmentUrl)
                          }
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Ver Comprovante
                        </Button>
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedAttachment && (
        <AttachmentViewer
          url={selectedAttachment}
          onClose={() => setSelectedAttachment(null)}
        />
      )}
    </div>
  )
}
