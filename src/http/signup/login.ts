export type LoginSchema = {
  email: string
  password: string
}

export type loginResponse = {
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
    | '  CTA_FINANCEIRO'
    | 'CTA_BIBLIOTECA'
    | 'CTA_DOCENTE'
    | 'CTA_RH'
    | 'CTA'
    | 'ESTUDANTE'
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function loginRequest({ email, password }: LoginSchema) {
  const response = await fetch(`${base_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Erro ao fazer login')
  }

  const result = response.json()
  console.log('resposta da api de login:, ', result)

  return result
}

export async function getLoginByEmail(email: string) {
  const response = await fetch(`${base_URL}/login/${email}`)

  if (!response.ok) {
    // Se a resposta não for ok, captura o código de status para um erro mais detalhado
    const errorText = await response.text()
    throw new Error(`Erro ao enviar dados: ${response.status} - ${errorText}`)
  }

  const result = await response.json()
  console.log('Response api for login data: ', result)

  return result.data
}

export async function getLogin() {
  try {
    const response = await fetch(`${base_URL}/login`)
    if (!response.ok) {
      // Se a resposta não for ok, captura o código de status para um erro mais detalhado
      const errorText = await response.text()
      throw new Error(`Erro ao enviar dados: ${response.status} - ${errorText}`)
    }
    const jsonResponse = await response.json()
    console.log('Resposta da API:', jsonResponse)
    return jsonResponse
  } catch (error) {
    console.error('Erro ao chamar a API:', error)
    throw error
  }
}
