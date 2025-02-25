const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function getTeachers() {
  const response = await fetch(`${base_URL}/teachers`)
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados')
  }
  const data = await response.json()
  console.log('Resposta da API:', data)
  return data
}
