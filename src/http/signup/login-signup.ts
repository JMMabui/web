type UserData = {
  email: string
  password: string
  contact: string
}

export async function signupRequest({ email, password, contact }: UserData) {
  const response = await fetch('http://localhost:3333/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, contact, password }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Erro ao registrar usuário')
  }

  return response.json()
}
