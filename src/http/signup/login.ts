type LoginData = {
  email: string
  password: string
}

export async function loginRequest({ email, password }: LoginData) {
  const response = await fetch('http://localhost:3333/auth/login', {
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
