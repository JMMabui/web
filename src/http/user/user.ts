export type userrequest = {
  surname: string
  name: string
  gender: 'MASCULINO' | 'FEMININO'
  dateOfBirth: Date
  address: string
  maritalStatus: 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO'
  documentExpiredAt: Date
  documentIssuedAt: Date
  identificationDocument: 'BI' | 'PASSAPORTE'
  identificationNumber: string
  taxIdentificationNumber: number
}

export type userResponse = {
  id: string
  name: string
  surname: string
  gender: 'MASCULINO' | 'FEMININO'
  address: string
  dateOfBirth: Date
  documentExpiredAt: Date
  documentIssuedAt: Date
  identificationDocument: 'BI' | 'PASSAPORTE'
  identificationNumber: string
  maritalStatus: 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO'
  taxIdentificationNumber: number
}

// export type userResponse = {
//   sucess: boolean
//   message: string
//   data: user[]
// }

const base_url = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function createUser({
  surname,
  name,
  gender,
  dateOfBirth,
  address,
  maritalStatus,
  documentExpiredAt,
  documentIssuedAt,
  identificationDocument,
  identificationNumber,
  taxIdentificationNumber,
}: userrequest): Promise<userResponse> {
  const response = await fetch(`${base_url}/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      surname,
      name,
      gender,
      dateOfBirth,
      address,
      maritalStatus,
      documentExpiredAt,
      documentIssuedAt,
      identificationDocument,
      identificationNumber,
      taxIdentificationNumber,
    }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar o usuário: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato userResponse
  return result.data
}

export async function getAllUser(): Promise<userResponse> {
  const response = await fetch(`${base_url}/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar o usuário: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato userResponse
  return result.data
}

export async function getUserById(userId: string): Promise<userResponse> {
  const response = await fetch(`${base_url}/user/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar o usuário: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato userResponse
  return result.data
}

export async function updateUserById(
  {
    surname,
    name,
    gender,
    dateOfBirth,
    address,
    maritalStatus,
    documentExpiredAt,
    documentIssuedAt,
    identificationDocument,
    identificationNumber,
    taxIdentificationNumber,
  }: userrequest,
  id: string
): Promise<userResponse> {
  const response = await fetch(`${base_url}/user/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      surname,
      name,
      gender,
      dateOfBirth,
      address,
      maritalStatus,
      documentExpiredAt,
      documentIssuedAt,
      identificationDocument,
      identificationNumber,
      taxIdentificationNumber,
    }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar o usuário: ${errorMessage}`)
  }

  const result = await response.json()
  return result.data
}

export async function deleteUserById(id: string): Promise<userResponse> {
  const response = await fetch(`${base_url}/user/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar o usuário: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato userResponse
  return result.data
}
