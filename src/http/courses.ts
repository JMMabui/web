export type CourseRequest = {
  courseName: string
  courseDescription: string
  courseDuration: number
  levelCourse:
    | 'CURTA_DURACAO'
    | 'TECNICO_MEDIO'
    | 'LICENCIATURA'
    | 'MESTRADO'
    | 'RELIGIOSO'
  period: 'LABORAL' | 'POS_LABORAL'
  totalVacancies: number
  availableVacancies: number
}

export type CourseResponse = {
  id: string
  createdAt: Date
  updatedAt: Date
  courseName: string
  courseDescription: string | null
  courseDuration: number
  levelCourse:
    | 'CURTA_DURACAO'
    | 'TECNICO_MEDIO'
    | 'LICENCIATURA'
    | 'MESTRADO'
    | 'RELIGIOSO'
  period: 'LABORAL' | 'POS_LABORAL'
  totalVacancies: number
  availableVacancies: number | null
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function getCourses() {
  const response = await fetch(`${base_URL}/course`)
  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao buscar os dados: ${errorMessage}`)
  }
  const result = await response.json()
  // console.log('Resposta da API:', result)
  return result
}

export async function addCourse(course: CourseRequest) {
  const response = await fetch(`${base_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(course),
  })
  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao adicionar o curso: ${errorMessage}`)
  }
  const result = await response.json()
  // console.log('Resposta da API:', result)
  return result
}
