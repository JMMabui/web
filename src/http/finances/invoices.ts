import type { paymentsResponse } from './payments'
import type { CourseResponse } from './../courses'
import type { StudentsResponse } from './../students'
import type { lateFeeResponse } from './lateFee'
// export interface Invoice {
//   id: string
//   month: string
//   date: string
//   status: string
//   amount: number
//   dueDate: string
// }

export interface CreateInvoiceRequest {
  studentId: string
  courseId: string | null
  months: string[]
  dueDate: string
  type: 'MENSALIDADE' | 'MATRICULA' | 'PROPINA' | 'MATERIAL' | 'OUTROS'
  // amount: number
}

export interface invoiceResponse {
  id: string
  studentId: string
  courseId: string
  type: 'MENSALIDADE' | 'MATRICULA' | 'PROPINA' | 'MATERIAL' | 'OUTROS'
  amount: number
  dueDate: Date
  month:
    | 'JANEIRO'
    | 'FEVEREIRO'
    | 'MARCO'
    | 'ABRIL'
    | 'MAIO'
    | 'JUNHO'
    | 'JULHO'
    | 'AGOSTO'
    | 'SETEMBRO'
    | 'OUTUBRO'
    | 'NOVEMBRO'
    | 'DEZEMBRO'
  year: number
  cancelledAt: Date | null
  cancelledBy: string | null
  cancellationReason: string | null
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO' | 'PARCIALMENTE_PAGO'
  createdAt: Date
  updatedAt: Date
}

export interface invoiceExtendedResponse extends invoiceResponse {
  student: StudentsResponse
  course: CourseResponse
  payments: paymentsResponse[]
  LateFee: lateFeeResponse[]
}

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function createInvoice(data: CreateInvoiceRequest) {
  console.log('sending to api:', data)
  try {
    const response = await fetch(`${baseURL}/invoice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    const result = await response.json()

    console.log('result:', result)
    if (!response.ok) {
      throw new Error('Erro ao criar fatura')
    }

    return result.data
  } catch (error) {
    console.error('Erro ao criar fatura:', error)
    throw error
  }
}

export async function getAllInvoice() {
  try {
    const response = await fetch(`${baseURL}/invoice`)
    const result = await response.json()

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(`Erro ao buscar os dados: ${errorMessage}`)
    }

    console.log('api service: ', result)
    return result.data
  } catch (error) {
    console.error('Erro ao buscar faturas:', error)
    throw error
  }
}

export async function getInvoicesByStudentId(studentId: string) {
  try {
    const response = await fetch(`${baseURL}/invoice/student/${studentId}`)

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(`Erro ao buscar os dados: ${errorMessage}`)
    }

    const result = await response.json()
    console.log('api service: ', result)
    return result.data
  } catch (error) {
    console.error('Erro ao buscar faturas:', error)
    throw error
  }
}

export async function getInvoiceById(invoiceId: string) {
  try {
    const response = await fetch(`${baseURL}/invoice/${invoiceId}`)

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(`Erro ao buscar os dados: ${errorMessage}`)
    }

    const result = await response.json()
    console.log('api service: ', result)
    if (!result) {
      throw new Error('Fatura não encontrada')
    }

    return result.data
  } catch (error) {
    console.error('Erro ao buscar fatura por ID:', error)
    throw error
  }
}
export async function updateInvoiceStatus(invoiceId: string, status: string) {
  try {
    const response = await fetch(`${baseURL}/invoices/${invoiceId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    })
    const result = await response.json()

    return result
  } catch (error) {
    console.error('Erro ao atualizar status da fatura:', error)
    throw error
  }
}
