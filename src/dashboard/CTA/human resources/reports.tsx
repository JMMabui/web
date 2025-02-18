import { useState } from 'react';
import { Search } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  date: string;
}

const ReportRow = ({ report }: { report: Report }) => {
  return (
    <tr>
      <td className="p-3 border-b">{report.id}</td>
      <td className="p-3 border-b">{report.name}</td>
      <td className="p-3 border-b">{report.date}</td>
      <td className="p-3 border-b">
        <button type='button' className="bg-blue-500 text-white py-1 px-3 rounded-md">
          Visualizar
        </button>
      </td>
    </tr>
  );
};

export function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [reports] = useState([
    { id: '1', name: 'Relatório de Funcionários', date: '2025-02-01' },
    { id: '2', name: 'Relatório de Admissões', date: '2025-02-15' },
    { id: '3', name: 'Relatório de Desligamentos', date: '2025-01-30' },
    // Adicione mais relatórios aqui conforme necessário
  ]);

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Filtro de Pesquisa */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">Relatórios de Recursos Humanos</h2>
        <div className="flex items-center gap-3">
          <Search size={20} className="text-gray-600" />
          <input
            type="text"
            placeholder="Pesquisar relatório..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded-md"
          />
        </div>
      </div>

      {/* Tabela de Relatórios */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nome do Relatório</th>
            <th className="p-3 text-left">Data</th>
            <th className="p-3 text-left">Ação</th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => <ReportRow key={report.id} report={report} />)
          ) : (
            <tr>
              <td colSpan={4} className="p-3 text-center text-gray-500">
                Nenhum relatório encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
