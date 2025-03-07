import { useState } from 'react'
import { BookOpen, Clipboard } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getCourses, type CourseResponse } from '@/http/courses'
import { useNavigate } from 'react-router-dom'

export function CoursesDashboard() {
  const [coursesToShow] = useState(5) // Exibindo 5 cursos por vez
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null) // Estado para armazenar o nível selecionado
  const navegate = useNavigate()

  const {
    data: dataCourses,
    error: coursesError,
    isLoading: isLoadingCourses,
  } = useQuery<CourseResponse[]>({
    queryKey: ['courses_data'],
    queryFn: getCourses,
  })

  if (isLoadingCourses) return <div>Carregando cursos...</div>
  if (coursesError instanceof Error)
    return <div>Erro: {coursesError.message}</div>

  const totalCourses = dataCourses?.length || 0

  const coursesByLevel = dataCourses?.reduce(
    (acc, course) => {
      acc[course.levelCourse] = (acc[course.levelCourse] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const displayedCourses = selectedLevel
    ? dataCourses?.filter(course => course.levelCourse === selectedLevel)
    : dataCourses?.slice(0, coursesToShow) // Exibindo todos cursos ou limitados, dependendo do filtro

  // Função para lidar com o clique no card do nível
  const handleCardClick = (level: string) => {
    if (selectedLevel === level) {
      setSelectedLevel(null) // Desmarcar o filtro se o mesmo card for clicado
    } else {
      setSelectedLevel(level) // Aplicar o filtro para o nível selecionado
    }
  }

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Dashboard de Cursos
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Total de Cursos</h3>
            <p className="text-xl font-bold">{totalCourses}</p>
          </div>
          <BookOpen className="text-blue-600 w-12 h-12" />
        </div>

        {Object.entries(coursesByLevel || {}).map(([level, count]) => (
          <div
            key={level}
            className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between cursor-pointer"
            onClick={() => handleCardClick(level)} // Adicionando o evento de clique
            onKeyUp={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleCardClick(level)
              }
            }}
            // biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
            tabIndex={0} // Make the div focusable
          >
            <div>
              <h3 className="text-lg font-medium">Cursos de {level}</h3>
              <p className="text-xl font-bold">{count}</p>
            </div>
            <Clipboard className="text-green-600 w-12 h-12" />
          </div>
        ))}
      </div>

      {/* Tabela de Cursos */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Cursos Cadastrados</h3>
        <div className="overflow-auto max-h-80">
          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">
                  Nivel Academico
                </th>
                <th className="py-2 px-4 border-b text-left">Nome do Curso</th>
                <th className="py-2 px-4 border-b text-left">Periodo</th>
                <th className="py-2 px-4 border-b text-left">Vagas Totais</th>
                <th className="py-2 px-4 border-b text-left">
                  Vagas Disponíveis
                </th>
                <th className="py-2 px-4 border-b text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {displayedCourses?.map(course => (
                <tr key={course.id}>
                  <td className="py-2 px-4 border-b">
                    {course.levelCourse.charAt(0).toUpperCase() +
                      course.levelCourse.slice(1).toLowerCase()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {course.courseName.charAt(0).toUpperCase() +
                      course.courseName.slice(1).toLowerCase()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {course.period.charAt(0).toUpperCase() +
                      course.period.slice(1).toLowerCase()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {course.totalVacancies}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {course.availableVacancies}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      type="button"
                      className="bg-blue-600 text-white py-1 px-4 rounded-lg"
                      onClick={() =>
                        navegate(
                          `/academic_record/courses/add-subject/${course.id}`
                        )
                      }
                    >
                      Adicionar Disciplina
                    </button>
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
