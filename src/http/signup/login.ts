type LoginData = {
  email: string
  password: string
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function loginRequest({ email, password }: LoginData) {
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

  return response.json()
}
