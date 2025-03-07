import { useState, useEffect } from 'react'

export function InvoicesFinances() {
  const [searchTerm, setSearchTerm] = useState('')
  const [studentData, setStudentData] = useState({
    name: 'João Silva',
    course: 'Engenharia de Software',
    numSubjects: 5,
  })
  const [formData, setFormData] = useState({
    amount: 0,
    penaltyAmount: 0,
    discountAmount: 0,
    totalAmount: 0,
    dueDate: '', // A data de vencimento será calculada
    status: 'Pendente',
  })

  const calculateDueDate = () => {
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()

    // Definir a data de vencimento como 5 do mês seguinte
    const dueDate = new Date(currentYear, currentMonth + 1, 5)

    return dueDate.toISOString().split('T')[0] // Formatar para YYYY-MM-DD
  }

  useEffect(() => {
    // Definir automaticamente a data de vencimento quando o componente for montado
    setFormData(prevData => ({
      ...prevData,
      dueDate: calculateDueDate(),
    }))
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => {
      const newData = { ...prevData, [name]: value }

      // Calcular o totalAmount toda vez que um campo relacionado for alterado
      if (
        name === 'amount' ||
        name === 'penaltyAmount' ||
        name === 'discountAmount'
      ) {
        const amount = Number.parseFloat(newData.amount.toString() || '0')
        const penalty = Number.parseFloat(
          newData.penaltyAmount.toString() || '0'
        )
        const discount = Number.parseFloat(
          newData.discountAmount.toString() || '0'
        )
        newData.totalAmount = amount + penalty - discount
      }

      return newData
    })
  }

  // Função para calcular e aplicar a multa caso a data atual seja depois do dia 5 do mês seguinte
  const applyPenalty = (dueDate: string) => {
    const dueDateObj = new Date(dueDate)
    const currentDate = new Date()

    // Verifica se a data de vencimento já passou e é depois do dia 5 do mês seguinte
    if (currentDate > dueDateObj) {
      const dayOfMonth = currentDate.getDate()
      if (dayOfMonth > 5) {
        return 50 // Exemplo de multa fixa
      }
    }
    return 0
  }

  useEffect(() => {
    // Aplicar multa se a data de vencimento já tiver passado e o dia for maior que 5
    const penalty = applyPenalty(formData.dueDate)

    setFormData(prevData => ({
      ...prevData,
      penaltyAmount: penalty,
      totalAmount: prevData.amount + penalty - prevData.discountAmount,
    }))
  }, [formData.dueDate])

  return (
    <div className="w-full">
      {/* Input de busca */}
      <div className="mb-6 flex justify-end">
        <input
          type="text"
          placeholder="Pesquisar Estudante..."
          className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Resumo dos dados do estudante */}
      <div className="mb-6 p-4 border border-gray-300 rounded-lg">
        <h3 className="text-xl font-semibold">Resumo do Estudante</h3>
        <p>
          <strong>Nome:</strong> {studentData.name}
        </p>
        <p>
          <strong>Curso:</strong> {studentData.course}
        </p>
        <p>
          <strong>Número de Disciplinas:</strong> {studentData.numSubjects}
        </p>
      </div>

      {/* Formulário de Dados de Fatura */}
      <div className="p-4 border border-gray-300 rounded-lg">
        <h3 className="text-xl font-semibold">Formulário de Fatura</h3>
        <div className="mb-4">
          <label className="block">Amount:</label>
          <input
            type="number"
            name="amount"
            className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2"
            value={formData.amount}
            onChange={handleFormChange}
          />
        </div>
        <div className="mb-4">
          <label className="block">Penalty Amount:</label>
          <input
            type="number"
            name="penaltyAmount"
            className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2"
            value={formData.penaltyAmount}
            onChange={handleFormChange}
            readOnly
          />
        </div>
        <div className="mb-4">
          <label className="block">Discount Amount:</label>
          <input
            type="number"
            name="discountAmount"
            className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2"
            value={formData.discountAmount}
            onChange={handleFormChange}
          />
        </div>
        <div className="mb-4">
          <label className="block">Due Date:</label>
          <input
            type="date"
            name="dueDate"
            className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2"
            value={formData.dueDate}
            onChange={handleFormChange}
          />
        </div>
        <div className="mb-4">
          <label className="block">Status:</label>
          <input
            type="text"
            name="status"
            className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2"
            value={formData.status}
            onChange={handleFormChange}
          />
        </div>
        <div className="mb-4">
          <label className="block font-semibold">Total Amount:</label>
          <input
            type="number"
            name="totalAmount"
            className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2"
            value={formData.totalAmount}
            readOnly
          />
        </div>
      </div>
    </div>
  )
}
