import dayjs from 'dayjs'
import { z } from 'zod'

export const employeeEducationSchema = z
  .object({
    // employeeId: z
    //   .string()
    //   .uuid({ message: 'O ID do funcionário deve ser um UUID válido.' }),
    institutionName: z
      .string()
      .min(1, { message: 'O nome da instituição não pode estar vazio.' }),
    degree: z
      .string()
      .min(1, { message: 'O grau acadêmico não pode estar vazio.' }),
    fieldOfStudy: z
      .string()
      .min(1, { message: 'O campo de estudo não pode estar vazio.' }),
    startDate: z
      .string()
      .refine(
        date => {
          return dayjs(date, 'YYYY-MM-DD', true).isValid()
        },
        { message: 'A data de início deve estar no formato YYYY-MM-DD.' }
      )
      .transform(date => dayjs(date, 'YYYY-MM-DD').toDate()),
    endDate: z
      .string()
      .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
        message: 'A data de término deve estar no formato YYYY-MM-DD.',
      })
      .transform(date => dayjs(date, 'YYYY-MM-DD').toDate()),
  })
  .superRefine((data, ctx) => {
    if (data.endDate < data.startDate) {
      ctx.addIssue({
        path: ['endDate'],
        code: z.ZodIssueCode.custom,
        message: 'A data de término deve ser posterior à data de início.',
      })
    }
  })
