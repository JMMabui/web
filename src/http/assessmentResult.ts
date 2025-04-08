import type { assessmentResponse } from './assessment'

export type assessmentResultRequest = {
  assessmentId: string
  studentId: string
  grade: number
}

export type assessmentResultResponse = {
  assessment: assessmentResponse
} & {
  id: string
  assessmentId: string
  studentId: string
  grade: number
  createdAt: Date
  updatedAt: Date | null
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function createAssessmentResult({
  assessmentId,
  studentId,
  grade,
}: assessmentResultRequest): Promise<assessmentResultResponse> {
  const response = await fetch(`${base_URL}/assessment-result`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      assessmentId,
      studentId,
      grade,
    }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar a avaliação: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato assessmentResponse
  return result
}

export async function getAllAssessmentsResult(): Promise<
  assessmentResultResponse[]
> {
  const response = await fetch(`${base_URL}/assessment-result`)
  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao buscar os dados: ${errorMessage}`)
  }
  const result = await response.json()
  // console.log('Resposta da API all assessment result:', result)
  return result.data as assessmentResultResponse[]
}

export async function getAssessmentResultByAssessmentId(
  id: string | null
): Promise<assessmentResultResponse[]> {
  const response = await fetch(`${base_URL}/assessment-result/assessment/${id}`)
  if (!response.ok) {
    const errorMessage = `Erro ao buscar os dados: ${response.status} - ${response.statusText}`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }
  const result = await response.json()
  console.log('Resposta da API assessment result:', result)
  const resultData = result.data
  if (!resultData || !Array.isArray(resultData)) {
    throw new Error(
      'Nenhum dado de resultado retornado ou o formato dos dados está incorreto.'
    )
  }
  return resultData as assessmentResultResponse[]
}

export async function getAssessmentResultByStudentId(
  id: string | null
): Promise<assessmentResultResponse[]> {
  const response = await fetch(`${base_URL}/assessment-result/${id}`)
  if (!response.ok) {
    const errorMessage = `Failed to fetch subjects for student with ID: ${id}. Status: ${response.status} - ${response.statusText}`
    console.error(errorMessage)
    throw new Error(errorMessage) // Lançando o erro com uma mensagem mais detalhada
  }

  const result = await response.json()
  //   console.log('Resposta da API assessment result:', result)
  const resultData = result.data
  if (!resultData || !Array.isArray(resultData)) {
    throw new Error(
      'No subjects data returned or the data format is incorrect.'
    )
  }
  return resultData as assessmentResultResponse[]
}
