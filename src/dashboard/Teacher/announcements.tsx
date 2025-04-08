// src/components/Announcements.jsx

import { useState } from 'react'

export function Announcements() {
  const [comunicados, setComunicados] = useState([
    {
      titulo: 'Reunião de Pais',
      data: '2025-03-22',
      conteudo: 'Não percam a reunião de pais.',
    },
    {
      titulo: 'Entrega de Avaliações',
      data: '2025-03-25',
      conteudo: 'Entregar as avaliações até sexta-feira.',
    },
  ])

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-4">Comunicados</h2>
        <div className="space-y-4">
          {comunicados.map((comunicado, index) => (
            <div key={index} className="bg-green-100 p-4 rounded-md shadow-md">
              <h3 className="text-lg font-semibold">{comunicado.titulo}</h3>
              <p>{comunicado.conteudo}</p>
              <p className="text-sm text-gray-500">{comunicado.data}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
