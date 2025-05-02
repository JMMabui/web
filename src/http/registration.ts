import type { CourseResponse } from './courses'
import type { StudentsResponse } from './students'
export type RegistrationRequest = {
  course_id: string
  student_id: string
}

export type RegistrationResponse = {
  course_id: string
  student_id: string
  id: string
  registrationStatus:
    | 'PENDENTE'
    | 'CONFIRMADO'
    | 'CANCELADO'
    | 'TRANCADO'
    | 'INSCRITO'
    | 'NAO_INSCRITO'
  student: StudentsResponse
  course: CourseResponse

  createdAt: Date
  updatedAt: Date | null
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function getRegistration() {
  try {
    const response = await fetch(`${base_URL}/registration`)
    if (!response.ok) {
      throw new Error('Erro ao buscar os dados')
    }
    const data = await response.json()
    console.log('Resposta da API para registration:', data)
    return data.data
  } catch (error) {
    console.error('Error fetching registration data:', error)
    throw error
  }
}

export async function postRegistration({
  course_id,
  student_id,
}: RegistrationRequest) {
  const response = await fetch(`${base_URL}/registration-status-confirmation`, {
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

export async function getRegistrationByid(id: string) {
  const response = await fetch(`${base_URL}/registration/${id}`)
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados')
  }
  const data = await response.json()
  console.log('Resposta da API:', data)
  return data
}

export async function validateRegistration(student_id: string) {
  const response = await fetch(
    `${base_URL}/registration-status/${student_id}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        registrationStatus: 'CONFIRMADO', // Enviar o status "CONFIRMADO"
      }),
    }
  )
  if (!response.ok) {
    throw new Error('Erro ao enviar dados')
  }
  const jsonResponse = await response.json()
  console.log('Resposta da API:', jsonResponse) // Verifique o que está sendo retornado
  return jsonResponse
}

export async function AddEnrollment({
  course_id,
  student_id,
}: RegistrationRequest) {
  const response = await fetch(`${base_URL}/registration`, {
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
