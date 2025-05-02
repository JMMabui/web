// Note: Dashboard Students Component
// URL: /students/dashboard

import {
  Search,
  Calendar,
  Bell,
  BookOpen,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getStudentData } from '@/http/signup/header'
import { getStudentsSubjectsByStudentId } from '@/http/students-subjects'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorComponent } from '@/components/ErrorComponent'

export function DashboardStudents() {
  const id = localStorage.getItem('student_login_id')

  const {
    data: subjectsData,
    isLoading: isLoadingSubjects,
    error: subjectsError,
  } = useQuery({
    queryKey: ['student_subjects', id],
    queryFn: () => getStudentsSubjectsByStudentId(id!),
    enabled: !!id,
  })

  if (isLoadingSubjects) {
    return <LoadingSkeleton />
  }

  if (subjectsError) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <ErrorComponent
          message={subjectsError?.message}
          onRetry={() => {
            window.location.reload()
          }}
        />
      </div>
    )
  }

  const totalSubjects = subjectsData?.length || 0
  const completedSubjects =
    subjectsData?.filter(subject => subject.result === 'APROVADO').length || 0
  const pendingSubjects = totalSubjects - completedSubjects

  const subjects = subjectsData?.map(subject => ({
    id: subject.id,
    name: subject.Subject.subjectName,
    status: subject.status,
  }))

  return (
    <div className="flex flex-col h-screen overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="flex justify-between items-center w-full p-4 bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Pesquisar disciplinas, avaliações..."
            className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64 bg-white/50 backdrop-blur-sm"
          />
          <button
            type="button"
            className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            <Bell className="w-6 h-6 text-gray-600" />
          </button>
          <button
            type="button"
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-300"
          >
            <Calendar className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Total de Disciplinas
                </h3>
                <p className="text-3xl font-bold text-blue-600">
                  {totalSubjects}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Disciplinas Concluídas
                </h3>
                <p className="text-3xl font-bold text-green-600">
                  {completedSubjects}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Disciplinas Pendentes
                </h3>
                <p className="text-3xl font-bold text-yellow-600">
                  {pendingSubjects}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Progresso Acadêmico
          </h2>
          <div className="w-full bg-gray-100 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(completedSubjects / totalSubjects) * 100}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {Math.round((completedSubjects / totalSubjects) * 100)}% concluído
          </p>
        </div>

        {/* Recent Activities */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Atividades Recentes
          </h2>
          <div className="space-y-4">
            {subjects?.map(subject => (
              <div
                key={subject.id}
                className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors duration-300"
              >
                <div>
                  <h3 className="font-medium text-gray-700">{subject.name}</h3>
                  <p className="text-sm text-gray-500">
                    Status: {subject.status}
                  </p>
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium ${
                    subject.status === 'CONFIRMADO'
                      ? 'bg-green-100 text-green-800'
                      : subject.status === 'INSCRITO'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {subject.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
