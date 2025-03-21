// Note: Dashboard Students Component
// URL: /students/dashboard

import { getStudentsSubjects } from '@/http/students-subjects'
import { getSubjects, type subjectResponse } from '@/http/subjects'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'

const {
  data: dataSubjects,
  isLoading: isLoadingSubjects,
  isError: isErrorSubjects,
} = useQuery<subjectResponse[]>({
  queryKey: ['subjects'],
  queryFn: getSubjects,
})

const {
  data: dataSubjectsStudents,
  isLoading: isLoadingSubjectsStudents,
  isError: isErrorSubjectsStudents,
} = useQuery({
  queryKey: ['subjects_students'],
  queryFn: getStudentsSubjects,
})

export function DashboardStudents() {
  if (isLoadingSubjects || isLoadingSubjectsStudents) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    )
  }

  const totalSubjects = dataSubjects?.length || 0
  const totalSubjectsDone = dataSubjectsStudents?.filter(
    subject => subject.result === 'APROVADO'
  ).length

  return (
    <div className="flex flex-col h-screen overflow-y-auto y">
      <div className="flex justify-between items-center w-full p-4 bg-white shadow-md">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Pesquisar..."
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            className="flex items-center justify-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-col p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Disciplinas
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Total de Disciplinas
                </h3>
                <p className="text-3xl font-bold text-blue-500">
                  {totalSubjects}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Disciplinas
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Disciplinas Feitas
                </h3>
                <p className="text-3xl font-bold text-blue-500">5</p>
              </div>
            </div>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Disciplinas
            </h2>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Disciplinas em falta
                </h3>
                <p className="text-3xl font-bold text-blue-500">15</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
