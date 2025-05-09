import dayjs from 'dayjs'
import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  surname: z.string().min(1, { message: 'Apelido é obrigatório' }),
  dateOfBirth: z
    .string()
    .refine(
      date => {
        return dayjs(date, 'YYYY-MM-DD', true).isValid()
      },
      { message: 'Invalid date format for document issued date' }
    )
    .transform(date => {
      return dayjs(date, 'YYYY-MM-DD').toDate()
    }),
  gender: z.enum(['MASCULINO', 'FEMININO'], {
    errorMap: () => ({ message: 'Selecione um gênero' }),
  }),
  identificationDocument: z.enum(['BI', 'PASSAPORTE'], {
    message: 'Selecione tipo de documento',
  }),
  identificationNumber: z
    .string()
    .min(1, { message: 'Número do documento é obrigatório' }),

  documentIssuedAt: z
    .string()
    .refine(
      date => {
        return dayjs(date, 'YYYY-MM-DD', true).isValid()
      },
      { message: 'Invalid date format for document issued date' }
    )
    .transform(date => {
      return dayjs(date, 'YYYY-MM-DD').toDate()
    }),
  documentExpiredAt: z
    .string()
    .refine(
      date => {
        return dayjs(date, 'YYYY-MM-DD', true).isValid()
      },
      { message: 'Invalid date format for document issued date' }
    )
    .transform(date => {
      return dayjs(date, 'YYYY-MM-DD').toDate()
    }),
  taxIdentificationNumber: z
    .string()
    .length(9, { message: 'NUIT deve ter exatamente 9 dígitos' }),
  maritalStatus: z.enum(['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO'], {
    errorMap: () => ({ message: 'Selecione um estado civil' }),
  }),
  address: z.string().min(1, { message: 'Endereço é obrigatório' }),
})
