import { useState } from 'react'
import { useNavigate } from 'react-router-dom' // Importe o hook useNavigate do React Router

function welcome() {
  return (
    <div className=" sm:mx-auto mx-auto sm:w-full  ">
      <h1 className="mt-10 text-center text-xl/5 font-bold tracking-tight text-gray-900">
        Bem-Vindo
      </h1>
      <p className="mt-3 text-center text-3.5 font-medium tracking-tight text-gray-500">
        A MMA SCHOOL e um software de gestao academica do Instituto Superior
        Maria Mae de Africa. Abaixo, encontrara instrucoes de como realizar a
        sua pre-inscricao, onde so sera validado, com apresentacao de documentos
        fisicos e o comprovativo de pagamento, na secretaria da instituicao
      </p>
    </div>
  )
}

export function LoginForm() {
  const [isSignup, setIsSignup] = useState(false)
  const navigate = useNavigate() // Usando o hook useNavigate

  const handleSwitchToSignup = () => {
    setIsSignup(true)
  }

  const handleSwitchToLogin = () => {
    setIsSignup(false)
  }

  // Função para lidar com o envio do formulário
  const handleSubmit = e => {
    e.preventDefault() // Impede o comportamento padrão do formulário

    // Aqui você pode adicionar a lógica de envio dos dados, como uma requisição API
    // Simulando um redirecionamento após a inscrição bem-sucedida
    if (isSignup) {
      // Após a inscrição, redireciona para uma página de confirmação ou login
      navigate('/pagina-de-confirmacao') // Substitua pelo caminho real da sua página
    } else {
      // Lógica para login (se necessário)
      navigate('/pagina-de-dashboard') // Redireciona para a página de dashboard após o login
    }
  }

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      {isSignup ? (
        <form onSubmit={handleSubmit} className="space-y-6">
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
              Password
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
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-900"
            >
              Confirme a senha
            </label>
            <div className="mt-2">
              <input
                id="confirm-password"
                name="confirm-password"
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
            Já tens uma conta?{' '}
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
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
              />
            </div>
          </div>

          <div className="text-sm">
            <a
              href="#"
              className="font-semibold text-cyan-600 hover:text-cyan-500"
            >
              Esqueceu a senha?
            </a>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              Entrar
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            Ainda não tens conta?{' '}
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
