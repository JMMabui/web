import { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  Plus,
  Trash2,
  Edit2,
  Calendar,
  MapPin,
  Users,
  Clock,
  BookOpen,
} from 'lucide-react'
import { useToast } from '../../components/ui/toast'

interface Event {
  id: string
  title: string
  description: string
  type: 'class' | 'workshop' | 'seminar' | 'exam' | 'other'
  startDate: string
  endDate: string
  location: string
  capacity: number
  participants: {
    id: string
    name: string
    status: 'registered' | 'attended' | 'cancelled'
  }[]
  disciplineId: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export default function Events() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    description: '',
    type: 'class',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 60 * 60 * 1000).toISOString().split('T')[0],
    location: '',
    capacity: 30,
    participants: [],
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

  // Fetch events
  const { data: events } = useQuery({
    queryKey: ['events', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const response = await api.get(
        `/events?disciplineId=${selectedDiscipline}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Create/Update event mutation
  const eventMutation = useMutation({
    mutationFn: async (event: Partial<Event>) => {
      if (event.id) {
        await api.put(`/events/${event.id}`, event)
      } else {
        await api.post('/events', {
          ...event,
          disciplineId: selectedDiscipline,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      setShowEventModal(false)
      setSelectedEvent(null)
      setNewEvent({
        title: '',
        description: '',
        type: 'class',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        location: '',
        capacity: 30,
        participants: [],
        status: 'scheduled',
      })
      toast({
        title: 'Evento salvo',
        description: 'O evento foi salvo com sucesso.',
        type: 'success',
      })
    },
  })

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      await api.delete(`/events/${eventId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast({
        title: 'Evento removido',
        description: 'O evento foi removido com sucesso.',
        type: 'success',
      })
    },
  })

  // Update participant status mutation
  const updateParticipantMutation = useMutation({
    mutationFn: async ({
      eventId,
      participantId,
      status,
    }: {
      eventId: string
      participantId: string
      status: Event['participants'][0]['status']
    }) => {
      await api.put(`/events/${eventId}/participants/${participantId}`, {
        status,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      toast({
        title: 'Status atualizado',
        description: 'O status do participante foi atualizado com sucesso.',
        type: 'success',
      })
    },
  })

  const handleAddParticipant = (studentId: string, studentName: string) => {
    setNewEvent(prev => ({
      ...prev,
      participants: [
        ...(prev.participants || []),
        {
          id: studentId,
          name: studentName,
          status: 'registered',
        },
      ],
    }))
  }

  const handleRemoveParticipant = (participantId: string) => {
    setNewEvent(prev => ({
      ...prev,
      participants: prev.participants?.filter(p => p.id !== participantId),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    eventMutation.mutate(newEvent)
  }

  const getTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'class':
        return <Calendar className="h-4 w-4" />
      case 'workshop':
        return <Users className="h-4 w-4" />
      case 'seminar':
        return <MapPin className="h-4 w-4" />
      case 'exam':
        return <Clock className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getTypeText = (type: Event['type']) => {
    switch (type) {
      case 'class':
        return 'Aula'
      case 'workshop':
        return 'Workshop'
      case 'seminar':
        return 'Seminário'
      case 'exam':
        return 'Exame'
      default:
        return 'Outro'
    }
  }

  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-500'
      case 'in_progress':
        return 'text-yellow-500'
      case 'completed':
        return 'text-green-500'
      case 'cancelled':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusText = (status: Event['status']) => {
    switch (status) {
      case 'scheduled':
        return 'Agendado'
      case 'in_progress':
        return 'Em Andamento'
      case 'completed':
        return 'Concluído'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  const getParticipantStatusColor = (
    status: Event['participants'][0]['status']
  ) => {
    switch (status) {
      case 'registered':
        return 'text-blue-500'
      case 'attended':
        return 'text-green-500'
      case 'cancelled':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getParticipantStatusText = (
    status: Event['participants'][0]['status']
  ) => {
    switch (status) {
      case 'registered':
        return 'Inscrito'
      case 'attended':
        return 'Presente'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Calendar className="h-8 w-8" />
                Eventos
              </h1>
              <p className="text-blue-100 mt-2">
                Organize eventos, workshops e atividades acadêmicas
              </p>
            </div>
            <Button
              onClick={() => setShowEventModal(true)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Evento
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
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Estatísticas
                </h3>
                <p className="text-sm text-gray-600">Visão geral dos eventos</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600 font-medium">
                  Total de Eventos
                </p>
                <p className="text-2xl font-bold text-blue-700">
                  {events?.length || 0}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-600 font-medium">
                  Participantes
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {events?.reduce(
                    (acc: number, event: Event) =>
                      acc + event.participants.length,
                    0
                  ) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {selectedDiscipline && (
          <div className="space-y-6">
            {events?.map((event: Event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {getTypeIcon(event.type)}
                      {event.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.startDate).toLocaleDateString()} -{' '}
                        {new Date(event.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedEvent(event)
                        setNewEvent(event)
                        setShowEventModal(true)
                      }}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEventMutation.mutate(event.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium">Descrição</h3>
                    <p className="text-sm">{event.description}</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Participantes</h3>
                      <span className="text-sm text-gray-600">
                        {event.participants.length} / {event.capacity}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {event.participants.map(participant => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between border rounded-lg p-4"
                        >
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <p
                              className={`text-sm ${getParticipantStatusColor(
                                participant.status
                              )}`}
                            >
                              {getParticipantStatusText(participant.status)}
                            </p>
                          </div>
                          <select
                            value={participant.status}
                            onChange={(
                              e: React.ChangeEvent<HTMLSelectElement>
                            ) =>
                              updateParticipantMutation.mutate({
                                eventId: event.id,
                                participantId: participant.id,
                                status: e.target
                                  .value as Event['participants'][0]['status'],
                              })
                            }
                            className="w-[150px] p-2 border border-gray-300 rounded-md"
                          >
                            <option value="registered">Inscrito</option>
                            <option value="attended">Presente</option>
                            <option value="cancelled">Cancelado</option>
                          </select>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {getStatusText(event.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showEventModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">
                {selectedEvent ? 'Editar Evento' : 'Novo Evento'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Preencha os detalhes do evento
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={newEvent.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewEvent(prev => ({ ...prev, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewEvent(prev => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Tipo</label>
                    <select
                      value={newEvent.type}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setNewEvent(prev => ({
                          ...prev,
                          type: e.target.value as Event['type'],
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="class">Aula</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminário</option>
                      <option value="exam">Exame</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <select
                      value={newEvent.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setNewEvent(prev => ({
                          ...prev,
                          status: e.target.value as Event['status'],
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="scheduled">Agendado</option>
                      <option value="in_progress">Em Andamento</option>
                      <option value="completed">Concluído</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Data de Início
                    </label>
                    <Input
                      type="datetime-local"
                      value={newEvent.startDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEvent(prev => ({
                          ...prev,
                          startDate: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Data de Término
                    </label>
                    <Input
                      type="datetime-local"
                      value={newEvent.endDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEvent(prev => ({
                          ...prev,
                          endDate: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Local</label>
                    <Input
                      value={newEvent.location}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEvent(prev => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Capacidade</label>
                    <Input
                      type="number"
                      value={newEvent.capacity}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEvent(prev => ({
                          ...prev,
                          capacity: Number.parseInt(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Participantes</label>
                    <select
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        const student = students?.find(
                          (s: any) => s.id === e.target.value
                        )
                        if (student) {
                          handleAddParticipant(student.id, student.name)
                        }
                      }}
                      className="w-[200px] p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Adicionar participante</option>
                      {students?.map((student: any) => (
                        <option key={student.id} value={student.id}>
                          {student.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    {newEvent.participants?.map(participant => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between border rounded-lg p-2"
                      >
                        <span className="text-sm">{participant.name}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleRemoveParticipant(participant.id)
                          }
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEventModal(false)
                      setSelectedEvent(null)
                      setNewEvent({
                        title: '',
                        description: '',
                        type: 'class',
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: new Date(Date.now() + 60 * 60 * 1000)
                          .toISOString()
                          .split('T')[0],
                        location: '',
                        capacity: 30,
                        participants: [],
                        status: 'scheduled',
                      })
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={eventMutation.isPending}>
                    {eventMutation.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
