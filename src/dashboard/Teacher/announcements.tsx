// src/components/Announcements.jsx

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import { mockAnnouncements } from '@/mockData'

export type Priority = 'BAIXA' | 'MEDIA' | 'ALTA'
export type Category = 'GERAL' | 'AVALIACAO' | 'REUNIAO' | 'OUTROS'

export interface Announcement {
  id: string
  titulo: string
  data: string
  conteudo: string
  prioridade: Priority
  categoria: Category
  anexos?: File[]
}

export function Announcements() {
  const [comunicados, setComunicados] =
    useState<Announcement[]>(mockAnnouncements)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category>('GERAL')
  const [selectedPriority, setSelectedPriority] = useState<Priority>('MEDIA')
  const [anexos, setAnexos] = useState<File[]>([])

  const [formData, setFormData] = useState<Omit<Announcement, 'id'>>({
    titulo: '',
    data: '',
    conteudo: '',
    prioridade: 'MEDIA',
    categoria: 'GERAL',
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAnexos(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (editingId) {
        // Atualizar comunicado existente
        setComunicados(prev =>
          prev.map(com =>
            com.id === editingId ? { ...com, ...formData, anexos } : com
          )
        )
        toast.success('Comunicado atualizado com sucesso!')
      } else {
        // Criar novo comunicado
        const newComunicado: Announcement = {
          id: Date.now().toString(),
          ...formData,
          anexos,
        }
        setComunicados(prev => [...prev, newComunicado])
        toast.success('Comunicado criado com sucesso!')
      }

      setShowForm(false)
      setEditingId(null)
      setFormData({
        titulo: '',
        data: '',
        conteudo: '',
        prioridade: 'MEDIA',
        categoria: 'GERAL',
      })
      setAnexos([])
    } catch (error) {
      toast.error('Erro ao salvar comunicado')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = (comunicado: Announcement) => {
    setEditingId(comunicado.id)
    setFormData({
      titulo: comunicado.titulo,
      data: comunicado.data,
      conteudo: comunicado.conteudo,
      prioridade: comunicado.prioridade,
      categoria: comunicado.categoria,
    })
    setAnexos(comunicado.anexos || [])
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este comunicado?')) {
      setComunicados(prev => prev.filter(com => com.id !== id))
      toast.success('Comunicado excluído com sucesso!')
    }
  }

  const getPriorityColor = (prioridade: Priority) => {
    switch (prioridade) {
      case 'ALTA':
        return 'bg-red-100 text-red-800'
      case 'MEDIA':
        return 'bg-yellow-100 text-yellow-800'
      case 'BAIXA':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold">Comunicados</h2>
          <Button onClick={() => setShowForm(true)}>Novo Comunicado</Button>
        </div>

        {/* Formulário de criação/edição */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h3 className="text-xl font-semibold mb-4">
                {editingId ? 'Editar Comunicado' : 'Novo Comunicado'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Data</label>
                  <input
                    type="date"
                    name="data"
                    value={formData.data}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Conteúdo
                  </label>
                  <textarea
                    name="conteudo"
                    value={formData.conteudo}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.categoria}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        categoria: e.target.value as Category,
                      }))
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="GERAL">Geral</option>
                    <option value="AVALIACAO">Avaliação</option>
                    <option value="REUNIAO">Reunião</option>
                    <option value="OUTROS">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Prioridade
                  </label>
                  <select
                    value={formData.prioridade}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        prioridade: e.target.value as Priority,
                      }))
                    }
                    className="w-full p-2 border rounded"
                  >
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Anexos
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowForm(false)
                      setEditingId(null)
                    }}
                    className="bg-gray-500"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner /> : 'Salvar'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de comunicados */}
        <div className="space-y-4">
          {comunicados.map(comunicado => (
            <div
              key={comunicado.id}
              className="bg-white p-4 rounded-lg shadow-md border-l-4 border-blue-500"
            >
              <div className="flex justify-between items-start">
                <div>
              <h3 className="text-lg font-semibold">{comunicado.titulo}</h3>
                  <p className="text-gray-600">{comunicado.conteudo}</p>
                  <div className="flex gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(comunicado.prioridade)}`}
                    >
                      {comunicado.prioridade}
                    </span>
                    <span className="px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {comunicado.categoria}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleEdit(comunicado)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Editar
                  </Button>
                  <Button
                    onClick={() => handleDelete(comunicado.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Excluir
                  </Button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Data: {new Date(comunicado.data).toLocaleDateString()}
              </p>
              {comunicado.anexos && comunicado.anexos.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">Anexos:</p>
                  <ul className="list-disc list-inside">
                    {comunicado.anexos.map((anexo, index) => (
                      <li key={index} className="text-sm text-blue-500">
                        {anexo.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
