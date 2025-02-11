import { Users, AlertTriangle, DollarSign, FileWarning } from 'lucide-react'

interface FinanceCardProps {
  title: string
  value: string
  icon: JSX.Element
  bgColor: string
  textColor: string
}

const FinanceCard = ({
  title,
  value,
  icon,
  bgColor,
  textColor,
}: FinanceCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow flex items-center space-x-4">
      <div className={`p-3 rounded-full ${bgColor}`}>
        <span className={textColor}>{icon}</span>
      </div>
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-gray-600 text-xl font-bold">{value}</p>
      </div>
    </div>
  )
}

export function Finance() {
  // Dados simulados
  const totalAlunos = 120
  const alunosInadimplentes = 25
  const totalPendente = 15000.0 // Valor total de mensalidades não pagas
  const totalMultas = 5 // Número de multas aplicadas

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Finanças</h2>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinanceCard
          title="Total de Alunos"
          value={`${totalAlunos}`}
          icon={<Users className="h-8 w-8" />}
          bgColor="bg-blue-100"
          textColor="text-blue-600"
        />

        <FinanceCard
          title="Alunos Inadimplentes"
          value={`${alunosInadimplentes}`}
          icon={<AlertTriangle className="h-8 w-8" />}
          bgColor="bg-red-100"
          textColor="text-red-600"
        />

        <FinanceCard
          title="Total a Receber"
          value={`R$ ${totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          icon={<DollarSign className="h-8 w-8" />}
          bgColor="bg-green-100"
          textColor="text-green-600"
        />

        <FinanceCard
          title="Multas Aplicadas"
          value={`${totalMultas}`}
          icon={<FileWarning className="h-8 w-8" />}
          bgColor="bg-yellow-100"
          textColor="text-yellow-600"
        />
      </div>

      {/* Outros componentes */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resumo Financeiro */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Resumo Financeiro</h3>
          <p className="text-gray-600">
            Saldo total:{' '}
            <span className="text-green-600 font-bold">R$ 50.000,00</span>
          </p>
          <p className="text-gray-600">
            Receita mensal:{' '}
            <span className="text-blue-600 font-bold">R$ 10.000,00</span>
          </p>
          <p className="text-gray-600">
            Despesas:{' '}
            <span className="text-red-600 font-bold">R$ 2.000,00</span>
          </p>
        </div>

        {/* Pagamentos Pendentes */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Pagamentos Pendentes</h3>
          <ul className="text-gray-600">
            <li>Aluno A - R$ 500,00</li>
            <li>Aluno B - R$ 750,00</li>
            <li>Aluno C - R$ 1.200,00</li>
          </ul>
        </div>
      </div>

      {/* Histórico de Transações */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Histórico de Transações</h3>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Data</th>
              <th className="p-2">Descrição</th>
              <th className="p-2">Valor</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-2">01/02/2025</td>
              <td className="p-2">Mensalidade - João</td>
              <td className="p-2 text-green-600">R$ 750,00</td>
              <td className="p-2 text-green-500">Pago</td>
            </tr>
            <tr className="border-b">
              <td className="p-2">02/02/2025</td>
              <td className="p-2">Mensalidade - Maria</td>
              <td className="p-2 text-red-600">R$ 800,00</td>
              <td className="p-2 text-red-500">Pendente</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
