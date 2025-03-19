import type { RegistrationResponse } from '../registration'

type StudentData = {
  id: string
  surname: string
  name: string
  Registration: RegistrationResponse[]
}

// Usando o tipo na função
const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function getStudentData(id: string | null): Promise<StudentData> {
  if (!id) {
    throw new Error('ID do estudante não pode ser nulo')
  }

  const response = await fetch(`${base_URL}/student-course/${id}`)

  // Verificando a resposta da API
  if (!response.ok) {
    throw new Error(`Erro ao buscar os dados: ${response.statusText}`)
  }

  const data = await response.json()
  // console.log('Resposta da API:', data)

  // Verificando a estrutura da resposta
  if (data?.student) {
    return data.student // Retornando o dado conforme esperado
  } else {
    throw new Error('Estrutura inesperada na resposta da API')
  }
}
