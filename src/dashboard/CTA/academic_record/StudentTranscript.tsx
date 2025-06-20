// Componente para exibir o histórico escolar completo do aluno
// Exemplo de dados fictícios para o histórico escolar
const mockTranscript = [
  { ano: 2021, disciplina: 'Matemática', nota: 12 },
  { ano: 2021, disciplina: 'Português', nota: 9 },
  { ano: 2022, disciplina: 'História', nota: 14 },
  { ano: 2022, disciplina: 'Geografia', nota: 8 },
]

export function StudentTranscript() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Histórico Escolar do Aluno</h2>
      <table className="w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Ano</th>
            <th className="border px-2 py-1">Disciplina</th>
            <th className="border px-2 py-1">Nota</th>
            <th className="border px-2 py-1">Situação</th>
          </tr>
        </thead>
        <tbody>
          {mockTranscript.map((item, idx) => (
            <tr key={idx}>
              <td className="border px-2 py-1">{item.ano}</td>
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
