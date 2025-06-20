// src/components/ActivityHistory.jsx
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from '@/components/Button'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { mockActivityHistory } from '@/mockData'
import {
  History,
  Search,
  Download,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  BarChart3,
  Filter,
  Eye,
} from 'lucide-react'

type ActivityStatus = 'Concluída' | 'Em andamento' | 'Pendente' | 'Cancelada'
type ActivityType = 'Avaliação' | 'Trabalho' | 'Projeto' | 'Outros'

interface Activity {
  id: string
  nome: string
  data: string
  status: ActivityStatus
  tipo: ActivityType
  descricao: string
  notas: string | null
  observacoes: string | null
}

export function ActivityHistory() {
  const [activities, setActivities] = useState<Activity[]>(
    mockActivityHistory as Activity[]
  )
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(
    null
  )
  const [filter, setFilter] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const filteredActivities = activities.filter(activity =>
    activity.nome.toLowerCase().includes(filter.toLowerCase())
  )

  const getStatusColor = (status: ActivityStatus) => {
    switch (status) {
      case 'Concluída':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Em andamento':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Pendente':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Cancelada':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: ActivityStatus) => {
    switch (status) {
      case 'Concluída':
        return <CheckCircle className="h-4 w-4" />
      case 'Em andamento':
        return <Clock className="h-4 w-4" />
      case 'Pendente':
        return <AlertCircle className="h-4 w-4" />
      case 'Cancelada':
        return <X className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeIcon = (tipo: ActivityType) => {
    switch (tipo) {
      case 'Avaliação':
        return <FileText className="h-5 w-5 text-blue-600" />
      case 'Trabalho':
        return <BarChart3 className="h-5 w-5 text-green-600" />
      case 'Projeto':
        return <History className="h-5 w-5 text-yellow-600" />
      default:
        return <FileText className="h-5 w-5 text-gray-600" />
    }
  }

  const handleExportCSV = () => {
    try {
      setIsLoading(true)
      const headers = [
        'Nome',
        'Data',
        'Status',
        'Tipo',
        'Descrição',
        'Notas',
        'Observações',
      ]
      const csvContent = [
        headers.join(','),
        ...filteredActivities.map(activity =>
          [
            activity.nome,
            activity.data,
            activity.status,
            activity.tipo,
            activity.descricao,
            activity.notas || '',
            activity.observacoes || '',
          ].join(',')
        ),
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = 'historico_atividades.csv'
      link.click()
      URL.revokeObjectURL(link.href)

      toast.success('Histórico exportado com sucesso!')
    } catch (error) {
      toast.error('Erro ao exportar histórico')
    } finally {
      setIsLoading(false)
    }
  }

  // Calcular estatísticas
  const totalActivities = activities.length
  const completedActivities = activities.filter(
    a => a.status === 'Concluída'
  ).length
  const pendingActivities = activities.filter(
    a => a.status === 'Pendente'
  ).length
  const inProgressActivities = activities.filter(
    a => a.status === 'Em andamento'
  ).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <History className="h-8 w-8" />
                Histórico de Atividades
              </h1>
              <p className="text-blue-100 mt-2">
                Acompanhe todas as atividades e seu progresso acadêmico
              </p>
            </div>
            <Button
              onClick={handleExportCSV}
              disabled={isLoading}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Download className="mr-2 h-4 w-4" />
              {isLoading ? <LoadingSpinner /> : 'Exportar CSV'}
            </Button>
          </div>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <History className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total de Atividades</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalActivities}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedActivities}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Em Andamento</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {inProgressActivities}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-purple-600">
                  {pendingActivities}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Filtros</h3>
              <p className="text-sm text-gray-600">
                Busque por atividades específicas
              </p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Filtrar por nome da atividade..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Lista de atividades */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <BarChart3 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Atividades
                </h3>
                <p className="text-sm text-gray-600">
                  {filteredActivities.length} atividades encontradas
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atividade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredActivities.map(activity => (
                  <tr
                    key={activity.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100">
                          {getTypeIcon(activity.tipo)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {activity.nome}
                          </div>
                          <div className="text-sm text-gray-500">
                            {activity.descricao.substring(0, 50)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-900">
                          {activity.data}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-1 text-xs font-medium rounded-full border ${getStatusColor(activity.status)}`}
                      >
                        {getStatusIcon(activity.status)}
                        {activity.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">
                        {activity.tipo}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        onClick={() => setSelectedActivity(activity)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-5 h-5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredActivities.length === 0 && (
            <div className="text-center py-12">
              <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma atividade encontrada</p>
            </div>
          )}
        </div>

        {/* Modal de detalhes */}
        {selectedActivity && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="bg-gradient-to-r from-blue-600 to-green-600 p-6 rounded-t-xl text-white">
                <div className="flex items-center gap-3">
                  {getTypeIcon(selectedActivity.tipo)}
                  <h2 className="text-xl font-semibold">
                    {selectedActivity.nome}
                  </h2>
                </div>
                <p className="text-blue-100 mt-2">Detalhes da atividade</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-600" />
                      <h3 className="font-semibold text-gray-800">Data</h3>
                    </div>
                    <p className="text-gray-700">{selectedActivity.data}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="h-4 w-4 text-gray-600" />
                      <h3 className="font-semibold text-gray-800">Status</h3>
                    </div>
                    <span
                      className={`px-3 py-1 inline-flex items-center gap-1 text-sm font-medium rounded-full border ${getStatusColor(selectedActivity.status)}`}
                    >
                      {getStatusIcon(selectedActivity.status)}
                      {selectedActivity.status}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-800">Tipo</h3>
                  </div>
                  <p className="text-gray-700">{selectedActivity.tipo}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-4 w-4 text-gray-600" />
                    <h3 className="font-semibold text-gray-800">Descrição</h3>
                  </div>
                  <p className="text-gray-700">{selectedActivity.descricao}</p>
                </div>

                {selectedActivity.notas && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <h3 className="font-semibold text-gray-800">Notas</h3>
                    </div>
                    <p className="text-gray-700">{selectedActivity.notas}</p>
                  </div>
                )}

                {selectedActivity.observacoes && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-gray-600" />
                      <h3 className="font-semibold text-gray-800">
                        Observações
                      </h3>
                    </div>
                    <p className="text-gray-700">
                      {selectedActivity.observacoes}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <Button
                    onClick={() => setSelectedActivity(null)}
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                  >
                    Fechar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
