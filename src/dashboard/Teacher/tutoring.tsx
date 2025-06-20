import { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  Users,
  Clock,
  Calendar,
  BookOpen,
  User,
  Search,
  Filter,
} from 'lucide-react'

interface TutoringSession {
  id: string
  studentId: string
  studentName: string
  date: string
  startTime: string
  endTime: string
  subject: string
  description: string
  status: 'scheduled' | 'completed' | 'cancelled'
  notes?: string
}

export default function Tutoring() {
  const queryClient = useQueryClient()
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [selectedSession, setSelectedSession] =
    useState<TutoringSession | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'scheduled' | 'completed' | 'cancelled'
  >('all')
  const [newSession, setNewSession] = useState<Partial<TutoringSession>>({
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '09:00',
    subject: '',
    description: '',
    status: 'scheduled',
  })

  // Fetch disciplines
  const { data: disciplines } = useQuery({
    queryKey: ['disciplines'],
    queryFn: async () => {
      const response = await api.get('/disciplines')
      return response.json()
    },
  })

  // Fetch students
  const { data: students } = useQuery({
    queryKey: ['students', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const response = await api.get(
        `/students?disciplineId=${selectedDiscipline}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Fetch tutoring sessions
  const { data: sessions } = useQuery({
    queryKey: ['tutoring-sessions', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const response = await api.get(
        `/tutoring-sessions?disciplineId=${selectedDiscipline}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Create/Update session mutation
  const sessionMutation = useMutation({
    mutationFn: async (session: Partial<TutoringSession>) => {
      if (session.id) {
        await api.put(`/tutoring-sessions/${session.id}`, session)
      } else {
        await api.post('/tutoring-sessions', {
          ...session,
          disciplineId: selectedDiscipline,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutoring-sessions'] })
      setShowSessionModal(false)
      setSelectedSession(null)
      setNewSession({
        date: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '09:00',
        subject: '',
        description: '',
        status: 'scheduled',
      })
      alert('Sessão de tutoria salva com sucesso.')
    },
  })

  // Delete session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      await api.delete(`/tutoring-sessions/${sessionId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tutoring-sessions'] })
      alert('Sessão de tutoria removida com sucesso.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sessionMutation.mutate(newSession)
  }

  const getStatusColor = (status: TutoringSession['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: TutoringSession['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Agendada'
      case 'completed':
        return 'Concluída'
      case 'cancelled':
        return 'Cancelada'
      default:
        return status
    }
  }

  // Filter sessions
  const filteredSessions = sessions?.filter((session: TutoringSession) => {
    const matchesSearch =
      session.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' || session.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Calculate statistics
  const calculateStats = () => {
    if (!sessions) return { total: 0, scheduled: 0, completed: 0, cancelled: 0 }

    const total = sessions.length
    const scheduled = sessions.filter(s => s.status === 'scheduled').length
    const completed = sessions.filter(s => s.status === 'completed').length
    const cancelled = sessions.filter(s => s.status === 'cancelled').length

    return { total, scheduled, completed, cancelled }
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Users className="h-8 w-8" />
                Tutoria
              </h1>
              <p className="text-blue-100 mt-2">
                Gerencie sessões de tutoria e acompanhe o progresso dos alunos
              </p>
            </div>
            <Button
              onClick={() => setShowSessionModal(true)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Sessão
            </Button>
          </div>
        </div>

        {/* Cards de seleção */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Disciplina
                </h3>
                <p className="text-sm text-gray-600">Selecione a disciplina</p>
              </div>
            </div>
            <select
              value={selectedDiscipline}
              onChange={e => setSelectedDiscipline(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Selecione uma disciplina</option>
              {disciplines?.map((discipline: any) => (
                <option key={discipline.id} value={discipline.id}>
                  {discipline.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Estatísticas
                </h3>
                <p className="text-sm text-gray-600">Visão geral das sessões</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600 font-medium">Total</p>
                <p className="text-2xl font-bold text-blue-700">
                  {sessions?.length || 0}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-600 font-medium">Hoje</p>
                <p className="text-2xl font-bold text-green-700">
                  {sessions?.filter(
                    (session: TutoringSession) =>
                      session.date === new Date().toISOString().split('T')[0]
                  ).length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas detalhadas */}
        {selectedDiscipline && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Agendadas</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.scheduled}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Concluídas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.completed}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Clock className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Canceladas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.cancelled}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <User className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Alunos</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {students?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtros e busca */}
        {selectedDiscipline && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por aluno ou assunto..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Todos os status</option>
                <option value="scheduled">Agendadas</option>
                <option value="completed">Concluídas</option>
                <option value="cancelled">Canceladas</option>
              </select>
            </div>
          </div>
        )}

        {/* Lista de sessões */}
        {selectedDiscipline && (
          <div className="space-y-4">
            {filteredSessions?.map((session: TutoringSession) => (
              <div
                key={session.id}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {session.studentName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {session.subject}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}
                      >
                        {getStatusText(session.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(session.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.startTime} - {session.endTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSession(session)
                        setNewSession(session)
                        setShowSessionModal(true)
                      }}
                      className="flex items-center gap-1"
                    >
                      <Edit2 className="h-4 w-4" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSessionMutation.mutate(session.id)}
                      className="flex items-center gap-1 text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remover
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">
                      Descrição
                    </h4>
                    <p className="text-sm text-gray-600">
                      {session.description}
                    </p>
                  </div>
                  {session.notes && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-1">Notas</h4>
                      <p className="text-sm text-gray-600">{session.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredSessions?.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma sessão encontrada</p>
              </div>
            )}
          </div>
        )}

        {/* Estado vazio */}
        {!selectedDiscipline && (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Selecione uma disciplina
            </h3>
            <p className="text-gray-500">
              Escolha uma disciplina para começar a gerenciar as sessões de
              tutoria
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800">
                {selectedSession ? 'Editar Sessão' : 'Nova Sessão'}
              </h3>
              <p className="text-sm text-gray-600">
                Preencha os detalhes da sessão de tutoria
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Aluno
                </label>
                <select
                  value={newSession.studentId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setNewSession(prev => ({
                      ...prev,
                      studentId: e.target.value,
                      studentName: students?.find(
                        (s: any) => s.id === e.target.value
                      )?.name,
                    }))
                  }
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione um aluno</option>
                  {students?.map((student: any) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Assunto
                </label>
                <Input
                  value={newSession.subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewSession(prev => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Descrição
                </label>
                <textarea
                  value={newSession.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewSession(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Data
                  </label>
                  <Input
                    type="date"
                    value={newSession.date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewSession(prev => ({ ...prev, date: e.target.value }))
                    }
                    required
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Status
                  </label>
                  <select
                    value={newSession.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setNewSession(prev => ({
                        ...prev,
                        status: e.target.value as TutoringSession['status'],
                      }))
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="scheduled">Agendada</option>
                    <option value="completed">Concluída</option>
                    <option value="cancelled">Cancelada</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Horário de Início
                  </label>
                  <Input
                    type="time"
                    value={newSession.startTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewSession(prev => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    required
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Horário de Término
                  </label>
                  <Input
                    type="time"
                    value={newSession.endTime}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewSession(prev => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    required
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Notas (opcional)
                </label>
                <textarea
                  value={newSession.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewSession(prev => ({ ...prev, notes: e.target.value }))
                  }
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowSessionModal(false)
                    setSelectedSession(null)
                    setNewSession({
                      date: new Date().toISOString().split('T')[0],
                      startTime: '08:00',
                      endTime: '09:00',
                      subject: '',
                      description: '',
                      status: 'scheduled',
                    })
                  }}
                  className="px-6 py-2"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={sessionMutation.isPending}
                  className="px-6 py-2"
                >
                  {sessionMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
