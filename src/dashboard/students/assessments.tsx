import { getAssessmentResultByStudentId } from '@/http/assessmentResult'
import { getStudentsSubjectsByStudentId } from '@/http/students-subjects'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export function Assessments() {
  // Estado para a disciplina selecionada e seu código
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('') // Adicionando estado para armazenar o código da disciplina
  const id = localStorage.getItem('student_login_id')

  // Obtendo os dados das disciplinas
  const {
    data: dataSubjects,
    isLoading: isLoadingSubjects,
    error: errorSubjects,
  } = useQuery({
    queryKey: ['subject'],
    queryFn: () => getStudentsSubjectsByStudentId(id),
  })

  // console.log('Disciplinas:', dataSubjects)

  // Obtendo os resultados de avaliação de todos os estudantes
  const {
    data: dataAssessmentResultById,
    isLoading: isLoadingAssessmentResult,
    error: errorAssessmentResult,
  } = useQuery({
    queryKey: ['assessmentstudent'],
    queryFn: () => getAssessmentResultByStudentId(id),
  })

  // console.log('Resultados de avaliação:', dataAssessmentResultById)

  if (isLoadingSubjects || isLoadingAssessmentResult) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Carregando...</div>
      </div>
    )
  }

  if (errorSubjects) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-red-600">
          Erro ao carregar as disciplinas
        </div>
      </div>
    )
  }

  if (errorAssessmentResult) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-red-600">
          Erro ao carregar os resultados da avaliação
        </div>
      </div>
    )
  }

  // Função para selecionar uma disciplina e atualizar o código da disciplina
  const handleSelectSubject = (subjectId: string, subjectCode: string) => {
    setSelectedSubject(subjectId)
    setSelectedSubjectCode(subjectCode) // Atualizando o código da disciplina
  }

  // console.log('selectedSubject:', selectedSubject)
  // console.log('selectedSubjectCode:', selectedSubjectCode) // Verificando o código da disciplina
  const filteredSubjects = dataSubjects?.filter(
    subjects =>
      subjects.status === 'INSCRITO' && subjects.result === 'REPROVADO'
  )
  console.log('Filtered subjects:', filteredSubjects)

  // Filtrando os resultados de avaliação para a disciplina selecionada
  const filteredAssessmentResults = dataAssessmentResultById?.filter(
    assessmentResult => {
      return assessmentResult.assessment.subjectId === selectedSubjectCode
    }
  )

  // console.log('Resultados filtrados:', filteredAssessmentResults)

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center text-amber-600 mb-6">
        Avaliações
      </h1>

      {/* Lista de disciplinas */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Escolha uma disciplina
        </h2>
        {Array.isArray(filteredSubjects) && filteredSubjects.length > 0 ? (
          <select
            onChange={e => {
              const selectedSubjectId = e.target.value
              const selectedSubjectData = dataSubjects?.find(
                subject => subject.id === selectedSubjectId
              )
              if (selectedSubjectData) {
                handleSelectSubject(
                  selectedSubjectId,
                  selectedSubjectData.disciplineId
                ) // Passando o código da disciplina
              }
            }}
            value={selectedSubject}
            className="w-full text-gray-700 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma disciplina</option>
            {filteredSubjects?.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.disciplineId} - {subject.discipline.disciplineName}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-center text-gray-500">
            Nenhuma disciplina disponível. Caso não tenha disciplinas
            disponíveis, verifique se você está inscrito em alguma disciplina.
          </p>
        )}
      </div>

      {/* Exibindo o código da disciplina selecionada */}
      {selectedSubject && selectedSubjectCode && (
        <div className="mb-6 text-lg text-gray-700">
          <strong>Código da Disciplina:</strong> {selectedSubjectCode}
        </div>
      )}

      {/* Tabela de resultados da avaliação */}
      <div className="overflow-x-auto">
        <h2 className="text-xl font-semibold text-gray-700 mb-3">
          Resultados da Avaliação
        </h2>
        {Array.isArray(filteredAssessmentResults) &&
        filteredAssessmentResults.length > 0 ? (
          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
            <thead className="bg-amber-500 text-white">
              <tr>
                <th className="p-3 border-b">Disciplina</th>
                <th className="p-3 border-b">Nota</th>
                <th className="p-3 border-b">Data da Avaliação</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssessmentResults.map(assessmentResult => (
                <tr key={assessmentResult.id}>
                  <td className="p-3 border-b text-gray-700">
                    {assessmentResult.assessment.name}
                  </td>
                  <td className="p-3 border-b text-gray-700">
                    {assessmentResult.grade}
                  </td>
                  <td className="p-3 border-b text-gray-700">
                    {new Date(assessmentResult.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500">
            Nenhum resultado encontrado para a disciplina selecionada.
          </p>
        )}
      </div>
    </div>
  )
}
