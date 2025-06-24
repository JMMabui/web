import {
  calculateAverageSalary,
  getAllEmployees,
  groupEmployeesByDepartment,
} from '@/http/employee/employee'
import { useQuery } from '@tanstack/react-query'
import { Users, User, FileText, FileDown } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js'
import Card from '@/components/Card'
import { TabelaFuncionarios } from '@/components/EmployeeTable'
import Button from '@/components/Button'
import { exportToExcel } from '@/components/exportToExcel'

ChartJS.register(ArcElement, Tooltip, Legend)

export function Dashboard_Human_Resourses() {
  const [statusFilter, setStatusFilter] = useState<
    'TODOS' | 'ATIVO' | 'INATIVO'
  >('TODOS')
  const [departmentFilter, setDepartmentFilter] = useState<string>('TODOS')

  const {
    data: employeesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['employees'],
    queryFn: getAllEmployees,
  })

  const employees = employeesData?.data ?? []

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const statusMatch =
        statusFilter === 'TODOS' || emp.status === statusFilter
      const departmentMatch =
        departmentFilter === 'TODOS' || emp.department === departmentFilter
      return statusMatch && departmentMatch
    })
  }, [employees, statusFilter, departmentFilter])

  const activeEmployees = filteredEmployees.filter(
    emp => emp.status === 'ATIVO'
  ).length
  const inactiveEmployees = filteredEmployees.filter(
    emp => emp.status === 'INATIVO'
  ).length
  const averageSalary = calculateAverageSalary(filteredEmployees)
  const departmentData = groupEmployeesByDepartment(filteredEmployees)

  const uniqueDepartments = Array.from(
    new Set(employees.map(emp => emp.department))
  )

  const pieData = {
    labels: Object.entries(departmentData).map(
      ([name, group]) => `${name} (${group.length})`
    ),

    datasets: [
      {
        label: 'Funcionários por Departamento',
        data: Object.values(departmentData).map(dept => dept.length),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C9CBCF',
        ],
        hoverOffset: 8,
      },
    ],
  }

  const pieOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom', // ⬅️ Coloca as labels em linha abaixo do gráfico
        labels: {
          boxWidth: 20,
          padding: 15,
          color: '#4B5563', // opcional: cor do texto da legenda (text-gray-700)
          font: {
            size: 12,
          },
        },
      },
    },
  }

  if (isLoading) {
    return <div className="p-6 text-gray-600">Carregando funcionários...</div>
  }

  if (isError) {
    return (
      <div className="p-6 text-red-600">Erro ao carregar os funcionários.</div>
    )
  }

  return (
    <div className="flex flex-col p-4 bg-gray-50">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status:
          </label>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="p-2 border rounded-md w-full"
          >
            <option value="TODOS">Todos</option>
            <option value="ATIVO">Ativos</option>
            <option value="INATIVO">Inativos</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Departamento:
          </label>
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            <option value="TODOS">Todos</option>
            {uniqueDepartments.map(dep => (
              <option key={dep} value={dep}>
                {dep}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card
          title="Total"
          value={filteredEmployees.length}
          icon={Users}
          iconColor="text-blue-500"
        />
        <Card
          title="Ativos"
          value={activeEmployees}
          icon={User}
          iconColor="text-green-500"
        />
        <Card
          title="Inativos"
          value={inactiveEmployees}
          icon={FileText}
          iconColor="text-red-500"
        />
        <Card
          title="Média Salarial"
          value={averageSalary}
          icon={FileText}
          iconColor="text-yellow-500"
        />
      </div>

      <div>
        <Button
          onClick={() =>
            exportToExcel(
              filteredEmployees.map(emp => ({
                nome: `${emp.user.name} ${emp.user.surname}`,
                departamento: emp.department,
                status: emp.status,
                salario: emp.salary,
              })),
              'funcionarios_ativos',
              {
                nome: 'Nome',
                departamento: 'Departamento',
                status: 'Status',
                salario: 'Salário',
              },
              ['salario']
            )
          }
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm mb-4 flex items-center gap-2"
        >
          <FileDown size={16} />
          Exportar Excel
        </Button>
      </div>

      {/* Gráfico */}
      <div className="mt-8 max-w-xs md:max-w-sm lg:max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Funcionários por Departamento
        </h2>
        {Object.keys(departmentData).length > 0 ? (
          <div className="h-100">
            <Pie data={pieData} options={pieOptions} />
          </div>
        ) : (
          <p className="text-gray-600 text-center">Sem dados para exibir.</p>
        )}
      </div>

      {/* Tabela de Funcionários Filtrados */}
      <TabelaFuncionarios employees={filteredEmployees} />
    </div>
  )
}
