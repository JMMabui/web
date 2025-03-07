import { useState, useEffect } from 'react'

export function PaymentsFinances() {
  // Estado para armazenar os dados da fatura
  const [invoiceData, setInvoiceData] = useState({
    id: '',
    amount: 0,
    dueDate: '',
    totalAmount: 0,
    studentName: '',
    status: 'Pendente',
  })

  // Estado para armazenar os dados do pagamento
  const [paymentData, setPaymentData] = useState({
    invoiceId: '',
    amount: 0,
    paymentDate: '',
    method: 'CREDIT_CARD', // Método padrão
    status: 'PENDING', // Status inicial
  })

  // Mock de dados da fatura (isso viria de uma API ou banco de dados)
  useEffect(() => {
    // Simulação de dados de fatura
    setInvoiceData({
      id: 'abc123',
      amount: 1000,
      dueDate: '2025-04-05',
      totalAmount: 1050, // Incluindo multas e descontos, por exemplo
      studentName: 'João Silva',
      status: 'Pendente',
    })

    // Inicializar o ID da fatura no pagamento
    setPaymentData(prevData => ({
      ...prevData,
      invoiceId: 'abc123',
    }))
  }, [])

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setPaymentData(prevData => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você pode realizar o processo de envio para o backend para registrar o pagamento
    console.log('Pagamento registrado:', paymentData)
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="p-6 border border-gray-300 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-6">Registrar Pagamento</h2>

        {/* Dados da Fatura */}
        <div className="mb-6 p-4 border border-gray-200 rounded-lg">
          <h3 className="text-xl font-semibold">Dados da Fatura</h3>
          <p>
            <strong>Nome do Estudante:</strong> {invoiceData.studentName}
          </p>
          <p>
            <strong>Valor Total:</strong> R$ {invoiceData.totalAmount}
          </p>
          <p>
            <strong>Data de Vencimento:</strong> {invoiceData.dueDate}
          </p>
          <p>
            <strong>Status:</strong> {invoiceData.status}
          </p>
        </div>

        {/* Formulário de Pagamento */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block">ID da Fatura:</label>
            <input
              type="text"
              name="invoiceId"
              className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2"
              value={paymentData.invoiceId}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block">Valor do Pagamento:</label>
            <input
              type="number"
              name="amount"
              className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2"
              value={paymentData.amount}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Data do Pagamento:</label>
            <input
              type="date"
              name="paymentDate"
              className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2"
              value={paymentData.paymentDate}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block">Método de Pagamento:</label>
            <select
              name="method"
              className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2"
              value={paymentData.method}
              onChange={handleFormChange}
              required
            >
              <option value="CREDIT_CARD">Cartão de Crédito</option>
              <option value="DEBIT_CARD">Cartão de Débito</option>
              <option value="BANK_TRANSFER">Transferência Bancária</option>
              <option value="MOBILE_MONEY">Dinheiro Mobile</option>
              <option value="CASH">Dinheiro</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block">Status do Pagamento:</label>
            <select
              name="status"
              className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2"
              value={paymentData.status}
              onChange={handleFormChange}
              required
            >
              <option value="PENDING">Pendente</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="FAILED">Falhou</option>
            </select>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none"
            >
              Registrar Pagamento
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
