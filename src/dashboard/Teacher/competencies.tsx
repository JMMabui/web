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
  Target,
  Award,
  CheckCircle,
  BookOpen,
} from 'lucide-react'

interface Competency {
  id: string
  title: string
  description: string
  level: 'basic' | 'intermediate' | 'advanced'
  category: string
  indicators: {
    id: string
    description: string
    level: 'basic' | 'intermediate' | 'advanced'
  }[]
  assessments: {
    id: string
    studentId: string
    studentName: string
    level: 'basic' | 'intermediate' | 'advanced'
    date: string
    evidence: string
    feedback: string
  }[]
  disciplineId: string
  createdAt: string
  updatedAt: string
}

export function Competencies() {
  const queryClient = useQueryClient()
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [showCompetencyModal, setShowCompetencyModal] = useState(false)
  const [selectedCompetency, setSelectedCompetency] =
    useState<Competency | null>(null)
  const [showAssessmentModal, setShowAssessmentModal] = useState(false)
  const [selectedAssessment, setSelectedAssessment] = useState<
    Competency['assessments'][0] | null
  >(null)
  const [newCompetency, setNewCompetency] = useState<Partial<Competency>>({
    title: '',
    description: '',
    level: 'basic',
    category: '',
    indicators: [],
  })
  const [newAssessment, setNewAssessment] = useState<
    Partial<Competency['assessments'][0]>
  >({
    level: 'basic',
    evidence: '',
    feedback: '',
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

  // Fetch competencies
  const { data: competencies } = useQuery({
    queryKey: ['competencies', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const response = await api.get(
        `/competencies?disciplineId=${selectedDiscipline}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Create/Update competency mutation
  const competencyMutation = useMutation({
    mutationFn: async (competency: Partial<Competency>) => {
      if (competency.id) {
        await api.put(`/competencies/${competency.id}`, competency)
      } else {
        await api.post('/competencies', {
          ...competency,
          disciplineId: selectedDiscipline,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competencies'] })
      setShowCompetencyModal(false)
      setSelectedCompetency(null)
      setNewCompetency({
        title: '',
        description: '',
        level: 'basic',
        category: '',
        indicators: [],
      })
      alert('Competência salva com sucesso.')
    },
  })

  // Delete competency mutation
  const deleteCompetencyMutation = useMutation({
    mutationFn: async (competencyId: string) => {
      await api.delete(`/competencies/${competencyId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competencies'] })
      alert('Competência removida com sucesso.')
    },
  })

  // Create/Update assessment mutation
  const assessmentMutation = useMutation({
    mutationFn: async (assessment: Partial<Competency['assessments'][0]>) => {
      if (assessment.id) {
        await api.put(`/assessments/${assessment.id}`, assessment)
      } else {
        await api.post('/assessments', {
          ...assessment,
          competencyId: selectedCompetency?.id,
          date: new Date().toISOString(),
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['competencies'] })
      setShowAssessmentModal(false)
      setSelectedAssessment(null)
      setNewAssessment({
        level: 'basic',
        evidence: '',
        feedback: '',
      })
      alert('Avaliação salva com sucesso.')
    },
  })

  const handleAddIndicator = () => {
    setNewCompetency(prev => ({
      ...prev,
      indicators: [
        ...(prev.indicators || []),
        {
          id: Date.now().toString(),
          description: '',
          level: 'basic',
        },
      ],
    }))
  }

  const handleRemoveIndicator = (indicatorId: string) => {
    setNewCompetency(prev => ({
      ...prev,
      indicators: prev.indicators?.filter(i => i.id !== indicatorId),
    }))
  }

  const handleIndicatorChange = (
    indicatorId: string,
    field: keyof Competency['indicators'][0],
    value: any
  ) => {
    setNewCompetency(prev => ({
      ...prev,
      indicators: prev.indicators?.map(i =>
        i.id === indicatorId ? { ...i, [field]: value } : i
      ),
    }))
  }

  const handleSubmitCompetency = (e: React.FormEvent) => {
    e.preventDefault()
    competencyMutation.mutate(newCompetency)
  }

  const handleSubmitAssessment = (e: React.FormEvent) => {
    e.preventDefault()
    assessmentMutation.mutate(newAssessment)
  }

  const getLevelColor = (level: Competency['level']) => {
    switch (level) {
      case 'basic':
        return 'text-blue-500'
      case 'intermediate':
        return 'text-yellow-500'
      case 'advanced':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  const getLevelText = (level: Competency['level']) => {
    switch (level) {
      case 'basic':
        return 'Básico'
      case 'intermediate':
        return 'Intermediário'
      case 'advanced':
        return 'Avançado'
      default:
        return level
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
                <Target className="h-8 w-8" />
                Competências
              </h1>
              <p className="text-blue-100 mt-2">
                Defina e avalie competências dos alunos por disciplina
              </p>
            </div>
            <Button
              onClick={() => setShowCompetencyModal(true)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Competência
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
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Estatísticas
                </h3>
                <p className="text-sm text-gray-600">
                  Visão geral das competências
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600 font-medium">
                  Competências
                </p>
                <p className="text-2xl font-bold text-blue-700">
                  {competencies?.length || 0}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-600 font-medium">Avaliações</p>
                <p className="text-2xl font-bold text-green-700">
                  {competencies?.reduce(
                    (acc: number, competency: Competency) =>
                      acc + competency.assessments.length,
                    0
                  ) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {selectedDiscipline && (
          <div className="space-y-6">
            {competencies?.map((competency: Competency) => (
              <div
                key={competency.id}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      {competency.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <span className={getLevelColor(competency.level)}>
                        {getLevelText(competency.level)}
                      </span>
                      {' • '}
                      {competency.category}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedCompetency(competency)
                        setNewCompetency(competency)
                        setShowCompetencyModal(true)
                      }}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        deleteCompetencyMutation.mutate(competency.id)
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium">Descrição</h3>
                    <p className="text-sm">{competency.description}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Indicadores</h3>
                    <div className="space-y-4">
                      {competency.indicators.map(indicator => (
                        <div
                          key={indicator.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-sm">{indicator.description}</p>
                              <p
                                className={`text-sm ${getLevelColor(
                                  indicator.level
                                )}`}
                              >
                                {getLevelText(indicator.level)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Avaliações</h3>
                      <Button
                        onClick={() => {
                          setSelectedCompetency(competency)
                          setShowAssessmentModal(true)
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Avaliação
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {competency.assessments.map(assessment => (
                        <div
                          key={assessment.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {assessment.studentName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(assessment.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm mt-2">
                                <span className="font-medium">Evidência:</span>{' '}
                                {assessment.evidence}
                              </p>
                              <p className="text-sm mt-2">
                                <span className="font-medium">Feedback:</span>{' '}
                                {assessment.feedback}
                              </p>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getLevelColor(
                                assessment.level
                              )}`}
                            >
                              {getLevelText(assessment.level)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estado vazio */}
        {!selectedDiscipline && (
          <div className="text-center py-20">
            <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Selecione uma disciplina
            </h3>
            <p className="text-gray-500">
              Escolha uma disciplina para começar a gerenciar competências
            </p>
          </div>
        )}
      </div>

      {/* Modais */}
      {showCompetencyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-2">
              {selectedCompetency ? 'Editar Competência' : 'Nova Competência'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Preencha os detalhes da competência
            </p>
            <form onSubmit={handleSubmitCompetency} className="space-y-6">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={newCompetency.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewCompetency(prev => ({
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
                  value={newCompetency.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewCompetency(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nível</label>
                  <select
                    value={newCompetency.level}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setNewCompetency(prev => ({
                        ...prev,
                        level: e.target.value as Competency['level'],
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="basic">Básico</option>
                    <option value="intermediate">Intermediário</option>
                    <option value="advanced">Avançado</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Categoria</label>
                  <Input
                    value={newCompetency.category}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewCompetency(prev => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Indicadores</label>
                  <Button type="button" onClick={handleAddIndicator}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Indicador
                  </Button>
                </div>
                <div className="space-y-4">
                  {newCompetency.indicators?.map(indicator => (
                    <div key={indicator.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-4">
                          <div>
                            <label className="text-sm font-medium">
                              Descrição
                            </label>
                            <textarea
                              value={indicator.description}
                              onChange={(
                                e: React.ChangeEvent<HTMLTextAreaElement>
                              ) =>
                                handleIndicatorChange(
                                  indicator.id,
                                  'description',
                                  e.target.value
                                )
                              }
                              required
                              className="w-full p-2 border border-gray-300 rounded-md"
                              rows={2}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Nível</label>
                            <select
                              value={indicator.level}
                              onChange={(
                                e: React.ChangeEvent<HTMLSelectElement>
                              ) =>
                                handleIndicatorChange(
                                  indicator.id,
                                  'level',
                                  e.target.value
                                )
                              }
                              className="w-full p-2 border border-gray-300 rounded-md"
                            >
                              <option value="basic">Básico</option>
                              <option value="intermediate">
                                Intermediário
                              </option>
                              <option value="advanced">Avançado</option>
                            </select>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveIndicator(indicator.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover
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
                    setShowCompetencyModal(false)
                    setSelectedCompetency(null)
                    setNewCompetency({
                      title: '',
                      description: '',
                      level: 'basic',
                      category: '',
                      indicators: [],
                    })
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={competencyMutation.isPending}>
                  {competencyMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-2">
              {selectedAssessment ? 'Editar Avaliação' : 'Nova Avaliação'}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Avalie a competência do aluno
            </p>
            <form onSubmit={handleSubmitAssessment} className="space-y-6">
              <div>
                <label className="text-sm font-medium">Aluno</label>
                <select
                  value={newAssessment.studentId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setNewAssessment(prev => ({
                      ...prev,
                      studentId: e.target.value,
                      studentName: students?.find(
                        (s: any) => s.id === e.target.value
                      )?.name,
                    }))
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
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
                <label className="text-sm font-medium">Nível</label>
                <select
                  value={newAssessment.level}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setNewAssessment(prev => ({
                      ...prev,
                      level: e.target
                        .value as Competency['assessments'][0]['level'],
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="basic">Básico</option>
                  <option value="intermediate">Intermediário</option>
                  <option value="advanced">Avançado</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Evidência</label>
                <textarea
                  value={newAssessment.evidence}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewAssessment(prev => ({
                      ...prev,
                      evidence: e.target.value,
                    }))
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Feedback</label>
                <textarea
                  value={newAssessment.feedback}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewAssessment(prev => ({
                      ...prev,
                      feedback: e.target.value,
                    }))
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAssessmentModal(false)
                    setSelectedAssessment(null)
                    setNewAssessment({
                      level: 'basic',
                      evidence: '',
                      feedback: '',
                    })
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={assessmentMutation.isPending}>
                  {assessmentMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
