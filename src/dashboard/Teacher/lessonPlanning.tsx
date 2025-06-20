import { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Calendar, Plus, Edit2, Trash2, Check, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { useToast } from '../../components/ui/toast'

interface Lesson {
  id: string
  title: string
  description: string
  objectives: string[]
  content: string
  methodology: string
  resources: string[]
  assessment: string
  date: string
  duration: number
  disciplineId: string
  status: 'planned' | 'in_progress' | 'completed'
}

export function LessonPlanning() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [showLessonModal, setShowLessonModal] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({
    title: '',
    description: '',
    objectives: [''],
    content: '',
    methodology: '',
    resources: [''],
    assessment: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    duration: 50,
    status: 'planned',
  })

  // Fetch disciplines
  const { data: disciplines } = useQuery({
    queryKey: ['disciplines'],
    queryFn: async () => {
      const response = await api.get('/disciplines')
      return response.json()
    },
  })

  // Fetch lessons
  const { data: lessons } = useQuery({
    queryKey: ['lessons', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const response = await api.get(
        `/lessons?disciplineId=${selectedDiscipline}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Create/Update lesson mutation
  const lessonMutation = useMutation({
    mutationFn: async (lesson: Partial<Lesson>) => {
      if (lesson.id) {
        await api.put(`/lessons/${lesson.id}`, lesson)
      } else {
        await api.post('/lessons', {
          ...lesson,
          disciplineId: selectedDiscipline,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      setShowLessonModal(false)
      setSelectedLesson(null)
      setNewLesson({
        title: '',
        description: '',
        objectives: [''],
        content: '',
        methodology: '',
        resources: [''],
        assessment: '',
        date: format(new Date(), 'yyyy-MM-dd'),
        duration: 50,
        status: 'planned',
      })
      toast({
        title: 'Aula salva',
        description: 'O planejamento da aula foi salvo com sucesso.',
        type: 'success',
      })
    },
  })

  // Delete lesson mutation
  const deleteMutation = useMutation({
    mutationFn: async (lessonId: string) => {
      await api.delete(`/lessons/${lessonId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      toast({
        title: 'Aula removida',
        description: 'O planejamento da aula foi removido com sucesso.',
        type: 'success',
      })
    },
  })

  const handleAddObjective = () => {
    setNewLesson(prev => ({
      ...prev,
      objectives: [...(prev.objectives || []), ''],
    }))
  }

  const handleAddResource = () => {
    setNewLesson(prev => ({
      ...prev,
      resources: [...(prev.resources || []), ''],
    }))
  }

  const handleObjectiveChange = (index: number, value: string) => {
    setNewLesson(prev => ({
      ...prev,
      objectives: prev.objectives?.map((obj, i) => (i === index ? value : obj)),
    }))
  }

  const handleResourceChange = (index: number, value: string) => {
    setNewLesson(prev => ({
      ...prev,
      resources: prev.resources?.map((res, i) => (i === index ? value : res)),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    lessonMutation.mutate(newLesson)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Planejamento de Aulas</h1>
        <Button onClick={() => setShowLessonModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Aula
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Disciplina</h3>
          <p className="text-sm text-gray-600 mb-4">Selecione a disciplina</p>
          <select
            value={selectedDiscipline}
            onChange={e => setSelectedDiscipline(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Selecione uma disciplina</option>
            {disciplines?.map((discipline: any) => (
              <option key={discipline.id} value={discipline.id}>
                {discipline.name}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-2">Estatísticas</h3>
          <p className="text-sm text-gray-600 mb-4">
            Visão geral do planejamento
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-gray-600">Total de Aulas</p>
              <p className="text-2xl font-bold">{lessons?.length || 0}</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-gray-600">Horas Planejadas</p>
              <p className="text-2xl font-bold">
                {lessons?.reduce(
                  (acc: number, lesson: Lesson) => acc + lesson.duration,
                  0
                ) / 60 || 0}
                h
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedDiscipline && (
        <div className="space-y-4">
          {lessons?.map((lesson: Lesson) => (
            <div key={lesson.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{lesson.title}</h3>
                  <p className="text-sm text-gray-600">
                    {format(new Date(lesson.date), "dd 'de' MMMM 'de' yyyy")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedLesson(lesson)
                      setNewLesson(lesson)
                      setShowLessonModal(true)
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteMutation.mutate(lesson.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Objetivos</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {lesson.objectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Recursos</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {lesson.resources.map((resource, index) => (
                      <li key={index}>{resource}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{lesson.duration} minutos</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span className="capitalize">{lesson.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showLessonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">
              {selectedLesson ? 'Editar Aula' : 'Nova Aula'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Preencha os detalhes da aula
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={newLesson.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewLesson(prev => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <textarea
                  value={newLesson.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewLesson(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Objetivos</label>
                {newLesson.objectives?.map((objective, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={objective}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleObjectiveChange(index, e.target.value)
                      }
                      required
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddObjective}
                >
                  Adicionar Objetivo
                </Button>
              </div>
              <div>
                <label className="text-sm font-medium">Conteúdo</label>
                <textarea
                  value={newLesson.content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewLesson(prev => ({ ...prev, content: e.target.value }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Metodologia</label>
                <textarea
                  value={newLesson.methodology}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewLesson(prev => ({
                      ...prev,
                      methodology: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Recursos</label>
                {newLesson.resources?.map((resource, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={resource}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleResourceChange(index, e.target.value)
                      }
                      required
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddResource}
                >
                  Adicionar Recurso
                </Button>
              </div>
              <div>
                <label className="text-sm font-medium">Avaliação</label>
                <textarea
                  value={newLesson.assessment}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewLesson(prev => ({
                      ...prev,
                      assessment: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Data</label>
                  <Input
                    type="date"
                    value={newLesson.date}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewLesson(prev => ({ ...prev, date: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Duração (minutos)
                  </label>
                  <Input
                    type="number"
                    value={newLesson.duration}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewLesson(prev => ({
                        ...prev,
                        duration: Number.parseInt(e.target.value),
                      }))
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Status</label>
                <select
                  value={newLesson.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setNewLesson(prev => ({
                      ...prev,
                      status: e.target.value as Lesson['status'],
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="planned">Planejada</option>
                  <option value="in_progress">Em Andamento</option>
                  <option value="completed">Concluída</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowLessonModal(false)
                    setSelectedLesson(null)
                    setNewLesson({
                      title: '',
                      description: '',
                      objectives: [''],
                      content: '',
                      methodology: '',
                      resources: [''],
                      assessment: '',
                      date: format(new Date(), 'yyyy-MM-dd'),
                      duration: 50,
                      status: 'planned',
                    })
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={lessonMutation.isPending}>
                  {lessonMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
