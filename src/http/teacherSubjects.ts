import type { subjectResponse } from './subjects'
import type { teacherResponse } from './teacher'

export type teacherSubjectResponse = {
  teacher: teacherResponse
  discipline: subjectResponse
} & {
  status: 'ATIVO' | 'INATIVO'
  teacher_id: string
  disciplineId: string
  id: string
  createdAt: Date
  updatedAt: Date | null
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function getTeacherSubjectByTeacherId(
  teacher_id: string
): Promise<teacherSubjectResponse[]> {
  try {
    const response = await fetch(
      `${base_URL}/teacher_subject/teacher/${teacher_id}`
    )
    if (!response.ok) {
      // Se a resposta não for ok, captura o código de status para um erro mais detalhado
      const errorText = await response.text()
      throw new Error(`Erro ao enviar dados: ${response.status} - ${errorText}`)
    }
    const jsonResponse = await response.json()
    // console.log('Resposta da API:', jsonResponse)
    return jsonResponse as teacherSubjectResponse[]
  } catch (error) {
    console.error('Erro ao chamar a API:', error)
    throw error
  }
}
