export type SubjectsRequest = {
  codigo: string
  credits: number
  disciplineName: string
  disciplineType: 'NUCLEAR' | 'COMPLEMENTAR' // Corrigido para tipo literal
  hcs: number
  semester: 'PRIMEIRO_SEMESTRE' | 'SEGUNDO_SEMESTRE' // Corrigido para tipo literal
  year_study: 'PRIMEIRO_ANO' | 'SEGUNDO_ANO' | 'TERCEIRO_ANO' | 'QUARTO_ANO' // Corrigido para tipo literal
  courseId: string
}
export type subjectResponse = {
  codigo: string
  credits: number
  disciplineName: string
  disciplineType: 'NUCLEAR' | 'COMPLEMENTAR'
  hcs: number
  semester: 'PRIMEIRO_SEMESTRE' | 'SEGUNDO_SEMESTRE'
  year_study: 'PRIMEIRO_ANO' | 'SEGUNDO_ANO' | 'TERCEIRO_ANO' | 'QUARTO_ANO'
  courseId: string | null
  createdAt: Date
  updatedAt: Date
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function PostSubjects({
  codigo,
  disciplineName,
  disciplineType,
  year_study,
  semester,
  credits,
  courseId,
  hcs,
}: SubjectsRequest) {
  console.log(
    'Mandando para API:',
    codigo,
    disciplineName,
    disciplineType,
    year_study,
    semester,
    credits,
    courseId,
    hcs
  )
  try {
    const response = await fetch(`${base_URL}/subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        codigo,
        credits,
        disciplineName,
        disciplineType,
        hcs,
        semester,
        year_study,
        courseId,
      }),
    })

    if (!response.ok) {
      // Se a resposta não for ok, captura o código de status para um erro mais detalhado
      const errorText = await response.text()
      throw new Error(`Erro ao enviar dados: ${response.status} - ${errorText}`)
    }

    const jsonResponse = await response.json()
    console.log('Resposta da API:', jsonResponse)
    return jsonResponse
  } catch (error) {
    console.error('Erro ao chamar a API:', error)
    throw error
  }
}

export async function getSubjects(): Promise<subjectResponse[]> {
  try {
    const response = await fetch(`${base_URL}/subjects`)

    if (!response.ok) {
      throw new Error('Erro ao buscar os dados')
    }

    const data = await response.json()
    console.log('Resposta da API:', data)
    return data as subjectResponse[]
  } catch (error) {
    console.error('Erro ao buscar os dados:', error)
    throw error
  }
}

export async function checkIfCodeExists(codigo: string): Promise<boolean> {
  try {
    // Realiza a consulta na API para verificar se o código já existe
    const response = await fetch(`${base_URL}/subjects/${codigo}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })

    // Verifica se a resposta foi bem-sucedida (status 200)
    if (!response.ok) {
      throw new Error(`Erro ao verificar o código: ${response.statusText}`)
    }

    const jsonResponse = await response.json()

    // Verifica se a resposta indica que o código já existe
    if (jsonResponse.exists) {
      return true // Código já existe
    }

    return false // Código não existe
  } catch (error) {
    console.error('Erro ao verificar o código:', error)
    return false // Caso de erro, consideramos que o código não existe
  }
}
