import { getCourses } from '@/http/courses'
import { useQuery } from '@tanstack/react-query'

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

export function CourseData() {
  const { data, error, isLoading } = useQuery<CourseResponse>({
    queryKey: ['course_data'],
    queryFn: getCourses,
  })

  if (isLoading) return <div>Carregando cursos...</div>
  if (error instanceof Error) return <div>Erro: {error.message}</div>

  if (!data || !data.course || data.course.length === 0) {
    return <div>Não há cursos disponíveis no momento.</div>
  }

  data.course.length
  return (
    <div>
      <h1>Lista de Cursos</h1>
      {data.course.map(course => (
        <div key={course.id} className="my-4 p-4 border rounded-md">
          <h2 className="text-xl font-bold">{course.courseName}</h2>
          <p><strong>Nível do Curso:</strong> {course.levelCourse}</p>
          <p><strong>Descrição:</strong> {course.courseDescription || 'Não disponível'}</p>
          <p><strong>Duração:</strong> {course.courseDuration} meses</p>
          <p><strong>Vagas Totais:</strong> {course.totalVacancies}</p>
          <p><strong>Vagas Disponíveis:</strong> {course.availableVacancies ?? 'Indefinido'}</p>
        </div>
      ))}
    </div>
  )
}
