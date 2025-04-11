import { useEffect, useState } from 'react'
import Button from '@/component/Button'

export function MonthlyFee() {
  const [showForm, setShowForm] = useState(false)
  const [newInvoice, setNewInvoice] = useState<{
    months: string[]
    date: string
    status: string
  }>({
    months: [],
    date: '',
    status: 'Não Pago',
  })
  const [invoices, setInvoices] = useState([
    {
      month: 'Abril',
      date: '25/03/2025',
      status: 'Pago',
    },
    {
      month: 'Maio',
      date: '30/04/2025',
      status: 'Não Pago',
    },
    {
      month: 'Junho',
      date: '01/06/2025',
      status: 'Pago',
    },
  ])

  const [studentId, setStudentId] = useState<string | null>(null)

  useEffect(() => {
    setStudentId(localStorage.getItem('student_login_id') || null)
    // console.log('ID do estudante:', studentId) // Mostra o ID do estudante armazenado
  })
  // Função para calcular a data final (dia 5 do mês selecionado)
  const getDueDate = (month: string): string => {
    const currentYear = new Date().getFullYear()
    const monthIndex = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ].indexOf(month)

    const dueDate = new Date(currentYear, monthIndex, 5) // Define o dia 5 para o mês escolhido
    return dueDate.toISOString().split('T')[0] // Retorna no formato YYYY-MM-DD
  }

  // Função para obter o mês mais recente selecionado
  const getMostRecentMonth = (months: string[]): string => {
    const monthOrder = [
      'Janeiro',
      'Fevereiro',
      'Março',
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

    // Ordena os meses selecionados com base no índice do array
    const sortedMonths = months.sort(
      (a, b) => monthOrder.indexOf(b) - monthOrder.indexOf(a)
    )
    return sortedMonths[0] // Retorna o mês mais recente
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Nova fatura criada:', newInvoice, studentId)
  }

  return (
    <div className="flex w-full justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        {/* Lista de faturas */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Facturas
          </h2>
          <div
            className="space-y-4 overflow-y-auto"
            style={{ maxHeight: '400px' }} // Limita a altura e ativa o scroll
          >
            {invoices.map((invoice, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-800">
                    Mensalidade
                  </h3>
                  <p className="text-gray-600">Mes: {invoice.month}</p>
                  <p className="text-gray-600">Data: {invoice.date}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`text-xl font-semibold ${
                      invoice.status === 'Pago'
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {invoice.status}
                  </span>
                  <Button variant="secondary">Detalhe</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botão para adicionar nova fatura */}
        <div className="mt-6 text-center">
          <Button
            className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300"
            onClick={() => setShowForm(true)}
          >
            Gerar nova fatura
          </Button>
        </div>

        {/* Formulário de criação de fatura */}
        {showForm && (
          <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Criar Nova Fatura
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="months"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Selecione os Meses
                </label>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    'Janeiro',
                    'Fevereiro',
                    'Março',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho',
                    'Agosto',
                    'Setembro',
                    'Outubro',
                    'Novembro',
                    'Dezembro',
                  ].map(month => (
                    <label key={month} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        name="months"
                        value={month}
                        checked={newInvoice.months.includes(month)}
                        onChange={e => {
                          const selectedMonths = e.target.checked
                            ? [...newInvoice.months, month]
                            : newInvoice.months.filter(m => m !== month)
                          const mostRecentMonth =
                            getMostRecentMonth(selectedMonths)
                          setNewInvoice(prevInvoice => ({
                            ...prevInvoice,
                            months: selectedMonths,
                            date: selectedMonths.length
                              ? getDueDate(mostRecentMonth)
                              : '',
                          }))
                        }}
                        className="form-checkbox h-4 w-4 text-blue-500"
                      />
                      <span>{month}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-end space-x-4">
                <Button
                  className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition duration-300"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Criar Fatura
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
