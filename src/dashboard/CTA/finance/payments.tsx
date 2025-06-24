import { useQuery } from '@tanstack/react-query'
import {
  getAllInvoice,
  type invoiceExtendedResponse,
} from '@/http/finances/invoices'
import { useState, useMemo } from 'react'
import { PaymentForm } from '@/components/paymentForm'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorComponent } from '@/components/ErrorComponent'
import Button from '@/components/Button'
import { CheckCircle, Search } from 'lucide-react'

export function PaymentsFinances() {
  const {
    data: faturas,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['invoice'],
    queryFn: getAllInvoice,
  })

  const [search, setSearch] = useState('')
  const [selectedInvoice, setSelectedInvoice] =
    useState<invoiceExtendedResponse | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Apenas faturas pendentes
  const filteredFaturas = useMemo(() => {
    if (!faturas) return []
    return faturas.filter((f: invoiceExtendedResponse) => {
      const matchesSearch =
        f.student.name.toLowerCase().includes(search.toLowerCase()) ||
        f.student.surname.toLowerCase().includes(search.toLowerCase())
      return (
        matchesSearch &&
        (f.status === 'PENDENTE' ||
          f.status === 'ATRASADO' ||
          f.status === 'PARCIALMENTE_PAGO')
      )
    })
  }, [faturas, search])

  // Função para saber se a fatura está atrasada
  const isOverdue = (f: invoiceExtendedResponse) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dueDate = new Date(Number(f.year), Number(f.month), 0)
    return dueDate < today
  }

  // Função para calcular multa
  const getLateFee = (f: invoiceExtendedResponse) => {
    return f.LateFee && f.LateFee.length > 0
      ? f.LateFee.reduce((sum, fee) => sum + fee.amount, 0)
      : 0
  }

  const handlePaymentSuccess = () => {
    setShowSuccess(true)
    setSelectedInvoice(null)
  }

  const handleCancelPayment = () => {
    setSelectedInvoice(null)
  }

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorComponent message="Erro ao carregar faturas" />

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Registrar Pagamento
      </h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Lista de Faturas Pendentes */}
        <div className="flex-1">
          <div className="relative mb-4">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por estudante..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            {filteredFaturas.length === 0 && (
              <div className="text-gray-500 text-center py-8">
                Nenhuma fatura pendente encontrada.
              </div>
            )}
            {filteredFaturas.map((f: invoiceExtendedResponse) => {
              const overdue = isOverdue(f)
              const lateFee = getLateFee(f)
              const total = Number(f.amount) + lateFee
              return (
                <div
                  key={f.id}
                  className={`flex items-center justify-between bg-white rounded-lg shadow-sm px-4 py-3 border ${selectedInvoice?.id === f.id ? 'ring-2 ring-blue-400' : ''}`}
                >
                  <div>
                    <div className="font-semibold text-gray-800 flex items-center gap-2">
                      {f.student.name} {f.student.surname}
                      {overdue && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                          Atrasada
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      {f.course?.courseName || 'Sem Curso'} | {f.month}/{f.year}
                    </div>
                    <div className="text-sm font-bold text-blue-700 mt-1">
                      {total.toLocaleString('pt-MZ', {
                        style: 'currency',
                        currency: 'MZN',
                      })}
                      {lateFee > 0 && (
                        <span className="ml-2 text-xs text-orange-600">
                          + Multa:{' '}
                          {lateFee.toLocaleString('pt-MZ', {
                            style: 'currency',
                            currency: 'MZN',
                          })}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1"
                    onClick={() => setSelectedInvoice(f)}
                  >
                    Registrar Pagamento
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
        {/* Detalhe e Formulário */}
        <div className="w-full md:w-[400px]">
          {selectedInvoice && !showSuccess && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Detalhes da Fatura
              </h3>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Estudante:</span>{' '}
                {selectedInvoice?.student.name}{' '}
                {selectedInvoice?.student.surname}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Curso:</span>{' '}
                {selectedInvoice?.course?.courseName || 'Sem Curso'}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Mês/Ano:</span>{' '}
                {selectedInvoice?.month}/{selectedInvoice?.year}
              </div>
              <div className="mb-2 text-gray-700">
                <span className="font-semibold">Valor:</span>{' '}
                {Number(selectedInvoice?.amount).toLocaleString('pt-MZ', {
                  style: 'currency',
                  currency: 'MZN',
                })}
                {getLateFee(selectedInvoice) > 0 && (
                  <span className="ml-2 text-xs text-orange-600">
                    + Multa:{' '}
                    {getLateFee(selectedInvoice).toLocaleString('pt-MZ', {
                      style: 'currency',
                      currency: 'MZN',
                    })}
                  </span>
                )}
              </div>
              {isOverdue(selectedInvoice) && (
                <div className="mb-2 text-xs text-red-600 font-semibold">
                  Esta fatura está atrasada e possui multa.
                </div>
              )}
              <div className="mb-2 text-gray-700 font-bold">
                Total a pagar:{' '}
                {(
                  Number(selectedInvoice?.amount) + getLateFee(selectedInvoice)
                ).toLocaleString('pt-MZ', {
                  style: 'currency',
                  currency: 'MZN',
                })}
              </div>
              <div className="mt-4">
                {selectedInvoice && (
                  <PaymentForm
                    invoiceId={selectedInvoice.id}
                    onPaymentSuccess={handlePaymentSuccess}
                    onCancel={handleCancelPayment}
                  />
                )}
              </div>
            </div>
          )}
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center justify-center">
              <CheckCircle size={40} className="text-green-600 mb-2" />
              <div className="text-lg font-semibold text-green-700 mb-2">
                Pagamento registrado com sucesso!
              </div>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700 mt-2"
                onClick={() => setShowSuccess(false)}
              >
                Registrar Novo Pagamento
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
