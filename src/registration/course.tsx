import { getCourses } from '@/http/courses'
import { getRegistration, postRegistration } from '@/http/registration'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
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

type Registration = {
  course_id: string
  student_id: string
}

type registrationResponse = {
  registration: Registration[]
}

export function Inscricao() {
  const [selectedLevel, setSelectedLevel] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesByLevel, setCoursesByLevel] = useState<
    Record<string, Course[]>
  >({})
  const [message, setMessage] = useState<string | null>(null)


  const navigate = useNavigate()

  const studentId = localStorage.getItem('student_id')
  console.log('Student id: ', studentId)

  // 🔄 Busca os cursos da API
  const {
    data: dataCourses,
    error: coursesError,
    isLoading: isLoadingCourse,
  } = useQuery<CourseResponse>({
    queryKey: ['course_data'],
    queryFn: getCourses,
  })

  const {
    data: dataRegistration,
    error: RegistrationError,
    isLoading: isLoadingRegistration,
  } = useQuery<registrationResponse>({
    queryKey: ['Registration_data'],
    queryFn: getRegistration,
  })

  // 🔄 Agrupar cursos por nível acadêmico
  useEffect(() => {
    if (dataCourses?.course) {
      const groupedCourses: Record<string, Course[]> = {}

      dataCourses.course.forEach(course => {
        if (!groupedCourses[course.levelCourse]) {
          groupedCourses[course.levelCourse] = []
        }
        groupedCourses[course.levelCourse].push(course)
      })

      setCoursesByLevel(groupedCourses)
    }
  }, [dataCourses])

  if (isLoadingCourse) return <div>Carregando cursos...</div>
  if (coursesError instanceof Error)
    return <div>Erro: {coursesError.message}</div>

  if (!dataCourses || !dataCourses.course || dataCourses.course.length === 0) {
    return <div>Não há cursos disponíveis no momento.</div>
  }

  if (isLoadingRegistration) return <div>Carregando cursos...</div>
  if (RegistrationError instanceof Error)
    return <div>Erro: {RegistrationError.message}</div>

  // 🔄 Atualiza cursos ao mudar o nível
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = e.target.value
    setSelectedLevel(level)
    setSelectedPeriod('')
    setSelectedCourse(null)

    setCourses(coursesByLevel[level] || [])
  }

  // 🔄 Filtra cursos por período
  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const period = e.target.value.toUpperCase()
    setSelectedPeriod(period)
    setSelectedCourse(null)

    if (selectedLevel && coursesByLevel[selectedLevel]) {
      setCourses(
        coursesByLevel[selectedLevel].filter(course => course.period === period)
      )
    }
  }

  // 🔄 Atualiza curso selecionado
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseName = e.target.value
    const course =
      courses.find(course => course.courseName === courseName) || null
    setSelectedCourse(course)
  }

  const handleInscription = async () => {
    if (!selectedCourse || !studentId) {
      setMessage('Erro: Selecione um curso e certifique-se de estar logado.')
      return
    }

    // Verificar se o estudante já está inscrito em algum curso
    if (dataRegistration?.registration) {
      const existingRegistration = dataRegistration.registration.find(
        reg => reg.student_id === studentId
      )

      if (existingRegistration) {
        // Encontrar o nome do curso ao qual o estudante já está inscrito
        const registeredCourse = dataCourses?.course.find(
          course => course.id === existingRegistration.course_id
        )

        setMessage(
          `Erro: Você já está registrado no curso "${registeredCourse?.levelCourse
            .replace(/_/g, ' ') // Substitui _ por espaço
            .toLowerCase() // Converte para minúsculas
            .replace(/\b\w/g, char =>
              char.toUpperCase()
            )} em ${registeredCourse?.courseName} - ${registeredCourse?.period.toLowerCase() === 'laboral' ? 'Laboral' : 'Pós-laboral'}".`
        )
        return
      }
    }

    try {
      const response = await postRegistration({
        course_id: selectedCourse.id,
        student_id: studentId,
      })

      setMessage('Inscrição realizada com sucesso!')
      console.log('Resposta da API:', response)
      // setIsModalOpen(true)
      navigate('/registration/resume')
    } catch (error) {
      setMessage('Erro ao realizar a inscrição.')
      console.error(error)
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-semibold">Inscrição</h2>
      <p className="text-gray-600">
        Atenção, só poderá se inscrever apenas a cursos compatíveis com seu
        nível pré-escolar.
      </p>

      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Seleção de Nível Acadêmico */}
        <div>
          <label className="block font-semibold">Nível Acadêmico</label>
          <select
            className="border p-2 rounded-md w-full mt-1"
            onChange={handleLevelChange}
            value={selectedLevel}
          >
            <option value="">-- Escolha --</option>
            {Object.keys(coursesByLevel).map(level => (
              <option key={level} value={level}>
                {level.replace('_', ' ').charAt(0).toUpperCase() +
                  level.replace('_', ' ').slice(1).toLowerCase()}
              </option>
            ))}
          </select>
        </div>

        {/* Seleção de Período */}
        <div>
          <label className="block font-semibold">Período</label>
          <select
            className="border p-2 rounded-md w-full mt-1"
            onChange={handlePeriodChange}
            value={selectedPeriod}
            disabled={!selectedLevel}
          >
            <option value="">-- Selecione o período --</option>
            <option value="LABORAL">Laboral</option>
            <option value="POS_LABORAL">Pós-laboral</option>
          </select>
        </div>

        {/* Seleção de Curso */}
        <div className="col-span-2">
          <label className="block font-semibold">
            Cursos{' '}
            <span className="text-gray-500">
              (selecione um curso baseado na disponibilidade)
            </span>
          </label>
          <select
            className="border p-2 rounded-md w-full mt-1"
            onChange={handleCourseChange}
            value={selectedCourse?.courseName || ''}
            disabled={!selectedLevel || !selectedPeriod}
          >
            <option value="">-- Selecione o curso --</option>
            {courses.map(course => (
              <option key={course.id} value={course.courseName}>
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

      {/* Exibição do Curso Selecionado */}
      <h3 className="mt-6 font-semibold">Curso Selecionado</h3>
      <div className="bg-gray-200 p-4 mt-2 rounded-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              {/* <th className="p-2">ID</th> */}
              <th className="p-2">Nível Acadêmico</th>
              <th className="p-2">Nome do Curso</th>
              <th className="p-2">Período</th>
              <th className="p-2">Vagas Disponíveis</th>
            </tr>
          </thead>
          <tbody>
            {selectedCourse ? (
              <tr>
                {/* <td className="p-2">{selectedCourse.id}</td> */}
                <td className="p-2">
                  {selectedCourse.levelCourse
                    ? selectedCourse.levelCourse.charAt(0).toUpperCase() +
                      selectedCourse.levelCourse.slice(1).toLowerCase()
                    : ''}
                </td>
                <td className="p-2">
                  {selectedCourse.courseName
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </td>
                <td className="p-2">
                  {selectedCourse.period
                    ? selectedCourse.period.charAt(0).toUpperCase() +
                      selectedCourse.period.slice(1).toLowerCase()
                    : ''}
                </td>
                <td className="p-2">
                  {selectedCourse.availableVacancies} vagas
                </td>
              </tr>
            ) : (
              <tr>
                <td className="p-2 text-gray-500" colSpan={5}>
                  Nenhum curso selecionado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {message && <p className="mt-4 text-center font-semibold">{message}</p>}

      <button
        type="button"
        onClick={handleInscription}
        className="bg-blue-500 text-white p-2 rounded-md mt-4"
      >
        Inscrever-se
      </button>

    </div>
  )
}
