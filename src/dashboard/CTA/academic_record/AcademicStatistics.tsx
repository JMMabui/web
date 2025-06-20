import { useQuery } from '@tanstack/react-query'
import { getStudents } from '@/http/students'
import { getCourses } from '@/http/courses'
import {
  getStudentsSubjects,
  type StudentsSubjectsWithExtraDataResponse,
} from '@/http/students-subjects'

// Componente para relatórios estatísticos acadêmicos
export function AcademicStatistics() {
  const { data: studentsData, isLoading: loadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: getStudents,
  })
  const { data: coursesData, isLoading: loadingCourses } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
  })
  const { data: studentsSubjectsData, isLoading: loadingSubjects } = useQuery<
    StudentsSubjectsWithExtraDataResponse[]
  >({
    queryKey: ['studentsSubjects'],
    queryFn: getStudentsSubjects,
  })

  console.log('total de students subjects', studentsSubjectsData)

  // Calculando estatísticas
  // Total de alunos, cursos, aprovados e reprovados
  const totalAlunos = studentsData?.length ?? 0
  const totalCursos = coursesData?.length ?? 0
  const aprovados =
    studentsSubjectsData?.filter(s => s.result === 'EM_ANDAMENTO').length ?? 0
  const reprovados =
    studentsSubjectsData?.filter(s => s.result === 'REPROVADO').length ?? 0

  if (loadingStudents || loadingCourses || loadingSubjects) {
    return <div>Carregando estatísticas...</div>
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Relatórios Estatísticos</h2>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-blue-100 p-4 rounded-lg text-center">
          <h3 className="font-semibold">Total de Alunos</h3>
          <p className="text-2xl">{totalAlunos}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <h3 className="font-semibold">Total de Cursos</h3>
          <p className="text-2xl">{totalCursos}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg text-center">
          <h3 className="font-semibold">Aprovados</h3>
          <p className="text-2xl">{aprovados}</p>
        </div>
        <div className="bg-red-100 p-4 rounded-lg text-center">
          <h3 className="font-semibold">Reprovados</h3>
          <p className="text-2xl">{reprovados}</p>
        </div>
      </div>
    </div>
  )
}
