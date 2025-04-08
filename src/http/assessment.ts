import type { subjectResponse } from './subjects'

export type assessmentResponse = {
  subject: subjectResponse
  AssessmentResult: assessmentResponse[]
} & {
  name: string
  type: string
  dateApplied: Date
  subjectId: string
  weight: number | null
  id: string
}

export type assessmentRequest = {
  name: string
  type:
    | 'TESTE_INDIVIDUAL'
    | 'TESTE_GRUPO'
    | 'TRABALHO_INDIVIDUAL'
    | 'TRABALHO_GRUPO'
    | 'EXAME_NORMAL'
    | 'EXAME_RECORRENCIA'
    | 'EXAME_ESPECIAL'
  dateApplied: Date
  weight: number
  subjectId: string // ID da disciplina, presumo que seja uma string
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function createAssessment({
  name,
  type,
  dateApplied,
  weight,
  subjectId,
}: assessmentRequest): Promise<assessmentResponse> {
  const response = await fetch(`${base_URL}/assessment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      type,
      dateApplied,
      weight,
      subjectId,
    }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar a avaliação: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato assessmentResponse
  return result.data
}

// export async function createExame({
//   name,
//   type,
//   dateApplied,
//   subjectId,
// }: assessmentRequest) {
//   const response = await fetch(`${base_URL}/assessment`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       name,
//       type,
//       dateApplied,
//       weight: 100,
//       subjectId,
//     }),
//   })

//   if (!response.ok) {
//     const errorMessage = await response.text()
//     throw new Error(`Erro ao criar a avaliação: ${errorMessage}`)
//   }

//   const result = await response.json()

//   // Retorna a resposta no formato assessmentResponse
//   return result.data
// }

export async function getAssessments(): Promise<assessmentResponse[]> {
  const response = await fetch(`${base_URL}/assessment`)
  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao buscar os dados: ${errorMessage}`)
  }
  const result = await response.json()
  //   console.log('Resposta da API assessment:', result)
  return result.data
}

export async function getAssessmentById(
  id: string
): Promise<assessmentResponse[]> {
  const response = await fetch(`${base_URL}/assessment/${id}`)
  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao buscar os dados: ${errorMessage}`)
  }

  const result = await response.json()

  // console.log('Resposta da Api: ', result)
  return result.data.data
}

export async function getAssessmentsBySubjectId(
  subjectId: string
): Promise<assessmentResponse[]> {
  const response = await fetch(`${base_URL}/assessment/subject/${subjectId}`)
  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao buscar os dados: ${errorMessage}`)
  }

  const result = await response.json()

  // console.log('Resposta da Api: ', result)
  return result.data as assessmentResponse[]
}

export async function updateAssessment(
  id: string,
  { name, type, dateApplied, weight, subjectId }: assessmentRequest
): Promise<assessmentResponse> {
  const response = await fetch(`${base_URL}/assessment/${id}`, {
    method: 'PUT', // Usando o método PUT para atualização
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      type,
      dateApplied,
      weight,
      subjectId,
    }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao atualizar a avaliação: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato assessmentResponse
  return result.data
}

export async function deleteAssessment(id: string) {
  try {
    // URL da API para excluir uma avaliação
    const response = await fetch(`${base_URL}/assessment/${id}`, {
      method: 'DELETE', // Método HTTP para excluir
      headers: {
        // 'Content-Type': 'application/json', // Define o tipo de conteúdo da requisição
      },
    })

    // Verifica se a resposta foi bem-sucedida (status 2xx)
    if (!response.ok) {
      // Caso o código de status seja diferente de 2xx, lançamos um erro
      const errorData = await response.json()
      // Se houver uma mensagem de erro no corpo da resposta, mostramos
      throw new Error(
        errorData?.message ||
          `Erro ao excluir a avaliação: ${response.statusText}`
      )
    }

    // Se a requisição for bem-sucedida, retornamos a resposta JSON
    const data = await response.json()
    return data
  } catch (error: any) {
    // Erros conhecidos, como problemas de rede
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      // Erro de rede (conexão perdida, servidor inatingível, etc)
      throw new Error(
        'Erro de conexão com o servidor. Tente novamente mais tarde.'
      )
    }

    // Erros de resposta da API (status diferente de 2xx)
    if (error instanceof Error) {
      throw new Error(error.message)
    }

    // Qualquer outro erro inesperado
    throw new Error('Erro desconhecido ao tentar excluir a avaliação.')
  }
}
