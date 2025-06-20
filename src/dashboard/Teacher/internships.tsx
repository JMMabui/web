import { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  Plus,
  Trash2,
  Edit2,
  Building2,
  Calendar,
  FileText,
  User,
  BookOpen,
} from 'lucide-react'

interface Internship {
  id: string
  title: string
  description: string
  company: string
  supervisor: string
  supervisorEmail: string
  supervisorPhone: string
  startDate: string
  endDate: string
  hoursPerWeek: number
  totalHours: number
  studentId: string
  studentName: string
  disciplineId: string
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled'
  documents: {
    id: string
    title: string
    type: 'agreement' | 'report' | 'evaluation' | 'other'
    url?: string
    file?: File
    status: 'pending' | 'approved' | 'rejected'
    feedback?: string
  }[]
  evaluations: {
    id: string
    date: string
    type: 'supervisor' | 'student' | 'coordinator'
    rating: number
    comments: string
  }[]
  createdAt: string
  updatedAt: string
}

export default function Internships() {
  const queryClient = useQueryClient()
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [showInternshipModal, setShowInternshipModal] = useState(false)
  const [selectedInternship, setSelectedInternship] =
    useState<Internship | null>(null)
  const [showDocumentModal, setShowDocumentModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<
    Internship['documents'][0] | null
  >(null)
  const [showEvaluationModal, setShowEvaluationModal] = useState(false)
  const [selectedEvaluation, setSelectedEvaluation] = useState<
    Internship['evaluations'][0] | null
  >(null)
  const [newInternship, setNewInternship] = useState<Partial<Internship>>({
    title: '',
    description: '',
    company: '',
    supervisor: '',
    supervisorEmail: '',
    supervisorPhone: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    hoursPerWeek: 20,
    totalHours: 240,
    documents: [],
    evaluations: [],
    status: 'pending',
  })
  const [newDocument, setNewDocument] = useState<
    Partial<Internship['documents'][0]>
  >({
    title: '',
    type: 'agreement',
    status: 'pending',
  })
  const [newEvaluation, setNewEvaluation] = useState<
    Partial<Internship['evaluations'][0]>
  >({
    type: 'supervisor',
    rating: 0,
    comments: '',
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

  // Fetch internships
  const { data: internships } = useQuery({
    queryKey: ['internships', selectedDiscipline, selectedStudent],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const response = await api.get(
        `/internships?disciplineId=${selectedDiscipline}${
          selectedStudent ? `&studentId=${selectedStudent}` : ''
        }`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Create/Update internship mutation
  const internshipMutation = useMutation({
    mutationFn: async (internship: Partial<Internship>) => {
      if (internship.id) {
        await api.put(`/internships/${internship.id}`, internship)
      } else {
        await api.post('/internships', {
          ...internship,
          disciplineId: selectedDiscipline,
          studentId: selectedStudent,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internships'] })
      setShowInternshipModal(false)
      setSelectedInternship(null)
      setNewInternship({
        title: '',
        description: '',
        company: '',
        supervisor: '',
        supervisorEmail: '',
        supervisorPhone: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        hoursPerWeek: 20,
        totalHours: 240,
        documents: [],
        evaluations: [],
        status: 'pending',
      })
      alert('Estágio salvo com sucesso.')
    },
  })

  // Delete internship mutation
  const deleteInternshipMutation = useMutation({
    mutationFn: async (internshipId: string) => {
      await api.delete(`/internships/${internshipId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internships'] })
      alert('Estágio removido com sucesso.')
    },
  })

  // Create/Update document mutation
  const documentMutation = useMutation({
    mutationFn: async (document: Partial<Internship['documents'][0]>) => {
      const formData = new FormData()
      Object.entries(document).forEach(([key, value]) => {
        if (key === 'file' && value) {
          formData.append('file', value)
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      if (document.id) {
        await api.put(`/documents/${document.id}`, formData)
      } else {
        await api.post('/documents', {
          ...formData,
          internshipId: selectedInternship?.id,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internships'] })
      setShowDocumentModal(false)
      setSelectedDocument(null)
      setNewDocument({
        title: '',
        type: 'agreement',
        status: 'pending',
      })
      alert('Documento salvo com sucesso.')
    },
  })

  // Create/Update evaluation mutation
  const evaluationMutation = useMutation({
    mutationFn: async (evaluation: Partial<Internship['evaluations'][0]>) => {
      if (evaluation.id) {
        await api.put(`/evaluations/${evaluation.id}`, evaluation)
      } else {
        await api.post('/evaluations', {
          ...evaluation,
          internshipId: selectedInternship?.id,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['internships'] })
      setShowEvaluationModal(false)
      setSelectedEvaluation(null)
      setNewEvaluation({
        type: 'supervisor',
        rating: 0,
        comments: '',
      })
      alert('Avaliação salva com sucesso.')
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewDocument(prev => ({
        ...prev,
        file,
      }))
    }
  }

  const handleSubmitInternship = (e: React.FormEvent) => {
    e.preventDefault()
    internshipMutation.mutate(newInternship)
  }

  const handleSubmitDocument = (e: React.FormEvent) => {
    e.preventDefault()
    documentMutation.mutate(newDocument)
  }

  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault()
    evaluationMutation.mutate(newEvaluation)
  }

  const getStatusColor = (status: Internship['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500'
      case 'approved':
        return 'text-green-500'
      case 'in_progress':
        return 'text-blue-500'
      case 'completed':
        return 'text-green-600'
      case 'cancelled':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusText = (status: Internship['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendente'
      case 'approved':
        return 'Aprovado'
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

  const getDocumentTypeText = (type: Internship['documents'][0]['type']) => {
    switch (type) {
      case 'agreement':
        return 'Acordo'
      case 'report':
        return 'Relatório'
      case 'evaluation':
        return 'Avaliação'
      case 'other':
        return 'Outro'
      default:
        return type
    }
  }

  const getEvaluationTypeText = (
    type: Internship['evaluations'][0]['type']
  ) => {
    switch (type) {
      case 'supervisor':
        return 'Supervisor'
      case 'student':
        return 'Estudante'
      case 'coordinator':
        return 'Coordenador'
      default:
        return type
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
                <Building2 className="h-8 w-8" />
                Estágios
              </h1>
              <p className="text-blue-100 mt-2">
                Gerencie estágios e acompanhe o desenvolvimento profissional dos
                alunos
              </p>
            </div>
            <Button
              onClick={() => setShowInternshipModal(true)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Estágio
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
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Aluno</h3>
                <p className="text-sm text-gray-600">Selecione o aluno</p>
              </div>
            </div>
            <select
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              <option value="">Selecione um aluno</option>
              {students?.map((student: any) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedDiscipline && selectedStudent && (
          <div className="space-y-6">
            {internships?.map((internship: Internship) => (
              <div
                key={internship.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {internship.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>{internship.company}</span>
                        <span>•</span>
                        <span>
                          {new Date(internship.startDate).toLocaleDateString()}{' '}
                          - {new Date(internship.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedInternship(internship)
                        setNewInternship(internship)
                        setShowInternshipModal(true)
                      }}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        deleteInternshipMutation.mutate(internship.id)
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
                    <p className="text-sm">{internship.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium">Supervisor</h3>
                      <p className="text-sm">{internship.supervisor}</p>
                      <p className="text-sm text-gray-600">
                        {internship.supervisorEmail}
                      </p>
                      <p className="text-sm text-gray-600">
                        {internship.supervisorPhone}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Horas</h3>
                      <p className="text-sm">
                        {internship.hoursPerWeek} horas/semana
                      </p>
                      <p className="text-sm text-gray-600">
                        Total: {internship.totalHours} horas
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Documentos</h3>
                      <Button
                        onClick={() => {
                          setSelectedInternship(internship)
                          setShowDocumentModal(true)
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Novo Documento
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {internship.documents.map(document => (
                        <div
                          key={document.id}
                          className="flex items-center justify-between border rounded-lg p-4"
                        >
                          <div>
                            <p className="font-medium">{document.title}</p>
                            <p className="text-sm text-gray-600">
                              {getDocumentTypeText(document.type)}
                            </p>
                            {document.feedback && (
                              <p className="text-sm mt-2">
                                {document.feedback}
                              </p>
                            )}
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              document.status === 'approved'
                                ? 'text-green-500'
                                : document.status === 'rejected'
                                  ? 'text-red-500'
                                  : 'text-yellow-500'
                            }`}
                          >
                            {document.status === 'approved'
                              ? 'Aprovado'
                              : document.status === 'rejected'
                                ? 'Rejeitado'
                                : 'Pendente'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">Avaliações</h3>
                      <Button
                        onClick={() => {
                          setSelectedInternship(internship)
                          setShowEvaluationModal(true)
                        }}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Nova Avaliação
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {internship.evaluations.map(evaluation => (
                        <div
                          key={evaluation.id}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {getEvaluationTypeText(evaluation.type)}
                              </p>
                              <p className="text-sm text-gray-600">
                                {new Date(evaluation.date).toLocaleDateString()}
                              </p>
                              <p className="text-sm mt-2">
                                {evaluation.comments}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, index) => (
                                  <span
                                    key={index}
                                    className={`text-lg ${
                                      index < evaluation.rating
                                        ? 'text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <p className="text-sm font-medium">
                                {evaluation.rating}/5
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        internship.status
                      )}`}
                    >
                      {getStatusText(internship.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showInternshipModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">
                {selectedInternship ? 'Editar Estágio' : 'Novo Estágio'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Preencha os detalhes do estágio
              </p>
              <form onSubmit={handleSubmitInternship} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={newInternship.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewInternship(prev => ({
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
                    value={newInternship.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewInternship(prev => ({
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
                  <label className="text-sm font-medium">Empresa</label>
                  <Input
                    value={newInternship.company}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewInternship(prev => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Supervisor</label>
                    <Input
                      value={newInternship.supervisor}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewInternship(prev => ({
                          ...prev,
                          supervisor: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Email do Supervisor
                    </label>
                    <Input
                      type="email"
                      value={newInternship.supervisorEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewInternship(prev => ({
                          ...prev,
                          supervisorEmail: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Telefone do Supervisor
                  </label>
                  <Input
                    value={newInternship.supervisorPhone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewInternship(prev => ({
                        ...prev,
                        supervisorPhone: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">
                      Data de Início
                    </label>
                    <Input
                      type="date"
                      value={newInternship.startDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewInternship(prev => ({
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
                      type="date"
                      value={newInternship.endDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewInternship(prev => ({
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
                    <label className="text-sm font-medium">
                      Horas por Semana
                    </label>
                    <Input
                      type="number"
                      value={newInternship.hoursPerWeek}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewInternship(prev => ({
                          ...prev,
                          hoursPerWeek: Number.parseInt(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Total de Horas
                    </label>
                    <Input
                      type="number"
                      value={newInternship.totalHours}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewInternship(prev => ({
                          ...prev,
                          totalHours: Number.parseInt(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={newInternship.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setNewInternship(prev => ({
                        ...prev,
                        status: e.target.value as Internship['status'],
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="pending">Pendente</option>
                    <option value="approved">Aprovado</option>
                    <option value="in_progress">Em Andamento</option>
                    <option value="completed">Concluído</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowInternshipModal(false)
                      setSelectedInternship(null)
                      setNewInternship({
                        title: '',
                        description: '',
                        company: '',
                        supervisor: '',
                        supervisorEmail: '',
                        supervisorPhone: '',
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split('T')[0],
                        hoursPerWeek: 20,
                        totalHours: 240,
                        documents: [],
                        evaluations: [],
                        status: 'pending',
                      })
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={internshipMutation.isPending}>
                    {internshipMutation.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDocumentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-2">
                {selectedDocument ? 'Editar Documento' : 'Novo Documento'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Preencha os detalhes do documento
              </p>
              <form onSubmit={handleSubmitDocument} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={newDocument.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewDocument(prev => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <select
                    value={newDocument.type}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setNewDocument(prev => ({
                        ...prev,
                        type: e.target
                          .value as Internship['documents'][0]['type'],
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="agreement">Acordo</option>
                    <option value="report">Relatório</option>
                    <option value="evaluation">Avaliação</option>
                    <option value="other">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Arquivo</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">URL (opcional)</label>
                  <Input
                    value={newDocument.url || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewDocument(prev => ({ ...prev, url: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <select
                    value={newDocument.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setNewDocument(prev => ({
                        ...prev,
                        status: e.target
                          .value as Internship['documents'][0]['status'],
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="pending">Pendente</option>
                    <option value="approved">Aprovado</option>
                    <option value="rejected">Rejeitado</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Feedback (opcional)
                  </label>
                  <textarea
                    value={newDocument.feedback || ''}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewDocument(prev => ({
                        ...prev,
                        feedback: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDocumentModal(false)
                      setSelectedDocument(null)
                      setNewDocument({
                        title: '',
                        type: 'agreement',
                        status: 'pending',
                      })
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={documentMutation.isPending}>
                    {documentMutation.isPending ? 'Salvando...' : 'Salvar'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEvaluationModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-2">
                {selectedEvaluation ? 'Editar Avaliação' : 'Nova Avaliação'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Preencha os detalhes da avaliação
              </p>
              <form onSubmit={handleSubmitEvaluation} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Tipo</label>
                  <select
                    value={newEvaluation.type}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setNewEvaluation(prev => ({
                        ...prev,
                        type: e.target
                          .value as Internship['evaluations'][0]['type'],
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="supervisor">Supervisor</option>
                    <option value="student">Estudante</option>
                    <option value="coordinator">Coordenador</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Avaliação (1-5)</label>
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    value={newEvaluation.rating}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewEvaluation(prev => ({
                        ...prev,
                        rating: Number.parseInt(e.target.value),
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Comentários</label>
                  <textarea
                    value={newEvaluation.comments}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewEvaluation(prev => ({
                        ...prev,
                        comments: e.target.value,
                      }))
                    }
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    required
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowEvaluationModal(false)
                      setSelectedEvaluation(null)
                      setNewEvaluation({
                        type: 'supervisor',
                        rating: 0,
                        comments: '',
                      })
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={evaluationMutation.isPending}>
                    {evaluationMutation.isPending ? 'Salvando...' : 'Salvar'}
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
