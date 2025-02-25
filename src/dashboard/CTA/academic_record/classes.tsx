import React, { useState } from 'react'

export function Classes() {
  const [classes, setClasses] = useState<{ id: number; name: string }[]>([])
  const [newClass, setNewClass] = useState('')

  // Função para adicionar uma nova turma
  const addClass = () => {
    if (newClass.trim()) {
      setClasses([...classes, { id: Date.now(), name: newClass }])
      setNewClass('')
    }
  }

  // Função para remover uma turma
  const removeClass = (id: number) => {
    setClasses(classes.filter(c => c.id !== id))
  }

  // Função para editar uma turma
  const editClass = (id: number, newName: string) => {
    setClasses(classes.map(c => (c.id === id ? { ...c, name: newName } : c)))
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Gestão de Turmas</h1>

      {/* Formulário para adicionar uma nova turma */}
      <div className="flex mb-6">
        <input
          type="text"
          value={newClass}
          onChange={e => setNewClass(e.target.value)}
          placeholder="Nome da nova turma"
          className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={addClass}
          className="bg-indigo-500 text-white p-3 rounded-r-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Adicionar Turma
        </button>
      </div>

      {/* Lista de turmas */}
      <ul className="space-y-4">
        {classes.map(classItem => (
          <li
            key={classItem.id}
            className="flex justify-between items-center p-4 border border-gray-300 rounded-md shadow-sm"
          >
            <span className="text-lg">{classItem.name}</span>
            <div className="space-x-2">
              <button
                type="button"
                onClick={() => removeClass(classItem.id)}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Remover
              </button>
              <button
                type="button"
                onClick={() => {
                  const newName = prompt(
                    'Novo nome para a turma',
                    classItem.name
                  )
                  if (newName) editClass(classItem.id, newName)
                }}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Editar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
