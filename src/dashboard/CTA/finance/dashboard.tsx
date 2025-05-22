import {
  getAllInvoice,
  type invoiceExtendedResponse,
} from '@/http/finances/invoices'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  AlertCircle,
  Coins,
  Table2,
  BarChart2,
  TrendingUp,
  TrendingDown,
  Download,
} from 'lucide-react'
import { useState, useMemo } from 'react'
import Card from '@/components/Card'
import { ErrorComponent } from '@/components/ErrorComponent'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  type Scale,
  type CoreScaleOptions,
  // type Tick,
} from 'chart.js'
import Button from '@/components/Button'
import { Tooltip as TooltipUI } from '@/components/ui/tooltip'
import { motion, AnimatePresence } from 'framer-motion'
// import XLSX from 'xlsx'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement
)

// Configurações globais do Chart.js
ChartJS.defaults.responsive = true
ChartJS.defaults.maintainAspectRatio = false
ChartJS.defaults.plugins.tooltip.backgroundColor = 'rgba(0, 0, 0, 0.8)'
ChartJS.defaults.plugins.tooltip.padding = 12
ChartJS.defaults.plugins.tooltip.cornerRadius = 8
ChartJS.defaults.plugins.legend.position = 'bottom'
ChartJS.defaults.plugins.legend.labels.usePointStyle = true

