import { ErrorComponent } from '@/components/ErrorComponent'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import {
  type invoiceExtendedResponse,
  getAllInvoice,
} from '@/http/finances/invoices'
import { useQuery } from '@tanstack/react-query'
import {
  Eye,
  Search,
  Download,
  CheckCircle,
  XCircle,
  Users,
  UserX,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import toast from 'react-hot-toast'
import Button from '@/components/Button'
import { exportToExcel } from '@/components/exportToExcel'
import StudentFinancialHistoryModal from '@/components/StudentFinancialHistoryModal'
import Card from '@/components/Card'

type StudentWithInvoices = {
  id: string
  name: string
  surname: string
  totalPaid: number
  invoices: invoiceExtendedResponse[]
}

export function InvoicesFinances() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PAGO' | 'PENDENTE'>(
    'ALL'
  )
  const [sortBy, setSortBy] = useState<'name' | 'status' | 'total' | 'date'>(
    'name'
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] =
    useState<StudentWithInvoices | null>(null)

  const {
    data: dataInvoice,
    isLoading,
    isError,
  } = useQuery<invoiceExtendedResponse[]>({
    queryKey: ['invoice'],
    queryFn: getAllInvoice,
  })

  const students = useMemo(() => {
    if (!dataInvoice) return {}
    return dataInvoice.reduce(
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
      {} as Record<string, StudentWithInvoices>
    )
  }, [dataInvoice])

  const handleOpenHistory = (studentId: string) => {
    setSelectedStudent(students[studentId])
    setIsHistoryModalOpen(true)
  }

  const filteredStudents = useMemo(() => {
    return Object.values(students)
      .filter(student => {
        const fullName = `${student.name} ${student.surname}`.toLowerCase()
        const matchesSearch = fullName.includes(searchTerm.toLowerCase())
        if (filterStatus === 'ALL') return matchesSearch
        const hasPending = student.invoices.some(inv => inv.status !== 'PAGO')
        return filterStatus === 'PENDENTE'
          ? matchesSearch && hasPending
          : matchesSearch && !hasPending
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return sortOrder === 'asc'
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name)
          case 'status': {
            const aHasPending = a.invoices.some(inv => inv.status !== 'PAGO')
            const bHasPending = b.invoices.some(inv => inv.status !== 'PAGO')
            if (aHasPending === bHasPending) return 0
            if (sortOrder === 'asc') {
              return aHasPending ? 1 : -1
            }
            return aHasPending ? -1 : 1
          }
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

  const studentForModal = useMemo(() => {
    if (!selectedStudent) return null
    return {
      ...selectedStudent,
      invoices: selectedStudent.invoices.map(inv => ({
        ...inv,
        month: Number(inv.month),
      })),
    }
  }, [selectedStudent])

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
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

  const summary = useMemo(() => {
    const totalStudents = Object.keys(students).length
    const studentsWithPending = filteredStudents.filter(s =>
      s.invoices.some(inv => inv.status !== 'PAGO')
    ).length
    return { totalStudents, studentsWithPending }
  }, [students, filteredStudents])

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorComponent />

  const getInitials = (name: string, surname: string) => {
    return `${name.charAt(0)}${surname.charAt(0)}`.toUpperCase()
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">
          Visão Geral de Faturas
        </h1>
        <p className="text-sm text-gray-600">
          Acompanhe e gerencie as faturas dos estudantes.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card
          title="Total de Estudantes"
          value={summary.totalStudents}
          icon={Users}
        />
        <Card
          title="Com Pendências"
          value={summary.studentsWithPending}
          icon={UserX}
          iconColor="text-red-500"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
          <div className="relative flex-1 w-full md:w-auto">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Buscar por nome do estudante..."
              className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-4">
            <select
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filterStatus}
              onChange={e =>
                setFilterStatus(e.target.value as 'ALL' | 'PAGO' | 'PENDENTE')
              }
            >
              <option value="ALL">Todos Status</option>
              <option value="PAGO">Em Dia</option>
              <option value="PENDENTE">Com Pendências</option>
            </select>
            <Button
              onClick={exportToExcelReport}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Download size={18} className="mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estudante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status Financeiro
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total de Faturas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map(student => {
                const hasPending = student.invoices.some(
                  inv => inv.status !== 'PAGO'
                )
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-700 font-bold">
                            {getInitials(student.name, student.surname)}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">{`${student.name} ${student.surname}`}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium ${
                          hasPending
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {hasPending ? (
                          <XCircle size={14} />
                        ) : (
                          <CheckCircle size={14} />
                        )}
                        {hasPending ? 'Pendente' : 'Em Dia'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {student.invoices.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        onClick={() => handleOpenHistory(student.id)}
                        className="bg-gray-500 hover:bg-gray-600 text-gray-700"
                      >
                        <Eye size={16} className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <StudentFinancialHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        student={studentForModal}
      />
    </div>
  )
}
