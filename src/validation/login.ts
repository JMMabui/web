import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'O email é obrigatório.' })
    .email({ message: 'Informe um email válido.' }),

  // password: z
  //   .string()
  //   .min(8, {
  //     message: 'A senha deve conter pelo menos 8 caracteres.',
  //   })
  //   .max(64, {
  //     message: 'A senha não pode ultrapassar 64 caracteres.',
  //   }),

  contact: z
    .string()
    .trim()
    .min(9, { message: 'O contacto deve conter pelo menos 9 dígitos.' })
    .max(15, { message: 'O contacto não pode exceder 15 dígitos.' })
    .regex(/^\d+$/, {
      message: 'O contacto deve conter apenas números.',
    }),

  jobPosition: z.enum(
    [
      'ADMIN_IT',
      'CTA_ADMIN_FINANCEIRO',
      'CTA_ADMIN_REG_ACADEMICO',
      'CTA_ADMIN_RH',
      'CTA_ADMIN_BIBLIOTECA',
      'CTA_ADMIN_COORDENADOR',
      'CTA_REG_ACADEMICO',
      'CTA_FINANCEIRO',
      'CTA_BIBLIOTECA',
      'CTA_DOCENTE',
      'CTA_RH',
      'CTA',
      'ESTUDANTE',
    ],
    {
      errorMap: () => ({ message: 'Cargo inválido selecionado.' }),
    }
  ),
})
