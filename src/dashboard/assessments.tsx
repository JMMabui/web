import { useState } from 'react'

export const Assessments = () => {
  const [cadeiraSelecionada, setCadeiraSelecionada] = useState<string>('')
  const [avaliacoes, setAvaliacoes] = useState<Array<any>>([])
  const [frequencia, setFrequencia] = useState<any>({})

  // Dados simulados das avaliações
  const avaliacoesPorCadeira: Record<string, Array<any>> = {
    'Matemática 1': [
      { data: '01/12/2024', tipo: 'Prova', nota: 17, peso: 40 },
      { data: '15/12/2024', tipo: 'Trabalho', nota: 18, peso: 60 },
    ],
    'Física 1': [
      { data: '10/12/2024', tipo: 'Prova', nota: 14, peso: 50 },
      { data: '20/12/2024', tipo: 'Experimento', nota: 16, peso: 50 },
    ],
    'Cultura 1': [
      { data: '10/12/2024', tipo: 'Prova', nota: 10, peso: 50 },
      { data: '20/12/2024', tipo: 'Experimento', nota: 10, peso: 50 },
    ],
  }

  // Dados simulados de frequência
  const frequenciasPorCadeira: Record<string, any> = {
    'Matemática 1': {
      docente: 'Prof. João Silva',
      media: 12,
      situacao: 'Admitido',
      notaExame: 16,
    },
    'Física 1': {
      docente: 'Prof. Maria Souza',
      media: 9,
      situacao: 'Excluído',
      notaExame: 0,
    },
    'Cultura 1': {
      docente: 'Prof. Alberto',
      media: 10,
      situacao: 'Admitido',
      notaExame: 5,
    },
  }

  // Função para lidar com a seleção da cadeira
  const handleSelectCadeira = (cadeira: string) => {
    setCadeiraSelecionada(cadeira)
    setAvaliacoes(avaliacoesPorCadeira[cadeira] || [])
    setFrequencia(frequenciasPorCadeira[cadeira] || {})
  }

  // Função para verificar a situação do exame
  const verificarSituacaoExame = (notaExame: number) => {
    const notaMinima = 10
    if (notaExame < notaMinima) {
      return 'Exame de Recorrência'
    }
    return 'Aprovado'
  }

  // Função para verificar a situação final
  const verificarSituacaoFinal = (
    mediaFrequencia: number,
    notaExame: number
  ) => {
    const notaMinima = 10
    if (mediaFrequencia >= 10 && notaExame >= notaMinima) {
      return 'Aprovado'
    }
    if (notaExame >= notaMinima) {
      return 'Aprovado após Recorrência'
    }
    return 'Reprovado'
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-yellow-200 text-black rounded-md">
      <h2 className="text-2xl font-semibold mb-4">
        Selecione uma Cadeira para Ver as Avaliações
      </h2>

      <div className="mb-4">
        <label htmlFor="cadeira" className="block text-lg font-medium mb-2">
          Cadeira:
        </label>
        <select
          id="cadeira"
          value={cadeiraSelecionada}
          onChange={e => handleSelectCadeira(e.target.value)}
          className="w-full p-2 rounded-md bg-yellow-300 text-black"
        >
          <option value="">Selecione a cadeira</option>
          {Object.keys(avaliacoesPorCadeira).map(cadeira => (
            <option key={cadeira} value={cadeira}>
              {cadeira}
            </option>
          ))}
        </select>
      </div>

      {cadeiraSelecionada && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">
            Avaliações para {cadeiraSelecionada}:
          </h3>
          <table className="min-w-full mt-4 border-collapse border border-yellow-500">
            <thead>
              <tr>
                <th className="px-4 py-2 border bg-yellow-300">Data</th>
                <th className="px-4 py-2 border bg-yellow-300">
                  Tipo de Avaliação
                </th>
                <th className="px-4 py-2 border bg-yellow-300">Nota (0-20)</th>
                <th className="px-4 py-2 border bg-yellow-300">Peso (%)</th>
              </tr>
            </thead>
            <tbody>
              {avaliacoes.length > 0 ? (
                avaliacoes.map((avaliacao, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border">{avaliacao.data}</td>
                    <td className="px-4 py-2 border">{avaliacao.tipo}</td>
                    <td className="px-4 py-2 border">{avaliacao.nota}</td>
                    <td className="px-4 py-2 border">{avaliacao.peso}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-2 text-center border">
                    Nenhuma avaliação disponível.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {cadeiraSelecionada && frequencia && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">
            Frequência para {cadeiraSelecionada}:
          </h3>
          <p>
            <strong>Docente:</strong> {frequencia.docente}
          </p>
          <p>
            <strong>Média de Frequência:</strong> {frequencia.media}
          </p>
          <p>
            <strong>Situação:</strong>{' '}
            {frequencia.situacao === 'Admitido' ? 'Admitido' : 'Excluído'}
          </p>

          {(frequencia.situacao === 'Admitido' ||
            frequencia.situacao === 'Exame de Recorrência') &&
            frequencia.notaExame !== undefined && (
              <>
                <p>
                  <strong>Nota do Exame:</strong> {frequencia.notaExame}
                </p>
                <p>
                  <strong>Situação do Exame:</strong>{' '}
                  {verificarSituacaoExame(frequencia.notaExame)}
                </p>
              </>
            )}

          <p>
            <strong>Situação Final:</strong>{' '}
            {verificarSituacaoFinal(frequencia.media, frequencia.notaExame)}
          </p>
        </div>
      )}
    </div>
  )
}
