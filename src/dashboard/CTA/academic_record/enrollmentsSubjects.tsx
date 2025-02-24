import { getCourses } from '@/http/courses'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

type Course = {
  id: string
  createdAt: Date
  updatedAt: Date
  courseName: string
  courseDescription: string
  courseDuration: number
  levelCourse:
    | 'CURTA_DURACAO'
    | 'TECNICO_MEDIO'
    | 'LICENCIATURA'
    | 'MESTRADO'
    | 'RELIGIOSO'
  period: 'LABORAL' | 'POS_LABORAL'
  totalVacancies: number
  availableVacancies: number
  disciplines: string[] // Adicionando uma propriedade para disciplinas
}

type CourseResponse = {
  course: Course[]
}

export function EnrollmentsSubjects() {
  // Estado para armazenar as seleções do curso, ano e semestre
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')

  // Estado para armazenar os estudantes
  const [students, setStudents] = useState<any[]>([])

  const {
    data: dataCourses,
    error: coursesError,
    isLoading: isLoadingCourses,
  } = useQuery<CourseResponse>({
    queryKey: ['courses_data'],
    queryFn: getCourses,
  })

  if (isLoadingCourses) return <div>Carregando cursos...</div>
  if (coursesError instanceof Error)
    return <div>Erro: {coursesError.message}</div>

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const courseName = event.target.value
    const selectedCourse = dataCourses?.course.find(
      course => course.courseName === courseName
    )
    if (selectedCourse) {
      setSelectedCourseId(selectedCourse.id)
    }
  }

  return (
    <div className="w-full p-6 bg-gray-100 rounded-lg shadow-lg">
      <div className="flex space-x-4">
        {/* Select de Curso */}
        <div className="sm:col-span-2">
          <label
            htmlFor="course"
            className="block text-sm font-medium text-gray-900"
          >
            Curso
          </label>
          <div className="mt-2">
            <select
              id="course"
              onChange={handleCourseChange}
              className="w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-ind"
            >
              <option value="">-- Selecione --</option>
              {dataCourses?.course.map(course => (
                <option key={course.id} value={course.courseName}>
                  {course.levelCourse
                    .replace('_', ' ')
                    .charAt(0)
                    .toUpperCase() +
                    course.levelCourse.slice(1).toLowerCase()}{' '}
                  em{' '}
                  {course.courseName
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Select de Ano */}
        <div className="w-1/3">
          <label className="text-lg font-medium">Ano</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={selectedYear}
            onChange={e => setSelectedYear(e.target.value)}
          >
            <option value="">Selecione o Ano</option>
            <option value="PRIMEIRO_ANO">1º Ano</option>
            <option value="SEGUNDO_ANO">2º Ano</option>
            <option value="TERCEIRO_ANO">3º Ano</option>
            <option value="QUARTO_ANO">4º Ano</option>
          </select>
        </div>

        {/* Select de Semestre */}
        <div className="w-1/3">
          <label className="text-lg font-medium">Semestre</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={selectedSemester}
            onChange={e => setSelectedSemester(e.target.value)}
          >
            <option value="">Selecione o Semestre</option>
            <option value="PRIMEIRO_SEMESTRE">1º Semestre</option>
            <option value="SEGUNDO_SEMESTRE">2º Semestre</option>
          </select>
        </div>
      </div>

      {/* Exibição da lista de estudantes filtrados */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Estudantes Matriculados</h2>
        <button
          type="button"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
          onClick={() => alert('Disciplinas alocadas com sucesso!')}
        >
          Alocar Disciplinas
        </button>
        {students.length === 0 ? (
          <p className="text-gray-500">
            Nenhum estudante encontrado para os critérios selecionados.
          </p>
        ) : (
          <ul className="mt-4">
            {students.map(student => (
              <li
                key={student.id}
                className="py-2 px-4 border-b border-gray-300"
              >
                {student.name} - {student.year} - {student.semester}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
