import React, { useState } from 'react'
import logo from './assents/dark-logo.png'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LoginForm } from './Login/loginForm'
import { Personal_data } from './registration/person_data'
import { Inscricao } from './registration/course'
import { Dashboard } from './dashboard/dashboard-empty'
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
          {activeForm === 'curso' && renderCurso()}
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
      {/* {header_primary()} */}
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pagina-de-confirmacao" element={PreInstituto()} />
        </Routes>
      </Router>
    </div>
  )
}
