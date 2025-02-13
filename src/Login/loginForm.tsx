import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { signupRequest } from '@/http/signup/login-signup'
import { loginRequest } from '@/http/signup/login'
import logo from '../assents/ismmalogo.png'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [contact, setContact] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const navigate = useNavigate()

  // Mutations
  const mutation = useMutation({
    mutationFn: loginRequest,
    onError: (error: Error) => {
      setMensagemErro(error.message || 'Ocorreu um erro inesperado.')
    },
    onSuccess: data => {
      console.log('dados da api', data)
      const student_id = data.student_id.id
      console.log('id do estudante logado', student_id)
      localStorage.setItem('token', data.token)
      localStorage.setItem('student_login_id', student_id)
      setMensagemErro('')
      navigate('/dashboard/dashboard-empty')
    },
  })

  const signupMutation = useMutation({
    mutationFn: signupRequest,
    onError: (error: Error) => {
      setMensagemErro(error.message || 'Ocorreu um erro inesperado.')
    },
    onSuccess: data => {
      setMensagemErro('')
      const login_id = data.login.id
      localStorage.setItem('login_id', login_id)
      navigate('/registration')
    },
  })

  const handleSwitchToSignup = () => setIsSignup(true)
  const handleSwitchToLogin = () => setIsSignup(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isSignup) {
      handleSignup(e)
    } else {
      handleLogin(e)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setMensagemErro('Por favor, preencha todos os campos!')
      return
    }
    mutation.mutate({ email, password })
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
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
    signupMutation.mutate({ email, password, contact })
  }

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="bg-zinc-600 mx-auto w-auto"
          src={logo}
          alt="mma school"
        />
        <h1 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          MMA SCHOOL
        </h1>
        <h2 className=" text-center text-xl font-semibold tracking-tight text-gray-500">
          Sistema de Gestao Academico
        </h2>
      </div>
      {isSignup ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Formulário de Inscrição */}
          <InputField
            label="Email"
            value={email}
            setValue={setEmail}
            type="email"
          />
          <InputField
            label="Senha"
            value={password}
            setValue={setPassword}
            type="password"
          />
          <InputField
            label="Contato"
            value={contact}
            setValue={setContact}
            type="text"
          />

          {mensagemErro && (
            <div className="text-red-500 text-sm">{mensagemErro}</div>
          )}

          <button type="submit" className="w-full bg-amber-600 text-white">
            Inscrever-se
          </button>

          <p className="text-center text-sm">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={handleSwitchToLogin}
              className="text-blue-600"
            >
              Iniciar Sessão
            </button>
          </p>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Formulário de Login */}
          <InputField
            label="Email"
            value={email}
            setValue={setEmail}
            type="email"
          />
          <InputField
            label="Senha"
            value={password}
            setValue={setPassword}
            type="password"
          />

          {mensagemErro && (
            <div className="text-red-500 text-sm">{mensagemErro}</div>
          )}

          <button type="submit" className="w-full bg-amber-600 text-white">
            Entrar
          </button>

          <p className="text-center text-sm">
            Ainda não tem uma conta?{' '}
            <button
              type="button"
              onClick={handleSwitchToSignup}
              className="text-blue-600"
            >
              Iniciar Inscrição
            </button>
          </p>
        </form>
      )}
    </div>
  )
}

function InputField({
  label,
  value,
  setValue,
  type,
}: {
  label: string
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
  type: string
}) {
  return (
    <div>
      <label
        htmlFor={label}
        className="block text-sm font-medium text-gray-900"
      >
        {label}
      </label>
      <input
        id={label}
        name={label}
        type={type}
        required
        value={value}
        onChange={e => setValue(e.target.value)}
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400"
      />
    </div>
  )
}
