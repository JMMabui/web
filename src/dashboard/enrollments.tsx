import React, { useState, useEffect } from 'react'

export const Enrollments = () => {
  const [ano, setAno] = useState('')
  const [semestre, setSemestre] = useState('')
  const [cadeiras, setCadeiras] = useState<string[]>([]) // Cadeiras obrigatórias
  const [cadeirasAdicionais, setCadeirasAdicionais] = useState<
    { cadeira: string; ano: string; semestre: string }[]
  >([]) // Cadeiras adicionais com ano e semestre
  const [message, setMessage] = useState('')

  // Dados do pagamento
  const mensalidadeBase = 500 // valor base da mensalidade
  const precoPorCadeiraAdicional = 100 // valor acrescido por cada cadeira extra

  // Função para listar as cadeiras com base no ano e semestre
  const listarCadeiras = (ano: string, semestre: string) => {
    const cadeirasPorAnoSemestre: Record<string, Record<string, string[]>> = {
      '1': {
        '1': ['Matemática 1', 'Física 1', 'Introdução à Programação'],
        '2': ['Matemática 2', 'Física 2', 'Algoritmos e Estruturas de Dados'],
      },
      '2': {
        '1': ['Cálculo 1', 'Estruturas de Dados', 'Física 3'],
        '2': [
          'Cálculo 2',
          'Arquitetura de Computadores',
          'Redes de Computadores',
        ],
      },
      '3': {
        '1': [
          'Banco de Dados',
          'Sistemas Operacionais',
          'Teoria da Computação',
        ],
        '2': [
          'Engenharia de Software',
          'Inteligência Artificial',
          'Algoritmos Avançados',
        ],
      },
      '4': {
        '1': [
          'Projeto de Software',
          'Tópicos Avançados em Computação',
          'Computação Gráfica',
        ],
        '2': [
          'Trabalho de Conclusão de Curso',
          'Estágio Supervisionado',
          'Gestão de Projetos',
        ],
      },
    }

    // Se o ano e semestre forem válidos, adiciona as cadeiras obrigatórias do semestre
    if (ano && semestre) {
      setCadeiras(cadeirasPorAnoSemestre[ano]?.[semestre] || [])
    } else {
      setCadeiras([]) // Limpa as cadeiras caso o ano ou semestre não sejam selecionados
    }
  }

  // Função para adicionar cadeira ao total
  const handleAddCadeira = (cadeira: string, ano: string, semestre: string) => {
    if (cadeirasAdicionais.length < 3) {
      setCadeirasAdicionais(prev => [...prev, { cadeira, ano, semestre }])
    } else {
      setMessage('Você pode adicionar no máximo 3 cadeiras adicionais.')
    }
  }

  // Função para calcular o total a pagar
  const calcularTotal = () => {
    let total = mensalidadeBase
    // Se houver cadeiras adicionais, somamos o valor adicional
    if (cadeirasAdicionais.length > 0) {
      total += cadeirasAdicionais.length * precoPorCadeiraAdicional
    }
    return total
  }

  // Função para gerar o arquivo de resumo
  const downloadResumo = () => {
    const resumo = `
    Resumo da Inscrição:
    Ano: ${ano}
    Semestre: ${semestre}
    Primeira Mensalidade: ${mensalidadeBase}€
    Cadeiras Obrigatórias: ${cadeiras.join(', ')}
    Cadeiras Adicionais: ${cadeirasAdicionais.map(c => `${c.cadeira} (${c.ano}º Ano, ${c.semestre}º Semestre)`).join(', ') || 'Nenhuma'}
    Valor Total: ${calcularTotal()}€
    Métodos de Pagamento: Cartão, Transferência Bancária, Dinheiro
    `
    const blob = new Blob([resumo], { type: 'text/plain' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = 'resumo_inscricao.txt'
    link.click()
  }

  // Usar useEffect para disparar a listagem das cadeiras sempre que ano ou semestre forem alterados
  useEffect(() => {
    listarCadeiras(ano, semestre)
  }, [ano, semestre]) // A dependência é o ano e semestre

  return (
    <div className="max-w-4xl mx-auto p-6 bg-yellow-400 text-gray-800 rounded-md flex">
      <div className="w-1/2 pr-6">
        <h2 className="text-2xl font-semibold mb-4">Formulário de Inscrição</h2>

        <div className="mb-4">
          <label htmlFor="ano" className="block text-lg font-medium mb-2">
            Ano:
          </label>
          <select
            id="ano"
            value={ano}
            onChange={e => setAno(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white"
          >
            <option value="">Selecione o ano</option>
            <option value="1">1º Ano</option>
            <option value="2">2º Ano</option>
            <option value="3">3º Ano</option>
            <option value="4">4º Ano</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="semestre" className="block text-lg font-medium mb-2">
            Semestre:
          </label>
          <select
            id="semestre"
            value={semestre}
            onChange={e => setSemestre(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white"
          >
            <option value="">Selecione o semestre</option>
            <option value="1">1º Semestre</option>
            <option value="2">2º Semestre</option>
          </select>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium">Cadeiras Obrigatórias:</h3>
          <ul className="mt-2">
            {cadeiras.map((cadeira, index) => (
              <li key={index} className="text-sm text-gray-900">
                {cadeira} (Obrigatória)
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <h3 className="text-lg font-medium">
            Adicionar Cadeiras Adicionais:
          </h3>
          <div className="mb-4">
            <label
              htmlFor="anoAdicional"
              className="block text-lg font-medium mb-2"
            >
              Ano:
            </label>
            <select
              id="anoAdicional"
              className="w-full p-2 rounded-md bg-gray-700 text-white"
              onChange={e => setAno(e.target.value)}
            >
              <option value="">Selecione o ano</option>
              <option value="1">1º Ano</option>
              <option value="2">2º Ano</option>
              <option value="3">3º Ano</option>
              <option value="4">4º Ano</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="semestreAdicional"
              className="block text-lg font-medium mb-2"
            >
              Semestre:
            </label>
            <select
              id="semestreAdicional"
              className="w-full p-2 rounded-md bg-gray-700 text-white"
              onChange={e => setSemestre(e.target.value)}
            >
              <option value="">Selecione o semestre</option>
              <option value="1">1º Semestre</option>
              <option value="2">2º Semestre</option>
            </select>
          </div>

          <button
            type="button"
            onClick={() => handleAddCadeira('Exemplo Cadeira', ano, semestre)}
            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
          >
            Adicionar Cadeira
          </button>
        </div>

        {message && <div className="mt-4 text-red-600">{message}</div>}
      </div>

      <div className="w-1/2">
        <h2 className="text-2xl font-semibold mb-4">Resumo da Inscrição</h2>

        <div className="mb-4">
          <p>
            <strong>Ano:</strong> {ano || 'Não Selecionado'}
          </p>
          <p>
            <strong>Semestre:</strong> {semestre || 'Não Selecionado'}
          </p>
          <p>
            <strong>Primeira Mensalidade:</strong> {mensalidadeBase}€
          </p>
          <p>
            <strong>Cadeiras Obrigatórias:</strong> {cadeiras.join(', ')}
          </p>
          {cadeirasAdicionais.length > 0 && (
            <p>
              <strong>Cadeiras Adicionais:</strong>{' '}
              {cadeirasAdicionais
                .map(
                  c => `${c.cadeira} (${c.ano}º Ano, ${c.semestre}º Semestre)`
                )
                .join(', ')}
            </p>
          )}
          <p>
            <strong>Total a Pagar:</strong> {calcularTotal()}€
          </p>
        </div>

        <button
          type="button"
          onClick={downloadResumo}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700"
        >
          Baixar Resumo
        </button>
      </div>
    </div>
  )
}
