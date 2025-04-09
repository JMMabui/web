import type { StudentsResponse } from './students'
import type { subjectResponse } from './subjects'

export type StudentsSubjectsRequest = {
  student_id: string
  disciplineId: string
}

export type StudentsSubjectsResponse = {
  id: string
  student_id: string
  disciplineId: string
  status:
    | 'PENDENTE'
    | 'CONFIRMADO'
    | 'CANCELADO'
    | 'TRANCADO'
    | 'INSCRITO'
    | 'NAO_INSCRITO'
  result: 'APROVADO' | 'REPROVADO ' | 'EM_ANDAMENTO'
  createdAt: Date
  updatedAt: Date | null
}

export type StudentsSubjectsWithExtraDataResponse = {
  discipline: subjectResponse
  student: StudentsResponse
} & {
  student_id: string
  disciplineId: string
  result: 'APROVADO' | 'REPROVADO' | 'EM_ANDAMENTO'
  id: string
  status:
    | 'PENDENTE'
    | 'CONFIRMADO'
    | 'CANCELADO'
    | 'TRANCADO'
    | 'INSCRITO'
    | 'NAO_INSCRITO'
  createdAt: Date
  updatedAt: Date | null
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function createStudentsSubjects({
  student_id,
  disciplineIds, // Agora é um array de disciplineId
}: {
  student_id: string
  disciplineIds: string[] // Array de disciplineIds
}) {
  try {
    const response = await fetch(`${base_URL}/students_subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        student_id,
        disciplineIds, // Passando o array de disciplineId
      }),
    })

    // Verifica se a resposta não foi ok e lança um erro com o status da resposta
    if (!response.ok) {
      const errorMessage = `Erro ao enviar dados. Status: ${response.status} - ${response.statusText}`
      throw new Error(errorMessage)
    }

    const jsonResponse = await response.json()

    console.log('Resposta da API:', jsonResponse) // Verifica o que está sendo retornado

    return jsonResponse
  } catch (error: any) {
    // Caso haja um erro, loga o erro para depuração
    console.error('Erro ao criar estudante/disciplina:', error.message || error)
    // Caso queira retornar o erro, pode ser feito assim
    return {
      error: error.message || 'Erro desconhecido ao criar estudante/disciplina',
    }
  }
}

export async function getStudentsSubjects(): Promise<
  StudentsSubjectsWithExtraDataResponse[]
> {
  const response = await fetch(`${base_URL}/students_subjects`)
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados')
  }
  const data = await response.json()
  // console.log('Resposta da API:', data)
  return data as StudentsSubjectsWithExtraDataResponse[]
}

export async function getStudentsSubjectsByStudentId(
  id: string | null
): Promise<StudentsSubjectsWithExtraDataResponse[]> {
  try {
    // Verificando a URL para garantir que o endpoint está correto
    const response = await fetch(`${base_URL}/students_subjects/subject/${id}`)

    // Verificando se a resposta da API foi bem-sucedida
    if (!response.ok) {
      const errorMessage = `Failed to fetch subjects for student with ID: ${id}. Status: ${response.status} - ${response.statusText}`
      console.error(errorMessage)
      throw new Error(errorMessage) // Lançando o erro com uma mensagem mais detalhada
    }

    // Tentando obter os dados em formato JSON
    const data = await response.json()

    // Exibindo os dados para depuração
    console.log('Subjects API response:', data)

    // Verificando se a resposta contém dados válidos
    if (!data ) {
      throw new Error(
        'No subjects data returned or the data format is incorrect.'
      )
    }

    return data as StudentsSubjectsWithExtraDataResponse[] // Retorna os dados dos assuntos
  } catch (error) {
    // Exibindo um erro geral
    console.error('Error fetching student subjects:', error)
    throw error // Re-lançando o erro para ser tratado por quem chamar a função
  }
}

export async function getStudentsSubjectsBySubjectId(
  subjectId: string | null
): Promise<StudentsSubjectsWithExtraDataResponse[]> {
  try {
    // Verificando a URL para garantir que o endpoint está correto
    const response = await fetch(
      `${base_URL}/students_subjects/subject/${subjectId}`
    )

    // Verificando se a resposta da API foi bem-sucedida
    if (!response.ok) {
      const errorMessage = `Failed to fetch subjects for student with ID: ${subjectId}. Status: ${response.status} - ${response.statusText}`
      console.error(errorMessage)
      throw new Error(errorMessage) // Lançando o erro com uma mensagem mais detalhada
    }

    // Tentando obter os dados em formato JSON
    const data = await response.json()

    // Exibindo os dados para depuração
    // console.log('Subjects API response:', data)

    // Verificando se a resposta contém dados válidos
    if (!data || !Array.isArray(data)) {
      throw new Error(
        'No subjects data returned or the data format is incorrect.'
      )
    }

    return data as StudentsSubjectsWithExtraDataResponse[] // Retorna os dados dos assuntos
  } catch (error) {
    // Exibindo um erro geral
    console.error('Error fetching student subjects:', error)
    throw error // Re-lançando o erro para ser tratado por quem chamar a função
  }
}
