import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Download,
  Calendar,
  Filter,
  DollarSign,
  BarChart2,
  TrendingUp,
  TrendingDown,
} from 'lucide-react'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import {
  getAllInvoice,
  type invoiceExtendedResponse,
} from '../../../http/finances/invoices'
import { LoadingSkeleton } from '../../../components/LoadingSkeleton'
import { ErrorComponent } from '../../../components/ErrorComponent'
import Card from '../../../components/Card'
import Button from '../../../components/Button'
import { exportToExcel } from '../../../components/exportToExcel'

ChartJS.register(ArcElement, Tooltip, Legend)

type ReportType = 'geral' | 'inadimplencia' | 'pagamentos' | 'cursos'

export function FinancialReports() {
  const {
    data: invoices,
    isLoading,
    isError,
  } = useQuery<invoiceExtendedResponse[]>({
    queryKey: ['invoices'],
    queryFn: getAllInvoice,
  })

  const [reportType, setReportType] = useState<ReportType>('geral')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [courseFilter, setCourseFilter] = useState('todos')

  const courses = useMemo(() => {
    if (!invoices) return []
    const courseSet = new Set(
      invoices.map(inv => inv.course?.courseName || 'Sem Curso')
    )
    return ['todos', ...Array.from(courseSet)]
  }, [invoices])

  const filteredData = useMemo(() => {
    if (!invoices) return []

    let data = invoices

    if (startDate) {
      data = data.filter(inv => new Date(inv.createdAt) >= new Date(startDate))
    }
    if (endDate) {
      data = data.filter(inv => new Date(inv.createdAt) <= new Date(endDate))
    }
    if (courseFilter !== 'todos') {
      data = data.filter(inv => inv.course?.courseName === courseFilter)
    }

    switch (reportType) {
      case 'inadimplencia':
        return data.filter(inv => inv.status !== 'PAGO')
      case 'pagamentos':
        return data.filter(inv => inv.status === 'PAGO')
      default:
        return data
    }
  }, [invoices, reportType, startDate, endDate, courseFilter])

  const summary = useMemo(() => {
    const totalGenerated = filteredData.reduce(
      (sum, inv) => sum + inv.amount,
      0
    )
    const totalPaid = filteredData
      .filter(inv => inv.status === 'PAGO')
      .reduce((sum, inv) => sum + inv.amount, 0)
    const totalLateFees = filteredData.reduce(
      (sum, inv) =>
        sum +
        (inv.LateFee?.reduce((feeSum, fee) => feeSum + fee.amount, 0) || 0),
      0
    )
    const totalPending = totalGenerated - totalPaid

    return { totalGenerated, totalPaid, totalLateFees, totalPending }
  }, [filteredData])

  const doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Arrecadado', 'Pendente'],
    datasets: [
      {
        data: [summary.totalPaid, summary.totalPending],
        backgroundColor: ['#10B981', '#EF4444'],
        hoverBackgroundColor: ['#059669', '#DC2626'],
        borderColor: '#ffffff',
        borderWidth: 2,
      },
    ],
  }

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            let label = context.label || ''
            if (label) {
              label += ': '
            }
            if (context.parsed !== null) {
              label += new Intl.NumberFormat('pt-MZ', {
                style: 'currency',
                currency: 'MZN',
              }).format(context.parsed)
            }
            return label
          },
        },
      },
    },
  }

  const handleExport = () => {
    if (!filteredData.length) {
      alert('Não há dados para exportar.')
      return
    }

    const dataToExport = filteredData.map(inv => ({
      Estudante: `${inv.student.name} ${inv.student.surname}`,
      Curso: inv.course?.courseName || 'N/A',
      Mês: inv.month,
      Ano: inv.year,
      Valor: inv.amount,
      Status: inv.status,
      'Data de Criação': new Date(inv.createdAt).toLocaleDateString(),
    }))

    exportToExcel(dataToExport, `relatorio_${reportType}.xlsx`, {
      Estudante: 'Estudante',
      Curso: 'Curso',
      Mês: 'Mês',
      Ano: 'Ano',
      Valor: 'Valor (MZN)',
      Status: 'Status',
      'Data de Criação': 'Data de Criação',
    })
  }

  if (isLoading) return <LoadingSkeleton />
  if (isError)
    return <ErrorComponent message="Falha ao carregar os dados financeiros." />

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <h1 className="text-3xl font-bold text-gray-800">
          Relatórios Financeiros
        </h1>
        <Button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Download size={18} className="mr-2" />
          Exportar para Excel
        </Button>
      </header>

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
          <Filter size={20} />
          Filtros do Relatório
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tipo de Relatório
            </label>
            <select
              value={reportType}
              onChange={e => setReportType(e.target.value as ReportType)}
              className="w-full p-2 border rounded-md"
            >
              <option value="geral">Geral</option>
              <option value="pagamentos">Pagamentos Realizados</option>
              <option value="inadimplencia">Inadimplência</option>
              <option value="cursos">Por Curso</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Data de Início
            </label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Data de Fim
            </label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Curso
            </label>
            <select
              value={courseFilter}
              onChange={e => setCourseFilter(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {courses.map(course => (
                <option key={course} value={course}>
                  {course === 'todos' ? 'Todos os Cursos' : course}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card
            title="Total Gerado"
            value={summary.totalGenerated}
            icon={DollarSign}
            onClick={() => setReportType('geral')}
          />
          <Card
            title="Total Arrecadado"
            value={summary.totalPaid}
            icon={TrendingUp}
            iconColor="text-green-500"
            onClick={() => setReportType('pagamentos')}
          />
          <Card
            title="Total Pendente"
            value={summary.totalPending}
            icon={TrendingDown}
            iconColor="text-red-500"
            onClick={() => setReportType('inadimplencia')}
          />
          <Card
            title="Total em Multas"
            value={summary.totalLateFees}
            icon={BarChart2}
            iconColor="text-yellow-500"
          />
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col justify-center items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Resumo Visual
          </h3>
          <div className="h-64 w-full">
            <Doughnut data={doughnutChartData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm overflow-x-auto">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Detalhes do Relatório
        </h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estudante
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Curso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fatura (Mês/Ano)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData.length > 0 ? (
              filteredData.map(inv => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${inv.student.name} ${inv.student.surname}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {inv.course?.courseName || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{`${inv.month}/${inv.year}`}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat('pt-MZ', {
                      style: 'currency',
                      currency: 'MZN',
                    }).format(inv.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${inv.status === 'PAGO' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  Nenhum dado encontrado para os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
