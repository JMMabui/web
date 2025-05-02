// src/components/ActivityHistory.jsx
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from '@/components/Button'
import LoadingSpinner from '@/components/LoadingSpinner'
import { mockActivityHistory } from '@/mockData'

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
        return 'bg-green-100 text-green-800'
      case 'Em andamento':
        return 'bg-yellow-100 text-yellow-800'
      case 'Pendente':
        return 'bg-blue-100 text-blue-800'
      case 'Cancelada':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Histórico de Atividades</h1>
        <Button onClick={handleExportCSV} disabled={isLoading}>
          Exportar CSV
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <input
          type="text"
          placeholder="Filtrar por nome..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nome
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
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredActivities.map(activity => (
              <tr
                key={activity.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedActivity(activity)}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedActivity(activity)
                  }
                }}
                tabIndex={0}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {activity.nome}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {activity.data}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${getStatusColor(activity.status as ActivityStatus)}`}
                  >
                    {activity.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {activity.tipo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedActivity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">{selectedActivity.nome}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Data</h3>
                <p>{selectedActivity.data}</p>
              </div>
              <div>
                <h3 className="font-semibold">Status</h3>
                <p>{selectedActivity.status}</p>
              </div>
              <div>
                <h3 className="font-semibold">Tipo</h3>
                <p>{selectedActivity.tipo}</p>
              </div>
              <div>
                <h3 className="font-semibold">Descrição</h3>
                <p>{selectedActivity.descricao}</p>
              </div>
              {selectedActivity.notas && (
                <div>
                  <h3 className="font-semibold">Notas</h3>
                  <p>{selectedActivity.notas}</p>
                </div>
              )}
              {selectedActivity.observacoes && (
                <div>
                  <h3 className="font-semibold">Observações</h3>
                  <p>{selectedActivity.observacoes}</p>
                </div>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => setSelectedActivity(null)}>Fechar</Button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center mt-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
