import { forwardRef } from 'react'

interface Payment {
  id: string
  studentName: string
  amount: number
  paymentDate: string
  method: string
  reference?: string
  status: string
}

interface PaymentReceiptProps {
  payment: Payment
  schoolInfo: {
    name: string
    address: string
    phone: string
    email: string
  }
}

export const PaymentReceipt = forwardRef<HTMLDivElement, PaymentReceiptProps>(
  ({ payment, schoolInfo }, ref) => {
    return (
      <div ref={ref} className="p-8 bg-white">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">{schoolInfo.name}</h1>
          <p className="text-gray-600">{schoolInfo.address}</p>
          <p className="text-gray-600">
            Tel: {schoolInfo.phone} | Email: {schoolInfo.email}
          </p>
        </div>

        {/* Número do Recibo */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold">RECIBO DE PAGAMENTO</h2>
          <p className="text-gray-600">Nº {payment.id}</p>
        </div>

        {/* Informações do Pagamento */}
        <div className="space-y-4 mb-8">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Estudante:</span>
            <span>{payment.studentName}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Data do Pagamento:</span>
            <span>
              {new Date(payment.paymentDate).toLocaleDateString('pt-BR')}
            </span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Valor:</span>
            <span>{payment.amount.toLocaleString('pt-BR')} MT</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Método de Pagamento:</span>
            <span>{payment.method}</span>
          </div>

          {payment.reference && (
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Referência:</span>
              <span>{payment.reference}</span>
            </div>
          )}

          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Status:</span>
            <span
              className={`font-medium
              ${
                payment.status === 'CONFIRMED'
                  ? 'text-green-600'
                  : payment.status === 'PENDING'
                    ? 'text-yellow-600'
                    : 'text-red-600'
              }`}
            >
              {payment.status}
            </span>
          </div>
        </div>

        {/* Assinaturas */}
        <div className="mt-16 flex justify-between">
          <div className="text-center">
            <div className="border-t border-gray-400 w-48 pt-2">
              Assinatura do Responsável
            </div>
          </div>
          <div className="text-center">
            <div className="border-t border-gray-400 w-48 pt-2">
              Carimbo da Instituição
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="mt-16 text-center text-sm text-gray-500">
          <p>Este documento serve como comprovante oficial de pagamento.</p>
          <p>Emitido em: {new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    )
  }
)
