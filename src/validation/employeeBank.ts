import { z } from 'zod'

export const employeeBankSchema = z.object({
  // employeerId: z
  //   .string()
  //   .uuid({ message: 'O ID do funcionário deve ser um UUID válido.' }),
  bankName: z
    .string()
    .min(1, { message: 'O nome do banco não pode estar vazio.' }),
  accountNumber: z
    .string()
    .regex(/^\d+$/, {
      message: 'O número da conta deve conter apenas dígitos.',
    })
    .min(5, { message: 'O número da conta deve ter pelo menos 5 dígitos.' }),
  accountType: z
    .string()
    .min(1, { message: 'O tipo de conta não pode estar vazio.' }),
  accountHolder: z
    .string()
    .min(1, { message: 'O titular da conta não pode estar vazio.' }),
})
