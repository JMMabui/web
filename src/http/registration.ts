type dataSchema = {
  course_id: string
  student_id: string
}
export async function getRegistration() {
  const response = await fetch('http://localhost:3333/registration')
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados')
  }
  const data = await response.json()
  console.log('Resposta da API:', data)
  return data
}

export async function postRegistration({ course_id, student_id }: dataSchema) {
  const response = await fetch('http://localhost:3333/registration', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      course_id,
      student_id,
    }),
  })
  if (!response.ok) {
    throw new Error('Erro ao enviar dados')
  }
  const jsonResponse = await response.json()
  console.log('Resposta da API:', jsonResponse) // Verifique o que está sendo retornado
  // const studentId = jsonResponse.student.id
  // console.log('ID do estudante:', studentId) // Aqui você tem o id

  return jsonResponse
}
