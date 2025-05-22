import dayjs from 'dayjs'
import { z } from 'zod'

export const employeeSchema = z.object({
  employeeType: z.enum(
    [
      'PERMANENT',
      'FIXED_TERM',
      'UNCERTAIN_TERM',
      'PART_TIME',
      'INTERN',
      'APPRENTICE',
    ],
    { message: 'O tipo de funcionário deve ser um dos valores permitidos.' }
  ),
  jobTitle: z.string().min(1, { message: 'O cargo não pode estar vazio.' }),
  department: z
    .string()
    .min(1, { message: 'O departamento não pode estar vazio.' }),
  dateOfHire: z
    .string()
    .refine(
      date => {
        return dayjs(date, 'YYYY-MM-DD', true).isValid()
      },
      { message: 'O formato da data de contratação deve ser YYYY-MM-DD.' }
    )
    .transform(date => {
      return dayjs(date, 'YYYY-MM-DD').toDate()
    }),
  salary: z
    .number()
    .positive({ message: 'O salário deve ser um número positivo.' }),
  // loginId: z
  //   .string()
  //   .uuid({ message: 'O ID de login deve ser um UUID válido.' }),
  status: z.enum(['ATIVO', 'INATIVO']),
})
