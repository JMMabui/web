import type { StudentsResponse } from './students'
import type { subjectResponse } from './subjects'

export type StudentsSubjectsRequest = {
  studentId: string
  subjectIds: string[]
}

export type StudentsSubjectsResponse = {
  id: string
  studentId: string
  subjectId: string
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
  Subject: subjectResponse
  student: StudentsResponse
} & {
  studentId: string
  subjectId: string
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
  studentId,
  subjectIds, // Agora é um array de disciplineId
}: StudentsSubjectsRequest) {
  console.log('Dados enviados para a API:', {
    studentId,
    subjectIds,
  }) // Verifica os dados que estão sendo enviados
  try {
    const response = await fetch(`${base_URL}/students_subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId,
        subjectIds,
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

export async function getStudentsSubjects() {
  try {
    const response = await fetch(`${base_URL}/students_subjects`)
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados')
    }
    const result = await response.json()

    // Verifica se a resposta tem a estrutura esperada
    if (!result || typeof result !== 'object') {
      throw new Error('Resposta inválida da API')
    }

    // Verifica se a requisição foi bem sucedida
    if (!result.success) {
      console.warn('API retornou sucesso falso:', result.message)
      return [] // Retorna array vazio em caso de sucesso falso
    }

    // Verifica se os dados são um array
    if (!Array.isArray(result.data)) {
      throw new Error('Dados retornados não são um array')
    }

    console.log('Resposta da API getStudentsSubjects:', result.data)
    return result.data
  } catch (error) {
    console.error('Error fetching student subjects:', error)
    throw error
  }
}

// Interface para a estrutura padrão de resposta da API
interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  status?: number
}

// Função auxiliar para tratar erros HTTP
function handleHttpError(response: Response): never {
  const errorMessages: Record<number, string> = {
    400: 'Requisição inválida',
    401: 'Não autorizado',
    403: 'Acesso negado',
    404: 'Recurso não encontrado',
    500: 'Erro interno do servidor',
  }

  const errorMessage = errorMessages[response.status] || 'Erro desconhecido'
  throw new Error(`${errorMessage} (Status: ${response.status})`)
}

export async function getStudentsSubjectsByStudentId(
  id: string | null
): Promise<StudentsSubjectsWithExtraDataResponse[]> {
  try {
    const response = await fetch(`${base_URL}/students_subjects/${id}`)

    if (!response.ok) {
      return handleHttpError(response)
    }

    const result: ApiResponse<StudentsSubjectsWithExtraDataResponse[]> =
      await response.json()

    if (!result || typeof result !== 'object') {
      throw new Error('Resposta inválida da API')
    }

    if (!result.success) {
      console.warn(`API retornou sucesso falso: ${result.message}`)
      return []
    }

    if (!Array.isArray(result.data)) {
      throw new Error('Dados retornados não são um array')
    }

    // console.log('result.data: ', result.data)

    return result.data
  } catch (error) {
    console.error('Erro ao buscar disciplinas do estudante:', error)
    throw error
  }
}

export async function getStudentsSubjectsBySubjectId(subjectId: string | null) {
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
    const result = await response.json()

    // Exibindo os dados para depuração
    console.log('Subjects API response:', result)

    // Verificando se a resposta contém dados válidos
    if (!result || !Array.isArray(result.data)) {
      throw new Error(
        'No subjects result returned or the result format is incorrect.'
      )
    }

    return result.data
  } catch (error) {
    // Exibindo um erro geral
    console.error('Error fetching student subjects:', error)
    throw error // Re-lançando o erro para ser tratado por quem chamar a função
  }
}
