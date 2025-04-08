import { getStudentsSubjects } from '@/http/students-subjects'
import { getTeacherSubjectByTeacherId } from '@/http/teacherSubjects'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export function ClassManagement() {
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('')
  const [presencaPorData, setPresencaPorData] = useState<{ [studentId: string]: { [date: string]: boolean } }>({});


  // Fetching teacher subjects
  const { data: dataTeacherSubjects, isLoading: isLoadingTeacherSubject, error: errorTeacherSubject } = useQuery({
    queryKey: ['teacherSubjects'],
    queryFn: () => getTeacherSubjectByTeacherId('fda9ee19-a657-4590-9a69-6006695ae51e'),
  })

  // Fetching students subjects
  const { data: dataStudentsSujects, isLoading: isLoadingStudentsSujects, error: errorStudentsSujects } = useQuery({
    queryKey: ['studentsSubjects'],
    queryFn: getStudentsSubjects
  })

  if (isLoadingTeacherSubject || isLoadingStudentsSujects) {
    return <div>Carregando...</div>
  }

  if (errorTeacherSubject || errorStudentsSujects) {
    return <div>Ocorreu um erro ao carregar os dados</div>
  }

  const filteredSubjectsActiveted = dataTeacherSubjects?.filter((subject) => subject.status === "ATIVO")
//   console.log('filteredSubtects', filteredSubjectsActiveted)

  // Filtro para alunos com base na turma selecionada
  const filteredStudentsSubject = dataStudentsSujects?.filter((student) => student.disciplineId === turmaSelecionada && student.result === "EM_ANDAMENTO" && student.status === "INSCRITO")

//   console.log('filteredStudentsSubject', filteredStudentsSubject)


  // Função para lidar com a seleção da disciplina
  const handleDisciplinaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTurmaSelecionada(event.target.value) // Armazenando o ID da disciplina
  }

  const handlePresencaChange = (studentId: string, presente: boolean) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Obtém a data no formato YYYY-MM-DD
  
    setPresencaPorData((prevPresencas) => {
      const studentPresencas = prevPresencas[studentId] || {};
      // Verifica se já foi registrada presença ou ausência para o dia atual
      if (studentPresencas[currentDate] !== undefined) {
        return prevPresencas; // Retorna o estado anterior se já foi registrada a presença/ausência para hoje
      }
  
      // Marca presença ou ausência
      const updatedPresencas = {
        ...prevPresencas,
        [studentId]: {
          ...studentPresencas,
          [currentDate]: presente,
        },
      };
  
      return updatedPresencas;
    });
  };
  
  

  return (
    <div className="p-8 w-full bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Select para escolher a disciplina */}
        <div className="mb-6">
          <label htmlFor="disciplina" className="block text-lg font-medium text-gray-700 mb-2">
            Selecione a Disciplina
          </label>
          <select
            id="disciplina"
            value={turmaSelecionada}
            onChange={handleDisciplinaChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="">Escolha uma disciplina</option>
            {filteredSubjectsActiveted?.sort((a,b)=> a.disciplineId.localeCompare(b.disciplineId)).map((subject) => (
              <option key={subject.id} value={subject.disciplineId}>
               {subject.disciplineId} - {subject.discipline.disciplineName} 
              </option>
            ))}
          </select>
        </div>

        {/* Select para escolher a data */}
        {/* Aqui você pode adicionar a lógica para filtrar a data com base na turma selecionada */}

        {/* Exibir lista de alunos em formato de tabela se uma turma for selecionada */}
        {turmaSelecionada && (
            <div className="mb-6">
                <h3 className="text-2xl font-medium mb-4">
                Alunos da Turma {turmaSelecionada}
                </h3>
                <table className="min-w-full table-auto border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                    <th className="px-4 py-2 text-left">Aluno</th>
                    <th className="px-4 py-2 text-left">Faltas</th>
                    <th className="px-4 py-2 text-left">Presença</th>
                    <th className="px-4 py-2 text-left">Ausente</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStudentsSubject?.map((studentData, index) => {
                    const studentId = studentData.student.id;
                    const currentDate = new Date().toISOString().split('T')[0]; // Data de hoje no formato YYYY-MM-DD
                    const studentPresencas = presencaPorData[studentId] || {};
                    const faltas = Object.keys(studentPresencas).filter(date => !studentPresencas[date]).length; // Conta as ausências
                    const excluido = faltas > 5; // Exclui se o aluno tiver mais de 5 faltas

                    // Verifica se a presença já foi marcada para o dia atual
                    const alreadyMarked = studentPresencas[currentDate] !== undefined;

                    return (
                        <tr
                        key={index}
                        className={`${excluido ? 'bg-red-100' : 'bg-white'}`}
                        >
                        <td className="px-4 py-2">
                            {studentData.student.name} {studentData.student.surname}{' '}
                            {excluido && <span className="text-red-500">(Excluído)</span>}
                        </td>
                        <td className="px-4 py-2">{faltas}</td>
                        <td className="px-4 py-2">
                            <button
                            type="button"
                            onClick={() => handlePresencaChange(studentId, true)}
                            className="bg-green-500 text-white px-4 py-2 rounded-md"
                            disabled={alreadyMarked || excluido} // Desabilita se a presença já foi marcada ou se o aluno foi excluído
                            >
                            Presente
                            </button>
                        </td>
                        <td className="px-4 py-2">
                            <button
                            type="button"
                            onClick={() => handlePresencaChange(studentId, false)}
                            className="bg-red-500 text-white px-4 py-2 rounded-md"
                            disabled={alreadyMarked || excluido} // Desabilita se a ausência já foi marcada ou se o aluno foi excluído
                            >
                            Ausente
                            </button>
                        </td>
                        </tr>
                    );
                    })}
                </tbody>
                </table>
            </div>
        )}


      </div>
    </div>
  )
}
