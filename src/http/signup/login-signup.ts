export type SignupSchema = {
  email: string
  password: string
  contact: string
  jobPosition?: string
}

type login = {
  id: string
  email: string
  contact: string
  password: string
  jobPosition:
    | 'ADMIN_IT'
    | 'CTA_ADMIN_FINANCEIRO'
    | 'CTA_ADMIN_REG_ACADEMICO'
    | 'CTA_ADMIN_RH'
    | 'CTA_ADMIN_BIBLIOTECA'
    | 'CTA_ADMIN_COORDENADOR'
    | 'CTA_REG_ACADEMICO'
    | 'CTA_FINANCEIRO'
    | 'CTA_BIBLIOTECA'
    | 'CTA_DOCENTE'
    | 'CTA_RH'
    | 'CTA'
    | 'ESTUDANTE'
  createdAt: Date // Ensure TypeScript recognizes the global Date type
  updatedAt: Date | null
}

type signupResponse = {
  sucess: boolean
  message: string
  data: login[]
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function signupRequest({
  email,
  password,
  contact,
  jobPosition,
}: SignupSchema): Promise<login> {
  const response = await fetch(`${base_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, contact, password, jobPosition }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Erro ao registrar usuário')
  }

  const data = await response.json()
  // console.log('dados do signup', data)

  return data.data
}
