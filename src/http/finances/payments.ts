import type { invoiceResponse } from './invoices'

export interface paymentsResponse {
  amount: number
  id: string
  createdAt: Date
  updatedAt: Date
  invoiceId: string
  paymentMethod:
    | 'DINHEIRO'
    | 'TRANSFERENCIA'
    | 'DEPOSITO'
    | 'CARTAO_CREDITO'
    | 'CARTAO_DEBITO'
    | 'OUTROS'
  paymentDate: Date
  reference: string | null
  description: string | null
}

export interface paymentsRequest {
  invoiceId: string
  amount: number
  paymentMethod:
    | 'DINHEIRO'
    | 'TRANSFERENCIA'
    | 'DEPOSITO'
    | 'CARTAO_CREDITO'
    | 'CARTAO_DEBITO'
    | 'OUTROS'
  paymentDate: Date
  reference: string | null
  description: string | null
}

export interface paymentsExtendedResponse extends paymentsResponse {
  invoice: invoiceResponse
}

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function createPayments(data: paymentsRequest) {
  console.log('sending to api:', data)
  try {
    const response = await fetch(`${baseURL}/payment`, {
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

export async function getAllPayments() {
  try {
    const response = await fetch(`${baseURL}/payments`)
    const result = await response.json()

    if (!response.ok) {
      const errorMessage = await response.text()
      throw new Error(`Erro ao buscar os dados: ${errorMessage}`)
    }

    // console.log('api service: ', result)
    return result.data
  } catch (error) {
    console.error('Erro ao buscar faturas:', error)
    throw error
  }
}

// export interface CreatePaymentDTO {
//   invoiceId: string
//   amount: number
//   paymentDate: string
//   method:
//     | 'DINHEIRO'
//     | 'CARTAO_CREDITO'
//     | 'CARTAO_DEBITO'
//     | 'TRANSFERENCIA'
//     | 'DEPOSITO'
//     | 'OUTROS'
//   reference?: string
//   attachmentUrl?: string
// }

// export interface Payment {
//   id: string
//   invoiceId: string
//   amount: number
//   paymentDate: string
//   method: string
//   reference?: string
//   attachmentUrl?: string
//   createdAt: string
//   updatedAt: string
//   status: 'PENDING' | 'CONFIRMED' | 'FAILED'
// }

// export async function createPayment(data: CreatePaymentDTO): Promise<Payment> {
//   const response = await api.post<Payment>('/payments', data)
//   return response.data
// }

// export async function uploadAttachment(file: File): Promise<string> {
//   const formData = new FormData()
//   formData.append('file', file)

//   const response = await api.post<{ url: string }>('/uploads', formData, {
//     headers: {
//       'Content-Type': 'multipart/form-data',
//     },
//   })

//   return response.data.url
// }

// export async function getPaymentsByInvoiceId(
//   invoiceId: string
// ): Promise<Payment[]> {
//   const response = await api.get<Payment[]>(`/payments/invoice/${invoiceId}`)
//   return response.data
// }
