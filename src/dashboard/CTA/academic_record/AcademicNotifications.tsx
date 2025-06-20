import { useState } from 'react'

const initialNotifications = [
  { id: 1, mensagem: 'Prazo de matrícula termina em 5 dias.' },
  { id: 2, mensagem: 'Novo curso disponível: Engenharia de Dados.' },
]

// Componente para notificações automáticas acadêmicas
export function AcademicNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications)
  const [mensagem, setMensagem] = useState('')

  const handleAddNotification = (e: React.FormEvent) => {
    e.preventDefault()
    if (!mensagem) return
    setNotifications([
      ...notifications,
      { id: notifications.length + 1, mensagem },
    ])
    setMensagem('')
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Notificações Acadêmicas</h2>
      <form onSubmit={handleAddNotification} className="mb-4 flex gap-2">
        <input
          type="text"
          value={mensagem}
          onChange={e => setMensagem(e.target.value)}
          placeholder="Nova notificação"
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Adicionar
        </button>
      </form>
      <ul className="list-disc pl-5">
        {notifications.map(notif => (
          <li key={notif.id} className="mb-2">
            {notif.mensagem}
          </li>
        ))}
      </ul>
    </div>
  )
}
