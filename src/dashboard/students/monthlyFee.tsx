import { useState, useEffect } from 'react'

export const MonthlyFee = () => {
  // Dados simulados da mensalidade
  const mensalidadeBase = 4500 // Valor base da mensalidade
  const dataVencimento = '10/02/2025' // Data de vencimento da mensalidade

  // Histórico de Pagamentos
  const pagamentos = [
    {
      data: '01/01/2025',
      valor: mensalidadeBase,
      status: 'Pago',
      multa: false,
    },
    {
      data: '01/02/2025',
      valor: mensalidadeBase,
      status: 'Pendente',
      multa: true,
    },
    {
      data: '01/03/2025',
      valor: mensalidadeBase,
      status: 'Pago',
      multa: false,
    },
  ]

  // Definindo os meses
  const meses = [
    { mes: 'Janeiro', data: '01/01/2025' },
    { mes: 'Fevereiro', data: '01/02/2025' },
    { mes: 'Março', data: '01/03/2025' },
    { mes: 'Abril', data: '01/04/2025' },
    { mes: 'Maio', data: '01/05/2025' },
    { mes: 'Junho', data: '01/06/2025' },
    { mes: 'Julho', data: '01/07/2025' },
    { mes: 'Agosto', data: '01/08/2025' },
    { mes: 'Setembro', data: '01/09/2025' },
    { mes: 'Outubro', data: '01/10/2025' },
    { mes: 'Novembro', data: '01/11/2025' },
    { mes: 'Dezembro', data: '01/12/2025' },
  ]

  const [mesesSelecionados, setMesesSelecionados] = useState<string[]>([])
  const [valorTotal, setValorTotal] = useState(0)
  const [mesSelecionado, setMesSelecionado] = useState<string | null>(null)

  // Função para calcular o total de pagamentos com base nos meses selecionados
  const calcularTotalPagamento = () => {
    let total = 0
    let mesesComMulta = 0

    // Contar quantos meses têm multa
    mesesSelecionados.forEach(mes => {
      const pagamento = pagamentos.find(pagamento =>
        pagamento.data.includes(mes)
      )
      if (pagamento) {
        if (pagamento.multa) {
          mesesComMulta++
        }

        // Se o status for 'Pendente', aplicamos a multa
        const valorComMulta =
          pagamento.status === 'Pendente'
            ? mensalidadeBase * 1.5 // Multa de 50% se estiver pendente
            : mensalidadeBase
        total += valorComMulta
      }
    })

    // Aplicando a regra de desconto com base no número de meses selecionados com multa
    if (mesesSelecionados.length >= 3) {
      // Desconto de multa para 3 meses ou mais
      total -= mesesComMulta * (mensalidadeBase * 0.5) // Desconto de 50% para os meses com multa
    }

    setValorTotal(total)
  }

  // Função para adicionar ou remover meses da seleção
  const handleSelectMonth = (mes: string) => {
    setMesSelecionado(mes) // Atualiza o mês selecionado

    // Verifica se o mês já foi selecionado
    setMesesSelecionados(prevState => {
      const isSelected = prevState.includes(mes)
      if (isSelected) {
        return prevState.filter(month => month !== mes)
      } else {
        return [...prevState, mes]
      }
    })
  }

  // Função para aplicar as regras de pagamento quando os meses selecionados mudam
  useEffect(() => {
    if (mesesSelecionados.length > 0) {
      calcularTotalPagamento()
    }
  }, [mesesSelecionados])

  return (
    <div className="max-w-4xl mx-auto p-6 bg-yellow-200 text-gray-800 rounded-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2">Gestão de Mensalidade</h1>
        <p className="text-lg">
          Acompanhe a sua mensalidade e selecione as mensalidades que deseja
          pagar.
        </p>
      </div>

      {/* Seleção de Meses */}
      <div className="bg-yellow-300 p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-2">
          Selecione os Meses para Pagamento
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {meses.map((mes, index) => (
            <button
              type="button"
              key={index}
              className={`p-2 rounded-md ${mesesSelecionados.includes(mes.mes) ? 'bg-green-600 text-white' : 'bg-gray-300'}`}
              onClick={() => handleSelectMonth(mes.mes)}
            >
              {mes.mes}
            </button>
          ))}
        </div>
      </div>

      {/* Detalhes do Mês Selecionado */}
      {mesSelecionado && (
        <div className="bg-yellow-300 p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-2">
            Detalhes do Mês Selecionado
          </h3>
          <p>
            <strong>Mês:</strong> {mesSelecionado}
          </p>
          <p>
            <strong>Data de Vencimento:</strong> {dataVencimento}
          </p>
          <p>
            <strong>Status:</strong>{' '}
            {
              pagamentos.find(pagamento =>
                pagamento.data.includes(mesSelecionado)
              )?.status
            }
          </p>
          <p>
            <strong>Multa:</strong>{' '}
            {pagamentos.find(pagamento =>
              pagamento.data.includes(mesSelecionado)
            )?.multa
              ? 'Sim'
              : 'Não'}
          </p>
          <p>
            <strong>Total a Pagar:</strong>{' '}
            {mensalidadeBase +
              (pagamentos.find(pagamento =>
                pagamento.data.includes(mesSelecionado)
              )?.multa
                ? mensalidadeBase * 0.5
                : 0)}{' '}
            MZN
          </p>
        </div>
      )}

      {/* Valor Total a Pagar */}
      <div className="bg-yellow-300 p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-2">Valor Total a Pagar</h3>
        <p>
          <strong>Total:</strong> {valorTotal.toFixed(2)} MZN
        </p>
        <p>
          {mesesSelecionados.length >= 3
            ? 'Ao pagar 3 meses, você está isento de multas em dois meses.'
            : 'Se pagar apenas um mês, a multa será aplicada se houver atraso.'}
        </p>
      </div>

      {/* Botão de pagamento */}
      <div className="text-center">
        <button
          type="button"
          className="w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700"
        >
          Pagar Mensalidades Selecionadas
        </button>
      </div>
    </div>
  )
}
