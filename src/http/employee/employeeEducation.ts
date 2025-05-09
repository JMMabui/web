// TypeScript code for managing employee education records
type employeeEducationRequest = {
  employeerId: string
  institutionName: string
  degree: string
  fieldOfStudy: string
  startDate: Date
  endDate: Date
}

export type employeeEducationResponse = {
  id: string
  createdAt: Date
  updatedAt: Date
  employeerId: string
  institutionName: string
  degree: string
  fieldOfStudy: string
  startDate: Date
  endDate: Date
}
// export type employeeEducationResponse = {
//   sucess: boolean
//   message: string
//   data: employeeEducation[]
// }

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function createEmployeeEducation({
  employeerId,
  institutionName,
  degree,
  fieldOfStudy,
  startDate,
  endDate,
}: employeeEducationRequest): Promise<employeeEducationResponse> {
  const response = await fetch(`${base_URL}/employee-education`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      employeerId,
      institutionName,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
    }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar a avaliação: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato employeeEducationResponse
  return result.data
}

export async function getAllEmployeeEducation(): Promise<employeeEducationResponse> {
  const response = await fetch(`${base_URL}/employee-education`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar a avaliação: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato employeeEducationResponse
  return result.data
}

export async function getEmployeeEducationById(
  employeerId: string
): Promise<employeeEducationResponse> {
  const response = await fetch(
    `${base_URL}/employee-education/${employeerId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar a avaliação: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato employeeEducationResponse
  return result.data
}

export async function updateEmployeeEducation(
  employeerId: string,
  {
    institutionName,
    degree,
    fieldOfStudy,
    startDate,
    endDate,
  }: employeeEducationRequest
): Promise<employeeEducationResponse> {
  const response = await fetch(
    `${base_URL}/employee-education/${employeerId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        institutionName,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
      }),
    }
  )

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar a avaliação: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato employeeEducationResponse
  return result.data
}

export async function deleteEmployeeEducationById(
  id: string
): Promise<employeeEducationResponse> {
  const response = await fetch(`${base_URL}/employee-education/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar a avaliação: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato employeeEducationResponse
  return result.data
}
