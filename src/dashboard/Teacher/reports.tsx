import { useState } from 'react'
import Button from '../../components/Button'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Download, FileText, BarChart2, Users } from 'lucide-react'

interface Report {
  id: string
  title: string
  description: string
  type: 'pdf' | 'excel' | 'csv'
  url: string
  createdAt: string
}

export default function Reports() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [selectedReportType, setSelectedReportType] = useState<string>('')

  // Fetch disciplines
  const { data: disciplines } = useQuery({
    queryKey: ['disciplines'],
    queryFn: async () => {
      const response = await api.get('/disciplines')
      return response.json()
    },
  })

  // Fetch reports
  const { data: reports } = useQuery({
    queryKey: ['reports', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const response = await api.get(
        `/reports?disciplineId=${selectedDiscipline}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  const handleGenerateReport = async (type: 'pdf' | 'excel' | 'csv') => {
    try {
      const response = await api.post('/reports/generate', {
        disciplineId: selectedDiscipline,
        type,
      })

      const data = await response.json()

      // Create a temporary link to download the file
      const link = document.createElement('a')
      link.href = data.url
      link.download = `relatorio-${selectedDiscipline}-${Date.now()}.${type}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      alert('Relatório gerado com sucesso.')
    } catch (error) {
      alert('Erro ao gerar relatório.')
    }
  }

  const reportTypes = [
    {
      id: 'grades',
      title: 'Notas e Avaliações',
      description: 'Relatório detalhado de notas e avaliações',
      icon: FileText,
      type: 'pdf' as const,
    },
    {
      id: 'performance',
      title: 'Desempenho',
      description: 'Análise de desempenho dos alunos',
      icon: BarChart2,
      type: 'excel' as const,
    },
    {
      id: 'attendance',
      title: 'Frequência',
      description: 'Relatório de frequência dos alunos',
      icon: Users,
      type: 'csv' as const,
    },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Relatórios</h1>
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
            Visão geral dos relatórios
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-gray-600">Total de Relatórios</p>
              <p className="text-2xl font-bold">{reports?.length || 0}</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-gray-600">Último Relatório</p>
              <p className="text-2xl font-bold">
                {reports?.length
                  ? new Date(reports[0].createdAt).toLocaleDateString()
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedDiscipline && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {reportTypes.map(reportType => (
              <div
                key={reportType.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <reportType.icon className="h-5 w-5" />
                    {reportType.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {reportType.description}
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleGenerateReport(reportType.type)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">
              Histórico de Relatórios
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Relatórios gerados anteriormente
            </p>
            <div className="space-y-4">
              {reports?.map((report: Report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-gray-600">
                      {report.description}
                    </p>
                    <p className="text-sm text-gray-600">
                      Gerado em:{' '}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a')
                      link.href = report.url
                      link.download = report.title
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
