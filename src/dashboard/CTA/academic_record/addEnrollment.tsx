import { getCourses } from '@/http/courses'
import {
  getRegistration,
  AddEnrollment,
  type RegistrationSchema,
} from '@/http/registration'
import { getStudents } from '@/http/students'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

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

type StudentsSchema = {
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

type StudentsResponse = {
  students: StudentsSchema[]
}

export function AddEnrollments() {
  const [selectedStudent, setSelectedStudent] = useState<string>('') // ID do estudante selecionado
  const [selectedCourse, setSelectedCourse] = useState<string>('') // ID do curso selecionado
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  // Carregar os dados dos estudantes
  const {
    data: dataStudents,
    isLoading: isLoadingStudents,
    refetch: refetchStudents,
  } = useQuery<StudentsResponse>({
    queryKey: ['students_data'],
    queryFn: getStudents,
  })

  // Carregar os dados dos cursos
  const { data: dataCourses, isLoading: isLoadingCourse } =
    useQuery<CourseResponse>({
      queryKey: ['course_data'],
      queryFn: getCourses,
    })

  const {
    data: dataRegistration,
    isLoading: isLoadingRegistration,
    refetch: refetchRegistration,
  } = useQuery<RegistrationSchema[]>({
    queryKey: ['matricula'],
    queryFn: getRegistration,
  })

  // Verificar se os dados estão carregando
  if (isLoadingStudents || isLoadingCourse || isLoadingRegistration)
    return <div>Carregando...</div>

  // Obter todos os IDs dos estudantes que já têm matrícula
  const registeredStudentIds =
    dataRegistration?.map(registration => registration.student_id) || []

  // Filtrar os estudantes que ainda não têm matrícula
  const studentsWithoutCourses =
    dataStudents?.students.filter(
      student => !registeredStudentIds.includes(student.id)
    ) || []

  // Função para enviar a matrícula
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedStudent || !selectedCourse) {
      setErrorMessage('Por favor, selecione um estudante e um curso.')
      return
    }

    setIsSubmitting(true)
    try {
      await AddEnrollment({
        student_id: selectedStudent,
        course_id: selectedCourse,
      })
      alert('Matrícula realizada com sucesso!')
      setSelectedStudent('')
      setSelectedCourse('')

      // Recarregar os dados após a matrícula
      await refetchStudents()
      await refetchRegistration()
    } catch (error) {
      setErrorMessage('Erro ao realizar a matrícula.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-6 w-full h-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Gestão de Matrículas
      </h2>

      {/* Exibir mensagem de erro, se houver */}
      {errorMessage && (
        <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Formulário de Matrícula */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Seleção de Estudante */}
        <div>
          <label htmlFor="student" className="block text-sm font-semibold">
            Selecionar Estudante:
          </label>
          <select
            id="student"
            value={selectedStudent}
            onChange={e => setSelectedStudent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Selecione um Estudante</option>
            {studentsWithoutCourses.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} {student.surname}
              </option>
            ))}
          </select>
        </div>

        {/* Seleção de Curso */}
        <div>
          <label htmlFor="course" className="block text-sm font-semibold">
            Selecionar Curso:
          </label>
          <select
            id="course"
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Selecione um Curso</option>
            {dataCourses?.course.map(course => (
              <option key={course.id} value={course.id}>
                {course.levelCourse &&
                  course.levelCourse.charAt(0).toUpperCase() +
                    course.levelCourse.slice(1).toLowerCase()}{' '}
                - {course.courseName} -{' '}
                {course.period &&
                  course.period.charAt(0).toUpperCase() +
                    course.period.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Botão de Enviar */}
        <div className="mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white p-2 rounded-lg text-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Processando...' : 'Realizar Matrícula'}
          </button>
        </div>
      </form>

      {/* Lista de Estudantes que ainda não tem curso */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">
          Lista de Estudantes sem Matrícula:
        </h3>
        <ul className="space-y-2">
          {studentsWithoutCourses.map(student => (
            <li key={student.id} className="p-2 border-b border-gray-300">
              {student.name} {student.surname}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
