// src/components/DashboardTeachers.jsx
import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
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

export function DashboardTeachers() {
  const [selectedSubject, setSelectedSubject] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const { theme } = useTheme()

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

  console.log('Dados dos alunos por disciplina:', dataStudentsSubjects)

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

  console.log('Disciplinas filtradas:', filteredSubjects)

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

  return (
    <div
      className={`p-8 w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} min-h-screen`}
    >
      <div
        className={`max-w-6xl mx-auto ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-lg shadow-md`}
      >
        {/* Filtros */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar disciplina..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`w-full pl-10 p-2 border rounded-md ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white border-gray-600'
                  : 'bg-white'
              }`}
            />
          </div>
          <select
            value={selectedPeriod}
            onChange={e => setSelectedPeriod(e.target.value)}
            className={`p-2 border rounded-md ${
              theme === 'dark'
                ? 'bg-gray-700 text-white border-gray-600'
                : 'bg-white'
            }`}
          >
            <option value="">Todos os períodos</option>
            {uniquePeriods.map(period => (
              <option key={period} value={period}>
                {period}
              </option>
            ))}
          </select>
        </div>

        {/* Gráfico */}
        <div className="mb-8 h-64">
          <h3 className="text-xl font-semibold mb-4">
            Distribuição de Alunos por Disciplina
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="alunos" fill="#eab308" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject, index) => {
            const totalAlunos = getTotalAlunos(subject.subject.codigo)
            return (
              <button
                type="button"
                key={index}
                className={`p-6 rounded-md shadow-md transition-colors cursor-pointer w-full text-left ${
                  theme === 'dark'
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-blue-200 hover:bg-blue-300'
                }`}
                onClick={() => handleCardClick(subject)}
              >
                <h3 className="text-xl font-medium mb-2">
                  {subject.subject.subjectName}
                </h3>
                <p className="text-sm">
                  Estado: {subject.status === 'ATIVO' ? 'activo' : 'inactivo'}
                </p>
                <p className="text-sm">Total de Alunos: {totalAlunos.length}</p>
                <p className="text-sm">
                  Período:{' '}
                  {formatPeriodo(
                    subject.subject.year_study,
                    subject.subject.semester
                  )}
                </p>
              </button>
            )
          })}
        </div>

        {/* Resumo */}
        {selectedSubject && (
          <div
            className={`mt-8 p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}
          >
            <h2 className="text-2xl font-bold mb-4">
              {selectedSubject.subject.subjectName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-lg mb-2">
                  <strong>Código:</strong> {selectedSubject.subject.codigo}
                </p>
                <p className="text-lg mb-2">
                  <strong>Estado:</strong>{' '}
                  {selectedSubject.status === 'ATIVO' ? 'Ativo' : 'Inativo'}
                </p>
              </div>
              <div>
                <p className="text-lg mb-2">
                  <strong>Total de Alunos:</strong>{' '}
                  {getTotalAlunos(selectedSubject.subject.codigo).length}
                </p>
                <p className="text-lg mb-2">
                  <strong>Período:</strong>{' '}
                  {formatPeriodo(
                    selectedSubject.subject.year_study,
                    selectedSubject.subject.semester
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
