// src/components/Perfil.jsx
import { useState } from 'react'

export function Perfil() {
  const [nome, setNome] = useState('Professor Fulano')
  const [email, setEmail] = useState('professor@exemplo.com')

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Lógica de salvar as mudanças
    console.log('Dados atualizados!')
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-4">Meu Perfil</h2>
        <form onSubmit={handleSave}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          >
            Salvar alterações
          </button>
        </form>
      </div>
    </div>
  )
}
