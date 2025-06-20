import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorComponent } from '@/components/ErrorComponent'
import { getAssessmentResultByStudentId } from '@/http/assessmentResult'
import {
  getStudentsSubjectsByStudentId,
  type StudentsSubjectsWithExtraDataResponse,
} from '@/http/students-subjects'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts'
import { Calendar, TrendingUp, Users, Filter } from 'lucide-react'

interface AssessmentResult {
  id: string
  grade: number
  assessment: {
    name: string
    dateApplied: string
    weight: number
    subjectId: string
    assessmentType: string
  }
}

interface ClassAverage {
  assessmentName: string
  studentGrade: number
  classAverage: number
}

export function Assessments() {
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all')
  const [showClassAverage, setShowClassAverage] = useState<boolean>(false)
  const id = localStorage.getItem('student_login_id')

  // Obtendo os dados das disciplinas
  const {
    data: dataSubjects,
    isLoading: isLoadingSubjects,
    error: errorSubjects,
  } = useQuery<StudentsSubjectsWithExtraDataResponse[]>({
    queryKey: ['subject'],
    queryFn: () => getStudentsSubjectsByStudentId(id),
  })

  const {
    data: dataAssessmentResultById,
    isLoading: isLoadingAssessmentResult,
    error: errorAssessmentResult,
  } = useQuery({
    queryKey: ['assessmentstudent'],
    queryFn: () => getAssessmentResultByStudentId(id),
  })

  // Dados simulados para médias da turma (substituir por dados reais da API)
  const classAverages: ClassAverage[] = [
    { assessmentName: 'Avaliação 1', studentGrade: 15, classAverage: 12.5 },
    { assessmentName: 'Avaliação 2', studentGrade: 14, classAverage: 13.2 },
    { assessmentName: 'Avaliação 3', studentGrade: 16, classAverage: 14.8 },
  ]

  if (isLoadingSubjects || isLoadingAssessmentResult) {
    return <LoadingSkeleton />
  }

  if (errorSubjects || errorAssessmentResult) {
    return <ErrorComponent />
  }

  const handleSelectSubject = (subjectId: string, subjectCode: string) => {
    setSelectedSubject(subjectId)
    setSelectedSubjectCode(subjectCode)
  }

  const filteredSubjects = dataSubjects?.filter(
    subjects =>
      subjects.status === 'INSCRITO' && subjects.result === 'EM_ANDAMENTO'
  )

  const filteredAssessmentResults = dataAssessmentResultById?.filter(
    assessmentResult => {
      const isSelectedSubject = assessmentResult.assessment.subjectId === selectedSubjectCode
      const isNotExam = !assessmentResult.assessment.assessmentType.startsWith('EXAME')
      const isInPeriod = selectedPeriod === 'all' || 
        (selectedPeriod === 'current' && new Date(assessmentResult.assessment.dateApplied) >= new Date(new Date().getFullYear(), new Date().getMonth(), 1)) ||
        (selectedPeriod === 'last' && new Date(assessmentResult.assessment.dateApplied) >= new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1))
      return isSelectedSubject && isNotExam && isInPeriod
    }
  )

  const filteredExams = dataAssessmentResultById?.filter(assessmentResult => {
    return (
      assessmentResult.assessment.subjectId === selectedSubjectCode &&
      assessmentResult.assessment.assessmentType.startsWith('EXAME')
    )
  })

  const filterWeight = filteredAssessmentResults?.map(assessmentResult => {
    return assessmentResult.assessment.weight
  })

  const sumWeight = filterWeight?.reduce<number>((acc, curr) => {
    const accValue = acc ?? 0
    const currValue = curr ?? 0
    return accValue + currValue
  }, 0)

  const averageFrequency = filteredAssessmentResults
    ?.reduce((acc, curr) => {
      const weight = curr.assessment.weight ?? 0
      const grade = curr.grade ?? 0
      return acc + (weight * grade) / 100
    }, 0)
    .toFixed(2)

  const filterExamsGrade = filteredExams
    ?.reduce((acc, curr) => {
      const grade = curr.grade ?? 0
      const sum = acc + grade
      return sum
    }, 0)
    .toFixed(2)

  const averageFinal = (Number(averageFrequency) + Number(filterExamsGrade)) / 2

  // Preparar dados para o gráfico
  const chartData = filteredAssessmentResults?.map(result => ({
    name: result.assessment.name,
    nota: result.grade,
    peso: result.assessment.weight,
    data: new Date(result.assessment.dateApplied).toLocaleDateString(),
  }))

  const getGradeColor = (grade: number) => {
    if (grade >= 15) return 'bg-green-100 text-green-800'
    if (grade >= 10) return 'bg-blue-100 text-blue-800'
    if (grade >= 7) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Avaliações</h1>
          <p className="text-amber-100">Acompanhe suas notas e resultados acadêmicos</p>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-8 border border-gray-100">
          {/* Subject Selection and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">
                Escolha uma disciplina
              </h2>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 backdrop-blur-sm transition-all duration-300 appearance-none"
                  >
                    <option value="all">Todos os períodos</option>
                    <option value="current">Período atual</option>
                    <option value="last">Período anterior</option>
                  </select>
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
                <button
                  onClick={() => setShowClassAverage(!showClassAverage)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    showClassAverage
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Médias da Turma</span>
                </button>
              </div>
            </div>
            <div className="relative">
              <select
                onChange={e => {
                  const selectedSubjectId = e.target.value
                  const selectedSubjectData = dataSubjects?.find(
                    subject => subject.id === selectedSubjectId
                  )
                  if (selectedSubjectData) {
                    handleSelectSubject(
                      selectedSubjectId,
                      selectedSubjectData.subjectId
                    )
                  }
                }}
                value={selectedSubject}
                className="w-full text-gray-700 p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/80 backdrop-blur-sm transition-all duration-300 appearance-none"
              >
                <option value="">Selecione uma disciplina</option>
                {filteredSubjects?.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subjectId} - {subject.Subject.subjectName}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Assessment Results */}
          {selectedSubject && (
            <div className="space-y-8">
              {/* Performance Chart */}
              {chartData && chartData.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-amber-500" />
                    Desempenho ao Longo do Tempo
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 20]} />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="nota"
                          stroke="#f59e0b"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Class Average Comparison */}
              {showClassAverage && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-amber-500" />
                    Comparação com a Turma
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={classAverages}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="assessmentName" />
                        <YAxis domain={[0, 20]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="studentGrade" name="Sua Nota" fill="#f59e0b" />
                        <Bar dataKey="classAverage" name="Média da Turma" fill="#9ca3af" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Results Table */}
              {Array.isArray(filteredAssessmentResults) &&
              filteredAssessmentResults.length > 0 ? (
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-4">
                    <h2 className="text-xl font-semibold text-white">
                      Resultados da Avaliação
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Disciplina
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Nota
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Peso
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                            Data da Avaliação
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAssessmentResults.map(assessmentResult => (
                          <tr key={assessmentResult.id} className="hover:bg-gray-50 transition-colors duration-200">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {assessmentResult.assessment.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(Number(assessmentResult.grade))}`}>
                                {assessmentResult.grade}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {assessmentResult.assessment.weight}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {new Date(
                                assessmentResult.assessment.dateApplied
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhum resultado encontrado para o período selecionado.</p>
                </div>
              )}

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Média de Frequência</h3>
                  <p className="text-3xl font-bold text-amber-600">{averageFrequency}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Média de Exames</h3>
                  <p className="text-3xl font-bold text-amber-600">{filterExamsGrade}</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Média Final</h3>
                  <p className="text-3xl font-bold text-amber-600">{averageFinal.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
