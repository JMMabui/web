type dataSchema = {
  id: string
  surname: string
  name: string
  Registration: {
    course: {
      courseName: string
      levelCourse:
        | 'CURTA_DURACAO'
        | 'TECNICO_MEDIO'
        | 'LICENCIATURA'
        | 'MESTRADO'
        | 'RELIGIOSO'
      period: 'LABORAL' | 'POS_LABORAL'
    }
  }[]
}

export async function getStudentData(): Promise<dataSchema> {
  const response = await fetch('http://localhost:3333/students-course/:id')
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados')
  }
  const data = await response.json()
  console.log('Resposta da API:', data)

  return data.student
}
