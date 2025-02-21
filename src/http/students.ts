const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function getStudents() {
  const response = await fetch(`${base_URL}/students`)
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados')
  }
  const result = await response.json()
  console.log('Resposta da API:', result) // Verificando o conteúdo da resposta
  return result
}

export async function getStudent(id: string | null) {
  const response = await fetch(`${base_URL}/students/${id}`)
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados')
  }
  const result = await response.json()
  //  console.log('Resposta da API:', result) // Verificando o conteúdo da resposta
  return result
}
