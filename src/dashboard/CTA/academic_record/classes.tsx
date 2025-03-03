import { type CourseResponse, getCourses } from '@/http/courses'
import { getRegistration, type RegistrationSchema } from '@/http/registration'
import { getSubjects, type SubjectsSchema } from '@/http/subjects'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

type CourseSchema = {
  course: CourseResponse[]
}

type SubjectSchema = {
  discipline: SubjectsSchema[]
}

export function Classes() {
  const [className, setClassName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([])
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState<string>('')

  // Carregar cursos
  const {
    data: dataCourses,
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
  } = useQuery<CourseSchema>({
    queryKey: ['datacourses'],
    queryFn: getCourses,
  })

  // Carregar disciplinas ao selecionar um curso
  const {
    data: dataSubjects,
    isLoading: isLoadingSubjects,
    isError: isErrorSubjects,
  } = useQuery<SubjectSchema>({
    queryKey: ['dataSubjects'],
    queryFn: getSubjects,
  })

  // Carregar estudantes com prefixo 2025
  const {
    data: dataRegistration,
    isLoading: isLoadingRegistration,
    isError: isErrorRegistration,
  } = useQuery<RegistrationSchema[]>({
    queryKey: ['dataRegistration'],
    queryFn: getRegistration,
  })

  // Filtrar estudantes do curso selecionado
  const filteredStudents =
    dataRegistration?.filter(student => student.course_id === selectedCourse) ||
    []

  useEffect(() => {
    if (dataCourses && selectedCourse) {
      const selectedCourseData = dataCourses?.course.find(
        course => course.id === selectedCourse
      )
      if (selectedCourseData) {
        const ignoreWords = ['e', 'em', 'de', 'com']
        const courseLevel = selectedCourseData.levelCourse
          .charAt(0)
          .toUpperCase()
        const courseName = selectedCourseData.courseName
          .split(' ')
          .filter(word => !ignoreWords.includes(word.toLowerCase()))
          .map(word => word.charAt(0).toUpperCase())
          .join('')
        const period = selectedCourseData.period
          .toUpperCase()
          .includes('POS_LABORAL')
          ? 'PL'
          : selectedCourseData.period.charAt(0).toUpperCase()
        setClassName(`${courseLevel}${courseName} - ${period}`)
      }
    }
  }, [selectedCourse, dataCourses])

  if (isLoadingCourses || isLoadingSubjects || isLoadingRegistration) {
    return <div className="text-center">Carregando os dados ...</div>
  }

  if (isErrorCourses || isErrorSubjects || isErrorRegistration) {
    return (
      <div className="text-center text-red-600">Erro ao carregar os dados.</div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      className,
      courseId: selectedCourse,
      disciplines: selectedDisciplines,
      students: selectedStudents,
      state: selectedState,
    }
    console.log(data)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Criar Turma</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Seleção do Curso */}
        <div>
          <label
            htmlFor="course"
            className="block text-sm font-medium text-gray-700"
          >
            Selecione o Curso:
          </label>
          <select
            id="course"
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Selecione...</option>
            {dataCourses?.course.map(course => (
              <option key={course.id} value={course.id}>
                {course.levelCourse.charAt(0).toUpperCase() +
                  course.levelCourse.slice(1).toLowerCase()}{' '}
                -{' '}
                {course.courseName.charAt(0).toUpperCase() +
                  course.courseName.slice(1).toLowerCase()}{' '}
                -{' '}
                {course.period.charAt(0).toUpperCase() +
                  course.period.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Nome da Turma */}
        <div>
          <label
            htmlFor="className"
            className="block text-sm font-medium text-gray-700"
          >
            Nome da Turma:
          </label>
          <input
            id="className"
            type="text"
            placeholder="Editar se for necessário"
            value={className}
            onChange={e => setClassName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Descrição */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descrição
          </label>
          <input
            id="description"
            type="text"
            placeholder="Ano atual, Nome do coordenador"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Seleção dos Estudantes do Curso Selecionado */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Selecione os Estudantes:
          </label>
          <select
            multiple
            value={selectedStudents}
            onChange={e =>
              setSelectedStudents(
                Array.from(e.target.selectedOptions, option => option.value)
              )
            }
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {filteredStudents.map(student => (
              <option key={student.id} value={student.id}>
                {student.student.name} - {student.student.surname}
              </option>
            ))}
          </select>
        </div>

        {/* Estado da Turma */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Estado da Turma
          </label>
          <select
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Selecione ...</option>
            <option value="EM_ACTIVIDADE">Em Actividade</option>
            <option value="DESACTIVADO">Desativado</option>
          </select>
        </div>

        {/* Botão para Criar Turma */}
        <div className="text-center mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Criar Turma
          </button>
        </div>
      </form>
    </div>
  )
}
