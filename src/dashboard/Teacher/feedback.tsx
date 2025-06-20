import { useState } from 'react'
import Button from '../../components/Button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Trash2, Star, MessageSquare } from 'lucide-react'

interface Feedback {
  id: string
  studentId: string
  studentName: string
  content: string
  rating: number
  date: string
  response?: string
  status: 'pending' | 'responded'
}

export function Feedback() {
  const queryClient = useQueryClient()
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null
  )
  const [response, setResponse] = useState('')

  // Fetch disciplines
  const { data: disciplines } = useQuery({
    queryKey: ['disciplines'],
    queryFn: async () => {
      const response = await api.get('/disciplines')
      return response.json()
    },
  })

  // Fetch feedback
  const { data: feedback } = useQuery({
    queryKey: ['feedback', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const response = await api.get(
        `/feedback?disciplineId=${selectedDiscipline}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Respond to feedback mutation
  const respondMutation = useMutation({
    mutationFn: async ({
      feedbackId,
      response,
    }: {
      feedbackId: string
      response: string
    }) => {
      await api.put(`/feedback/${feedbackId}/respond`, { response })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] })
      setShowResponseModal(false)
      setSelectedFeedback(null)
      setResponse('')
      alert('Resposta enviada com sucesso.')
    },
  })

  // Delete feedback mutation
  const deleteFeedbackMutation = useMutation({
    mutationFn: async (feedbackId: string) => {
      await api.delete(`/feedback/${feedbackId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] })
      alert('Feedback removido com sucesso.')
    },
  })

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedFeedback) {
      respondMutation.mutate({
        feedbackId: selectedFeedback.id,
        response,
      })
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        className={`h-5 w-5 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Feedback dos Alunos</h1>
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
            Visão geral dos feedbacks
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-gray-600">Total de Feedbacks</p>
              <p className="text-2xl font-bold">{feedback?.length || 0}</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-gray-600">Média de Avaliação</p>
              <p className="text-2xl font-bold">
                {feedback?.length
                  ? (
                      feedback.reduce(
                        (acc: number, item: Feedback) => acc + item.rating,
                        0
                      ) / feedback.length
                    ).toFixed(1)
                  : '0.0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {selectedDiscipline && (
        <div className="space-y-4">
          {feedback?.map((item: Feedback) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{item.studentName}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {item.status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFeedback(item)
                        setShowResponseModal(true)
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Responder
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteFeedbackMutation.mutate(item.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {renderStars(item.rating)}
                </div>
                <p className="text-sm">{item.content}</p>
                {item.response && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-medium mb-2">Sua Resposta:</h4>
                    <p className="text-sm">{item.response}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showResponseModal && selectedFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-2">Responder Feedback</h3>
            <p className="text-sm text-gray-600 mb-4">
              Responda ao feedback do aluno {selectedFeedback.studentName}
            </p>
            <form onSubmit={handleSubmitResponse} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Feedback Original</label>
                <div className="p-4 bg-gray-100 rounded-lg mt-2">
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(selectedFeedback.rating)}
                  </div>
                  <p className="text-sm">{selectedFeedback.content}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Sua Resposta</label>
                <textarea
                  value={response}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setResponse(e.target.value)
                  }
                  required
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowResponseModal(false)
                    setSelectedFeedback(null)
                    setResponse('')
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={respondMutation.isPending}>
                  {respondMutation.isPending
                    ? 'Enviando...'
                    : 'Enviar Resposta'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
