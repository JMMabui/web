export type teacherData = {
  id: string
  surname: string
  name: string
  email: string
  contact: string
  teacherType: 'DOCENTE' | 'COORDENADOR' | 'AUXILIAR'
  statusTeacher: 'ATIVO' | 'INATIVO'
  loginId: string | null
}
export type teacherResponse = {
  success: boolean
  message: string
  data: teacherData[]
}
const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function getTeachers() {
  const response = await fetch(`${base_URL}/teachers`)
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados')
  }
  const data = await response.json()
  console.log('Resposta da API:', data)
  return data.map((item: any) => ({
    ...item,
    success: item.sucess,
  }))
}

export async function getTeacherByEmail(email: string) {
  if (!email) {
    throw new Error('Email inválido')
  }
  const response = await fetch(`${base_URL}/teacher/email/${email}`)
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados')
  }
  const data = await response.json()
  // console.log('Resposta da API:', data)
  return data.data
}
