import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Mail, Search, AlertTriangle, Eye, Send } from 'lucide-react'
import {
  getAllInvoice,
  type invoiceExtendedResponse,
} from '../../../http/finances/invoices'
import { LoadingSkeleton } from '../../../components/LoadingSkeleton'
import { ErrorComponent } from '../../../components/ErrorComponent'
import Card from '../../../components/Card'
import Button from '../../../components/Button'
import Modal from '../../../components/Modal'

type Defaulter = {
  studentId: string
  studentName: string
  courseName: string
  overdueInvoices: number
  totalDebt: number
  invoices: invoiceExtendedResponse[]
}

type SortKey = 'studentName' | 'totalDebt' | 'overdueInvoices'

export function LateFeesManagement() {
  const {
    data: invoices,
    isLoading,
    isError,
  } = useQuery<invoiceExtendedResponse[]>({
    queryKey: ['invoicesForLateFees'],
    queryFn: getAllInvoice,
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<Defaulter | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [sortConfig, setSortConfig] = useState<{
    key: SortKey
    direction: 'asc' | 'desc'
  }>({ key: 'totalDebt', direction: 'desc' })

  const defaulters = useMemo<Defaulter[]>(() => {
    if (!invoices) return []

    const defaultersMap = new Map<string, Defaulter>()

    invoices
      .filter(inv => inv.status !== 'PAGO')
      .forEach(inv => {
        const studentId = inv.student.id
        let defaulter = defaultersMap.get(studentId)

        if (!defaulter) {
          defaulter = {
            studentId,
            studentName: `${inv.student.name} ${inv.student.surname}`,
            courseName: inv.course?.courseName || 'N/A',
            overdueInvoices: 0,
            totalDebt: 0,
            invoices: [],
          }
        }

        const lateFeeTotal =
          inv.LateFee?.reduce((sum, fee) => sum + fee.amount, 0) || 0
        defaulter.overdueInvoices += 1
        defaulter.totalDebt += inv.amount + lateFeeTotal
        defaulter.invoices.push(inv)
        defaultersMap.set(studentId, defaulter)
      })

    return Array.from(defaultersMap.values())
  }, [invoices])

  const sortedAndFilteredDefaulters = useMemo(() => {
    return defaulters
      .filter(d =>
        d.studentName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1
        }
        return 0
      })
  }, [defaulters, searchTerm, sortConfig])

  const handleSelect = (studentId: string) => {
    const newSelection = new Set(selectedIds)
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId)
    } else {
      newSelection.add(studentId)
    }
    setSelectedIds(newSelection)
  }

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(sortedAndFilteredDefaulters.map(d => d.studentId))
      setSelectedIds(allIds)
    } else {
      setSelectedIds(new Set())
    }
  }

  const handleBulkSendReminders = () => {
    if (selectedIds.size === 0) {
      alert('Nenhum estudante selecionado.')
      return
    }
    alert(`Simulando envio de lembretes para ${selectedIds.size} estudante(s).`)
    setSelectedIds(new Set())
  }

  const summary = {
    totalDefaulters: sortedAndFilteredDefaulters.length,
    totalDebt: sortedAndFilteredDefaulters.reduce(
      (sum, d) => sum + d.totalDebt,
      0
    ),
  }

  const handleSendReminder = (studentName: string) => {
    alert(`Lembrete de pagamento enviado para ${studentName}.`)
  }

  if (isLoading) return <LoadingSkeleton />
  if (isError)
    return (
      <ErrorComponent message="Falha ao carregar dados de inadimplência." />
    )

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">
          Gestão de Inadimplência
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Total de Inadimplentes"
          value={summary.totalDefaulters}
          icon={AlertTriangle}
          iconColor="text-red-500"
        />
        <Card
          title="Dívida Total"
          value={summary.totalDebt}
          icon={AlertTriangle}
          iconColor="text-red-500"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Buscar estudante..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
              />
            </div>
            <div>
              <select
                value={sortConfig.key}
                onChange={e =>
                  setSortConfig({
                    ...sortConfig,
                    key: e.target.value as SortKey,
                  })
                }
                className="p-2 border rounded-lg"
              >
                <option value="totalDebt">Maior Dívida</option>
                <option value="studentName">Ordem Alfabética</option>
                <option value="overdueInvoices">Mais Faturas</option>
              </select>
            </div>
          </div>
          <Button
            onClick={handleBulkSendReminders}
            disabled={selectedIds.size === 0}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Send size={16} />
            Enviar Lembretes ({selectedIds.size})
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedIds.size > 0 &&
                      selectedIds.size === sortedAndFilteredDefaulters.length
                    }
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estudante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Faturas Atrasadas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dívida Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAndFilteredDefaulters.map(defaulter => (
                <tr
                  key={defaulter.studentId}
                  className={`hover:bg-gray-50 ${selectedIds.has(defaulter.studentId) ? 'bg-blue-50' : ''}`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(defaulter.studentId)}
                      onChange={() => handleSelect(defaulter.studentId)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {defaulter.studentName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {defaulter.courseName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-red-600 font-semibold">
                    {defaulter.overdueInvoices}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat('pt-MZ', {
                      style: 'currency',
                      currency: 'MZN',
                    }).format(defaulter.totalDebt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Button
                      onClick={() => setSelectedStudent(defaulter)}
                      className="bg-blue-100 text-blue-700 hover:bg-blue-200"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      onClick={() => handleSendReminder(defaulter.studentName)}
                      className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    >
                      <Mail size={16} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedStudent && (
        <Modal
          isOpen={!!selectedStudent}
          onClose={() => setSelectedStudent(null)}
          title={`Detalhes de Inadimplência - ${selectedStudent.studentName}`}
        >
          <div className="p-4">
            <div className="mb-4">
              <p>
                <strong>Estudante:</strong> {selectedStudent.studentName}
              </p>
              <p>
                <strong>Curso:</strong> {selectedStudent.courseName}
              </p>
              <p>
                <strong>Dívida Total:</strong>{' '}
                {new Intl.NumberFormat('pt-MZ', {
                  style: 'currency',
                  currency: 'MZN',
                }).format(selectedStudent.totalDebt)}
              </p>
            </div>
            <h4 className="font-semibold text-lg mb-2">Faturas Pendentes</h4>
            <ul className="list-disc pl-5 space-y-1">
              {selectedStudent.invoices.map(inv => (
                <li key={inv.id}>
                  Fatura de {inv.month}/{inv.year} -{' '}
                  {new Intl.NumberFormat('pt-MZ', {
                    style: 'currency',
                    currency: 'MZN',
                  }).format(inv.amount)}
                </li>
              ))}
            </ul>
          </div>
        </Modal>
      )}
    </div>
  )
}