export function DashboardFinances() {
  const [viewMode, setViewMode] = useState<'graphs' | 'table'>('graphs')
  const [selectedMonth, setSelectedMonth] = useState<string>('Todos')
  const [selectedYear, setSelectedYear] = useState<string>('Todos')
  const [showComparison, setShowComparison] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<'amount' | 'count'>(
    'amount'
  )
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos')
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  }>({ key: '', direction: 'asc' })

  const {
    data: dataInvoice,
    isLoading,
    isError,
  } = useQuery<invoiceExtendedResponse[]>({
    queryKey: ['invoice'],
    queryFn: getAllInvoice,
  })

  const availableMonths = useMemo(() => {
    const months = new Set<string>()
    dataInvoice?.forEach(inv => months.add(inv.month.toString()))
    return Array.from(months).sort()
  }, [dataInvoice])

  const availableYears = useMemo(() => {
    const years = new Set<string>()
    dataInvoice?.forEach(inv => years.add(inv.year.toString()))
    return Array.from(years).sort()
  }, [dataInvoice])

  const filteredInvoices = useMemo(() => {
    return (
      dataInvoice?.filter(inv => {
        const matchMonth =
          selectedMonth === 'Todos' || inv.month.toString() === selectedMonth
        const matchYear =
          selectedYear === 'Todos' || inv.year.toString() === selectedYear
        return matchMonth && matchYear
      }) || []
    )
  }, [dataInvoice, selectedMonth, selectedYear])

  const totalPaid = filteredInvoices.reduce(
    (sum, inv) => sum + Number(inv.amount),
    0
  )
  const pendingCount = filteredInvoices.filter(
    inv => inv.status !== 'PAGO'
  ).length
  const inDayCount = filteredInvoices.filter(
    inv => inv.status === 'PAGO'
  ).length

  // const barChartData = {
  //   labels: filteredInvoices.map(inv => `${inv.month}/${inv.year}`),
  //   datasets: [
  //     {
  //       label: 'Valor Pago (MT)',
  //       data: filteredInvoices.map(inv => inv.amount || 0),
  //       backgroundColor: 'rgba(75, 192, 192, 0.6)',
  //       borderColor: 'rgba(75, 192, 192, 1)',
  //       borderWidth: 1,
  //     },
  //   ],
  // }

  const statusCounts = filteredInvoices.reduce(
    (acc, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const totalInvoices = filteredInvoices.length
  const pieChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts).map(count =>
          Number(((count / totalInvoices) * 100).toFixed(2))
        ),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  // Cálculo de métricas comparativas
  const comparativeMetrics = useMemo(() => {
    if (!dataInvoice) return null

    const currentMonthData = filteredInvoices
    const previousMonthData = dataInvoice.filter(inv => {
      const prevMonth =
        selectedMonth === 'Todos'
          ? new Date().getMonth()
          : Number.parseInt(selectedMonth) - 1
      return Number(inv.month) === prevMonth
    })

    const currentTotal = currentMonthData.reduce(
      (sum, inv) => sum + inv.amount,
      0
    )
    const previousTotal = previousMonthData.reduce(
      (sum, inv) => sum + inv.amount,
      0
    )
    const percentageChange = previousTotal
      ? ((currentTotal - previousTotal) / previousTotal) * 100
      : 0

    return {
      currentTotal,
      previousTotal,
      percentageChange,
      trend: percentageChange >= 0 ? 'up' : 'down',
    }
  }, [dataInvoice, filteredInvoices, selectedMonth])

  // Métricas avançadas
  const advancedMetrics = useMemo(() => {
    const totalStudents = new Set(filteredInvoices.map(inv => inv.student.id))
      .size
    const totalAmount = filteredInvoices.reduce(
      (sum, inv) => sum + inv.amount,
      0
    )
    const paidAmount = filteredInvoices
      .filter(inv => inv.status === 'PAGO')
      .reduce((sum, inv) => sum + inv.amount, 0)

    const defaultingStudents = new Set(
      filteredInvoices
        .filter(inv => inv.status !== 'PAGO')
        .map(inv => inv.student.id)
    ).size

    return {
      mediaByStudent: totalAmount / totalStudents || 0,
      defaultRate: (defaultingStudents / totalStudents) * 100 || 0,
      collectionRate: (paidAmount / totalAmount) * 100 || 0,
      totalStudents,
      defaultingStudents,
    }
  }, [filteredInvoices])

  // Dados para análise mensal
  const monthlyAnalysis = useMemo(() => {
    const monthlyData = filteredInvoices.reduce(
      (acc, inv) => {
        const key = `${inv.month}/${inv.year}`
        if (!acc[key]) {
          acc[key] = {
            total: 0,
            paid: 0,
            count: 0,
            paidCount: 0,
          }
        }
        acc[key].total += inv.amount
        acc[key].count += 1
        if (inv.status === 'PAGO') {
          acc[key].paid += inv.amount
          acc[key].paidCount += 1
        }
        return acc
      },
      {} as Record<
        string,
        { total: number; paid: number; count: number; paidCount: number }
      >
    )

    return {
      labels: Object.keys(monthlyData),
      datasets: [
        {
          label: 'Total Previsto',
          data: Object.values(monthlyData).map(d =>
            selectedMetric === 'amount' ? d.total : d.count
          ),
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
        {
          label: 'Total Recebido',
          data: Object.values(monthlyData).map(d =>
            selectedMetric === 'amount' ? d.paid : d.paidCount
          ),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    }
  }, [filteredInvoices, selectedMetric])

  // Métricas por curso
  const courseMetrics = useMemo(() => {
    const courseData = filteredInvoices.reduce(
      (acc, inv) => {
        const courseId = inv.course?.id || 'Sem Curso'
        const courseName = inv.course?.courseName || 'Sem Curso'

        if (!acc[courseId]) {
          acc[courseId] = {
            name: courseName,
            totalAmount: 0,
            studentCount: new Set(),
            paidCount: 0,
            pendingCount: 0,
            lateFees: 0,
          }
        }

        acc[courseId].totalAmount += inv.amount
        acc[courseId].studentCount.add(inv.student.id)
        if (inv.status === 'PAGO') {
          acc[courseId].paidCount++
        } else {
          acc[courseId].pendingCount++
        }

        // Soma das multas por atraso
        inv.LateFee?.forEach(fee => {
          acc[courseId].lateFees += fee.amount
        })

        return acc
      },
      {} as Record<
        string,
        {
          name: string
          totalAmount: number
          studentCount: Set<string>
          paidCount: number
          pendingCount: number
          lateFees: number
        }
      >
    )

    return Object.values(courseData).map(course => ({
      ...course,
      studentCount: course.studentCount.size,
    }))
  }, [filteredInvoices])

  // Métricas de métodos de pagamento
  const paymentMethodMetrics = useMemo(() => {
    const methodData = filteredInvoices.reduce(
      (acc, inv) => {
        inv.payments?.forEach(payment => {
          const method = payment.paymentMethod
          if (!acc[method]) {
            acc[method] = {
              total: 0,
              count: 0,
            }
          }
          acc[method].total += payment.amount
          acc[method].count++
        })
        return acc
      },
      {} as Record<string, { total: number; count: number }>
    )

    return methodData
  }, [filteredInvoices])

  // Dados para o gráfico de métodos de pagamento
  const paymentMethodChartData = {
    labels: Object.keys(paymentMethodMetrics),
    datasets: [
      {
        data: Object.values(paymentMethodMetrics).map(m => m.total),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }

  // Métricas de atraso e multas
  const latePaymentMetrics = useMemo(() => {
    let totalLateFees = 0
    let invoicesWithLateFees = 0
    let maxLateFee = 0
    let totalDaysLate = 0
    let invoicesCount = 0

    filteredInvoices.forEach(inv => {
      if (inv.LateFee && inv.LateFee.length > 0) {
        invoicesWithLateFees++
        inv.LateFee.forEach(fee => {
          totalLateFees += fee.amount
          totalDaysLate += fee.daysLate
          maxLateFee = Math.max(maxLateFee, fee.amount)
        })
      }
      invoicesCount++
    })

    return {
      totalLateFees,
      invoicesWithLateFees,
      percentageWithLateFees: (invoicesWithLateFees / invoicesCount) * 100,
      averageLateFee: invoicesWithLateFees
        ? totalLateFees / invoicesWithLateFees
        : 0,
      maxLateFee,
      averageDaysLate: invoicesWithLateFees
        ? totalDaysLate / invoicesWithLateFees
        : 0,
    }
  }, [filteredInvoices])

  // Cálculo de totais
  const totalExpected = useMemo(
    () => filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0),
    [filteredInvoices]
  )

  const totalCollected = useMemo(
    () =>
      filteredInvoices
        .filter(inv => inv.status === 'PAGO')
        .reduce((sum, inv) => sum + inv.amount, 0),
    [filteredInvoices]
  )

  // Função para ordenar a tabela
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    })
  }

  const sortedInvoices = useMemo(() => {
    if (!sortConfig.key) return filteredInvoices

    return [...filteredInvoices].sort((a, b) => {
      if (sortConfig.key === 'name') {
        const aValue = `${a.student.name} ${a.student.surname}`
        const bValue = `${b.student.name} ${b.student.surname}`
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      const aValue = a[sortConfig.key as keyof typeof a]
      const bValue = b[sortConfig.key as keyof typeof b]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }

      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue))
    })
  }, [filteredInvoices, sortConfig])

  // Base chart options without scales
  const baseChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
      },
    },
  }

  // Specific options for Bar and Line charts
  const scaleChartOptions = {
    ...baseChartOptions,
    scales: {
      y: {
        type: 'linear' as const,
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: function (
            this: Scale<CoreScaleOptions>,
            tickValue: string | number
            // index: number,
            // ticks: Tick[]
          ) {
            return new Intl.NumberFormat('pt-MZ', {
              style: 'currency',
              currency: 'MZN',
            }).format(Number(tickValue))
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  // Dados do gráfico de tendência com animação
  const trendChartData = {
    labels: filteredInvoices.map(inv => `${inv.month}/${inv.year}`),
    datasets: [
      {
        label: 'Valor Mensal',
        data: filteredInvoices.map(inv => inv.amount),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true,
        pointStyle: 'circle',
        pointRadius: 6,
        pointHoverRadius: 8,
      },
    ],
  }

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorComponent />

  return (
    <div className="w-full p-6 space-y-8">
      {/* Cabeçalho */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md"
      >
        <h2 className="text-3xl font-bold text-gray-800">
          📊 Painel Financeiro
        </h2>
        <div className="flex gap-4">
          <Button
            onClick={() => setShowComparison(!showComparison)}
            className="bg-blue-100 text-blue-700 hover:bg-blue-200"
          >
            {showComparison ? 'Ocultar Comparação' : 'Mostrar Comparação'}
          </Button>
          <Button
            onClick={() =>
              setViewMode(prev => (prev === 'graphs' ? 'table' : 'graphs'))
            }
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {viewMode === 'graphs' ? (
              <>
                <Table2 size={18} className="mr-2" /> Ver Tabela
              </>
            ) : (
              <>
                <BarChart2 size={18} className="mr-2" /> Ver Gráficos
              </>
            )}
          </Button>
        </div>
      </motion.div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">🔍 Filtros</h3>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-4">
            <TooltipUI content="Filtrar dados por mês específico">
              <div>
                <label className="text-sm text-gray-700">Mês</label>
                <select
                  className="block w-32 border rounded-md px-3 py-2"
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                >
                  <option value="Todos">Todos</option>
                  {availableMonths.map(month => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </TooltipUI>

            <TooltipUI content="Filtrar dados por ano específico">
              <div>
                <label className="text-sm text-gray-700">Ano</label>
                <select
                  className="block w-32 border rounded-md px-3 py-2"
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                >
                  <option value="Todos">Todos</option>
                  {availableYears.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </TooltipUI>

            <TooltipUI content="Filtrar por status de pagamento">
              <div>
                <label className="text-sm text-gray-700">Status</label>
                <select
                  className="block w-32 border rounded-md px-3 py-2"
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                >
                  <option value="Todos">Todos</option>
                  <option value="PAGO">Pago</option>
                  <option value="PENDENTE">Pendente</option>
                </select>
              </div>
            </TooltipUI>
          </div>

          <TooltipUI content="Exportar dados">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Download size={18} className="mr-2" />
              Exportar
            </Button>
          </TooltipUI>
        </div>
      </div>

      {/* Resumo Financeiro */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-gray-800">
          💰 Resumo Financeiro
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="col-span-2"
          >
            <Card
              title="Expectativa a Arrecadar"
              value={totalExpected}
              icon={TrendingUp}
              footer={
                <div className="text-sm text-gray-500">
                  Total previsto no período
                </div>
              }
            />
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="col-span-2"
          >
            <Card
              title="Total Arrecadado"
              value={totalCollected}
              icon={Coins}
              footer={
                showComparison &&
                comparativeMetrics && (
                  <div
                    className={`text-sm flex items-center gap-1 ${
                      comparativeMetrics.trend === 'up'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {comparativeMetrics.trend === 'up' ? (
                      <TrendingUp size={16} />
                    ) : (
                      <TrendingDown size={16} />
                    )}
                    {Math.abs(comparativeMetrics.percentageChange).toFixed(1)}%
                    em relação ao mês anterior
                  </div>
                )
              }
            />
          </motion.div>

          <Card
            title="Taxa de Realização"
            value={(totalCollected / totalExpected) * 100}
            icon={TrendingUp}
            valueFormatter={value => `${value.toFixed(1)}%`}
            footer={
              <div className="text-sm text-gray-500">Do valor esperado</div>
            }
          />

          <Card
            title="Pagamentos Pendentes"
            value={pendingCount}
            icon={AlertCircle}
          />

          <Card
            title="Média por Estudante"
            value={advancedMetrics.mediaByStudent}
            icon={Users}
          />

          <Card
            title="Taxa de Inadimplência"
            value={advancedMetrics.defaultRate}
            icon={AlertCircle}
            valueFormatter={value => `${value.toFixed(1)}%`}
            footer={
              <div className="text-sm text-gray-500">
                {advancedMetrics.defaultingStudents} de{' '}
                {advancedMetrics.totalStudents} estudantes
              </div>
            }
          />
        </div>
      </div>

      {/* Análise de Atrasos */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">
          ⚠️ Análise de Atrasos
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-50 p-4 rounded-xl"
          >
            <h4 className="text-sm font-semibold text-gray-600">
              Total em Multas
            </h4>
            <p className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('pt-MZ', {
                style: 'currency',
                currency: 'MZN',
              }).format(latePaymentMetrics.totalLateFees)}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-50 p-4 rounded-xl"
          >
            <h4 className="text-sm font-semibold text-gray-600">
              Faturas com Atraso
            </h4>
            <p className="text-2xl font-bold text-orange-600">
              {latePaymentMetrics.percentageWithLateFees.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-500">
              ({latePaymentMetrics.invoicesWithLateFees} faturas)
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-gray-50 p-4 rounded-xl"
          >
            <h4 className="text-sm font-semibold text-gray-600">
              Média de Dias em Atraso
            </h4>
            <p className="text-2xl font-bold text-yellow-600">
              {Math.round(latePaymentMetrics.averageDaysLate)} dias
            </p>
          </motion.div>
        </div>
      </div>

      {/* Visualizações */}
      <AnimatePresence mode="wait">
        {viewMode === 'graphs' ? (
          <motion.div
            key="graphs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Gráfico de Análise Mensal */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-blue-700">
                    📊 Análise Mensal
                  </h3>
                  <select
                    className="border rounded-md px-3 py-2 text-sm"
                    value={selectedMetric}
                    onChange={e =>
                      setSelectedMetric(e.target.value as 'amount' | 'count')
                    }
                  >
                    <option value="amount">Valores</option>
                    <option value="count">Quantidade</option>
                  </select>
                </div>
                <div className="h-[400px]">
                  <Bar data={monthlyAnalysis} options={scaleChartOptions} />
                </div>
              </div>

              {/* Gráfico de Tendência */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-blue-700 mb-6">
                  📈 Tendência de Pagamentos
                </h3>
                <div className="h-[400px]">
                  <Line data={trendChartData} options={scaleChartOptions} />
                </div>
              </div>

              {/* Gráfico de Status */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-blue-700 mb-6">
                  📊 Distribuição de Status
                </h3>
                <div className="h-[400px]">
                  <Pie data={pieChartData} options={baseChartOptions} />
                </div>
              </div>

              {/* Gráfico de Métodos de Pagamento */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-blue-700 mb-6">
                  💳 Métodos de Pagamento
                </h3>
                <div className="h-[400px]">
                  <Pie
                    data={paymentMethodChartData}
                    options={baseChartOptions}
                  />
                </div>
              </div>
            </div>

            {/* Análise por Curso */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold text-blue-700 mb-6">
                📚 Análise por Curso
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Curso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Arrecadado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estudantes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Taxa de Pagamento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Multas
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {courseMetrics.map((course, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {course.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Intl.NumberFormat('pt-MZ', {
                            style: 'currency',
                            currency: 'MZN',
                          }).format(course.totalAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {course.studentCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {(
                            (course.paidCount /
                              (course.paidCount + course.pendingCount)) *
                            100
                          ).toFixed(1)}
                          %
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Intl.NumberFormat('pt-MZ', {
                            style: 'currency',
                            currency: 'MZN',
                          }).format(course.lateFees)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-blue-700 mb-6">
              📋 Lista de Faturas
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      { key: 'name', label: 'Nome do Estudante' },
                      { key: 'month', label: 'Mês' },
                      { key: 'year', label: 'Ano' },
                      { key: 'amount', label: 'Valor' },
                      { key: 'status', label: 'Status' },
                    ].map(({ key, label }) => (
                      <th key={key} className="px-6 py-3 text-left">
                        <button
                          type="button"
                          className="text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 w-full text-left flex items-center gap-1"
                          onClick={() => handleSort(key)}
                          aria-label={`Sort by ${label}`}
                        >
                          {label}
                          {sortConfig.key === key && (
                            <span className="text-blue-500">
                              {sortConfig.direction === 'asc' ? '↑' : '↓'}
                            </span>
                          )}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedInvoices.map((inv, idx) => (
                    <motion.tr
                      key={`${inv.student.id}-${inv.month}-${inv.year}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {inv.student.name} {inv.student.surname}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inv.month}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {inv.year}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Intl.NumberFormat('pt-MZ', {
                          style: 'currency',
                          currency: 'MZN',
                        }).format(inv.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            inv.status === 'PAGO'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
