import { useState } from 'react'

export function Notifications() {
  const [notifications] = useState([
    { id: 1, message: 'Nova avaliação criada' },
    { id: 2, message: 'Notas atualizadas' },
  ])

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4">
      <h3 className="font-semibold mb-2">Notificações</h3>
      <div className="space-y-2">
        {notifications.map(notification => (
          <div key={notification.id} className="p-2 hover:bg-gray-100 rounded">
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  )
}
