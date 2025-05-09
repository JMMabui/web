type employeeBankRequest = {
  employeerId: string
  bankName: string
  accountNumber: string
  accountType: string
  accountHolder: string
}

export type employeeBankResponse = {
  id: string
  createdAt: Date
  updatedAt: Date
  employeeId: string
  bankName: string
  accountNumber: string
  accountType: string
  accountHolder: string
}
// export type employeeBankResponse = {
//   sucess: boolean
//   message: string
//   data: employeeBank[]
// }

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function createEmployeeBank({
  employeerId,
  bankName,
  accountNumber,
  accountType,
  accountHolder,
}: employeeBankRequest): Promise<employeeBankResponse> {
  const response = await fetch(`${base_URL}/employee-bank`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      employeerId,
      bankName,
      accountNumber,
      accountType,
      accountHolder,
    }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar a avaliação: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato employeeBankResponse
  return result.data
}

export async function getAllEmployeeBank(): Promise<employeeBankResponse> {
  const response = await fetch(`${base_URL}/employee-bank`, {
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

  // Retorna a resposta no formato employeeBankResponse
  return result.data
}

export async function getEmployeeBankById(
  employeeId: string
): Promise<employeeBankResponse> {
  const response = await fetch(`${base_URL}/employee-bank/${employeeId}`, {
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

  // Retorna a resposta no formato employeeBankResponse
  return result.data
}

export async function updateEmployeeBankById(
  employeeId: string,
  { bankName, accountNumber, accountType, accountHolder }: employeeBankRequest
): Promise<employeeBankResponse> {
  const response = await fetch(`${base_URL}/employee-bank/${employeeId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      bankName,
      accountNumber,
      accountType,
      accountHolder,
    }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar a avaliação: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato employeeBankResponse
  return result.data
}

export async function deleteEmployeeBankById(
  employeeId: string
): Promise<employeeBankResponse> {
  const response = await fetch(`${base_URL}/employee-bank/${employeeId}`, {
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

  // Retorna a resposta no formato employeeBankResponse
  return result.data
}
