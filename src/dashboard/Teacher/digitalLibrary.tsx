import { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  FileText,
  Book,
  Link,
  Download,
  BookOpen,
} from 'lucide-react'

interface Resource {
  id: string
  title: string
  description: string
  type: 'document' | 'book' | 'link' | 'other'
  category: string
  tags: string[]
  url?: string
  file?: File
  disciplineId: string
  author?: string
  publicationDate?: string
  isbn?: string
  pages?: number
  language?: string
  format?: string
  size?: number
  downloads: number
  createdAt: string
  updatedAt: string
}

export function DigitalLibrary() {
  const queryClient = useQueryClient()
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedType, setSelectedType] = useState<string>('')
  const [newResource, setNewResource] = useState<Partial<Resource>>({
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

  // Fetch resources
  const { data: resources } = useQuery({
    queryKey: ['resources', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const response = await api.get(
        `/resources?disciplineId=${selectedDiscipline}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Create/Update resource mutation
  const resourceMutation = useMutation({
    mutationFn: async (resource: Partial<Resource>) => {
      const formData = new FormData()
      Object.entries(resource).forEach(([key, value]) => {
        if (key === 'file' && value instanceof File) {
          formData.append('file', value)
        } else if (key === 'tags') {
          formData.append('tags', JSON.stringify(value))
        } else if (value !== undefined) {
          formData.append(key, String(value))
        }
      })

      if (resource.id) {
        await api.put(`/resources/${resource.id}`, formData)
      } else {
        await api.post('/resources', formData)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      setShowResourceModal(false)
      setSelectedResource(null)
      setNewResource({
        title: '',
        description: '',
        type: 'document',
        category: '',
        tags: [],
        url: '',
      })
      alert('Recurso salvo com sucesso.')
    },
  })

  // Delete resource mutation
  const deleteResourceMutation = useMutation({
    mutationFn: async (resourceId: string) => {
      await api.delete(`/resources/${resourceId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] })
      alert('Recurso removido com sucesso.')
    },
  })

  const handleAddTag = () => {
    setNewResource(prev => ({
      ...prev,
      tags: [...(prev.tags || []), ''],
    }))
  }

  const handleRemoveTag = (index: number) => {
    setNewResource(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index),
    }))
  }

  const handleTagChange = (index: number, value: string) => {
    setNewResource(prev => ({
      ...prev,
      tags: prev.tags?.map((tag, i) => (i === index ? value : tag)),
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewResource(prev => ({
        ...prev,
        file,
        size: file.size,
        format: file.type,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    resourceMutation.mutate({
      ...newResource,
      disciplineId: selectedDiscipline,
    })
  }

  const filteredResources = resources?.filter((resource: Resource) => {
    const matchesSearch = resource.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesCategory =
      !selectedCategory || resource.category === selectedCategory
    const matchesType = !selectedType || resource.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  const categories = Array.from(
    new Set(resources?.map((r: Resource) => r.category) || [])
  ) as string[]
  const types = Array.from(
    new Set(resources?.map((r: Resource) => r.type) || [])
  ) as string[]

  const getTypeIcon = (type: Resource['type']) => {
    switch (type) {
      case 'document':
        return <FileText className="h-4 w-4" />
      case 'book':
        return <Book className="h-4 w-4" />
      case 'link':
        return <Link className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
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
                <Book className="h-8 w-8" />
                Biblioteca Digital
              </h1>
              <p className="text-blue-100 mt-2">
                Gerencie recursos digitais e materiais de apoio para suas
                disciplinas
              </p>
            </div>
            <Button
              onClick={() => setShowResourceModal(true)}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Recurso
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
                <Download className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Estatísticas
                </h3>
                <p className="text-sm text-gray-600">
                  Visão geral dos recursos
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm text-blue-600 font-medium">Recursos</p>
                <p className="text-2xl font-bold text-blue-700">
                  {resources?.length || 0}
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-sm text-green-600 font-medium">Downloads</p>
                <p className="text-2xl font-bold text-green-700">
                  {resources?.reduce(
                    (acc: number, resource: Resource) =>
                      acc + resource.downloads,
                    0
                  ) || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {selectedDiscipline && (
          <>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Buscar recursos..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchQuery(e.target.value)
                    }
                    className="pl-9"
                  />
                </div>
              </div>
              <select
                value={selectedCategory}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedCategory(e.target.value)
                }
                className="w-[200px] p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todas as categorias</option>
                {categories.map((category: string) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedType(e.target.value)
                }
                className="w-[200px] p-2 border border-gray-300 rounded-md"
              >
                <option value="">Todos os tipos</option>
                {types.map((type: string) => (
                  <option key={type} value={type}>
                    {type === 'document'
                      ? 'Documento'
                      : type === 'book'
                        ? 'Livro'
                        : type === 'link'
                          ? 'Link'
                          : 'Outro'}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResources?.map((resource: Resource) => (
                <div
                  key={resource.id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        {getTypeIcon(resource.type)}
                        {resource.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {resource.category}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedResource(resource)
                          setNewResource(resource)
                          setShowResourceModal(true)
                        }}
                      >
                        <Edit2 className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          deleteResourceMutation.mutate(resource.id)
                        }
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm">{resource.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {resource.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <span className="text-sm text-gray-600">
                          {resource.downloads} downloads
                        </span>
                      </div>
                      {resource.url && (
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          Acessar
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {showResourceModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">
                {selectedResource ? 'Editar Recurso' : 'Novo Recurso'}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Preencha os detalhes do recurso
              </p>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={newResource.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewResource(prev => ({
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
                    value={newResource.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewResource(prev => ({
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
                    <label className="text-sm font-medium">Tipo</label>
                    <select
                      value={newResource.type}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setNewResource(prev => ({
                          ...prev,
                          type: e.target.value as Resource['type'],
                        }))
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="document">Documento</option>
                      <option value="book">Livro</option>
                      <option value="link">Link</option>
                      <option value="other">Outro</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Categoria</label>
                    <Input
                      value={newResource.category}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewResource(prev => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                {newResource.type === 'book' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Autor</label>
                      <Input
                        value={newResource.author}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewResource(prev => ({
                            ...prev,
                            author: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">ISBN</label>
                      <Input
                        value={newResource.isbn}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewResource(prev => ({
                            ...prev,
                            isbn: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Páginas</label>
                      <Input
                        type="number"
                        value={newResource.pages}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewResource(prev => ({
                            ...prev,
                            pages: Number.parseInt(e.target.value),
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Idioma</label>
                      <Input
                        value={newResource.language}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setNewResource(prev => ({
                            ...prev,
                            language: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium">Tags</label>
                    <Button type="button" onClick={handleAddTag}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Tag
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {newResource.tags?.map((tag, index) => (
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

                {newResource.type === 'link' ? (
                  <div>
                    <label className="text-sm font-medium">URL</label>
                    <Input
                      type="url"
                      value={newResource.url}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewResource(prev => ({
                          ...prev,
                          url: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="text-sm font-medium">Arquivo</label>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      required={!selectedResource}
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowResourceModal(false)
                      setSelectedResource(null)
                      setNewResource({
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
                  <Button type="submit" disabled={resourceMutation.isPending}>
                    {resourceMutation.isPending ? 'Salvando...' : 'Salvar'}
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
