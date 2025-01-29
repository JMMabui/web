import React, { useState } from 'react'
import logo from './assents/dark-logo.png'
import { useNavigate } from 'react-router-dom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LoginForm } from './Login/loginForm'
import { Personal_data } from './registration/person_data'
import { Inscricao } from './registration/course'

// import ConfirmationPage from './ConfirmationPage'; // Sua página de confirmação ou qualquer outra

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

// function LoginForm() {
//   const [isSignup, setIsSignup] = useState(false)
//   const navigate = useNavigate() // Usando o hook useNavigate

//   const handleSwitchToSignup = () => {
//     setIsSignup(true)
//   }

//   const handleSwitchToLogin = () => {
//     setIsSignup(false)
//   }

//   // Função para lidar com o envio do formulário
//   const handleSubmit = e => {
//     e.preventDefault() // Impede o comportamento padrão do formulário

//     // Aqui você pode adicionar a lógica de envio dos dados, como uma requisição API
//     // Simulando um redirecionamento após a inscrição bem-sucedida
//     if (isSignup) {
//       // Após a inscrição, redireciona para uma página de confirmação ou login
//       navigate('/pagina-de-confirmacao') // Substitua pelo caminho real da sua página
//     } else {
//       // Lógica para login (se necessário)
//       navigate('/pagina-de-dashboard') // Redireciona para a página de dashboard após o login
//     }
//   }

//   return (
//     <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
//       {isSignup ? (
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-900"
//             >
//               Email
//             </label>
//             <div className="mt-2">
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 autoComplete="email"
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-900"
//             >
//               Password
//             </label>
//             <div className="mt-2">
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 autoComplete="new-password"
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="confirm-password"
//               className="block text-sm font-medium text-gray-900"
//             >
//               Confirme a senha
//             </label>
//             <div className="mt-2">
//               <input
//                 id="confirm-password"
//                 name="confirm-password"
//                 type="password"
//                 required
//                 autoComplete="new-password"
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="flex w-full justify-center rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-blue-600"
//             >
//               Inscrever-se
//             </button>
//           </div>

//           <p className="mt-10 text-center text-sm text-gray-500">
//             Já tens uma conta?{' '}
//             <button
//               type="button"
//               onClick={handleSwitchToLogin}
//               className="font-semibold text-indigo-600 hover:text-indigo-500"
//             >
//               Iniciar Sessão
//             </button>
//           </p>
//         </form>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-900"
//             >
//               Email
//             </label>
//             <div className="mt-2">
//               <input
//                 id="email"
//                 name="email"
//                 type="email"
//                 required
//                 autoComplete="email"
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
//               />
//             </div>
//           </div>

//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-gray-900"
//             >
//               Password
//             </label>
//             <div className="mt-2">
//               <input
//                 id="password"
//                 name="password"
//                 type="password"
//                 required
//                 autoComplete="current-password"
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
//               />
//             </div>
//           </div>

//           <div className="text-sm">
//             <a
//               href="#"
//               className="font-semibold text-cyan-600 hover:text-cyan-500"
//             >
//               Esqueceu a senha?
//             </a>
//           </div>

//           <div>
//             <button
//               type="submit"
//               className="flex w-full justify-center rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs hover:bg-amber-500 focus-visible:outline-2 focus-visible:outline-blue-600"
//             >
//               Entrar
//             </button>
//           </div>

//           <p className="mt-10 text-center text-sm text-gray-500">
//             Ainda não tens conta?{' '}
//             <button
//               type="button"
//               onClick={handleSwitchToSignup}
//               className="font-semibold text-indigo-600 hover:text-indigo-500"
//             >
//               Iniciar Inscrição
//             </button>
//           </p>
//         </form>
//       )}
//     </div>
//   )
// }

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

