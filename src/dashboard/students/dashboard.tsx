import { Chart } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export const Dashboard = () => {
  // Dados simulados
  const progressoAcademico = {
    concluido: 5,
    total: 10,
  }

  // Número de cadeiras que o aluno está frequentando no momento
  const cadeirasFrequentando = 4

  const mensalidadeBase = 4500 // Valor base da mensalidade
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

  const alertas = [
    'Lembre-se de pagar a mensalidade até 10/02.',
    'Você tem 3 cadeiras obrigatórias restantes para concluir o semestre.',
  ]

  // Relatórios (usando gráfico para visualizar pagamento por mês)
  const chartData = {
    labels: ['Jan', 'Fev', 'Mar'],
    datasets: [
      {
        label: 'Pagamentos',
        data: [500, 500, 500],
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  }

  // Função para calcular o progresso acadêmico em %
  const calcularProgresso = (concluido: number, total: number) =>
    (concluido / total) * 100

  // Função para calcular o total do pagamento (incluindo multa se houver)
  const calcularTotalPagamento = (valor: number, multa: boolean) =>
    multa ? valor + valor * 0.5 : valor

  return (
    <div className="max-w-4xl mx-auto p-6 bg-yellow-200 text-gray-800 rounded-md">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold mb-2">Dashboard do Aluno</h1>
        <p className="text-lg">
          Acompanhe seu progresso acadêmico e status financeiro
        </p>
      </div>

      {/* Progresso Acadêmico */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Progresso Acadêmico</h2>
          <div className="mt-2">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <span className="text-xs font-semibold inline-block py-1 uppercase">
                  Cadeiras Concluídas
                </span>
                <span className="text-xs font-semibold inline-block py-1 uppercase">
                  {progressoAcademico.concluido}/{progressoAcademico.total}
                </span>
              </div>
              <div className="flex mb-2">
                <div className="w-full bg-gray-200 rounded-full">
                  <div
                    className="bg-green-500 text-xs font-medium text-center p-0.5 leading-none rounded-l-full"
                    style={{
                      width: `${calcularProgresso(progressoAcademico.concluido, progressoAcademico.total)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cadeiras que está frequentando */}
        <div className="ml-8">
          <h2 className="text-2xl font-semibold">Cadeiras Frequentes</h2>
          <div className="mt-2">
            <span className="text-lg font-semibold">
              {cadeirasFrequentando} Cadeiras
            </span>
          </div>
        </div>
      </div>

      {/* Histórico de Pagamentos */}
      <div className="bg-yellow-300 p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-2">Histórico de Pagamentos</h3>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Data</th>
              <th className="px-4 py-2 border">Valor</th>
              <th className="px-4 py-2 border">Multa</th>
              <th className="px-4 py-2 border">Total a Pagar</th>
            </tr>
          </thead>
          <tbody>
            {pagamentos.map((pagamento, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border">{pagamento.data}</td>
                <td className="px-4 py-2 border">{pagamento.valor}.00 MZN</td>
                <td className="px-4 py-2 border">
                  {pagamento.multa ? 'Sim' : 'Não'}
                </td>
                <td className="px-4 py-2 border">
                  {calcularTotalPagamento(pagamento.valor, pagamento.multa)}.00
                  MZN
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alertas e Lembretes */}
      <div className="bg-yellow-300 p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-2">Alertas e Lembretes</h3>
        <ul className="list-disc pl-5">
          {alertas.map((alerta, index) => (
            <li key={index} className="text-sm">
              {alerta}
            </li>
          ))}
        </ul>
      </div>

      {/* Relatórios e Estatísticas */}
      <div className="bg-yellow-300 p-4 rounded-lg shadow-md mb-6">
        <h3 className="text-xl font-semibold mb-2">
          Relatórios e Estatísticas
        </h3>
        <Chart type="bar" data={chartData} />
      </div>
    </div>
  )
}
