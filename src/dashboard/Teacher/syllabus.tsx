import { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Plus, Trash2, Edit2, BookOpen, BarChart3 } from 'lucide-react'

interface Topic {
  id: string
  title: string
  description: string
  duration: number
  order: number
  resources: {
    id: string
    title: string
    type: 'book' | 'article' | 'video' | 'other'
    url?: string
  }[]
}

interface Syllabus {
  id: string
  disciplineId: string
  title: string
  description: string
  objectives: string[]
  topics: Topic[]
  bibliography: {
    id: string
    title: string
    authors: string
    year: number
    type: 'book' | 'article' | 'other'
  }[]
}

export function Syllabus() {
  const queryClient = useQueryClient()
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [showSyllabusModal, setShowSyllabusModal] = useState(false)
  const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(
    null
  )
  const [newSyllabus, setNewSyllabus] = useState<Partial<Syllabus>>({
    title: '',
    description: '',
    objectives: [''],
    topics: [
      {
        id: '1',
        title: '',
        description: '',
        duration: 1,
        order: 1,
        resources: [],
      },
    ],
    bibliography: [],
  })

  // Fetch disciplines
  const { data: disciplines } = useQuery({
    queryKey: ['disciplines'],
    queryFn: async () => {
      const response = await api.get('/disciplines')
      return response.json()
    },
  })

  // Fetch syllabus
  const { data: syllabus } = useQuery({
    queryKey: ['syllabus', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) return null
      const response = await api.get(
        `/syllabus?disciplineId=${selectedDiscipline}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Create/Update syllabus mutation
  const syllabusMutation = useMutation({
    mutationFn: async (syllabus: Partial<Syllabus>) => {
      if (syllabus.id) {
        await api.put(`/syllabus/${syllabus.id}`, syllabus)
      } else {
        await api.post('/syllabus', {
          ...syllabus,
          disciplineId: selectedDiscipline,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabus'] })
      setShowSyllabusModal(false)
      setSelectedSyllabus(null)
      setNewSyllabus({
        title: '',
        description: '',
        objectives: [''],
        topics: [
          {
            id: '1',
            title: '',
            description: '',
            duration: 1,
            order: 1,
            resources: [],
          },
        ],
        bibliography: [],
      })
      alert('Conteúdo programático salvo com sucesso.')
    },
  })

  // Delete syllabus mutation
  const deleteSyllabusMutation = useMutation({
    mutationFn: async (syllabusId: string) => {
      await api.delete(`/syllabus/${syllabusId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['syllabus'] })
      alert('Conteúdo programático removido com sucesso.')
    },
  })

  const handleAddObjective = () => {
    setNewSyllabus(prev => ({
      ...prev,
      objectives: [...(prev.objectives || []), ''],
    }))
  }

  const handleRemoveObjective = (index: number) => {
    setNewSyllabus(prev => ({
      ...prev,
      objectives: prev.objectives?.filter((_, i) => i !== index),
    }))
  }

  const handleObjectiveChange = (index: number, value: string) => {
    setNewSyllabus(prev => ({
      ...prev,
      objectives: prev.objectives?.map((obj, i) => (i === index ? value : obj)),
    }))
  }

  const handleAddTopic = () => {
    setNewSyllabus(prev => ({
      ...prev,
      topics: [
        ...(prev.topics || []),
        {
          id: Date.now().toString(),
          title: '',
          description: '',
          duration: 1,
          order: (prev.topics?.length || 0) + 1,
          resources: [],
        },
      ],
    }))
  }

  const handleRemoveTopic = (topicId: string) => {
    setNewSyllabus(prev => ({
      ...prev,
      topics: prev.topics?.filter(t => t.id !== topicId),
    }))
  }

  const handleTopicChange = (
    topicId: string,
    field: keyof Topic,
    value: any
  ) => {
    setNewSyllabus(prev => ({
      ...prev,
      topics: prev.topics?.map(t =>
        t.id === topicId ? { ...t, [field]: value } : t
      ),
    }))
  }

  const handleAddResource = (topicId: string) => {
    setNewSyllabus(prev => ({
      ...prev,
      topics: prev.topics?.map(t =>
        t.id === topicId
          ? {
              ...t,
              resources: [
                ...t.resources,
                {
                  id: Date.now().toString(),
                  title: '',
                  type: 'book',
                },
              ],
            }
          : t
      ),
    }))
  }

  const handleRemoveResource = (topicId: string, resourceId: string) => {
    setNewSyllabus(prev => ({
      ...prev,
      topics: prev.topics?.map(t =>
        t.id === topicId
          ? {
              ...t,
              resources: t.resources.filter(r => r.id !== resourceId),
            }
          : t
      ),
    }))
  }

  const handleResourceChange = (
    topicId: string,
    resourceId: string,
    field: keyof Topic['resources'][0],
    value: any
  ) => {
    setNewSyllabus(prev => ({
      ...prev,
      topics: prev.topics?.map(t =>
        t.id === topicId
          ? {
              ...t,
              resources: t.resources.map(r =>
                r.id === resourceId ? { ...r, [field]: value } : r
              ),
            }
          : t
      ),
    }))
  }

  const handleAddBibliography = () => {
    setNewSyllabus(prev => ({
      ...prev,
      bibliography: [
        ...(prev.bibliography || []),
        {
          id: Date.now().toString(),
          title: '',
          authors: '',
          year: new Date().getFullYear(),
          type: 'book',
        },
      ],
    }))
  }

  const handleRemoveBibliography = (bibliographyId: string) => {
    setNewSyllabus(prev => ({
      ...prev,
      bibliography: prev.bibliography?.filter(b => b.id !== bibliographyId),
    }))
  }

  const handleBibliographyChange = (
    bibliographyId: string,
    field: keyof Syllabus['bibliography'][0],
    value: any
  ) => {
    setNewSyllabus(prev => ({
      ...prev,
      bibliography: prev.bibliography?.map(b =>
        b.id === bibliographyId ? { ...b, [field]: value } : b
      ),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    syllabusMutation.mutate(newSyllabus)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <BookOpen className="h-8 w-8" />
                Conteúdo Programático
              </h1>
              <p className="text-blue-100 mt-2">
                Organize o conteúdo programático e objetivos das suas
                disciplinas
              </p>
            </div>
            <Button
              onClick={() => setShowSyllabusModal(true)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Conteúdo
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
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Estatísticas
                </h3>
                <p className="text-sm text-gray-600">Visão geral do conteúdo</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600 font-medium">Tópicos</p>
                <p className="text-2xl font-bold text-blue-700">
                  {syllabus?.topics?.length || 0}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-600 font-medium">Horas</p>
                <p className="text-2xl font-bold text-green-700">
                  {syllabus?.topics?.reduce(
                    (acc: number, topic: Topic) => acc + topic.duration,
                    0
                  ) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {selectedDiscipline && syllabus && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{syllabus.title}</h3>
                <p className="text-sm text-gray-600">{syllabus.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedSyllabus(syllabus)
                    setNewSyllabus(syllabus)
                    setShowSyllabusModal(true)
                  }}
                >
                  <Edit2 className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteSyllabusMutation.mutate(syllabus.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remover
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Objetivos</h3>
                <ul className="list-disc list-inside space-y-1">
                  {syllabus.objectives.map(
                    (objective: string, index: number) => (
                      <li key={index} className="text-sm">
                        {objective}
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h3 className="font-medium mb-2">Conteúdo Programático</h3>
                <div className="space-y-4">
                  {syllabus.topics.map((topic: Topic) => (
                    <div key={topic.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{topic.title}</h4>
                          <p className="text-sm text-gray-600">
                            {topic.description}
                          </p>
                        </div>
                        <div className="text-sm font-medium">
                          {topic.duration} horas
                        </div>
                      </div>
                      {topic.resources.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium mb-1">
                            Recursos:
                          </h5>
                          <ul className="list-disc list-inside space-y-1">
                            {topic.resources.map((resource: any) => (
                              <li key={resource.id} className="text-sm">
                                {resource.title}
                                {resource.url && (
                                  <a
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline ml-1"
                                  >
                                    (Link)
                                  </a>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Bibliografia</h3>
                <div className="space-y-2">
                  {syllabus.bibliography.map((item: any) => (
                    <div key={item.id} className="text-sm">
                      {item.authors} ({item.year}). {item.title}.
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {showSyllabusModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">
                {selectedSyllabus ? 'Editar Conteúdo' : 'Novo Conteúdo'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Preencha os detalhes do conteúdo programático
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={newSyllabus.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewSyllabus(prev => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <textarea
                    value={newSyllabus.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewSyllabus(prev => ({
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
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Objetivos</label>
                    <Button type="button" onClick={handleAddObjective}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Objetivo
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newSyllabus.objectives?.map((objective, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={objective}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleObjectiveChange(index, e.target.value)
                          }
                          required
                        />
                        {newSyllabus.objectives!.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveObjective(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Tópicos</label>
                    <Button type="button" onClick={handleAddTopic}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Tópico
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {newSyllabus.topics?.map(topic => (
                      <div
                        key={topic.id}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-4">
                            <div>
                              <label className="text-sm font-medium">
                                Título
                              </label>
                              <Input
                                value={topic.title}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  handleTopicChange(
                                    topic.id,
                                    'title',
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Descrição
                              </label>
                              <textarea
                                value={topic.description}
                                onChange={(
                                  e: React.ChangeEvent<HTMLTextAreaElement>
                                ) =>
                                  handleTopicChange(
                                    topic.id,
                                    'description',
                                    e.target.value
                                  )
                                }
                                className="w-full p-2 border border-gray-300 rounded-md"
                                rows={3}
                                required
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">
                                Duração (horas)
                              </label>
                              <Input
                                type="number"
                                min={1}
                                value={topic.duration}
                                onChange={(
                                  e: React.ChangeEvent<HTMLInputElement>
                                ) =>
                                  handleTopicChange(
                                    topic.id,
                                    'duration',
                                    Number.parseInt(e.target.value)
                                  )
                                }
                                required
                              />
                            </div>
                          </div>
                          {newSyllabus.topics!.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveTopic(topic.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium">
                              Recursos
                            </label>
                            <Button
                              type="button"
                              onClick={() => handleAddResource(topic.id)}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Adicionar Recurso
                            </Button>
                          </div>
                          <div className="space-y-2">
                            {topic.resources.map(resource => (
                              <div key={resource.id} className="flex gap-2">
                                <Input
                                  value={resource.title}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) =>
                                    handleResourceChange(
                                      topic.id,
                                      resource.id,
                                      'title',
                                      e.target.value
                                    )
                                  }
                                  placeholder="Título do recurso"
                                  required
                                />
                                <select
                                  value={resource.type}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLSelectElement>
                                  ) =>
                                    handleResourceChange(
                                      topic.id,
                                      resource.id,
                                      'type',
                                      e.target.value
                                    )
                                  }
                                  className="w-[120px] p-2 border border-gray-300 rounded-md"
                                >
                                  <option value="book">Livro</option>
                                  <option value="article">Artigo</option>
                                  <option value="video">Vídeo</option>
                                  <option value="other">Outro</option>
                                </select>
                                <Input
                                  value={resource.url || ''}
                                  onChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                  ) =>
                                    handleResourceChange(
                                      topic.id,
                                      resource.id,
                                      'url',
                                      e.target.value
                                    )
                                  }
                                  placeholder="URL (opcional)"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleRemoveResource(topic.id, resource.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Bibliografia</label>
                    <Button type="button" onClick={handleAddBibliography}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Referência
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {newSyllabus.bibliography?.map(item => (
                      <div key={item.id} className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Título</label>
                          <Input
                            value={item.title}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              handleBibliographyChange(
                                item.id,
                                'title',
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Autores</label>
                          <Input
                            value={item.authors}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              handleBibliographyChange(
                                item.id,
                                'authors',
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Ano</label>
                          <Input
                            type="number"
                            min={1900}
                            max={new Date().getFullYear()}
                            value={item.year}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) =>
                              handleBibliographyChange(
                                item.id,
                                'year',
                                Number.parseInt(e.target.value)
                              )
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Tipo</label>
                          <select
                            value={item.type}
                            onChange={(
                              e: React.ChangeEvent<HTMLSelectElement>
                            ) =>
                              handleBibliographyChange(
                                item.id,
                                'type',
                                e.target.value
                              )
                            }
                            className="w-full p-2 border border-gray-300 rounded-md"
                          >
                            <option value="book">Livro</option>
                            <option value="article">Artigo</option>
                            <option value="other">Outro</option>
                          </select>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveBibliography(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowSyllabusModal(false)
                      setSelectedSyllabus(null)
                      setNewSyllabus({
                        title: '',
                        description: '',
                        objectives: [''],
                        topics: [
                          {
                            id: '1',
                            title: '',
                            description: '',
                            duration: 1,
                            order: 1,
                            resources: [],
                          },
                        ],
                        bibliography: [],
                      })
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={syllabusMutation.isPending}>
                    {syllabusMutation.isPending ? 'Salvando...' : 'Salvar'}
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
