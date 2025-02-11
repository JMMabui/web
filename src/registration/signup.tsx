import { useState } from 'react'
import { Personal_data } from './person_data'
import { Inscricao } from './course'
import { Invoice } from './invoice'
import { Pre_Instituto } from './pre_institutos'

export function Signup() {
  const [activeForm, setActiveForm] = useState('dadosPessoais')

  const [formData] = useState({
    dadosPessoais: {},
    preescola: {},
    encarregadoEducacao: {},
    curso: {},
  })

  // Função para verificar se o Nível Acadêmico foi selecionado

  // Função para passar para o próximo formulário
  const goToNextForm = () => {
    if (activeForm === 'dadosPessoais') {
      setActiveForm('preescola')
    } else if (activeForm === 'preescola') {
      setActiveForm('curso')
    } else if (activeForm === 'curso') {
      setActiveForm('factura')
    } else if (activeForm === 'factura') {
      // Quando o formulário "Factura" for alcançado, podemos disparar uma ação de inscrição
      alert('Inscrição realizada com sucesso!')
      // Você pode adicionar aqui o redirecionamento ou outras ações
    }
  }

  // const updateFormData = (formName: string, data: any) => {
  //   setFormData(prevData => ({
  //     ...prevData,
  //     [formName]: data,
  //   }))
  // }

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
      <Invoice formData={formData} />
    </div>
  )

  const renderPreEscola = () => (
    <div>
      <Pre_Instituto />
    </div>
  )

  const renderContinuarButton = () => {
    const buttonText = activeForm === 'factura' ? 'Inscrever' : 'Continuar'

    return (
      <div className="mt-8 text-right w-full max-w-6xl">
        <button
          className="bg-orange-500 text-white rounded-md py-2 px-6"
          type="button"
          onClick={goToNextForm} // Muda para o próximo formulário ou realiza a inscrição
        >
          {buttonText}
        </button>
      </div>
    )
  }

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

        {/* Exibir o botão "Continuar" ou "Inscrever" no final */}
        {renderContinuarButton()}
      </div>
    </div>
  )
}
