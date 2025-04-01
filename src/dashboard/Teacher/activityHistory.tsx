// src/components/ActivityHistory.jsx
import React from 'react'

export function ActivityHistory() {
  const atividades = [
    { nome: 'Avaliação 1', data: '2025-03-15', status: 'Concluída' },
    { nome: 'Avaliação 2', data: '2025-03-20', status: 'Em andamento' },
  ]

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-4">
          Histórico de Atividades
        </h2>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Nome da Atividade</th>
              <th className="px-4 py-2 border">Data</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {atividades.map((atividade, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{atividade.nome}</td>
                <td className="px-4 py-2 border">{atividade.data}</td>
                <td className="px-4 py-2 border">{atividade.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
