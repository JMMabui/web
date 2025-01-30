import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Welcome() {
  return (
    <div className="sm:mx-auto mx-auto sm:w-full">
      <h1 className="mt-10 text-center text-xl/5 font-bold tracking-tight text-gray-900">
        Bem-Vindo
      </h1>
      <p className="mt-3 text-center text-3.5 font-medium tracking-tight text-gray-500">
        A MMA SCHOOL é um software de gestão acadêmica do Instituto Superior
        Maria Mãe de África. Abaixo, encontrará instruções de como realizar a
        sua pré-inscrição, que será validada apenas com a apresentação de
        documentos físicos e o comprovativo de pagamento, na secretaria da
        instituição.
      </p>
    </div>
  )
}

const usuarios = [
  {
    username: 'justinsalomon2@gmail.com',
    senha: 'senha123',
  },
  {
    username: 'usuario2',
    senha: 'senha456',
  },
  {
    username: 'admin',
    senha: 'admin123',
  },
]

export function LoginForm() {
  const [username, setUsername] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagemErro, setMensagemErro] = useState('')
  const [usuarioLogado, setUsuarioLogado] = useState(false)
  const [isSignup, setIsSignup] = useState(false)
  const navigate = useNavigate() // Usando o hook useNavigate

  const handleSwitchToSignup = () => {
    setIsSignup(true)
  }

  const handleSwitchToLogin = () => {
    setIsSignup(false)
  }

  // Função para fazer login
  const handleLogin = () => {
    // Verificar se o usuário existe e a senha está correta
    const usuario = usuarios.find(user => user.username === username)

    if (!usuario) {
      setMensagemErro('Usuário não registrado!')
      return
    }

    if (usuario.senha !== senha) {
      setMensagemErro('Senha incorreta!')
      return
    }

    // Se o login for bem-sucedido, "logar" o usuário
    setUsuarioLogado(true)
    setMensagemErro('') // Limpa a mensagem de erro

    // Redirecionar para o dashboard ou página principal
    navigate('/dashboard/dashboard-empty') // Substitua pelo caminho correto
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (isSignup) {
      // Simulação de redirecionamento após inscrição
      navigate('/registration')
    } else {
      handleLogin() // Chama a função de login quando o formulário é enviado
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
                value={username}
                onChange={e => setUsername(e.target.value)}
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
                value={senha}
                onChange={e => setSenha(e.target.value)}
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