function PreInstituto() {
  // Estado para controlar o formulário ativo e o nível acadêmico selecionado
  const [activeForm, setActiveForm] = useState('dadosPessoais')
  const [nivelAcademico, setNivelAcademico] = useState('') // Armazenar o nível acadêmico selecionado

  // Função de renderização do formulário de Dados Pessoais (apenas como exemplo)
  const renderDadosPessoais = () => (
    <div>
      {/* <h2 className="text-lg font-semibold">Formulário de Dados Pessoais</h2> */}
      {/* Adicione os campos de Dados Pessoais aqui */}
      <Personal_data />
    </div>
  )

  const renderCurso = () => (
    <div>
      <Inscricao />
    </div>
  )

  // Função de renderização do formulário Pré-escola
  const renderPreEscola = () => (
    <div>
      <h2 className="text-lg font-semibold mb-4">Pré-escola</h2>
      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {/* Campos do formulário de Pré-escola */}
        <div className="sm:col-span-1">
          <label
            htmlFor="school_level"
            className="block text-sm font-medium text-gray-900"
          >
            Nível Acadêmico
          </label>
          <select
            id="school_level"
            name="school_level"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            value={nivelAcademico}
            onChange={e => setNivelAcademico(e.target.value)} // Atualiza o nível acadêmico
          >
            <option value="null">--Ensino Geral (equivalente)</option>
            <option value="CLASSE_10">10 Classe</option>
            <option value="CLASSE_12">12 Classe</option>
            <option value="LICENCIATURA">Licenciatura</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="school"
            className="block text-sm font-medium text-gray-900"
          >
            Escola
          </label>
          <input
            id="school"
            name="school"
            type="text"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            placeholder="Nome da escola"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="provincy_school"
            className="block text-sm font-medium text-gray-900"
          >
            Província
          </label>
          <select
            id="provincy_school"
            name="provincy_school"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
          >
            <option value="NULL">-- Selecione a província --</option>
            <option value="MAPUTO_CIDADE">Maputo Cidade</option>
            <option value="MAPUTO_PROVINCIA">Maputo Provincia</option>
            {/* Adicione outras opções de províncias aqui */}
          </select>
        </div>
      </div>

      {/* Exibe a parte do Encarregado de Educação se o nível acadêmico for "10 Classe" */}
      {nivelAcademico === 'CLASSE_10' && renderEncarregadoEducacao()}
    </div>
  )

  // Função de renderização para o formulário de Encarregado de Educação
  const renderEncarregadoEducacao = () => (
    <div>
      <h2 className="mt-5 text-lg font-semibold mb-6">
        Encarregado de Educação
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {/* Campos para Encarregado de Educação */}
        <div className="sm:col-span-3">
          <label
            htmlFor="education_name"
            className="block text-sm font-medium text-gray-900"
          >
            Nome Completo
          </label>
          <input
            id="education_name"
            name="education_name"
            type="text"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            placeholder="Nome do encarregado de educação"
          />
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="profession"
            className="block text-sm font-medium text-gray-900"
          >
            Profissão
          </label>
          <input
            id="profession"
            name="profession"
            type="text"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            placeholder="Profissão do encarregado"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="dateBirth"
            className="block text-sm font-medium text-gray-900"
          >
            Data de Nascimento
          </label>
          <input
            id="dateBirth"
            name="dateBirth"
            type="date"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
          />
        </div>
      </div>
    </div>
  )

  // Função de renderização do botão "Continuar"
  const renderContinuarButton = () => (
    <div className="mt-8 text-right w-full max-w-6xl">
      <button
        className="bg-orange-500 text-white rounded-md py-2 px-6"
        type="button"
        onClick={() => setActiveForm('curso')} // Exemplo de mudança de formulário
      >
        Continuar
      </button>
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex w-full max-w-6xl mt-8">
        <div className="w-1/4 space-y-4">
          <button
            className="w-full bg-orange-500 text-white rounded-md py-2"
            type="button"
            onClick={() => setActiveForm('dadosPessoais')}
          >
            Dados Pessoais
          </button>
          <button
            className="w-full bg-orange-500 text-white rounded-md py-2"
            type="button"
            onClick={() => setActiveForm('preescola')}
          >
            Pré-escola
          </button>
          <button
            className="w-full bg-orange-500 text-white rounded-md py-2"
            type="button"
            onClick={() => setActiveForm('curso')}
          >
            Curso
          </button>
          <button
            className="w-full bg-orange-500 text-white rounded-md py-2"
            type="button"
            onClick={() => setActiveForm('factura')}
          >
            Factura da Inscrição
          </button>
        </div>

        <div className="w-3/4 bg-white p-6 rounded-lg shadow-md">
          {activeForm === 'dadosPessoais' && renderDadosPessoais()}
          {activeForm === 'preescola' && renderPreEscola()}
          {activeForm === 'curso' &&
            // <h2 className="text-lg font-semibold">Formulário de Curso</h2>
            renderCurso()}
          {activeForm === 'factura' && (
            <h2 className="text-lg font-semibold">Formulário de Factura</h2>
          )}

          {/* Exibir o botão "Continuar" no final */}
          {renderContinuarButton()}
        </div>
      </div>
    </div>
  )
}

export function App() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {header_primary()}
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/pagina-de-confirmacao" element={PreInstituto()} />
        </Routes>
      </Router>
    </div>
  )
}

