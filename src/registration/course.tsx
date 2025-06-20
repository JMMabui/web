import { type CourseResponse, getCourses } from '@/http/courses'
import { getRegistration, postRegistration } from '@/http/registration'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { LoadingSpinner } from '../components/ui/loading-spinner'

type Registration = {
  course_id: string
  student_id: string
}

type registrationResponse = {
  registration: Registration[]
}

interface InscricaoProps {
  onComplete: () => void
  onBack: () => void
}

export function Inscricao({ onComplete, onBack }: InscricaoProps) {
  const [selectedLevel, setSelectedLevel] = useState<string>('')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('')
  const [selectedCourse, setSelectedCourse] = useState<CourseResponse | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [courses, setCourses] = useState<CourseResponse[]>([])
  const [coursesByLevel, setCoursesByLevel] = useState<
    Record<string, CourseResponse[]>
  >({})
  const [message, setMessage] = useState<string | null>(null)

  const navigate = useNavigate()
  const studentId = localStorage.getItem('student_id')

  // 🔄 Busca os cursos da API
  const {
    data: dataCourses,
    error: coursesError,
    isLoading: isLoadingCourse,
  } = useQuery<CourseResponse[]>({
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
    if (dataCourses) {
      const groupedCourses: Record<string, CourseResponse[]> = {}
      dataCourses.forEach(course => {
        if (!groupedCourses[course.levelCourse]) {
          groupedCourses[course.levelCourse] = []
        }
        groupedCourses[course.levelCourse].push(course)
      })
      setCoursesByLevel(groupedCourses)
    }
  }, [dataCourses])

  // 🔄 Atualiza cursos ao mudar o nível
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = e.target.value
    setSelectedLevel(level)
    setSelectedPeriod('')
    setSelectedCourse(null)
    setCourses(coursesByLevel[level] || [])
    setHasUnsavedChanges(true)
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
    setHasUnsavedChanges(true)
  }

  // 🔄 Atualiza curso selecionado
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseName = e.target.value
    const course =
      courses.find(course => course.courseName === courseName) || null
    setSelectedCourse(course)
    setHasUnsavedChanges(true)
  }

  const handleInscription = async () => {
    if (!selectedCourse || !studentId) {
      toast.error('Selecione um curso e certifique-se de estar logado.')
      return
    }

    // Verificar se o estudante já está inscrito em algum curso
    if (dataRegistration?.registration) {
      const existingRegistration = dataRegistration.registration.find(
        reg => reg.student_id === studentId
      )

      if (existingRegistration) {
        const registeredCourse = dataCourses?.find(
          course => course.id === existingRegistration.course_id
        )
        toast.error(
          `Você já está registrado no curso "${registeredCourse?.levelCourse
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/\b\w/g, char =>
              char.toUpperCase()
            )} em ${registeredCourse?.courseName} - ${
            registeredCourse?.period.toLowerCase() === 'laboral'
              ? 'Laboral'
              : 'Pós-laboral'
          }".`
        )
        return
      }
    }

    try {
      setIsLoading(true)
      await postRegistration({
        courseId: selectedCourse.id,
        studentId: studentId,
      })

      toast.success('Inscrição realizada com sucesso!')
      setHasUnsavedChanges(false)
      onComplete()
    } catch (error) {
      console.error(error)
      toast.error('Erro ao realizar a inscrição.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingCourse || isLoadingRegistration) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (coursesError instanceof Error || RegistrationError instanceof Error) {
    return <div>Erro ao carregar os dados. Por favor, tente novamente.</div>
  }

  if (!dataCourses || dataCourses.length === 0) {
    return <div>Não há cursos disponíveis no momento.</div>
  }

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-2xl">
      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Seleção de Curso</h2>
          <p className="mt-2 text-sm text-gray-600">
            Atenção, só poderá se inscrever apenas a cursos compatíveis com seu
            nível pré-escolar.
          </p>
        </div>

        <div className="space-y-6">
          {/* Seleção de Nível Acadêmico */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nível Acadêmico
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={handleLevelChange}
              value={selectedLevel}
            >
              <option value="">-- Escolha o nível --</option>
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
            <label className="block text-sm font-medium text-gray-700">
              Período
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
              onChange={handlePeriodChange}
              value={selectedPeriod}
              disabled={!selectedLevel}
            >
              <option value="">-- Selecione o período --</option>
              <option value="LABORAL">Laboral</option>
              <option value="POS_LABORAL">Pós-laboral</option>
            </select>
            {!selectedLevel && (
              <p className="mt-1 text-sm text-gray-500">
                Selecione primeiro o nível acadêmico
              </p>
            )}
          </div>

          {/* Seleção de Curso */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cursos
              <span className="text-red-500 ml-1">*</span>
              <span className="text-gray-500 text-xs ml-1">
                (selecione um curso baseado na disponibilidade)
              </span>
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500"
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
            {(!selectedLevel || !selectedPeriod) && (
              <p className="mt-1 text-sm text-gray-500">
                Selecione o nível acadêmico e o período primeiro
              </p>
            )}
          </div>

          {/* Exibição do Curso Selecionado */}
          {selectedCourse && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Curso Selecionado
              </h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Nível Acadêmico
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedCourse.levelCourse
                      .replace(/_/g, ' ')
                      .toLowerCase()
                      .replace(/\b\w/g, char => char.toUpperCase())}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Nome do Curso
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedCourse.courseName
                      .toLowerCase()
                      .split(' ')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Período</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {selectedCourse.period.toLowerCase() === 'laboral'
                      ? 'Laboral'
                      : 'Pós-laboral'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Vagas Disponíveis
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedCourse?.availableVacancies && selectedCourse.availableVacancies > 10
                          ? 'bg-green-100 text-green-800'
                          : selectedCourse?.availableVacancies && selectedCourse.availableVacancies > 5
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {selectedCourse.availableVacancies} vagas
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={handleInscription}
              disabled={isLoading || !selectedCourse}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Processando...
                </>
              ) : (
                'Inscrever-se'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
