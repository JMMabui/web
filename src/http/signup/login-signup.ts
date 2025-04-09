export type SignupSchema = {
  email: string
  password: string
  contact: string
  // jobPosition?: string
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function signupRequest({
  email,
  password,
  contact,
  // jobPosition,
}: SignupSchema) {
  const response = await fetch(`${base_URL}/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, contact, password, jobPosition: 'ESTUDANTE' }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Erro ao registrar usuário')
  }

  const data = await response.json()
  console.log('dados do signup', data)

  return data.data
}
