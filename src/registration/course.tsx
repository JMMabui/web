import { getCourses } from '@/http/courses'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

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

export function Inscricao() {
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [courses, setCourses] = useState<Course[]>([])
  const [courseAvailability, setCourseAvailability] = useState<number | null>(
    null
  )
  const [coursesByLevel, setCoursesByLevel] = useState<
    Record<string, Course[]>
  >({})

  // 🛠 Busca os cursos da API
  const {
    data: dataCourses,
    error: coursesError,
    isLoading: isLoadingCourse,
  } = useQuery<CourseResponse>({
    queryKey: ['course_data'],
    queryFn: getCourses,
  })

  console.log('Cursos retornados da API:', dataCourses)

  // 🔄 Atualiza os cursos por nível acadêmico assim que os dados são carregados
  useEffect(() => {
    if (dataCourses?.course) {
      console.log('Cursos brutos antes de agrupar:', dataCourses.course)

      const groupedCourses: Record<string, Course[]> = {}

      dataCourses.course.forEach(course => {
        if (!groupedCourses[course.levelCourse]) {
          groupedCourses[course.levelCourse] = []
        }
        groupedCourses[course.levelCourse].push(course)
      })

      console.log('Cursos agrupados por nível:', groupedCourses)

      setCoursesByLevel(groupedCourses)
    }
  }, [dataCourses])

  if (isLoadingCourse) return <div>carregando cursos...</div>
  if (coursesError instanceof Error)
    return <div>erro: {coursesError.message}</div>

  if (!dataCourses || !dataCourses.course || dataCourses.course.length === 0) {
    return <div>não há cursos disponíveis no momento.</div>
  }

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = e.target.value
    setSelectedLevel(level)

    console.log('Nível selecionado:', level) // 🛠 Verifica se o nível foi atualizado corretamente

    if (coursesByLevel[level]) {
      console.log('Cursos disponíveis para o nível:', coursesByLevel[level]) // 🛠 Verifica se os cursos desse nível existem
      setCourses(coursesByLevel[level])
    } else {
      setCourses([])
    }

    setSelectedCourse('')
    setSelectedPeriod('')
    setCourseAvailability(null)
  }

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const period = e.target.value.toUpperCase() // 🔥 Converte para maiúsculas
    setSelectedPeriod(period)

    console.log('Período selecionado:', period)

    if (selectedLevel && coursesByLevel[selectedLevel]) {
      const filteredCourses = coursesByLevel[selectedLevel].filter(
        course => course.period === period
      )

      console.log('Cursos filtrados pelo período:', filteredCourses)
      setCourses(filteredCourses)
    }
  }

  // 🔄 Atualiza a disponibilidade do curso ao selecionar um curso
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseName = e.target.value
    setSelectedCourse(courseName)

    // 🛠 Corrigido: usando `courseName` em vez de `name`
    const course = courses.find(course => course.courseName === courseName)
    setCourseAvailability(course ? course.availableVacancies : null)
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-semibold">inscrição</h2>
      <p className="text-gray-600">
        atenção, só poderá se inscrever apenas a cursos que são compatíveis com
        o seu nível pré-escolar.
      </p>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Seleção de Nível Acadêmico */}
        <div>
          <label className="block font-semibold">nível acadêmico</label>
          <select
            className="border p-2 rounded-md w-full mt-1"
            onChange={handleLevelChange}
            value={selectedLevel}
          >
            <option value="">--escolha--</option>
            {Object.keys(coursesByLevel).map(level => (
              <option key={level} value={level}>
                {level.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Seleção de Período */}
        <div>
          <label className="block font-semibold">período</label>
          <select
            className="border p-2 rounded-md w-full mt-1"
            onChange={handlePeriodChange}
            value={selectedPeriod}
            disabled={!selectedLevel}
          >
            <option value="">--selecione o período--</option>
            <option value="laboral">laboral</option>
            <option value="pos_laboral">pós-laboral</option>
          </select>
        </div>

        {/* Seleção de Cursos */}
        <div className="col-span-2">
          <label className="block font-semibold">
            cursos{' '}
            <span className="text-gray-500">
              (selecione um dos cursos com base na disponibilidade)
            </span>
          </label>
          <select
            className="border p-2 rounded-md w-full mt-1"
            onChange={handleCourseChange}
            value={selectedCourse}
            disabled={!selectedLevel || !selectedPeriod}
          >
            <option value="">--selecione o curso--</option>
            {courses.map(course => (
              <option key={course.id} value={course.courseName}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Exibição do Curso Selecionado */}
      <h3 className="mt-6 font-semibold">selecionou</h3>
      <div className="bg-gray-200 p-4 mt-2 rounded-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">nome do curso</th>
              <th className="p-2">vagas disponíveis</th>
            </tr>
          </thead>
          <tbody>
            {selectedCourse && courseAvailability !== null ? (
              <tr>
                <td className="p-2">{selectedCourse}</td>
                <td className="p-2">{courseAvailability} vagas</td>
              </tr>
            ) : (
              <tr>
                <td className="p-2 text-gray-500" colSpan={2}>
                  Nenhum curso selecionado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
