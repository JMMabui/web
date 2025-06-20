// src/components/DashboardTeachers.jsx
import { useState, useMemo } from 'react'
import {
  Search,
  BookOpen,
  Users,
  GraduationCap,
  Calendar,
  BarChart3,
  TrendingUp,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { getTeacherByEmail } from '@/http/teacher'
import { getTeacherSubjectByTeacherId } from '@/http/teacherSubjects'
import {
  getStudentsSubjectsBySubjectId,
  type StudentsSubjectsWithExtraDataResponse,
} from '@/http/students-subjects'
import Button from '@/components/Button'

export function DashboardTeachers() {
  const [selectedSubject, setSelectedSubject] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')

  const email = localStorage.getItem('email')

  // Buscar dados do professor
  const { data: dataTeacher } = useQuery({
    queryKey: ['teacher'],
    queryFn: async () =>
      email ? getTeacherByEmail(email) : Promise.reject('Invalid email'),
    enabled: !!email,
  })

  const teacherId = dataTeacher?.id || ''
  localStorage.setItem('teacherId', teacherId)

  // Buscar disciplinas do professor
  const { data: dataTeacherSubjects } = useQuery({
    queryKey: ['teacherSubjects', teacherId],
    queryFn: async () => getTeacherSubjectByTeacherId(teacherId),
    enabled: !!teacherId,
  })

  const teacherSubjects = (dataTeacherSubjects || []).map(subjectData => ({
    ...subjectData,
    subject: {
      ...subjectData.Subject,
      year_study: subjectData.Subject.year_study,
      semester: subjectData.Subject.semester,
    },
  }))

  const subjectIds = teacherSubjects.map(subject => subject.subjectId)

  // Buscar alunos das disciplinas
  const { data: dataStudentsSubjects } = useQuery<
    StudentsSubjectsWithExtraDataResponse[]
  >({
    queryKey: ['studentsSubjects', subjectIds],
    queryFn: async () => {
      const results = await Promise.all(
        subjectIds.map(subjectId => getStudentsSubjectsBySubjectId(subjectId))
      )
      return results.flat()
    },
    enabled: subjectIds.length > 0,
  })

  // Unificar os alunos
  const studentsSubjects = (dataStudentsSubjects || []).map(studentData => ({
    ...studentData,
    studentId: studentData.studentId,
  }))

  const getTotalAlunos = (subjectId: string) => {
    return studentsSubjects.filter(student => student.subjectId === subjectId)
  }

  const handleCardClick = (subject: any) => {
    setSelectedSubject(subject)
  }

  const formatPeriodo = (yearStudy: string, semester: string) => {
    const semestreFormatado = formSemester(semester)
    const anoFormatado = formatYear(yearStudy)
    return `${anoFormatado} - ${semestreFormatado}`
  }

  const formSemester = (semester: string) => {
    switch (semester) {
      case 'PRIMEIRO_SEMESTRE':
        return '1º Semestre'
      case 'SEGUNDO_SEMESTRE':
        return '2º Semestre'
      default:
        return semester
    }
  }

  const formatYear = (yearStudy: string) => {
    switch (yearStudy) {
      case 'PRIMEIRO_ANO':
        return '1º Ano'
      case 'SEGUNDO_ANO':
        return '2º Ano'
      case 'TERCEIRO_ANO':
        return '3º Ano'
      case 'QUARTO_ANO':
        return '4º Ano'
      default:
        return yearStudy
    }
  }

  const filteredSubjects = useMemo(() => {
    return teacherSubjects
      .filter(subject => {
        const matchesSearch = subject?.subject?.subjectName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
        const matchesPeriod =
          !selectedPeriod ||
          formatPeriodo(
            subject.subject.year_study,
            subject.subject.semester
          ) === selectedPeriod
        return matchesSearch && matchesPeriod
      })
      .sort((a, b) =>
        a.subject.subjectName.localeCompare(b.subject.subjectName)
      )
  }, [teacherSubjects, searchTerm, selectedPeriod])

  const chartData = useMemo(() => {
    return filteredSubjects.map(subject => {
      const totalAlunos = getTotalAlunos(subject.subject.codigo).length
      return {
        name: subject.subject.subjectName,
        alunos: totalAlunos,
      }
    })
  }, [filteredSubjects, studentsSubjects])

  const uniquePeriods = useMemo(() => {
    const periods = new Set(
      teacherSubjects.map(subject =>
        formatPeriodo(subject.subject.year_study, subject.subject.semester)
      )
    )
    return Array.from(periods)
  }, [teacherSubjects])

  // Calcular estatísticas gerais
  const totalStudents = studentsSubjects.length
  const totalSubjects = filteredSubjects.length
  const averageStudentsPerSubject =
    totalSubjects > 0 ? Math.round(totalStudents / totalSubjects) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <GraduationCap className="h-8 w-8" />
                Dashboard do Professor
              </h1>
              <p className="text-blue-100 mt-2">
                Bem-vindo, {dataTeacher?.name || 'Professor'}! Acompanhe suas
                disciplinas e alunos
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Período Atual</p>
                <p className="font-semibold">2024.1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Disciplinas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalSubjects}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Alunos</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalStudents}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Média por Disciplina</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {averageStudentsPerSubject}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Períodos</p>
                <p className="text-2xl font-bold text-purple-600">
                  {uniquePeriods.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar disciplinas..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos os períodos</option>
              {uniquePeriods.map(period => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Gráfico */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Distribuição de Alunos por Disciplina
              </h3>
              <p className="text-sm text-gray-600">
                Visualize a quantidade de alunos em cada disciplina
              </p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Bar dataKey="alunos" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lista de disciplinas */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Suas Disciplinas
                </h3>
                <p className="text-sm text-gray-600">
                  {filteredSubjects.length} disciplinas encontradas
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map(subject => {
                const totalAlunos = getTotalAlunos(
                  subject.subject.codigo
                ).length
                return (
                  <Button
                    key={subject.subject.codigo}
                    onClick={() => handleCardClick(subject)}
                    className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group w-full text-left"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          {subject.subject.subjectName}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatPeriodo(
                            subject.subject.year_study,
                            subject.subject.semester
                          )}
                        </p>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                        <BookOpen className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Código:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {subject.subject.codigo}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Alunos:</span>
                        <span className="text-sm font-medium text-green-600">
                          {totalAlunos}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          Ativa
                        </span>
                      </div>
                    </div>
                  </Button>
                )
              })}
            </div>

            {filteredSubjects.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma disciplina encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
