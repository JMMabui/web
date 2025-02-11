// type dataSchema = {
//   course_id: string
//   student_id: string
//   id: string
//   registrationStatus:
//     | 'PENDENTE'
//     | 'CONFIRMADO'
//     | 'CANCELADO'
//     | 'TRANCADO'
//     | 'INSCRITO'
//     | 'NAO_INSCRITO'
//   createdAt: Date
//   updatedAt: Date | null
// }
export async function getRegistration() {
  const response = await fetch('http://localhost:3333/registration')
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados')
  }
  const data = await response.json()
  console.log('Resposta da API:', data)
  return data
}
