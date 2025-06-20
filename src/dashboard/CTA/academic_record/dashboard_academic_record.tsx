import { useState } from 'react'
import {
  User,
  CheckCircle,
  BookOpen,
  Clipboard,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react' // Ícones de exemplo
import { useQuery } from '@tanstack/react-query'
import { getRegistration, type RegistrationResponse } from '@/http/registration'
import { type CourseResponse, getCourses } from '@/http/courses'
import { getStudents, type StudentsResponse } from '@/http/students'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorComponent } from '@/components/ErrorComponent'
import Button from '@/components/Button'
import { Bar, Pie } from 'react-chartjs-2'
import { saveAs } from 'file-saver'
import { toast } from 'react-toastify'

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
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [modalStudent, setModalStudent] = useState<RegistrationResponse | null>(
    null
  )

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
        <LoadingSpinner />
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

  // Simulação de tendência (em produção, calcular com base em dados históricos)
  const trends = {
    totalStudents: 'up',
    studentsRegistered: 'down',
    studentsPending: 'up',
    totalCourses: 'up',
    availableSlots: 'down',
  }
  const trendValues = {
    totalStudents: '+5%',
    studentsRegistered: '-2%',
    studentsPending: '+1%',
    totalCourses: '+1%',
    availableSlots: '-3%',
  }
  const trendColors = {
    up: 'text-green-500',
    down: 'text-red-500',
  }
  const iconBgs = [
    'bg-yellow-100',
    'bg-green-100',
    'bg-orange-100',
    'bg-blue-100',
    'bg-red-100',
  ]

  // Gráfico de status dos alunos
  const statusCounts = {
    Confirmado: studentsRegistered,
    Pendente: studentsPending,
  }
  const statusChartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Status',
        data: Object.values(statusCounts),
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  }

  // Gráfico de alunos por curso
  const courseLabels = filteredCourses?.map(c => c.courseName) || []
  const courseData = courseLabels.map(
    name => groupedByCourse?.[name]?.length || 0
  )
  const courseChartData = {
    labels: courseLabels,
    datasets: [
      {
        label: 'Alunos por Curso',
        data: courseData,
        backgroundColor: '#FFCE56',
      },
    ],
  }

  // Limpar filtros
  const handleClearFilters = () => {
    setSelectedCourse('')
    setSelectedLevelCourse('')
    setSelectedPeriod('')
    setSearchTerm('')
  }

  // Toast para exportação
  const handleExportSelected = () => {
    const studentsToExport = paginatedStudents.filter(s =>
      selectedStudents.includes(s.id)
    )
    const csvContent = studentsToExport
      .map(
        student =>
          `${student.student.name},${student.course.courseName},${student.registrationStatus}`
      )
      .join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, 'students_selecionados.csv')
    toast.success('Exportação realizada com sucesso!')
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

  const handleSelectStudent = (id: string) => {
    setSelectedStudents(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    )
  }
  const handleSelectAll = () => {
    if (selectedStudents.length === paginatedStudents.length) {
      setSelectedStudents([])
    } else {
      setSelectedStudents(paginatedStudents.map(s => s.id))
    }
  }

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Resumo do Dashboard
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[
          {
            label: 'Total de Alunos',
            value: totalStudents,
            icon: <User className="w-6 h-6 text-yellow-600" />,
            trend: trends.totalStudents,
            trendValue: trendValues.totalStudents,
            iconBg: iconBgs[0],
          },
          {
            label: 'Alunos Inscritos',
            value: studentsRegistered,
            icon: <CheckCircle className="w-6 h-6 text-green-600" />,
            trend: trends.studentsRegistered,
            trendValue: trendValues.studentsRegistered,
            iconBg: iconBgs[1],
          },
          {
            label: 'Matrículas Pendentes',
            value: studentsPending,
            icon: <AlertCircle className="w-6 h-6 text-orange-600" />,
            trend: trends.studentsPending,
            trendValue: trendValues.studentsPending,
            iconBg: iconBgs[2],
          },
          {
            label: 'Total de Cursos',
            value: totalCourses,
            icon: <BookOpen className="w-6 h-6 text-blue-600" />,
            trend: trends.totalCourses,
            trendValue: trendValues.totalCourses,
            iconBg: iconBgs[3],
          },
          {
            label: 'Vagas Disponíveis',
            value: availableSlots,
            icon: <Clipboard className="w-6 h-6 text-red-600" />,
            trend: trends.availableSlots,
            trendValue: trendValues.availableSlots,
            iconBg: iconBgs[4],
          },
        ].map(({ label, value, icon, trend, trendValue, iconBg }, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-5 flex flex-col gap-2 items-start"
          >
            <div className={`rounded-full p-3 ${iconBg} mb-2`}>{icon}</div>
            <span className="text-gray-500 text-sm">{label}</span>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{value}</span>
              <span
                className={`flex items-center gap-1 ${trendColors[trend as 'up' | 'down']}`}
              >
                {trend === 'up' ? <ArrowUpRight /> : <ArrowDownRight />}
                <span className="text-xs">{trendValue}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Gráficos em cards responsivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <h4 className="text-lg font-semibold mb-2">
            Distribuição por Status
          </h4>
          <span className="text-gray-500 text-xs mb-4">
            Alunos confirmados vs pendentes
          </span>
          <div className="w-full aspect-[4/3]">
            <Pie data={statusChartData} />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
          <h4 className="text-lg font-semibold mb-2">Alunos por Curso</h4>
          <span className="text-gray-500 text-xs mb-4">
            Distribuição dos alunos por curso
          </span>
          <div className="w-full aspect-[4/3]">
            <Bar data={courseChartData} />
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-6">Filtros</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-lg font-medium mb-2">
              Nível do Curso
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={selectedLevelCourse}
              onChange={e => setSelectedLevelCourse(e.target.value as any)}
              aria-label="Filtrar por nível do curso"
            >
              <option value="">Todos os Níveis</option>
              <option value="LICENCIATURA">Licenciatura</option>
              <option value="MESTRADO">Mestrado</option>
              <option value="CURTA_DURACAO">Curta Duração</option>
              <option value="TECNICO_MEDIO">Técnico Médio</option>
              <option value="RELIGIOSO">Religioso</option>
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">Período</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value as any)}
              aria-label="Filtrar por período"
            >
              <option value="">Todos os Períodos</option>
              <option value="LABORAL">Laboral</option>
              <option value="POS_LABORAL">Pós-Laboral</option>
            </select>
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">Curso</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              aria-label="Filtrar por curso"
            >
              <option value="">Selecione um curso</option>
              {filteredCourses?.map(course => (
                <option key={course.id} value={course.courseName}>
                  {course.courseName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Pesquisar aluno por nome..."
            className="w-full md:w-1/3 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label="Pesquisar aluno por nome"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg mt-2 md:mt-0"
            >
              Exportar Alunos
            </Button>
            <Button
              onClick={handleClearFilters}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg mt-2 md:mt-0"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-semibold mb-4">
          Alunos do Curso Selecionado
        </h3>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <Button
            onClick={handleExportSelected}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg mt-2 md:mt-0 disabled:opacity-50"
            disabled={selectedStudents.length === 0}
            aria-label="Exportar selecionados"
          >
            Exportar Selecionados
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr>
                <th className="px-2 py-2 border-b text-left">
                  <input
                    type="checkbox"
                    checked={
                      selectedStudents.length === paginatedStudents.length &&
                      paginatedStudents.length > 0
                    }
                    onChange={handleSelectAll}
                    aria-label="Selecionar todos"
                    tabIndex={0}
                  />
                </th>
                <th className="px-4 py-2 border-b text-left">Nome</th>
                <th className="px-4 py-2 border-b text-left">Curso</th>
                <th className="px-4 py-2 border-b text-left">
                  Estado da Matrícula
                </th>
                <th className="px-4 py-2 border-b text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student, idx) => (
                <tr
                  key={student.id}
                  className={
                    idx % 2 === 0
                      ? 'even:bg-gray-50 hover:bg-gray-100'
                      : 'hover:bg-gray-100'
                  }
                >
                  <td className="px-2 py-2 border-b">
                    <input
                      type="checkbox"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                      aria-label={`Selecionar ${student.student.name}`}
                      tabIndex={0}
                    />
                  </td>
                  <td className="px-4 py-2 border-b">{student.student.name}</td>
                  <td className="px-4 py-2 border-b">
                    {student.course.courseName}
                  </td>
                  <td className="px-4 py-2 border-b">
                    {student.registrationStatus}
                  </td>
                  <td className="px-4 py-2 border-b flex gap-2">
                    <Button
                      onClick={() => setModalStudent(student)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                      aria-label={`Ver perfil de ${student.student.name}`}
                    >
                      Ver Perfil
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Paginação */}
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`px-3 py-1 rounded-lg border ${currentPage === i + 1 ? 'bg-yellow-600 text-white' : 'bg-white text-gray-700'}`}
              onClick={() => setCurrentPage(i + 1)}
              aria-label={`Página ${i + 1}`}
              tabIndex={0}
            >
              {i + 1}
            </button>
          ))}
        </div>
        {/* Modal de detalhes do aluno */}
        {modalStudent && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full">
              <h3 className="text-2xl font-semibold mb-4">
                Perfil de {modalStudent.student.name}
              </h3>
              <p>
                <strong>Curso:</strong> {modalStudent.course.courseName}
              </p>
              <p>
                <strong>Estado da Matrícula:</strong>{' '}
                {modalStudent.registrationStatus}
              </p>
              <p>
                <strong>Nível:</strong> {modalStudent.course.levelCourse}
              </p>
              <p>
                <strong>Período:</strong> {modalStudent.course.period}
              </p>
              <div className="flex space-x-2 mt-4">
                <Button
                  onClick={() => setModalStudent(null)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg w-full"
                  aria-label="Fechar modal"
                >
                  Fechar
                </Button>
                <Button
                  onClick={() =>
                    window.open(
                      `/student_profile/${modalStudent.studentId}`,
                      '_blank'
                    )
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full"
                  aria-label="Ver perfil completo"
                >
                  Perfil Completo
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
