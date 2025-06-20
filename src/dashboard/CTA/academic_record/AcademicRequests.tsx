import { useState } from 'react'

const initialRequests = [
  { id: 1, tipo: 'Segunda Via', status: 'Pendente' },
  { id: 2, tipo: 'Trancamento', status: 'Aprovado' },
]

// Componente para gestão de solicitações acadêmicas
export function AcademicRequests() {
  const [requests, setRequests] = useState(initialRequests)
  const [tipo, setTipo] = useState('')

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tipo) return
    setRequests([
      ...requests,
      { id: requests.length + 1, tipo, status: 'Pendente' },
    ])
    setTipo('')
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Solicitações Acadêmicas</h2>
      <form onSubmit={handleAddRequest} className="mb-4 flex gap-2">
        <input
          type="text"
          value={tipo}
          onChange={e => setTipo(e.target.value)}
          placeholder="Tipo de solicitação"
          className="border rounded px-3 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Adicionar
        </button>
      </form>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Tipo</th>
            <th className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {requests.map(req => (
            <tr key={req.id}>
              <td className="border px-2 py-1">{req.id}</td>
              <td className="border px-2 py-1">{req.tipo}</td>
              <td className="border px-2 py-1">{req.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
