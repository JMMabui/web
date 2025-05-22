import { ErrorComponent } from '@/components/ErrorComponent'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import {
  type invoiceExtendedResponse,
  getAllInvoice,
} from '@/http/finances/invoices'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle, XCircle, Search, Download } from 'lucide-react'
import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import Button from '@/components/Button'
import { exportToExcel } from '@/components/exportToExcel'

export function InvoicesFinances() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PAGO' | 'PENDENTE'>(
    'ALL'
  )
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'total' | 'date'>(
    'name'
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null
  )
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] =
    useState<invoiceExtendedResponse | null>(null)

  const {
    data: dataInvoice,
    isLoading,
    isError,
  } = useQuery<invoiceExtendedResponse[]>({
    queryKey: ['invoice'],
    queryFn: getAllInvoice,
  })

  // Processar os dados dos estudantes
  const students = useMemo(() => {
    return dataInvoice?.reduce(
      (acc, invoice) => {
        const id = invoice.student.id

        if (!acc[id]) {
          acc[id] = {
            ...invoice.student,
            totalPaid: 0,
            invoices: [],
          }
        }

        const lateFeeTotal = invoice.LateFee.reduce(
          (sum, fee) => sum + fee.amount,
          0
        )
        acc[id].totalPaid += invoice.amount + lateFeeTotal
        acc[id].invoices.push(invoice)

        return acc
      },
      {} as Record<
        string,
        {
          id: string
          name: string
          surname: string
          totalPaid: number
          invoices: invoiceExtendedResponse[]
        }
      >
    )
  }, [dataInvoice])

  // Filtrar e ordenar estudantes
  const filteredStudents = useMemo(() => {
    if (!students) return []

    return Object.values(students)
      .filter(student => {
        const fullName = `${student.name} ${student.surname}`.toLowerCase()
        const matchesSearch = fullName.includes(searchTerm.toLowerCase())
        const latestStatus = student.invoices[0]?.status || 'PENDENTE'

        return (
          matchesSearch &&
          (filterStatus === 'ALL' || latestStatus === filterStatus)
        )
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return sortOrder === 'asc'
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name)
          case 'status':
            return sortOrder === 'asc'
              ? (a.invoices[0]?.status || '').localeCompare(
                  b.invoices[0]?.status || ''
                )
              : (b.invoices[0]?.status || '').localeCompare(
                  a.invoices[0]?.status || ''
                )
          case 'total':
            return sortOrder === 'asc'
              ? a.totalPaid - b.totalPaid
              : b.totalPaid - a.totalPaid
          case 'date': {
            const aDate = new Date(
              Number(a.invoices[0]?.year) || 0,
              Number(a.invoices[0]?.month) || 0
            )
            const bDate = new Date(
              Number(b.invoices[0]?.year) || 0,
              Number(b.invoices[0]?.month) || 0
            )
            return sortOrder === 'asc'
              ? aDate.getTime() - bDate.getTime()
              : bDate.getTime() - aDate.getTime()
          }
          default:
            return 0
        }
      })
  }, [students, searchTerm, filterStatus, sortBy, sortOrder])

  const selectedStudent = selectedStudentId
    ? students?.[selectedStudentId]
    : null

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handlePayment = (invoice: invoiceExtendedResponse) => {
    setSelectedInvoice(invoice)
    setShowPaymentModal(true)
  }

  const exportToExcelReport = () => {
    if (!filteredStudents.length) {
      toast.error('Não há dados para exportar')
      return
    }

    const data = filteredStudents.map(student => {
      const latest = student.invoices[0]
      return {
        nome: `${student.name} ${student.surname}`,
        status: latest?.status === 'PAGO' ? 'Em dia' : 'Pendente',
        totalPago: student.totalPaid,
        ultimaMensalidade: `${latest?.month}/${latest?.year}`,
        quantidadeFaturas: student.invoices.length,
        faturasEmAberto: student.invoices.filter(inv => inv.status !== 'PAGO')
          .length,
      }
    })

    const columns = {
      nome: 'Nome do Estudante',
      status: 'Status',
      totalPago: 'Total Pago',
      ultimaMensalidade: 'Última Mensalidade',
      quantidadeFaturas: 'Total de Faturas',
      faturasEmAberto: 'Faturas em Aberto',
    }

    try {
      exportToExcel(data, 'relatorio-mensalidades.xlsx', columns, ['totalPago'])
      toast.success('Relatório exportado com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar:', error)
      toast.error('Erro ao exportar o relatório')
    }
  }

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorComponent />

  return (
    <div className="space-y-8">
      {/* Cabeçalho e Filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar estudante..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={e =>
              setFilterStatus(e.target.value as 'ALL' | 'PAGO' | 'PENDENTE')
            }
          >
            <option value="ALL">Todos</option>
            <option value="PAGO">Pagos</option>
            <option value="PENDENTE">Pendentes</option>
          </select>
        </div>
        <Button
          onClick={exportToExcelReport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download size={20} />
          Exportar Excel
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tabela Resumo */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">
            📚 Estudantes
          </h3>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full text-sm text-gray-700">
              <thead className="bg-gray-100 border-b font-medium">
                <tr>
                  <th className="px-4 py-2 text-left">
                    <button
                      type="button"
                      className="w-full text-left hover:text-blue-600 focus:outline-none focus:text-blue-600"
                      onClick={() => handleSort('name')}
                      onKeyDown={e => e.key === 'Enter' && handleSort('name')}
                    >
                      Nome{' '}
                      {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                  </th>
                  <th className="px-4 py-2 text-left">
                    <button
                      type="button"
                      className="w-full text-left hover:text-blue-600 focus:outline-none focus:text-blue-600"
                      onClick={() => handleSort('status')}
                      onKeyDown={e => e.key === 'Enter' && handleSort('status')}
                    >
                      Status{' '}
                      {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                  </th>
                  <th className="px-4 py-2 text-left">
                    <button
                      type="button"
                      className="w-full text-left hover:text-blue-600 focus:outline-none focus:text-blue-600"
                      onClick={() => handleSort('total')}
                      onKeyDown={e => e.key === 'Enter' && handleSort('total')}
                    >
                      Total Pagar{' '}
                      {sortBy === 'total' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                  </th>
                  <th className="px-4 py-2 text-left">
                    <button
                      type="button"
                      className="w-full text-left hover:text-blue-600 focus:outline-none focus:text-blue-600"
                      onClick={() => handleSort('date')}
                      onKeyDown={e => e.key === 'Enter' && handleSort('date')}
                    >
                      Última Mensalidade{' '}
                      {sortBy === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, idx) => {
                  const latestMonth = student.invoices.length
                  const latest = student.invoices[latestMonth - 1]
                  const isPaid = latest?.status === 'PAGO'
                  return (
                    <tr
                      key={student.id}
                      className={`border-b ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          className="w-full text-left hover:text-blue-600 focus:outline-none focus:text-blue-600"
                          onClick={() => setSelectedStudentId(student.id)}
                          onKeyDown={e =>
                            e.key === 'Enter' &&
                            setSelectedStudentId(student.id)
                          }
                        >
                          {student.name} {student.surname}
                        </button>
                      </td>
                      <td
                        className={`px-4 py-2 flex items-center gap-2 ${
                          isPaid ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {isPaid ? (
                          <CheckCircle size={16} />
                        ) : (
                          <XCircle size={16} />
                        )}
                        {isPaid ? 'Em dia' : 'Pendente'}
                      </td>
                      <td className="px-4 py-2">
                        {student.totalPaid.toLocaleString('pt-BR')} MT
                      </td>
                      <td className="px-4 py-2">
                        {latest?.month}/{latest?.year}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detalhes Estudante */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">
            🎓 Detalhes do Estudante
          </h3>
          <div className="space-y-6">
            <div>
              <label className="text-gray-700 font-medium">
                Selecionar Estudante
              </label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                value={selectedStudentId || ''}
                onChange={e => setSelectedStudentId(e.target.value || null)}
              >
                <option value="">-- Selecione um estudante --</option>
                {filteredStudents.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.surname}
                  </option>
                ))}
              </select>
            </div>

            {selectedStudent && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">
                    Histórico de Faturas
                  </h4>
                  <div className="text-sm text-gray-600">
                    Total Acumulado:{' '}
                    {selectedStudent.totalPaid.toLocaleString('pt-BR')} MT
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-gray-700">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left">Mês</th>
                        <th className="px-4 py-2 text-left">Ano</th>
                        <th className="px-4 py-2 text-left">Valor</th>
                        <th className="px-4 py-2 text-left">Status</th>
                        <th className="px-4 py-2 text-left">Multa</th>
                        <th className="px-4 py-2 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedStudent.invoices.map((inv, idx) => (
                        <tr
                          key={inv.id}
                          className={`border-b ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <td className="px-4 py-2">{inv.month}</td>
                          <td className="px-4 py-2">{inv.year}</td>
                          <td className="px-4 py-2">
                            {inv.amount.toLocaleString('pt-BR')} MT
                          </td>

                          <td
                            className={`px-4 py-2 ${
                              inv.status === 'PAGO'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {inv.status}
                          </td>
                          <td className="px-4 py-2">
                            {inv.LateFee.length > 0
                              ? inv.LateFee.reduce(
                                  (sum, fee) => sum + fee.amount,
                                  0
                                ).toLocaleString('pt-BR')
                              : '0'}{' '}
                            MT
                          </td>
                          <td className="px-4 py-2">
                            {inv.status !== 'PAGO' && (
                              <Button
                                onClick={() => handlePayment(inv)}
                                className="text-blue-600 hover:text-blue-800 font-medium"
                              >
                                Pagar
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Pagamento */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full mx-4">
            {/* <PaymentForm
              invoice={selectedInvoice}
              onClose={() => {
                setShowPaymentModal(false)
                handlePaymentComplete()
              }}
            /> */}
          </div>
        </div>
      )}
    </div>
  )
}
