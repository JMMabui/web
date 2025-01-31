import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

type LoginData = {
  email: string
  password: string
}

type UserData = {
  email: string
  password: string
  contact: string
}

async function loginRequest({ email, password }: LoginData) {
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

async function signupRequest({ email, password, contact }: UserData) {
  const response = await fetch('http://localhost:3333/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, contact }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Erro ao registrar usuário')
  }

  return response.json()
}

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [contact, setContact] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const navigate = useNavigate()

  // Usando o useMutation do react-query para gerenciar o login
  const mutation = useMutation({
    mutationFn: loginRequest,
    onError: (error: Error) => {
      setMensagemErro(error.message)
    },
    onSuccess: data => {
      // Armazenar o token no localStorage
      localStorage.setItem('token', data.token)
      setMensagemErro('')
      navigate('/dashboard/dashboard-empty') // Redireciona para o dashboard
    },
  })

  const signupMutation = useMutation({
    mutationFn: signupRequest,
    onError: (error: Error) => {
      setMensagemErro(error.message)
    },
    onSuccess: () => {
      setMensagemErro('')
      navigate('/registration') // Redireciona para a página de sucesso após o signup
    },
  })

  // Função para alternar entre login e inscrição
  const handleSwitchToSignup = () => {
    setIsSignup(true)
  }

  const handleSwitchToLogin = () => {
    setIsSignup(false)
  }

  // Função de login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setMensagemErro('Por favor, preencha todos os campos!')
      return
    }

    // Chama o mutation para login
    mutation.mutate({ email, password })
  }

  // Função de inscrição
  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação de campos
    if (!email || !password || !contact) {
      setMensagemErro('Por favor, preencha todos os campos!')
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setMensagemErro('Por favor, insira um email válido.')
      return
    }

    if (password.length < 6) {
      setMensagemErro('A senha precisa ter no mínimo 6 caracteres.')
      return
    }

    // Chama o mutation para inscrição
    signupMutation.mutate({ email, password, contact })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isSignup) {
      handleSignup(e) // Chama a função de signup
    } else {
      handleLogin(e) // Chama a função de login
    }
  }

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      {isSignup ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Formulário de Inscrição */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Senha
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="contact"
              className="block text-sm font-medium text-gray-900"
            >
              Contato
            </label>
            <div className="mt-2">
              <input
                id="contact"
                name="contact"
                type="text"
                required
                value={contact}
                onChange={e => setContact(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              Inscrever-se
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={handleSwitchToLogin}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Iniciar Sessão
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Formulário de Login */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-900"
            >
              Senha
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Exibir mensagem de erro */}
          {mensagemErro && (
            <div className="text-red-500 text-sm">{mensagemErro}</div>
          )}

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              Entrar
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Ainda não tem uma conta?{' '}
            <button
              type="button"
              onClick={handleSwitchToSignup}
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Iniciar Inscrição
            </button>
          </p>
        </form>
      )}
    </div>
  )
}
