import { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Plus, Trash2, Edit2, Save, Check, X } from 'lucide-react'
import { useToast } from '../../components/ui/toast'

interface Student {
  id: string
  name: string
  registration: string
  currentGrade: number
  recoveryGrade?: number
  status: 'pending' | 'approved' | 'failed'
}

interface RecoveryAssessment {
  id: string
  title: string
  description: string
  date: string
  weight: number
  disciplineId: string
  students: Student[]
}

export function Recovery() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [showAssessmentModal, setShowAssessmentModal] = useState(false)
  const [selectedAssessment, setSelectedAssessment] =
    useState<RecoveryAssessment | null>(null)
  const [newAssessment, setNewAssessment] = useState<
    Partial<RecoveryAssessment>
  >({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    weight: 1,
    students: [],
  })

  // Fetch disciplines
  const { data: disciplines } = useQuery({
    queryKey: ['disciplines'],
    queryFn: async () => {
      const response = await api.get('/disciplines')
      return response.json()
    },
  })

  // Fetch recovery assessments
  const { data: assessments } = useQuery({
    queryKey: ['recovery-assessments', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const response = await api.get(
        `/recovery-assessments?disciplineId=${selectedDiscipline}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Create/Update assessment mutation
  const assessmentMutation = useMutation({
    mutationFn: async (assessment: Partial<RecoveryAssessment>) => {
      if (assessment.id) {
        await api.put(`/recovery-assessments/${assessment.id}`, assessment)
      } else {
        await api.post('/recovery-assessments', {
          ...assessment,
          disciplineId: selectedDiscipline,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recovery-assessments'] })
      setShowAssessmentModal(false)
      setSelectedAssessment(null)
      setNewAssessment({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        weight: 1,
        students: [],
      })
      toast({
        title: 'Avaliação salva',
        description: 'A avaliação de recuperação foi salva com sucesso.',
        type: 'success',
      })
    },
  })

  // Delete assessment mutation
  const deleteAssessmentMutation = useMutation({
    mutationFn: async (assessmentId: string) => {
      await api.delete(`/recovery-assessments/${assessmentId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recovery-assessments'] })
      toast({
        title: 'Avaliação removida',
        description: 'A avaliação de recuperação foi removida com sucesso.',
        type: 'success',
      })
    },
  })

  // Update student grade mutation
  const updateGradeMutation = useMutation({
    mutationFn: async ({
      assessmentId,
      studentId,
      grade,
    }: {
      assessmentId: string
      studentId: string
      grade: number
    }) => {
      await api.put(
        `/recovery-assessments/${assessmentId}/students/${studentId}`,
        {
          grade,
        }
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recovery-assessments'] })
      toast({
        title: 'Nota atualizada',
        description: 'A nota do aluno foi atualizada com sucesso.',
        type: 'success',
      })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    assessmentMutation.mutate(newAssessment)
  }

  const handleGradeChange = (
    assessmentId: string,
    studentId: string,
    grade: number
  ) => {
    updateGradeMutation.mutate({ assessmentId, studentId, grade })
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Avaliações de Recuperação</h1>
        <Button onClick={() => setShowAssessmentModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Avaliação
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
            Visão geral das recuperações
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-gray-600">Total de Avaliações</p>
              <p className="text-2xl font-bold">{assessments?.length || 0}</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-gray-600">Alunos em Recuperação</p>
              <p className="text-2xl font-bold">
                {assessments?.reduce(
                  (acc: number, assessment: RecoveryAssessment) =>
                    acc + assessment.students.length,
                  0
                ) || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedDiscipline && (
        <div className="space-y-4">
          {assessments?.map((assessment: RecoveryAssessment) => (
            <div
              key={assessment.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{assessment.title}</h3>
                  <p className="text-sm text-gray-600">
                    {assessment.description}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Data: {new Date(assessment.date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Peso: {assessment.weight}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAssessment(assessment)
                      setNewAssessment(assessment)
                      setShowAssessmentModal(true)
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      deleteAssessmentMutation.mutate(assessment.id)
                    }
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                {assessment.students.map(student => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{student.name}</h3>
                      <p className="text-sm text-gray-600">
                        Matrícula: {student.registration}
                      </p>
                      <p className="text-sm text-gray-600">
                        Nota Atual: {student.currentGrade.toFixed(1)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={0}
                          max={10}
                          step={0.1}
                          value={student.recoveryGrade || ''}
                          onChange={e =>
                            handleGradeChange(
                              assessment.id,
                              student.id,
                              Number.parseFloat(e.target.value)
                            )
                          }
                          className="w-20"
                        />
                        <span className="text-sm text-gray-600">/ 10</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {student.status === 'approved' && (
                          <Check className="h-5 w-5 text-green-500" />
                        )}
                        {student.status === 'failed' && (
                          <X className="h-5 w-5 text-red-500" />
                        )}
                        <span
                          className={`text-sm font-medium ${
                            student.status === 'approved'
                              ? 'text-green-500'
                              : student.status === 'failed'
                                ? 'text-red-500'
                                : 'text-yellow-500'
                          }`}
                        >
                          {student.status === 'approved'
                            ? 'Aprovado'
                            : student.status === 'failed'
                              ? 'Reprovado'
                              : 'Pendente'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAssessmentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">
                {selectedAssessment ? 'Editar Avaliação' : 'Nova Avaliação'}
              </h2>
              <p className="text-sm text-gray-600">
                Preencha os detalhes da avaliação
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={newAssessment.title}
                  onChange={e =>
                    setNewAssessment(prev => ({
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
                  value={newAssessment.description}
                  onChange={e =>
                    setNewAssessment(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Data</label>
                <Input
                  type="date"
                  value={newAssessment.date}
                  onChange={e =>
                    setNewAssessment(prev => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Peso</label>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={newAssessment.weight}
                  onChange={e =>
                    setNewAssessment(prev => ({
                      ...prev,
                      weight: Number.parseInt(e.target.value),
                    }))
                  }
                  required
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAssessmentModal(false)
                    setSelectedAssessment(null)
                    setNewAssessment({
                      title: '',
                      description: '',
                      date: new Date().toISOString().split('T')[0],
                      weight: 1,
                      students: [],
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
