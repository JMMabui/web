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
  Clock,
  MapPin,
  BookOpen,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  type: 'class' | 'assessment' | 'recovery' | 'other'
  disciplineId: string
  location?: string
  color: string
}

export default function CalendarPage() {
  const queryClient = useQueryClient()
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '09:00',
    type: 'class',
    location: '',
    color: '#3b82f6',
  })

  // Fetch disciplines
  const { data: disciplines } = useQuery({
    queryKey: ['disciplines'],
    queryFn: async () => {
      const response = await api.get('/disciplines')
      return response.json()
    },
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
        date: new Date().toISOString().split('T')[0],
        startTime: '08:00',
        endTime: '09:00',
        type: 'class',
        location: '',
        color: '#3b82f6',
      })
      alert('Evento salvo com sucesso.')
    },
  })

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      await api.delete(`/events/${eventId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      alert('Evento removido com sucesso.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    eventMutation.mutate(newEvent)
  }

  const getEventsForDate = (date: Date) => {
    return events?.filter(
      (event: Event) => event.date === format(date, 'yyyy-MM-dd')
    )
  }

  const eventTypes = [
    { value: 'class', label: 'Aula', color: '#3b82f6' },
    { value: 'assessment', label: 'Avaliação', color: '#ef4444' },
    { value: 'recovery', label: 'Recuperação', color: '#f59e0b' },
    { value: 'other', label: 'Outro', color: '#10b981' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Calendar className="h-8 w-8" />
                Calendário
              </h1>
              <p className="text-blue-100 mt-2">
                Organize eventos, aulas e atividades acadêmicas
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
                <Calendar className="h-5 w-5 text-green-600" />
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
                  Total Eventos
                </p>
                <p className="text-2xl font-bold text-blue-700">
                  {events?.length || 0}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-600 font-medium">
                  Eventos Hoje
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {getEventsForDate(new Date())?.length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {selectedDiscipline && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Calendário
                  </h3>
                  <p className="text-sm text-gray-600">Selecione uma data</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <input
                  type="date"
                  value={format(selectedDate, 'yyyy-MM-dd')}
                  onChange={e => setSelectedDate(new Date(e.target.value))}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Clock className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Eventos para {format(selectedDate, 'dd/MM/yyyy')}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Lista de eventos do dia selecionado
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {getEventsForDate(selectedDate)?.map((event: Event) => (
                  <div
                    key={event.id}
                    className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200"
                    style={{ borderLeftColor: event.color, borderLeftWidth: 4 }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-800">
                            {event.title}
                          </h3>
                          <span
                            className="px-2 py-1 text-xs font-medium rounded-full"
                            style={{
                              backgroundColor: `${event.color}20`,
                              color: event.color,
                            }}
                          >
                            {
                              eventTypes.find(t => t.value === event.type)
                                ?.label
                            }
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                          )}
                        </div>
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
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteEventMutation.mutate(event.id)}
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}

                {(!getEventsForDate(selectedDate) ||
                  getEventsForDate(selectedDate)?.length === 0) && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Nenhum evento para esta data
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {showEventModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 rounded-t-xl text-white">
                <div className="flex items-center gap-3">
                  <Calendar className="h-6 w-6" />
                  <h3 className="text-xl font-semibold">
                    {selectedEvent ? 'Editar Evento' : 'Novo Evento'}
                  </h3>
                </div>
                <p className="text-blue-100 mt-2">
                  Preencha os detalhes do evento
                </p>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Título
                    </label>
                    <Input
                      value={newEvent.title}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEvent(prev => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Descrição
                    </label>
                    <textarea
                      value={newEvent.description}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setNewEvent(prev => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      required
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Data
                      </label>
                      <Input
                        type="date"
                        value={newEvent.date}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewEvent(prev => ({
                            ...prev,
                            date: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Tipo
                      </label>
                      <select
                        value={newEvent.type}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setNewEvent(prev => ({
                            ...prev,
                            type: e.target.value as Event['type'],
                            color:
                              eventTypes.find(
                                type => type.value === e.target.value
                              )?.color || '#3b82f6',
                          }))
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      >
                        {eventTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Horário de Início
                      </label>
                      <Input
                        type="time"
                        value={newEvent.startTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewEvent(prev => ({
                            ...prev,
                            startTime: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Horário de Término
                      </label>
                      <Input
                        type="time"
                        value={newEvent.endTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewEvent(prev => ({
                            ...prev,
                            endTime: e.target.value,
                          }))
                        }
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Local (opcional)
                    </label>
                    <Input
                      value={newEvent.location || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewEvent(prev => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                    >
                      {selectedEvent ? 'Atualizar Evento' : 'Criar Evento'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEventModal(false)}
                      className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
