import { useState } from 'react'
import {
  User,
  CheckCircle,
  BookOpen,
  Clipboard,
  AlertCircle,
} from 'lucide-react' // Ícones de exemplo
import { useQuery } from '@tanstack/react-query'
import { getRegistration } from '@/http/registration'
import { getCourses } from '@/http/courses'
import { getStudents } from '@/http/students'
import { useNavigate } from 'react-router-dom'


type Course = {
  id: string
  createdAt: Date
  updatedAt: Date
  courseName: string
  courseDescription: string | null
  courseDuration: number
  levelCourse:
    | 'CURTA_DURACAO'
    | 'TECNICO_MEDIO'
    | 'LICENCIATURA'
    | 'MESTRADO'
    | 'RELIGIOSO'
  period: 'LABORAL' | 'POS_LABORAL'
  totalVacancies: number
  availableVacancies: number | null
}

type CourseResponse = {
  course: Course[]
}

type studentsSchema = {
  id: string
  surname: string
  name: string
  dataOfBirth: Date
  placeOfBirth: string
  gender: 'MASCULINO' | 'FEMININO'
  maritalStatus: 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO'
  provincyAddress:
    | 'MAPUTO_CIDADE'
    | 'MAPUTO_PROVINCIA'
    | 'GAZA'
    | 'INHAMBANE'
    | 'MANICA'
    | 'SOFALA'
    | 'TETE'
    | 'ZAMBEZIA'
    | 'NAMPULA'
    | 'CABO_DELGADO'
    | 'NIASSA'
  address: string
  fatherName: string
  motherName: string
  documentType: 'BI' | 'PASSAPORTE'
  documentNumber: string
  documentIssuedAt: Date
  documentExpiredAt: Date
  nuit: number
}

type studentsResponse = {
  students: studentsSchema[]
}

type registrationSchema = {
  course_id: string
  student_id: string
  id: string
  registrationStatus:
    | 'PENDENTE'
    | 'CONFIRMADO'
    | 'CANCELADO'
    | 'TRANCADO'
    | 'INSCRITO'
    | 'NAO_INSCRITO'
  student: {
    surname: string
    name: string
  }
  course: {
    courseName: string
    levelCourse:
      | 'CURTA_DURACAO'
      | 'TECNICO_MEDIO'
      | 'LICENCIATURA'
      | 'MESTRADO'
      | 'RELIGIOSO'
    period: 'LABORAL' | 'POS_LABORAL'
  }
  createdAt: Date
  updatedAt: Date | null
}

type registrationResponse = {
  registration: registrationSchema[]
}

