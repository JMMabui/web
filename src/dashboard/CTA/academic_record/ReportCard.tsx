// Componente para emissão de boletins e relatórios de desempenho
// Exemplo de dados fictícios para o boletim
const mockReport = [
  { disciplina: 'Matemática', nota: 12 },
  { disciplina: 'Português', nota: 9 },
  { disciplina: 'História', nota: 14 },
]

export function ReportCard() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">
        Boletim e Relatórios de Desempenho
      </h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Disciplina</th>
            <th className="border px-2 py-1">Nota</th>
            <th className="border px-2 py-1">Situação</th>
          </tr>
        </thead>
        <tbody>
          {mockReport.map((item, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{item.disciplina}</td>
              <td className="border px-2 py-1">{item.nota}</td>
              <td className="border px-2 py-1">
                {item.nota >= 10 ? 'Aprovado' : 'Reprovado'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
