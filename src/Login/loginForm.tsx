import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { signupRequest } from '@/http/signup/login-signup'
import { loginRequest } from '@/http/signup/login'
import logo from '../assets/ismmalogo.png'
import Input from '@/components/Input'
import Button from '@/components/Button'

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
      console.log('dados da api', data.data)
      localStorage.setItem('token', data.token)

      setMensagemErro('')

      const userType = data.data.user.jobPosition
      console.log('tipo de usuario', userType)

      // Mapeamento dos tipos de usuário para as rotas
      const userTypeToRouteMap: Record<string, string> = {
        ADMIN_IT: '/admin',
        CTA_ADMIN_FINANCEIRO: '/finances',
        CTA_ADMIN_REG_ACADEMICO: '/academic_record/dashboard',
        CTA_ADMIN_RH: '/human_resources',
        CTA_ADMIN_BIBLIOTECA: '/cta-admin-biblioteca/dashboard',
        CTA_ADMIN_COORDENADOR: '/cta-admin-coordenador/dashboard',
        CTA_REG_ACADEMICO: '/cta-reg-academico/dashboard',
        CTA_FINANCEIRO: '/cta-financeiro/dashboard',
        CTA_BIBLIOTECA: '/cta-biblioteca/dashboard',
        CTA_DOCENTE: '/Teacher/dashboard',
        CTA_RH: '/cta-rh/dashboard',
        CTA: '/cta/dashboard',
        // 'ESTUDANTE': '/student',
        PROFESSOR: '/teacher/dashboard',
      }

      if (userType === 'ESTUDANTE') {
        const student_id = data.data.student.id
        console.log('id do estudante logado', student_id)
        localStorage.setItem('student_login_id', student_id)
        navigate('/student/dashboard')
      } else if (userTypeToRouteMap[userType]) {
        const email = data.data.user.email
        console.log('email: ', email)
        localStorage.setItem('email', email)
        navigate(userTypeToRouteMap[userType])
      } else {
        // Caso o tipo de usuário não esteja no mapa, você pode tratar isso aqui
        console.error('Tipo de usuário desconhecido:', userType)
        // Aqui você pode redirecionar para uma rota padrão, caso queira
        // navigate('/pagina-inicial') ou qualquer outra rota
      }
    },
  })

  const signupMutation = useMutation({
    mutationFn: signupRequest,
    onError: (error: Error) => {
      setMensagemErro(error.message || 'Ocorreu um erro inesperado.')
    },
    onSuccess: data => {
      setMensagemErro('')
      console.log('dados do signup vindo da api para tratamento', data)
      const login_id = data.id
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
    signupMutation.mutate({
      email,
      password,
      contact,
      jobPosition: 'ESTUDANTE',
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img className="h-24 w-auto" src={logo} alt="ISMMA" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {isSignup ? 'Criar Conta' : 'Bem-vindo ao ISMMA'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-700">
          {isSignup
            ? 'Preencha os dados para criar sua conta'
            : 'Faça login para acessar o sistema'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-200">
          {isSignup ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                fullWidth
                className="bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                fullWidth
                className="bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
              <Input
                label="Contato"
                type="text"
                value={contact}
                onChange={e => setContact(e.target.value)}
                placeholder="Seu número de telefone"
                fullWidth
                className="bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />

              {mensagemErro && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-900">
                        {mensagemErro}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                className="bg-gray-900 hover:bg-gray-800 focus:ring-gray-900"
              >
                Criar Conta
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-700">Já tem uma conta? </span>
                <button
                  type="button"
                  onClick={handleSwitchToLogin}
                  className="font-medium text-gray-900 hover:text-gray-700"
                >
                  Fazer Login
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                fullWidth
                className="bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />
              <Input
                label="Senha"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                fullWidth
                className="bg-white border-gray-300 focus:border-gray-900 focus:ring-gray-900"
              />

              {mensagemErro && (
                <div className="rounded-md bg-red-50 p-4 border border-red-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-600"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-900">
                        {mensagemErro}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                className="bg-gray-900 hover:bg-gray-800 focus:ring-gray-900"
              >
                Entrar
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-700">Ainda não tem uma conta? </span>
                <button
                  type="button"
                  onClick={handleSwitchToSignup}
                  className="font-medium text-gray-900 hover:text-gray-700"
                >
                  Criar Conta
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
