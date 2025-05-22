import { invoiceResponse } from "./invoices"

export interface lateFeeResponse {
invoiceId: string;
    amount: number;
    daysLate: number;
    id: string;
    appliedAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

interface lateFeeRequest {
  invoiceId: string
  amount: number
  paymentMethod:
    | 'DINHEIRO'
    | 'TRANSFERENCIA'
    | 'DEPOSITO'
    | 'CARTAO_CREDITO'
    | 'CARTAO_DEBITO'
    | 'OUTROS'
  reference: string | null
  description: string | null
}

export interface lateFeeExtendedResponse extends lateFeeResponse {
  invoice: invoiceResponse
} 

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function createPayments(data: lateFeeRequest) {
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
export async function getAllLateFee() {
  try {
    const response = await fetch(`${baseURL}/late`)
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