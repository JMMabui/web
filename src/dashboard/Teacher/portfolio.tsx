import { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'

import { useToast } from '@/components/ui/toast'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  Plus,
  Trash2,
  Edit2,
  FileText,
  Image,
  Link,
  Star,
  BookOpen,
  User,
} from 'lucide-react'

interface PortfolioItem {
  id: string
  title: string
  description: string
  type: 'document' | 'image' | 'link' | 'other'
  category: string
  tags: string[]
  url?: string
  file?: File
  studentId: string
  studentName: string
  disciplineId: string
  status: 'draft' | 'submitted' | 'reviewed' | 'approved' | 'rejected'
  feedback?: string
  rating?: number
  createdAt: string
  updatedAt: string
}

export function Portfolio() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [selectedStudent, setSelectedStudent] = useState<string>('')
  const [showItemModal, setShowItemModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null)
  const [newItem, setNewItem] = useState<Partial<PortfolioItem>>({
    title: '',
    description: '',
    type: 'document',
    category: '',
    tags: [],
    url: '',
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

  // Fetch portfolio items
  const { data: portfolioItems } = useQuery({
    queryKey: ['portfolio', selectedDiscipline, selectedStudent],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const response = await api.get(
        `/portfolio?disciplineId=${selectedDiscipline}${
          selectedStudent ? `&studentId=${selectedStudent}` : ''
        }`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Create/Update portfolio item mutation
  const itemMutation = useMutation({
    mutationFn: async (item: Partial<PortfolioItem>) => {
      const formData = new FormData()
      Object.entries(item).forEach(([key, value]) => {
        if (key === 'file' && value instanceof File) {
          formData.append('file', value)
        } else if (key === 'tags' && Array.isArray(value)) {
          formData.append('tags', JSON.stringify(value))
        } else if (value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      if (item.id) {
        await api.put(`/portfolio/${item.id}`, formData)
      } else {
        await api.post('/portfolio', {
          ...formData,
          disciplineId: selectedDiscipline,
          studentId: selectedStudent,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      setShowItemModal(false)
      setSelectedItem(null)
      setNewItem({
        title: '',
        description: '',
        type: 'document',
        category: '',
        tags: [],
        url: '',
      })
      toast({
        title: 'Item salvo',
        description: 'O item foi salvo com sucesso.',
      })
    },
  })

  // Delete portfolio item mutation
  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      await api.delete(`/portfolio/${itemId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      toast({
        title: 'Item removido',
        description: 'O item foi removido com sucesso.',
      })
    },
  })

  // Update item status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({
      itemId,
      status,
      feedback,
      rating,
    }: {
      itemId: string
      status: PortfolioItem['status']
      feedback?: string
      rating?: number
    }) => {
      await api.put(`/portfolio/${itemId}/status`, {
        status,
        feedback,
        rating,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] })
      toast({
        title: 'Status atualizado',
        description: 'O status do item foi atualizado com sucesso.',
      })
    },
  })

  const handleAddTag = () => {
    setNewItem(prev => ({
      ...prev,
      tags: [...(prev.tags || []), ''],
    }))
  }

  const handleRemoveTag = (index: number) => {
    setNewItem(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index),
    }))
  }

  const handleTagChange = (index: number, value: string) => {
    setNewItem(prev => ({
      ...prev,
      tags: prev.tags?.map((tag, i) => (i === index ? value : tag)),
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewItem(prev => ({
        ...prev,
        file,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    itemMutation.mutate(newItem)
  }

  const getTypeIcon = (type: PortfolioItem['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'image':
        return <Image className="h-4 w-4" />
      case 'link':
        return <Link className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeText = (type: PortfolioItem['type']) => {
    switch (type) {
      case 'document':
        return 'Documento'
      case 'image':
        return 'Imagem'
      case 'link':
        return 'Link'
      default:
        return 'Outro'
    }
  }

  const getStatusColor = (status: PortfolioItem['status']) => {
    switch (status) {
      case 'draft':
        return 'text-gray-500'
      case 'submitted':
        return 'text-blue-500'
      case 'reviewed':
        return 'text-yellow-500'
      case 'approved':
        return 'text-green-500'
      case 'rejected':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusText = (status: PortfolioItem['status']) => {
    switch (status) {
      case 'draft':
        return 'Rascunho'
      case 'submitted':
        return 'Enviado'
      case 'reviewed':
        return 'Revisado'
      case 'approved':
        return 'Aprovado'
      case 'rejected':
        return 'Rejeitado'
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
                <FileText className="h-8 w-8" />
                Portfólio
              </h1>
              <p className="text-blue-100 mt-2">
                Gerencie portfólios dos alunos e avalie seus trabalhos
              </p>
            </div>
            <Button
              onClick={() => setShowItemModal(true)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Item
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
            {portfolioItems?.map((item: PortfolioItem) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      {getTypeIcon(item.type)}
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{getTypeText(item.type)}</span>
                      </div>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedItem(item)
                        setNewItem(item)
                        setShowItemModal(true)
                      }}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteItemMutation.mutate(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium">Descrição</h3>
                    <p className="text-sm">{item.description}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {item.url && (
                    <div>
                      <h3 className="font-medium mb-2">Link</h3>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {item.url}
                      </a>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium mb-2">Status</h3>
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusText(item.status)}
                      </span>
                      {item.rating && (
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, index) => (
                            <Star
                              key={index}
                              className={`h-4 w-4 ${
                                index < item.rating!
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="text-sm font-medium ml-1">
                            {item.rating}/5
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {item.feedback && (
                    <div>
                      <h3 className="font-medium mb-2">Feedback</h3>
                      <p className="text-sm">{item.feedback}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newStatus = prompt(
                          'Digite o novo status (draft/submitted/reviewed/approved/rejected):'
                        )
                        if (
                          newStatus &&
                          [
                            'draft',
                            'submitted',
                            'reviewed',
                            'approved',
                            'rejected',
                          ].includes(newStatus)
                        ) {
                          updateStatusMutation.mutate({
                            itemId: item.id,
                            status: newStatus as PortfolioItem['status'],
                          })
                        }
                      }}
                    >
                      Atualizar Status
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const feedback = prompt('Digite o feedback:')
                        const rating = prompt('Digite a avaliação (1-5):')
                        if (feedback && rating) {
                          const ratingNum = Number.parseInt(rating)
                          if (
                            !Number.isNaN(ratingNum) &&
                            ratingNum >= 1 &&
                            ratingNum <= 5
                          ) {
                            updateStatusMutation.mutate({
                              itemId: item.id,
                              status: 'reviewed',
                              feedback,
                              rating: ratingNum,
                            })
                          }
                        }
                      }}
                    >
                      Avaliar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showItemModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">
                {selectedItem ? 'Editar Item' : 'Novo Item'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Preencha os detalhes do item
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={newItem.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewItem(prev => ({ ...prev, title: e.target.value }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewItem(prev => ({
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
                      value={newItem.type}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setNewItem(prev => ({
                          ...prev,
                          type: e.target.value as PortfolioItem['type'],
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="document">Documento</option>
                      <option value="image">Imagem</option>
                      <option value="link">Link</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <Input
                      value={newItem.category}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewItem(prev => ({
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
                    <label className="text-sm font-medium">Tags</label>
                    <Button type="button" onClick={handleAddTag}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Tag
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newItem.tags?.map((tag, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={tag}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleTagChange(index, e.target.value)
                          }
                          placeholder="Digite uma tag"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveTag(index)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {newItem.type === 'link' ? (
                  <div>
                    <label className="text-sm font-medium">URL</label>
                    <Input
                      type="url"
                      value={newItem.url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewItem(prev => ({ ...prev, url: e.target.value }))
                      }
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium">Arquivo</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      required={!selectedItem}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowItemModal(false)
                      setSelectedItem(null)
                      setNewItem({
                        title: '',
                        description: '',
                        type: 'document',
                        category: '',
                        tags: [],
                        url: '',
                      })
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={itemMutation.isPending}>
                    {itemMutation.isPending ? 'Salvando...' : 'Salvar'}
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
