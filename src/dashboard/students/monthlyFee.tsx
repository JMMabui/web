import { useState } from 'react'
import Button from '@/component/Button'

export function MonthlyFee() {
  const [showForm, setShowForm] = useState(false)
  const [newInvoice, setNewInvoice] = useState<{
    number: string
    months: string[]
    date: string
    status: string
  }>({
    number: '',
    months: [],
    date: '',
    status: 'Não Pago',
  })
  const [invoices, setInvoices] = useState([
    {
      number: '001',
      month: 'Abril',
      date: '25/03/2025',
      status: 'Pago',
    },
    {
      number: '002',
      month: 'Maio',
      date: '30/04/2025',
      status: 'Não Pago',
    },
    {
      number: '003',
      month: 'Junho',
      date: '01/06/2025',
      status: 'Pago',
    },
    {
      number: '004',
      month: 'Julho',
      date: '15/07/2025',
      status: 'Não Pago',
    },
    {
      number: '005',
      month: 'Agosto',
      date: '20/08/2025',
      status: 'Pago',
    },
    {
      number: '006',
      month: 'Setembro',
      date: '30/09/2025',
      status: 'Não Pago',
    },
  ])

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    if (name === 'months') {
      // Caso o campo seja meses, lidamos de forma diferente
      const selectedMonths = Array.from(
        (e.target as HTMLSelectElement).selectedOptions,
        option => option.value
      )

      // Se houver múltiplos meses selecionados, atualiza a data de vencimento para o mês mais recente
      if (selectedMonths.length > 0) {
        const mostRecentMonth = getMostRecentMonth(selectedMonths)
        setNewInvoice(prevInvoice => ({
          ...prevInvoice,
          months: selectedMonths,
          date: getDueDate(mostRecentMonth), // Calcula a data para o mês mais recente
        }))
      } else {
        setNewInvoice(prevInvoice => ({
          ...prevInvoice,
          months: [],
          date: '', // Limpa a data se nenhum mês for selecionado
        }))
      }
    } else {
      setNewInvoice(prevInvoice => ({
        ...prevInvoice,
        [name]: value,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Nova fatura criada:', newInvoice)

    // Adiciona a nova fatura à lista de faturas
    setInvoices(prevInvoices => [
      ...prevInvoices,
      ...newInvoice.months.map((month, index) => ({
        number: (prevInvoices.length + index + 1).toString().padStart(3, '0'), // Gera um número único para cada nova fatura
        month,
        date: newInvoice.date,
        status: newInvoice.status,
      })),
    ])

    // Fechar o formulário após o envio
    setShowForm(false)
    // Limpar os campos do formulário
    setNewInvoice({
      number: '',
      months: [],
      date: '',
      status: 'Não Pago',
    })
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
                    Mensalidade Nº {invoice.number}
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
                  htmlFor="number"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Número de Meses
                </label>
                <input
                  type="number"
                  id="number"
                  name="number"
                  min="1"
                  value={newInvoice.number}
                  onChange={handleInputChange}
                  className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="months"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Selecione os Meses
                </label>
                <select
                  id="months"
                  name="months"
                  multiple
                  value={newInvoice.months}
                  onChange={handleInputChange}
                  className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
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
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newInvoice.date}
                  onChange={handleInputChange}
                  className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={newInvoice.status}
                  onChange={handleInputChange}
                  className="mt-2 block w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pago">Pago</option>
                  <option value="Não Pago">Não Pago</option>
                </select>
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
