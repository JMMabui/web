import type { subjectResponse } from './subjects'

export type assessmentResponse = {
  subject: subjectResponse
} & {
  name: string
  type: string
  dateApplied: Date
  subjectId: string
  id: string
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

export async function getAllAssessmentsResult() {
  const response = await fetch(`${base_URL}/assessment-result`)
  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao buscar os dados: ${errorMessage}`)
  }
  const result = await response.json()
  //   console.log('Resposta da API all assessment result:', result)
  return result
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