// function dados_pessoais() {
//   return {
//     /* <div className="mt-10 sm:mx-auto mx-auto sm:w-full sm:max-w-2xl text-left border-b border-gray-900/10 pb-12">
//         <h2 className="text-left text-base/7 font-semibold text-gray-900">
//           Dados Pessoais
//         </h2>

//         <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
//           <div className="sm:col-span-2">
//             <label
//               htmlFor="surname"
//               className="block text-sm/6 font-medium text-gray-900"
//             >
//               Apelido
//             </label>
//             <div className="mt-2">
//               <input
//                 id="surname"
//                 name="surname"
//                 type="text"
//                 autoComplete="family-name"
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//           </div>

//           <div className="sm:col-span-3">
//             <label
//               htmlFor="name"
//               className="block text-sm/6 font-medium text-gray-900"
//             >
//               Nome (sem apelido)
//             </label>
//             <div className="mt-2">
//               <input
//                 id="name"
//                 name="name"
//                 type="text"
//                 autoComplete="given-name"
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//           </div>

//           <div className="sm:col-span-2">
//             <label
//               htmlFor="data_birth"
//               className="block text-sm/6 font-medium text-gray-900"
//             >
//               Data de Nascimento
//             </label>
//             <div className="mt-2">
//               <input
//                 id="data_birth"
//                 name="data_birth"
//                 type="date"
//                 autoComplete="date"
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//           </div>

//           <div className="col-span-3">
//             <label
//               htmlFor="naturalite"
//               className="block text-sm/6 font-medium text-gray-900"
//             >
//               Provincia
//             </label>
//             <div className="mt-2">
//               <input
//                 id="naturalite"
//                 name="naturalite"
//                 type="text"
//                 autoComplete="naturalite"
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//           </div>

//           <div className="sm:col-span-2 sm:col-start-1">
//             <label
//               htmlFor="gender"
//               className="block text-sm/6 font-medium text-gray-900"
//             >
//               Genero
//             </label>
//             <div className="mt-2">
//               <select
//                 id="gender"
//                 name="gender"
//                 autoComplete="gender"
//                 className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               >
//                 <option value="default">-- Escolha Genero --</option>
//                 <option value="MASCULINO">Masculino</option>
//                 <option value="FEMININO">Feminino</option>
//               </select>
//             </div>
//           </div>

//           <div className="sm:col-span-2">
//             <label
//               htmlFor="marital"
//               className="block text-sm/6 font-medium text-gray-900"
//             >
//               Estado Civil
//             </label>
//             <div className="mt-2">
//               <select
//                 id="marital"
//                 name="marital"
//                 autoComplete="marital"
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               >
//                 <option value="default">-- Selecione --</option>
//                 <option value="SOLTERIO">Solteiro(a)</option>
//                 <option value="CASADO">Casado(a)</option>
//                 <option value="DIVORCIADO">Divorciado(a)</option>
//                 <option value="VIUVO">Viuvo(a)</option>
//               </select>
//             </div>
//           </div>

//           <div className="sm:col-span-2">
//             <label
//               htmlFor="provincy-address"
//               className="block text-sm/6 font-medium text-gray-900"
//             >
//               Naturalidade
//             </label>
//             <div className="mt-2 grid grid-cols-1 ">
//               <select
//                 id="provincy-address"
//                 name="proviny-address"
//                 autoComplete="provincy-address"
//                 className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               >
//                 <option value="NULL" className="text-gray-500 text-sm">
//                   -- Provinvia residindo --
//                 </option>
//                 <option value="MAPUTO_CIDADE">Maputo Cidade</option>
//                 <option value="MAPUTO_PROVINCIA">Maputo Provincia</option>
//                 <option value="GAZA">Gaza</option>
//                 <option value="INHAMBANE">Inhambane</option>
//                 <option value="SOFALA">Sofala</option>
//                 <option value="MANICA">Manica</option>
//                 <option value="TETE">Tete</option>
//                 <option value="ZAMBEZIA">Zambezia</option>
//                 <option value="NAMPULA">Nampula</option>
//                 <option value="CABO_DELGADO">Cabo Delgado</option>
//                 <option value="NIASSA">Niassa</option>
//               </select>
//             </div>
//           </div>

//           <div className="sm:col-span-2">
//             <label
//               htmlFor="postal-code"
//               className="block text-sm/6 font-medium text-gray-900"
//             >
//               ZIP / Postal code
//             </label>
//             <div className="mt-2">
//               <input
//                 id="postal-code"
//                 name="postal-code"
//                 type="text"
//                 autoComplete="postal-code"
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
//               />
//             </div>
//           </div>
//         </div>
//       </div> */
//   }
// }
