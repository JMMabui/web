import { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Trash2, MessageSquare } from 'lucide-react'
import { format } from 'date-fns'

interface Message {
  id: string
  senderId: string
  senderName: string
  receiverId: string
  receiverName: string
  subject: string
  content: string
  date: string
  read: boolean
}

interface Announcement {
  id: string
  title: string
  content: string
  date: string
  disciplineId: string
  authorId: string
  authorName: string
}

export function Communication() {
  const queryClient = useQueryClient()
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [showMessageModal, setShowMessageModal] = useState(false)
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'messages' | 'announcements'>(
    'messages'
  )
  const [newMessage, setNewMessage] = useState<Partial<Message>>({
    subject: '',
    content: '',
    receiverId: '',
  })
  const [newAnnouncement, setNewAnnouncement] = useState<Partial<Announcement>>(
    {
      title: '',
      content: '',
    }
  )

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

  // Fetch messages
  const { data: messages } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const response = await api.get('/messages')
      return response.json()
    },
  })

  // Fetch announcements
  const { data: announcements } = useQuery({
    queryKey: ['announcements', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const response = await api.get(
        `/announcements?disciplineId=${selectedDiscipline}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: Partial<Message>) => {
      await api.post('/messages', message)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      setShowMessageModal(false)
      setNewMessage({
        subject: '',
        content: '',
        receiverId: '',
      })
      alert('Mensagem enviada com sucesso.')
    },
  })

  // Create announcement mutation
  const createAnnouncementMutation = useMutation({
    mutationFn: async (announcement: Partial<Announcement>) => {
      await api.post('/announcements', {
        ...announcement,
        disciplineId: selectedDiscipline,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      setShowAnnouncementModal(false)
      setNewAnnouncement({
        title: '',
        content: '',
      })
      alert('Aviso criado com sucesso.')
    },
  })

  // Delete message mutation
  const deleteMessageMutation = useMutation({
    mutationFn: async (messageId: string) => {
      await api.delete(`/messages/${messageId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      alert('Mensagem removida com sucesso.')
    },
  })

  // Delete announcement mutation
  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (announcementId: string) => {
      await api.delete(`/announcements/${announcementId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] })
      alert('Aviso removido com sucesso.')
    },
  })

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessageMutation.mutate(newMessage)
  }

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault()
    createAnnouncementMutation.mutate(newAnnouncement)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Comunicação</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowMessageModal(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Nova Mensagem
          </Button>
          <Button onClick={() => setShowAnnouncementModal(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Novo Aviso
          </Button>
        </div>
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
            Visão geral da comunicação
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-gray-600">Mensagens</p>
              <p className="text-2xl font-bold">{messages?.length || 0}</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-lg">
              <p className="text-sm text-gray-600">Avisos</p>
              <p className="text-2xl font-bold">{announcements?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Button
            variant={selectedTab === 'messages' ? 'primary' : 'outline'}
            onClick={() => setSelectedTab('messages')}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Mensagens
          </Button>
          <Button
            variant={selectedTab === 'announcements' ? 'primary' : 'outline'}
            onClick={() => setSelectedTab('announcements')}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Avisos
          </Button>
        </div>

        {selectedTab === 'messages' && (
          <div className="space-y-4">
            {messages?.map((message: Message) => (
              <div
                key={message.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{message.subject}</h3>
                    <p className="text-sm text-gray-600">
                      De: {message.senderName} para: {message.receiverName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteMessageMutation.mutate(message.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {format(
                      new Date(message.date),
                      "dd 'de' MMMM 'de' yyyy 'às' HH:mm"
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedTab === 'announcements' && (
          <div className="space-y-4">
            {announcements?.map((announcement: Announcement) => (
              <div
                key={announcement.id}
                className="bg-white rounded-lg shadow-md p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Por: {announcement.authorName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        deleteAnnouncementMutation.mutate(announcement.id)
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remover
                    </Button>
                  </div>
                </div>
                <div>
                  <p className="whitespace-pre-wrap">{announcement.content}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {format(
                      new Date(announcement.date),
                      "dd 'de' MMMM 'de' yyyy 'às' HH:mm"
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Nova Mensagem</h3>
            <p className="text-sm text-gray-600 mb-4">
              Envie uma mensagem para um aluno
            </p>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Destinatário</label>
                <select
                  value={newMessage.receiverId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setNewMessage(prev => ({
                      ...prev,
                      receiverId: e.target.value,
                    }))
                  }
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Selecione o destinatário</option>
                  {students?.map((student: any) => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Assunto</label>
                <Input
                  value={newMessage.subject}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewMessage(prev => ({
                      ...prev,
                      subject: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Mensagem</label>
                <textarea
                  value={newMessage.content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewMessage(prev => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowMessageModal(false)
                    setNewMessage({
                      subject: '',
                      content: '',
                      receiverId: '',
                    })
                  }}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={sendMessageMutation.isPending}>
                  {sendMessageMutation.isPending ? 'Enviando...' : 'Enviar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAnnouncementModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Novo Aviso</h3>
            <p className="text-sm text-gray-600 mb-4">
              Crie um aviso para a turma
            </p>
            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  value={newAnnouncement.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewAnnouncement(prev => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Conteúdo</label>
                <textarea
                  value={newAnnouncement.content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewAnnouncement(prev => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded-md"
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAnnouncementModal(false)
                    setNewAnnouncement({
                      title: '',
                      content: '',
                    })
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={createAnnouncementMutation.isPending}
                >
                  {createAnnouncementMutation.isPending
                    ? 'Criando...'
                    : 'Criar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
