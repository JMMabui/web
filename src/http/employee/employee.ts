import type { employeeEducationResponse } from './employeeEducation'
import type { loginResponse } from './../signup/login'
import type { userResponse } from './../user/user'
import type { employeeBankResponse } from './employeeBank'

type employeeRequest = {
  userId: string
  employeeType:
    | 'PERMANENT'
    | 'FIXED_TERM'
    | 'UNCERTAIN_TERM'
    | 'PART_TIME'
    | 'INTERN'
    | 'APPRENTICE'
  jobTitle: string
  department: string
  dateOfHire: Date
  salary: number
  loginId: string
  status: 'ATIVO' | 'INATIVO'
}

export type employee = {
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string
  employeeType:
    | 'PERMANENT'
    | 'FIXED_TERM'
    | 'UNCERTAIN_TERM'
    | 'PART_TIME'
    | 'INTERN'
    | 'APPRENTICE'
  jobTitle: string
  department: string
  dateOfHire: Date
  salary: number
  loginId: string
  status: 'ATIVO' | 'INATIVO'
}

export type employeeExtended = {
  EmployeeBank: employeeBankResponse[]
  user: userResponse
  login: loginResponse
  EmployeeEducation: employeeEducationResponse[]
} & employee

export type employeeResponse = {
  sucess: boolean
  message: string
  data: employeeExtended[]
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function createEmployee({
  userId,
  employeeType,
  jobTitle,
  department,
  dateOfHire,
  salary,
  loginId,
  status,
}: employeeRequest): Promise<employee> {
  const response = await fetch(`${base_URL}/employee`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      employeeType,
      jobTitle,
      department,
      dateOfHire,
      salary,
      loginId,
      status,
    }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao criar o funcionário: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato employeeRequest
  return result.data
}

export async function getAllEmployees(): Promise<employeeResponse> {
  const response = await fetch(`${base_URL}/employee`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao buscar os funcionários: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato employeeRequest
  return result
}

export async function getEmployeeById(id: string): Promise<employeeResponse> {
  const response = await fetch(`${base_URL}/employee/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao buscar o funcionário: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato employeeRequest
  return result.data
}

export async function getEmployeeByLoginId(loginId: string) {
  const response = await fetch(`${base_URL}/employee/login/${loginId}`)

  if (!response.ok) {
    const ErrorMessage = await response.text()
    throw new Error(`Erro ao buscar os dados:  ${ErrorMessage}`)
  }

  const result = await response.json()

  // console.log('api receive: ', result)

  return result.data
}

export async function getEmployeeByEmail(email: string) {
  const response = await fetch(`${base_URL}/employee/email/${email}`)

  if (!response.ok) {
    const ErrorMessage = await response.text()
    throw new Error(`Erro ao buscar os dados:  ${ErrorMessage}`)
  }

  const result = await response.json()

  // console.log('api receive: ', result)

  return result.data
}

export async function updateEmployee(
  id: string,
  {
    userId,
    employeeType,
    jobTitle,
    department,
    dateOfHire,
    salary,
    loginId,
  }: employeeRequest
): Promise<employeeResponse> {
  const response = await fetch(`${base_URL}/employee/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      employeeType,
      jobTitle,
      department,
      dateOfHire,
      salary,
      loginId,
    }),
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao atualizar o funcionário: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato employeeRequest
  return result.data
}

export async function deleteEmployee(id: string): Promise<employeeResponse> {
  const response = await fetch(`${base_URL}/employee/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(`Erro ao deletar o funcionário: ${errorMessage}`)
  }

  const result = await response.json()

  // Retorna a resposta no formato employeeRequest
  return result.data
}

export function calculateAverageSalary(employees: employee[]): number {
  if (employees.length === 0) return 0
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0)
  return totalSalary / employees.length
}

export function groupEmployeesByDepartment(employees: employee[]) {
  const grouped = employees.reduce(
    (acc, emp) => {
      if (!acc[emp.department]) {
        acc[emp.department] = []
      }
      acc[emp.department].push(emp)
      return acc
    },
    {} as Record<string, employee[]>
  )

  // Ordena os departamentos por número de funcionários (desc)
  return Object.fromEntries(
    Object.entries(grouped).sort(([, a], [, b]) => b.length - a.length)
  )
}
