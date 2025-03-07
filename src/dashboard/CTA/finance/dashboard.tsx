export function DashboardFinances() {
  return (
    <div className="w-full">
      <div>
        <input type="text" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Estudantes</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Nome</th>
                  <th className="py-2 text-left">Status Financeiro</th>
                  <th className="py-2 text-left">Total Pago</th>
                  <th className="py-2 text-left">Mensalidade</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">João Silva</td>
                  <td className="py-2 text-green-600">Em dia</td>
                  <td className="py-2">R$ 3.000,00</td>
                  <td className="py-2">R$ 1.000,00</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">Maria Souza</td>
                  <td className="py-2 text-red-600">Pendente</td>
                  <td className="py-2">R$ 2.500,00</td>
                  <td className="py-2">R$ 1.000,00</td>
                </tr>
                <tr>
                  <td className="py-2">Carlos Pereira</td>
                  <td className="py-2 text-green-600">Em dia</td>
                  <td className="py-2">R$ 1.000,00</td>
                  <td className="py-2">R$ 1.000,00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold">Detalhes do Aluno</h3>
          <div className="mt-4">
            <label className="text-gray-600">Selecione o Estudante</label>
            <select className="mt-2 block w-full p-2 border border-gray-300 rounded-md">
              <option>João Silva</option>
              <option>Maria Souza</option>
              <option>Carlos Pereira</option>
            </select>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold">Histórico de Pagamentos</h4>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Data</th>
                    <th className="py-2 text-left">Valor Pago</th>
                    <th className="py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">01/03/2025</td>
                    <td className="py-2">R$ 1.000,00</td>
                    <td className="py-2 text-green-600">Pago</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">15/02/2025</td>
                    <td className="py-2">R$ 1.000,00</td>
                    <td className="py-2 text-red-600">Pendente</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold">Adicionar Pagamento</h4>
            <div className="mt-4">
              <label className="text-gray-600">Valor</label>
              <input
                type="text"
                className="mt-2 p-2 w-full border border-gray-300 rounded-md"
                placeholder="R$ 1.000,00"
              />
              <button
                type="button"
                className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Registrar Pagamento
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
