import logo from './assents/dark-logo.png'

function header_primary() {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img className="mx-auto h-10 w-auto" src={logo} alt="mma school" />
      <h1 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        MMA SCHOOL
      </h1>
      <h2 className=" text-center text-xl font-semibold tracking-tight text-gray-500">
        Sistema de Gestao Academico
      </h2>
    </div>
  )
}

function bodyLogin() {
  return (
    <div className="mt-10 sm:mx-auto sm: w-full sm:max-w-sm">
      <form action="#" method="POST" className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm/6 font-medium text-gray-900"
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
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Password
            </label>
          </div>
          <div className="mt-2">
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
            />
          </div>
        </div>

        <div className="text-sm">
          <a
            href="#"
            className="font-semibold text-cyan-600 hover:text-cyan-500"
          >
            Esqueceu password?
          </a>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-amber-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            Entrar
          </button>
        </div>
      </form>

      <p className="mt-10 text-center text-sm/6 text-gray-500">
        Ainda estas inscrito?{'  '}
        <a
          href="#"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          Iniciar Inscricao
        </a>
      </p>
    </div>
  )
}

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

function acess_data() {
  return (
    <div className="mt-6 sm:mx-auto mx-auto sm:w-full sm:max-w-sm border-b border-amber-900/10 pb-12">
      <h2 className="text-base/7 font-semibold text-gray-900 text-center">
        {' '}
        Dados de Acesso
      </h2>
      <p className=" text-sm/6 text-gray-600 text-center">
        Insira os dados, para iniciar a inscricao
      </p>
      <div className="mt-3.5">
        <label
          htmlFor="email"
          className="block text-sm/6 font-medium text-gray-900"
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
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
          />
        </div>
      </div>

      <div className="mt-3.5">
        <label
          htmlFor="password"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Password
        </label>
        <div className="mt-2">
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
          />
        </div>
      </div>

      <div className="mt-3.5">
        <label
          htmlFor="confirmar_password"
          className="block text-sm/6 font-medium text-gray-900"
        >
          Confirmar Password
        </label>
        <div className="mt-2">
          <input
            id="confirmar_password"
            name="confirmar_password"
            type="password"
            required
            autoComplete="confirmar_password"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="mt-6 flex w-full justify-center rounded-md bg-amber-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Iniciar
        </button>
      </div>
    </div>
  )
}

export function App() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {header_primary()}
      {/* {bodyLogin()} */}
      {/* {welcome()}
      {acess_data()} */}

      <div className="mt-10 sm:mx-auto mx-auto sm:w-full sm:max-w-2xl text-left border-b border-gray-900/10 pb-12">
        <h2 className="text-left text-base/7 font-semibold text-gray-900">
          Dados Pessoais
        </h2>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-2">
            <label
              htmlFor="surname"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Apelido
            </label>
            <div className="mt-2">
              <input
                id="surname"
                name="surname"
                type="text"
                autoComplete="family-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Nome (sem apelido)
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="data_birth"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Data de Nascimento
            </label>
            <div className="mt-2">
              <input
                id="data_birth"
                name="data_birth"
                type="date"
                autoComplete="date"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div className="col-span-3">
            <label
              htmlFor="naturalite"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Provincia
            </label>
            <div className="mt-2">
              <input
                id="naturalite"
                name="naturalite"
                type="text"
                autoComplete="naturalite"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>

          <div className="sm:col-span-2 sm:col-start-1">
            <label
              htmlFor="gender"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Genero
            </label>
            <div className="mt-2">
              <select
                id="gender"
                name="gender"
                autoComplete="gender"
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value="default">-- Escolha Genero --</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="marital"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Estado Civil
            </label>
            <div className="mt-2">
              <select
                id="marital"
                name="marital"
                autoComplete="marital"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value="default">-- Selecione --</option>
                <option value="SOLTERIO">Solteiro(a)</option>
                <option value="CASADO">Casado(a)</option>
                <option value="DIVORCIADO">Divorciado(a)</option>
                <option value="VIUVO">Viuvo(a)</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="provincy-address"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Naturalidade
            </label>
            <div className="mt-2 grid grid-cols-1 ">
              <select
                id="provincy-address"
                name="proviny-address"
                autoComplete="provincy-address"
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              >
                <option value="NULL" className="text-gray-500 text-sm">
                  -- Provinvia residindo --
                </option>
                <option value="MAPUTO_CIDADE">Maputo Cidade</option>
                <option value="MAPUTO_PROVINCIA">Maputo Provincia</option>
                <option value="GAZA">Gaza</option>
                <option value="INHAMBANE">Inhambane</option>
                <option value="SOFALA">Sofala</option>
                <option value="MANICA">Manica</option>
                <option value="TETE">Tete</option>
                <option value="ZAMBEZIA">Zambezia</option>
                <option value="NAMPULA">Nampula</option>
                <option value="CABO_DELGADO">Cabo Delgado</option>
                <option value="NIASSA">Niassa</option>
              </select>
              {/* <ChevronDownIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              /> */}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="postal-code"
              className="block text-sm/6 font-medium text-gray-900"
            >
              ZIP / Postal code
            </label>
            <div className="mt-2">
              <input
                id="postal-code"
                name="postal-code"
                type="text"
                autoComplete="postal-code"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
