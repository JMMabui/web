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

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function getInvoicesByStudentId(studentId: string) {
  try {
    const response = await fetch(`${baseURL}/invoice/student/${studentId}`)
    const result = await response.json()

    return result.data
  } catch (error) {
    console.error('Erro ao buscar faturas:', error)
    throw error
  }
}

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

    return result
  } catch (error) {
    console.error('Erro ao criar fatura:', error)
    throw error
  }
}

export async function getInvoiceById(invoiceId: string) {
  try {
    const response = await fetch(`${baseURL}/invoices/${invoiceId}`)
    const result = await response.json()

    return result
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
