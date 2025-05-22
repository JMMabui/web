import dayjs from 'dayjs'
import { z } from 'zod'

export const paymentSchema = z.object({
  invoiceId: z.string().uuid({ message: 'ID da fatura inválido.' }),
  amount: z
    .number()
    .min(0, { message: 'O valor deve ser maior ou igual a 0.' }),

  paymentMethod: z.enum(
    [
      'DINHEIRO',
      'TRANSFERENCIA',
      'DEPOSITO',
      'CARTAO_CREDITO',
      'CARTAO_DEBITO',
      'OUTROS',
    ],
    {
      errorMap: () => ({ message: 'Método de pagamento inválido.' }),
    }
  ),
  paymentDate: z
    .string()
    .refine(
      date => dayjs(date, 'DD/MM/YYYY', true).isValid(), // Verifica se a data está no formato correto
      { message: 'A data de pagamento deve estar no formato DD/MM/YYYY.' }
    )
    .transform(date => dayjs(date, 'DD/MM/YYYY').toDate()), // Transforma a data para um objeto Date

  reference: z
    .string()
    .max(255, { message: 'A referência deve ter no máximo 255 caracteres.' })
    .optional(),
  description: z
    .string()
    .max(255, { message: 'A descrição deve ter no máximo 255 caracteres.' })
    .optional(),
})
