import { useState } from 'react'
import { Personal_data } from './person_data'
import { Inscricao } from './course'
import { Invoice } from './invoice'
import { Pre_Instituto } from './pre_institutos'

export function Signup() {
  const [activeForm, setActiveForm] = useState('dadosPessoais')

  const renderDadosPessoais = () => (
    <div>
      <Personal_data />
    </div>
  )

  const renderCurso = () => (
    <div>
      <Inscricao />
    </div>
  )

  const renderFactura = () => (
    <div>
      <Invoice />
    </div>
  )

  const renderPreEscola = () => (
    <div>
      <Pre_Instituto />
    </div>
  )


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      {/* Botões no topo */}
      <div className="w-full max-w-6xl mb-4">
        <div className="flex space-x-4">
          <button
            className="w-1/4 bg-orange-500 text-white rounded-md py-2"
            type="button"
            onClick={() => setActiveForm('dadosPessoais')}
          >
            Dados Pessoais
          </button>
          <button
            className="w-1/4 bg-orange-500 text-white rounded-md py-2"
            type="button"
            onClick={() => setActiveForm('preescola')}
          >
            Pré-escola
          </button>
          <button
            className="w-1/4 bg-orange-500 text-white rounded-md py-2"
            type="button"
            onClick={() => setActiveForm('curso')}
          >
            Curso
          </button>
          <button
            className="w-1/4 bg-orange-500 text-white rounded-md py-2"
            type="button"
            onClick={() => setActiveForm('factura')}
          >
            Factura da Inscrição
          </button>
        </div>
      </div>

      {/* Formulário de conteúdo */}
      <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-md">
        {activeForm === 'dadosPessoais' && renderDadosPessoais()}
        {activeForm === 'preescola' && renderPreEscola()}
        {activeForm === 'curso' && renderCurso()}
        {activeForm === 'factura' &&
          //   <h2 className="text-lg font-semibold">Formulário de Factura</h2>
          renderFactura()}
      </div>
    </div>
  )
}
