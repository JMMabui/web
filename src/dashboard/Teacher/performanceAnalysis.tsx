import { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { useToast } from '../../components/ui/toast'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend
)

interface PerformanceData {
  studentId: string
  studentName: string
  assessments: {
    id: string
    name: string
    grade: number
    date: string
  }[]
  average: number
  highestGrade: number
  lowestGrade: number
  approvalRate: number
}

export function PerformanceAnalysis() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [selectedStudent, setSelectedStudent] = useState<string>('')

  // Fetch disciplines
  const { data: disciplines } = useQuery({
    queryKey: ['disciplines'],
    queryFn: async () => {
      const response = await api.get('/disciplines')
      return response.json()
    },
  })

  // Fetch students
  const { data: students } = useQuery({
    queryKey: ['students', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const response = await api.get(
        `/students?disciplineId=${selectedDiscipline}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Fetch performance data
  const { data: performanceData } = useQuery({
    queryKey: ['performance-analysis', selectedDiscipline, selectedStudent],
    queryFn: async () => {
      if (!selectedDiscipline) return null
      const response = await api.get(
        `/performance-analysis?disciplineId=${selectedDiscipline}&studentId=${selectedStudent}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Fetch class list
  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await api.get('/classes')
      return response.json()
    },
  })

  // Prepare chart data
  const performanceChartData = {
    labels: performanceData?.assessments.map((a: any) => a.name) || [],
    datasets: [
      {
        label: 'Notas',
        data: performanceData?.assessments.map((a: any) => a.grade) || [],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  }

  const performanceByTypeData = {
    labels: ['Provas', 'Trabalhos', 'Exercícios', 'Projetos'],
    datasets: [
      {
        label: 'Média por Tipo',
        data: [8.5, 7.8, 9.2, 8.9],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Desempenho do Aluno',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
      },
    },
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Análise de Desempenho</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Disciplina</h3>
          <p className="text-sm text-gray-600 mb-4">Selecione a disciplina</p>
          <select
            value={selectedDiscipline}
            onChange={e => setSelectedDiscipline(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione uma disciplina</option>
            {disciplines?.map((discipline: any) => (
              <option key={discipline.id} value={discipline.id}>
                {discipline.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Aluno</h3>
          <p className="text-sm text-gray-600 mb-4">Selecione o aluno</p>
          <select
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione um aluno</option>
            {students?.map((student: any) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {performanceData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Métricas Gerais</h3>
            <p className="text-sm text-gray-600 mb-4">
              Visão geral do desempenho
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-100 rounded-lg">
                <p className="text-sm text-gray-600">Média Geral</p>
                <p className="text-2xl font-bold">
                  {performanceData.average.toFixed(1)}
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg">
                <p className="text-sm text-gray-600">Taxa de Aprovação</p>
                <p className="text-2xl font-bold">
                  {performanceData.approvalRate}%
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg">
                <p className="text-sm text-gray-600">Maior Nota</p>
                <p className="text-2xl font-bold">
                  {performanceData.highestGrade.toFixed(1)}
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg">
                <p className="text-sm text-gray-600">Menor Nota</p>
                <p className="text-2xl font-bold">
                  {performanceData.lowestGrade.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Desempenho por Tipo</h3>
            <p className="text-sm text-gray-600 mb-4">
              Média por tipo de avaliação
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Provas', value: 8.5 },
                    { name: 'Trabalhos', value: 7.8 },
                    { name: 'Exercícios', value: 9.2 },
                    { name: 'Projetos', value: 8.9 },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {performanceData && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-2">Evolução do Desempenho</h3>
          <p className="text-sm text-gray-600 mb-4">Histórico de notas</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={performanceData.assessments.map((assessment: any) => ({
                  name: assessment.name,
                  nota: assessment.grade,
                  data: new Date(assessment.date).toLocaleDateString(),
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="data" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="nota"
                  stroke="#3B82F6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {performanceData && (
        <div className="mt-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Recomendações</h3>
            <p className="text-sm text-gray-600 mb-4">
              Sugestões para melhorar o desempenho
            </p>
            <div className="space-y-4">
              {performanceData.average < 7 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="font-medium text-yellow-800">
                    Atenção Necessária
                  </h3>
                  <p className="text-yellow-700">
                    O aluno está com média abaixo do esperado. Recomenda-se:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-yellow-700">
                    <li>Agendar uma reunião com o aluno</li>
                    <li>Identificar as principais dificuldades</li>
                    <li>Propor atividades de recuperação</li>
                    <li>Estabelecer um plano de estudos</li>
                  </ul>
                </div>
              )}

              {performanceData.approvalRate < 70 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h3 className="font-medium text-red-800">
                    Intervenção Urgente
                  </h3>
                  <p className="text-red-700">
                    A taxa de aprovação está abaixo do esperado. Ações
                    recomendadas:
                  </p>
                  <ul className="list-disc list-inside mt-2 text-red-700">
                    <li>Revisar a metodologia de ensino</li>
                    <li>Analisar o nível de dificuldade das avaliações</li>
                    <li>Implementar atividades de reforço</li>
                    <li>Considerar ajustes no plano de ensino</li>
                  </ul>
                </div>
              )}

              {performanceData.average >= 7 &&
                performanceData.approvalRate >= 70 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-800">
                      Bom Desempenho
                    </h3>
                    <p className="text-green-700">
                      O aluno está com bom desempenho. Sugestões para manter:
                    </p>
                    <ul className="list-disc list-inside mt-2 text-green-700">
                      <li>Manter o ritmo de estudos</li>
                      <li>Participar de atividades extras</li>
                      <li>Contribuir com a turma</li>
                      <li>Explorar tópicos avançados</li>
                    </ul>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
