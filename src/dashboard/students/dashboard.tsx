// Note: Dashboard Students Component
// URL: /students/dashboard

import {
  Search,
  Calendar,
  Bell,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  ChevronRight,
  Bookmark,
  GraduationCap,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { getStudentData } from '@/http/signup/header'
import { getStudentsSubjectsByStudentId } from '@/http/students-subjects'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorComponent } from '@/components/ErrorComponent'
import { useState } from 'react'

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  date: Date;
  read: boolean;
}

export function DashboardStudents() {
  const id = localStorage.getItem('student_login_id')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Nova Avaliação',
      message: 'Você tem uma nova avaliação de Matemática agendada para amanhã',
      type: 'warning',
      date: new Date(),
      read: false,
    },
    {
      id: '2',
      title: 'Mensalidade',
      message: 'Sua mensalidade vence em 3 dias',
      type: 'info',
      date: new Date(Date.now() - 86400000),
      read: false,
    },
    {
      id: '3',
      title: 'Resultado',
      message: 'Sua nota de Física foi lançada',
      type: 'success',
      date: new Date(Date.now() - 172800000),
      read: true,
    },
  ])

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
  const progressPercentage = Math.round((completedSubjects / totalSubjects) * 100)

  const subjects = subjectsData?.map(subject => ({
    id: subject.id,
    name: subject.Subject.subjectName,
    status: subject.status,
    code: subject.subjectId,
    result: subject.result,
  }))

  const unreadNotifications = notifications.filter(n => !n.read).length

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="sticky top-0 z-10 flex justify-between items-center w-full p-4 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Pesquisar disciplinas, avaliações..."
              className="pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-72 bg-white/80 backdrop-blur-sm transition-all duration-300"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors duration-300 relative group"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${
                          notification.type === 'success'
                            ? 'bg-green-100'
                            : notification.type === 'warning'
                            ? 'bg-yellow-100'
                            : 'bg-blue-100'
                        }`}>
                          {notification.type === 'success' ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : notification.type === 'warning' ? (
                            <AlertCircle className="w-4 h-4 text-yellow-600" />
                          ) : (
                            <Bell className="w-4 h-4 text-blue-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{notification.title}</p>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notification.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            className="p-2.5 rounded-xl hover:bg-gray-100 transition-colors duration-300 relative group"
          >
            <Calendar className="w-6 h-6 text-gray-600" />
            <span className="absolute -bottom-12 right-0 bg-gray-800 text-white text-xs rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Calendário
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col p-8 space-y-8 max-w-7xl mx-auto w-full">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta!</h1>
              <p className="text-blue-100">Acompanhe seu progresso acadêmico e mantenha-se atualizado com suas disciplinas.</p>
            </div>
            <div className="flex items-center space-x-2 bg-white/10 rounded-xl px-4 py-2">
              <Clock className="w-5 h-5" />
              <span>Semestre Atual</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
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
          <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
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
          <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
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
          <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-6 border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-700">
                  Progresso Geral
                </h3>
                <p className="text-3xl font-bold text-purple-600">
                  {progressPercentage}%
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Progresso Acadêmico
            </h2>
            <div className="space-y-4">
              <div className="w-full bg-gray-100 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {progressPercentage}% concluído
                </p>
                <p className="text-sm font-medium text-blue-600">
                  {completedSubjects} de {totalSubjects} disciplinas
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6">
              Próximas Avaliações
            </h2>
            <div className="space-y-4">
              {subjects?.slice(0, 3).map(subject => (
                <div
                  key={subject.id}
                  className="flex items-center justify-between p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Bookmark className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{subject.name}</p>
                      <p className="text-sm text-gray-500">{subject.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Em breve</span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-8 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">
              Atividades Recentes
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Ver todas
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects?.map(subject => (
              <div
                key={subject.id}
                className="bg-gray-50/50 rounded-xl border border-gray-100 p-6 hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      subject.result === 'APROVADO'
                        ? 'bg-green-100'
                        : subject.result === 'REPROVADO'
                        ? 'bg-red-100'
                        : 'bg-yellow-100'
                    }`}>
                      <GraduationCap className={`w-5 h-5 ${
                        subject.result === 'APROVADO'
                          ? 'text-green-600'
                          : subject.result === 'REPROVADO'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800">{subject.name}</h3>
                      <p className="text-sm text-gray-500">{subject.code}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    subject.result === 'APROVADO'
                      ? 'bg-green-100 text-green-800'
                      : subject.result === 'REPROVADO'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {subject.result === 'APROVADO'
                      ? 'Aprovado'
                      : subject.result === 'REPROVADO'
                      ? 'Reprovado'
                      : 'Em Andamento'}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className="font-medium text-gray-700">{subject.status}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progresso</span>
                    <span className="font-medium text-gray-700">
                      {subject.result === 'APROVADO' ? '100%' : 'Em andamento'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
