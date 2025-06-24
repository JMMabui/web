import type { FC } from 'react'
import Modal from './Modal'
import Button from './Button'
import {
  Printer,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'

type Invoice = {
  id: string
  month: number
  year: number
  amount: number
  status: string
  LateFee?: { amount: number }[]
}

type Student = {
  id: string
  name: string
  surname: string
  invoices: Invoice[]
}

interface StudentFinancialHistoryModalProps {
  student: Student | null
  isOpen: boolean
  onClose: () => void
}

const StudentFinancialHistoryModal: FC<StudentFinancialHistoryModalProps> = ({
  student,
  isOpen,
  onClose,
}) => {
  if (!student) return null

  const handlePrint = () => {
    const printContent = document.getElementById('financial-history-print')
    if (printContent) {
      const newWindow = window.open('', '', 'height=800,width=1200')
      newWindow?.document.write(`
        <html>
          <head>
            <title>Extrato Financeiro - ${student.name} ${student.surname}</title>
            <style>
              @media print {
                body { font-family: Arial, sans-serif; }
                .print-header { text-align: center; margin-bottom: 20px; }
                .print-summary { display: flex; justify-content: space-between; margin-bottom: 20px; }
                .timeline-item { margin-bottom: 15px; padding: 10px; border-left: 3px solid #ccc; }
                .status-paid { color: green; }
                .status-pending { color: red; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `)
      newWindow?.document.close()
      newWindow?.print()
    }
  }

  const allTransactions = student.invoices
    .map(inv => {
      const lateFee =
        inv.LateFee?.reduce((sum, fee) => sum + fee.amount, 0) || 0
      return {
        ...inv,
        totalAmount: inv.amount + lateFee,
      }
    })
    .sort(
      (a, b) =>
        new Date(b.year, b.month - 1).getTime() -
        new Date(a.year, a.month - 1).getTime()
    )

  const totalGenerated = allTransactions.reduce(
    (sum, t) => sum + t.totalAmount,
    0
  )
  const totalPaid = allTransactions
    .filter(t => t.status === 'PAGO')
    .reduce((sum, t) => sum + t.totalAmount, 0)
  const totalDebt = totalGenerated - totalPaid

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Histórico Financeiro - ${student.name} ${student.surname}`}
    >
      <div id="financial-history-print" className="p-4">
        {/* Enhanced Header with Financial Summary */}
        <div className="mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {student.name} {student.surname}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-green-700">
                <TrendingUp size={16} />
                <span className="font-semibold">Total Faturado</span>
              </div>
              <p className="text-lg font-bold text-green-800">
                {new Intl.NumberFormat('pt-MZ', {
                  style: 'currency',
                  currency: 'MZN',
                }).format(totalGenerated)}
              </p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700">
                <CheckCircle size={16} />
                <span className="font-semibold">Total Pago</span>
              </div>
              <p className="text-lg font-bold text-blue-800">
                {new Intl.NumberFormat('pt-MZ', {
                  style: 'currency',
                  currency: 'MZN',
                }).format(totalPaid)}
              </p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <TrendingDown size={16} />
                <span className="font-semibold">Saldo Devedor</span>
              </div>
              <p className="text-lg font-bold text-red-800">
                {new Intl.NumberFormat('pt-MZ', {
                  style: 'currency',
                  currency: 'MZN',
                }).format(totalDebt)}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline View */}
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <FileText size={20} /> Linha do Tempo de Transações
        </h3>
        <div className="max-h-96 overflow-y-auto pr-2">
          <div className="space-y-4">
            {allTransactions.map((transaction, index) => (
              <div key={transaction.id} className="relative">
                {/* Timeline Line */}
                {index < allTransactions.length - 1 && (
                  <div className="absolute left-6 top-8 w-0.5 h-8 bg-gray-300" />
                )}

                {/* Timeline Item */}
                <div className="flex items-start gap-4">
                  {/* Timeline Dot */}
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                      transaction.status === 'PAGO'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {transaction.status === 'PAGO' ? (
                      <CheckCircle size={20} />
                    ) : (
                      <XCircle size={20} />
                    )}
                  </div>

                  {/* Transaction Details */}
                  <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-500" />
                        <span className="font-semibold text-gray-800">
                          Fatura de {transaction.month}/{transaction.year}
                        </span>
                      </div>
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${
                          transaction.status === 'PAGO'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-lg font-bold text-gray-700">
                      <DollarSign size={16} />
                      {new Intl.NumberFormat('pt-MZ', {
                        style: 'currency',
                        currency: 'MZN',
                      }).format(transaction.totalAmount)}
                    </div>
                    {transaction.LateFee && transaction.LateFee.length > 0 && (
                      <div className="mt-2 text-sm text-orange-600">
                        <span className="font-semibold">Multas:</span>{' '}
                        {new Intl.NumberFormat('pt-MZ', {
                          style: 'currency',
                          currency: 'MZN',
                        }).format(
                          transaction.LateFee.reduce(
                            (sum, fee) => sum + fee.amount,
                            0
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-4 bg-gray-50 flex justify-end">
        <Button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Printer size={18} className="mr-2" />
          Imprimir Extrato
        </Button>
      </div>
    </Modal>
  )
}

export default StudentFinancialHistoryModal
