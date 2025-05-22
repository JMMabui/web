import { useState } from 'react'
import Button from '@/components/Button'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  getInvoicesByStudentId,
  createInvoice,
  type invoiceExtendedResponse,
} from '../../http/finances/invoices'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorComponent } from '@/components/ErrorComponent'

// interface Invoice {
//   id: string
//   month: string
//   date: string
//   status: string
//   amount: number
//   dueDate: string
//   paymentDate?: string
//   paymentMethod?: string
//   courseId: string
// }

export function MonthlyFee() {
  const [showForm, setShowForm] = useState(false)
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [selectedInvoice, setSelectedInvoice] =
    useState<invoiceExtendedResponse | null>(null)
  const studentId = localStorage.getItem('student_login_id')

  // Fetch invoices
  const {
    data: invoices,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['invoices', studentId],
    queryFn: () => getInvoicesByStudentId(studentId!),
    enabled: !!studentId,
  })

  const courseId = localStorage.getItem('course_id')

  // Create invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      alert('Fatura criada com sucesso!')
      setShowForm(false)
      setSelectedMonths([])
    },
    onError: (error: any) => {
      console.error('Erro ao criar fatura:', error)

      // Verificar a estrutura do erro e o status
      if (error?.response?.status === 409) {
        alert('Já existe uma fatura para este estudante e mês(es).')
      } else {
        alert('Erro ao criar fatura. Tente novamente.')
      }
    },
  })

  const months = [
    'Janeiro',
    'Fevereiro',
    'Marco',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ]

  const getDueDate = (month: string): string => {
    const now = new Date() // Obtém a data e hora atuais
    const currentYear = now.getFullYear()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentSecond = now.getSeconds()

    const monthIndex = months.indexOf(month)
    const dueDate = new Date(
      currentYear,
      monthIndex,
      5,
      currentHour,
      currentMinute,
      currentSecond
    ) // Usa a hora atual
    return dueDate.toISOString() // Retorna a data completa com hora
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId || selectedMonths.length === 0) return

    try {
      const dataSubmited = await createInvoiceMutation.mutateAsync({
        studentId,
        courseId,
        months: selectedMonths.map(month => month.toUpperCase()),
        type: 'MENSALIDADE',
        dueDate: getDueDate(selectedMonths[selectedMonths.length - 1]),
      })

      console.log('Fatura criada com sucesso:', dataSubmited)
      setShowForm(false)
    } catch (error) {
      console.error('Erro ao criar fatura:', error)
    }
  }

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorComponent />

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Gestão de Mensalidades
      </h1>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Detalhes da Fatura
              </h2>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Informações Básicas
                </h3>
                <div className="mt-2 space-y-2">
                  <p>
                    <span className="font-medium">Mês:</span>{' '}
                    {selectedInvoice.month}
                  </p>
                  <p>
                    <span className="font-medium">Data de Emissão:</span>{' '}
                    {selectedInvoice.createdAt instanceof Date
                      ? selectedInvoice.createdAt.toLocaleDateString('pt-BR')
                      : selectedInvoice.createdAt}
                  </p>
                  <p>
                    <span className="font-medium">Vencimento:</span>{' '}
                    {selectedInvoice.dueDate instanceof Date
                      ? selectedInvoice.dueDate.toLocaleDateString('pt-BR')
                      : selectedInvoice.dueDate}
                  </p>
                  <p>
                    <span className="font-medium">Valor:</span>{' '}
                    {selectedInvoice.amount.toLocaleString('pt-BR', {
                      style: 'currency',
                      currency: 'MZN',
                    })}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        selectedInvoice.status === 'PAGO'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedInvoice.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-700">
                  Informações do Pagamento
                </h3>
                <div className="mt-2 space-y-2">
                  <p>
                    <span className="font-medium">ID da Fatura:</span>{' '}
                    {selectedInvoice.id}
                  </p>
                  <p>
                    <span className="font-medium">ID do Estudante:</span>{' '}
                    {studentId}
                  </p>
                  {selectedInvoice.payments[0].paymentDate && (
                    <p>
                      <span className="font-medium">Data do Pagamento:</span>{' '}
                      {selectedInvoice.payments[0].paymentDate instanceof Date
                        ? selectedInvoice.payments[0].paymentDate.toLocaleDateString(
                            'pt-BR'
                          )
                        : selectedInvoice.payments[0].paymentDate}
                    </p>
                  )}
                  {selectedInvoice.payments[0].paymentMethod && (
                    <p>
                      <span className="font-medium">Método de Pagamento:</span>{' '}
                      {selectedInvoice.payments[0].paymentMethod}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                variant="secondary"
                onClick={() => setSelectedInvoice(null)}
              >
                Fechar
              </Button>
              {selectedInvoice.status !== 'PAGO' && (
                <Button
                  onClick={() => {
                    // TODO: Implement payment functionality
                    console.log(
                      'Iniciar pagamento para fatura:',
                      selectedInvoice.id
                    )
                  }}
                >
                  Realizar Pagamento
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invoices List */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Faturas</h2>
        <div className="space-y-4 overflow-auto h-96">
          {invoices?.map((invoice: invoiceExtendedResponse) => (
            <div
              key={invoice.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Mensalidade -{' '}
                    {invoice.month
                      .toLowerCase()
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </h3>
                  <p className="text-gray-600">
                    Data de emissão: {(() => {
                      const date =
                        invoice.createdAt instanceof Date
                          ? invoice.createdAt
                          : new Date(invoice.createdAt)
                      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
                    })()}
                  </p>
                  <p className="text-gray-600">
                    Vencimento: {(() => {
                      const date =
                        invoice.dueDate instanceof Date
                          ? invoice.dueDate
                          : new Date(invoice.dueDate)
                      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
                    })()}
                  </p>
                  <p className="text-gray-600">
                    Valor:{' '}
                    {invoice.amount.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{' '}
                    MT
                  </p>
                  <p className="text-gray-600">
                    Multa:{' '}
                    {invoice.LateFee.map(fee => fee.amount).toLocaleString(
                      'pt-BR',
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}{' '}
                    MT
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      invoice.status === 'PAGO'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {invoice.status}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedInvoice(invoice)}
                  >
                    Detalhes
                  </Button>

                  {invoice.status !== 'PAGO' && (
                    <Button
                      size="md"
                      className=" bg-green-400 hover:bg-green-600"
                    >
                      Pagar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate New Invoice Button */}
      <div className="text-center mb-8">
        <Button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Gerar Nova Fatura
        </Button>
      </div>

      {/* New Invoice Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Criar Nova Fatura
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione os Meses
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {months.map(month => (
                    <label
                      key={month}
                      className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedMonths.includes(month)}
                        onChange={e => {
                          if (e.target.checked) {
                            setSelectedMonths([...selectedMonths, month])
                          } else {
                            setSelectedMonths(
                              selectedMonths.filter(m => m !== month)
                            )
                          }
                        }}
                        className="form-checkbox h-4 w-4 text-blue-500"
                      />
                      <span>{month}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setShowForm(false)
                    setSelectedMonths([])
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={
                    selectedMonths.length === 0 ||
                    createInvoiceMutation.isPending
                  }
                >
                  {createInvoiceMutation.isPending
                    ? 'Criando...'
                    : 'Criar Fatura'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
