import type { invoice } from './invoices'

export type invoiceHistoryResponse = {
  id: string
  invoiceId: string
  status: 'PENDENTE' | 'PAGO' | ' ATRASADO' | 'CANCELADO' | 'PARCIALMENTE_PAGO'
  description: string
  createdAt: Date
  createdBy: string
}

export type invoiceHistoryExtendedResponse = {
  invoice: invoice
} & invoiceHistoryResponse

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function getAllInvoiceHistory() {
  try {
    const response = await fetch(`${baseURL}/invoice-}`)
    const result = await response.json()

    return result.data
  } catch (error) {
    console.error('Erro ao buscar faturas:', error)
    throw error
  }
}