export function Academic_Record() {

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

  const navegate = useNavigate()
  navegate('/academic_record')

  const {
    data: dataCourses,
    error: coursesError,
    isLoading: isLoadingCourse,
  } = useQuery<CourseResponse>({
    queryKey: ['course_data'],
    queryFn: getCourses,
  })

  const {
    data: dataStudents,
    error: studentError,
    isLoading: isLoadingStudents,
  } = useQuery<studentsResponse>({
    queryKey: ['students_data'],
    queryFn: getStudents,
  })

  const {
    data: dataRegistration,
    error: errorRegistration,
    isLoading: isLoadingRegistration,
  } = useQuery<registrationResponse>({
    queryKey: ['matricula'],
    queryFn: getRegistration,
  })

  if (isLoadingCourse) return <div>Carregando cursos...</div>
  if (coursesError instanceof Error)
    return <div>Erro: {coursesError.message}</div>

  if (!dataCourses || !dataCourses.course || dataCourses.course.length === 0) {
    return <div>Não há cursos disponíveis no momento.</div>
  }

  if (isLoadingStudents) return <div>Carregando Estudantes...</div>
  if (studentError instanceof Error)
    return <div>Erro: {studentError.message}</div>

  if (!dataStudents || dataStudents.students.length === 0) {
    return <div>Não há estudantes no momento.</div>
  }

  if (isLoadingRegistration) return <div>Carregando cursos...</div>
  if (errorRegistration instanceof Error)
    return <div>Erro: {errorRegistration.message}</div>

  if (!dataRegistration) {
    return <div>Não há matriculas disponíveis no momento.</div>
  }

  const totalStudents = dataStudents.students.length
  const studentsRegistered = dataRegistration.registration.filter(
    student => student.registrationStatus === 'CONFIRMADO'
  ).length

  const studentsPending = dataRegistration.registration.filter(
    student => student.registrationStatus === 'PENDENTE'
  ).length
  const totalCourses = dataCourses.course.length

  const totalAvailableSlots = dataCourses.course.reduce(
    (acc, course) => acc + course.totalVacancies,
    0
  )
  const totalEnrolledSlots = dataRegistration.registration.filter(
    student => student.registrationStatus
  ).length
  const availableSlots = totalAvailableSlots - totalEnrolledSlots

  const filteredCourses = dataCourses.course.filter(
    course =>
      (selectedLevelCourse
        ? course.levelCourse === selectedLevelCourse
        : true) && (selectedPeriod ? course.period === selectedPeriod : true)
  )

  const groupedByCourse = dataRegistration.registration.reduce<
    Record<string, registrationSchema[]>
  >((acc, student) => {
    const courseName = student.course.courseName
    if (!acc[courseName]) {
      acc[courseName] = []
    }
    acc[courseName].push(student)
    return acc
  }, {})

  const studentsInSelectedCourse = groupedByCourse[selectedCourse] || []

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Resumo do Dashboard</h2>

      {/* Cartões de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Total de Alunos</h3>
            <p className="text-xl font-bold">{totalStudents}</p>
          </div>
          <User className="w-12 h-12 text-yellow-600" />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Alunos Inscritos</h3>
            <p className="text-xl font-bold">{studentsRegistered}</p>
          </div>
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Matrículas Pendentes</h3>
            <p className="text-xl font-bold">{studentsPending}</p>
          </div>
          <AlertCircle className="w-12 h-12 text-orange-600" />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Cursos Disponíveis</h3>
            <p className="text-xl font-bold">{totalCourses}</p>
          </div>
          <BookOpen className="w-12 h-12 text-blue-600" />
        </div>
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Vagas Disponíveis</h3>
            <p className="text-xl font-bold">{availableSlots}</p>
          </div>
          <Clipboard className="w-12 h-12 text-red-600" />
        </div>
      </div>

      {/* Filtros de Seleção de Curso e Período */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Filtros</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-medium">Nível do Curso</label>
            <select
              className="border px-4 py-2 rounded-lg"
              value={selectedLevelCourse}
              onChange={e => setSelectedLevelCourse(e.target.value as any)}
            >
              <option value="">Selecione o Nível</option>
              <option value="LICENCIATURA">Licenciatura</option>
              <option value="MESTRADO">Mestrado</option>
              <option value="CURTA_DURACAO">Curta Duração</option>
              <option value="TECNICO_MEDIO">Técnico Médio</option>
              <option value="RELIGIOSO">Religioso</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium">Período</label>
            <select
              className="border px-4 py-2 rounded-lg"
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value as any)}
            >
              <option value="">Selecione o Período</option>
              <option value="LABORAL">Laboral</option>
              <option value="POS_LABORAL">Pós-Laboral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Seleção de Curso */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Selecione um Curso</h3>
        <select
          className="border px-4 py-2 rounded-lg"
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
        >
          <option value="">Selecione um curso</option>
          {filteredCourses.map(course => (
            <option key={course.id} value={course.courseName}>
              {course.levelCourse} em {course.courseName} - {course.period}
            </option>
          ))}
        </select>
      </div>

      {/* Detalhes dos Alunos por Curso */}
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
              {studentsInSelectedCourse.map((student, index) => (
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
        </div>
      </div>
    </div>
  )
}
