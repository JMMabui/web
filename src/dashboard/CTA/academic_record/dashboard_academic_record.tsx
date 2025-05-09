import { useState } from 'react'
import {
  User,
  CheckCircle,
  BookOpen,
  Clipboard,
  AlertCircle,
} from 'lucide-react' // Ícones de exemplo
import { useQuery } from '@tanstack/react-query'
import { getRegistration, type RegistrationResponse } from '@/http/registration'
import { type CourseResponse, getCourses } from '@/http/courses'
import { getStudents, type StudentsResponse } from '@/http/students'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorComponent } from '@/components/ErrorComponent'
import Button from '@/components/Button'
import { Bar } from 'react-chartjs-2'
import { saveAs } from 'file-saver'

export function AcademicRecord() {
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedLevelCourse, setSelectedLevelCourse] = useState<
    | 'CURTA_DURACAO'
    | 'TECNICO_MEDIO'
    | 'LICENCIATURA'
    | 'MESTRADO'
    | 'RELIGIOSO'
    | ''
  >('')
  const [selectedPeriod, setSelectedPeriod] = useState<
    'LABORAL' | 'POS_LABORAL' | ''
  >('')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const {
    data: dataCourses,
    error: coursesError,
    isLoading: isLoadingCourse,
  } = useQuery<CourseResponse[]>({
    queryKey: ['course_data'],
    queryFn: getCourses,
  })

  const {
    data: dataStudents,
    error: studentError,
    isLoading: isLoadingStudents,
  } = useQuery<StudentsResponse[]>({
    queryKey: ['students_data'],
    queryFn: getStudents,
  })

  const {
    data: dataRegistration,
    error: errorRegistration,
    isLoading: isLoadingRegistration,
  } = useQuery<RegistrationResponse[]>({
    queryKey: ['matricula'],
    queryFn: getRegistration,
  })

  if (isLoadingCourse || isLoadingStudents || isLoadingRegistration) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSkeleton />
      </div>
    )
  }

  const errors = [coursesError, studentError, errorRegistration]
    .filter(err => err instanceof Error)
    .map(err => err?.message)
    .join(', ')

  if (errors) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ErrorComponent message={errors} />
      </div>
    )
  }

  const totalStudents = dataStudents?.length ?? 0
  const studentsRegistered =
    dataRegistration?.filter(
      student => student.registrationStatus === 'CONFIRMADO'
    ).length ?? 0
  const studentsPending =
    dataRegistration?.filter(
      student => student.registrationStatus === 'PENDENTE'
    ).length ?? 0
  const totalCourses = dataCourses?.length ?? 0

  const totalAvailableSlots = Array.isArray(dataCourses)
    ? dataCourses.reduce((acc, course) => acc + course.totalVacancies, 0)
    : 0

  const totalEnrolledSlots =
    dataRegistration?.filter(
      student => student.registrationStatus === 'CONFIRMADO'
    ).length ?? 0

  const availableSlots = totalAvailableSlots - totalEnrolledSlots

  const filteredCourses = dataCourses?.filter(
    course =>
      (selectedLevelCourse
        ? course.levelCourse === selectedLevelCourse
        : true) && (selectedPeriod ? course.period === selectedPeriod : true)
  )

  const groupedByCourse = dataRegistration?.reduce<
    Record<string, RegistrationResponse[]>
  >((acc, student) => {
    const courseName = student.course.courseName
    if (!acc[courseName]) acc[courseName] = []
    acc[courseName].push(student)
    return acc
  }, {})

  const studentsInSelectedCourse = groupedByCourse?.[selectedCourse] || []

  const filteredStudents = studentsInSelectedCourse.filter(student =>
    student.student.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const itemsPerPage = 10
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)

  const chartData = {
    labels: ['Total de Alunos', 'Inscritos', 'Pendentes', 'Cursos'],
    datasets: [
      {
        label: 'Estatísticas',
        data: [
          totalStudents,
          studentsRegistered,
          studentsPending,
          totalCourses,
        ],
        backgroundColor: ['#FFCE56', '#36A2EB', '#FF6384', '#4BC0C0'],
      },
    ],
  }

  const handleExport = () => {
    const csvContent = filteredStudents
      .map(
        student =>
          `${student.student.name},${student.course.courseName},${student.registrationStatus}`
      )
      .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'students.csv')
  }

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Resumo do Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          {
            label: 'Total de Alunos',
            value: totalStudents,
            icon: <User className="text-yellow-600" />,
          },
          {
            label: 'Alunos Inscritos',
            value: studentsRegistered,
            icon: <CheckCircle className="text-green-600" />,
          },
          {
            label: 'Matrículas Pendentes',
            value: studentsPending,
            icon: <AlertCircle className="text-orange-600" />,
          },
          {
            label: 'Total de Cursos',
            value: totalCourses,
            icon: <BookOpen className="text-blue-600" />,
          },
          {
            label: 'Vagas Disponíveis',
            value: availableSlots,
            icon: <Clipboard className="text-red-600" />,
          },
        ].map(({ label, value, icon }, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between"
          >
            <div>
              <h3 className="text-lg font-medium">{label}</h3>
              <p className="text-xl font-bold">{value}</p>
            </div>
            <div className="w-12 h-12">{icon}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-6">Filtros</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Filtro de Nível do Curso */}
          <div>
            <label className="block text-lg font-medium mb-2">
              Nível do Curso
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={selectedLevelCourse}
              onChange={e => setSelectedLevelCourse(e.target.value as any)}
            >
              <option value="">Todos os Níveis</option>
              <option value="LICENCIATURA">Licenciatura</option>
              <option value="MESTRADO">Mestrado</option>
              <option value="CURTA_DURACAO">Curta Duração</option>
              <option value="TECNICO_MEDIO">Técnico Médio</option>
              <option value="RELIGIOSO">Religioso</option>
            </select>
          </div>

          {/* Filtro de Período */}
          <div>
            <label className="block text-lg font-medium mb-2">Período</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value as any)}
            >
              <option value="">Todos os Períodos</option>
              <option value="LABORAL">Laboral</option>
              <option value="POS_LABORAL">Pós-Laboral</option>
            </select>
          </div>

          {/* Filtro de Curso */}
          <div>
            <label className="block text-lg font-medium mb-2">Curso</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
            >
              <option value="">Selecione um curso</option>
              {filteredCourses?.length ? (
                filteredCourses.map(course => (
                  <option key={course.id} value={course.courseName}>
                    {course.levelCourse} em {course.courseName} -{' '}
                    {course.period}
                  </option>
                ))
              ) : (
                <option disabled>Sem cursos disponíveis</option>
              )}
            </select>
          </div>

          {/* Campo de Busca */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
            <label className="block text-lg font-medium mb-2">
              Buscar Aluno
            </label>
            <input
              type="text"
              placeholder="Digite o nome do aluno..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Resumo Gráfico</h3>
        <Bar data={chartData} />
      </div> */}

      <div className="mt-8">
        <Button onClick={handleExport} className="bg-green-600 text-white">
          Exportar Dados
        </Button>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">
          Detalhes dos Alunos - {selectedCourse}
        </h3>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-yellow-600 text-white">
                <th className="px-4 py-2 border border-gray-300">
                  Nome do Aluno
                </th>
                <th className="px-4 py-2 border border-gray-300">Curso</th>
                <th className="px-4 py-2 border border-gray-300">
                  Inscrição Concluída
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border border-gray-300">
                    {student.student.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {student.course.courseName}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {student.registrationStatus === 'CONFIRMADO'
                      ? 'Sim'
                      : 'Não'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-4">
            <Button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Anterior
            </Button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <Button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Próxima
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
