import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorComponent } from '@/components/ErrorComponent'
import { getAssessmentResultByStudentId } from '@/http/assessmentResult'
import {
  getStudentsSubjectsByStudentId,
  type StudentsSubjectsWithExtraDataResponse,
} from '@/http/students-subjects'
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
  } = useQuery<StudentsSubjectsWithExtraDataResponse[]>({
    queryKey: ['subject'],
    queryFn: () => getStudentsSubjectsByStudentId(id),
  })

  console.log('/students_subjects/${id} ', dataSubjects)

  const {
    data: dataAssessmentResultById,
    isLoading: isLoadingAssessmentResult,
    error: errorAssessmentResult,
  } = useQuery({
    queryKey: ['assessmentstudent'],
    queryFn: () => getAssessmentResultByStudentId(id),
  })

  console.log('assessment-result/${id} ', dataAssessmentResultById)

  if (isLoadingSubjects || isLoadingAssessmentResult) {
    return <LoadingSkeleton />
  }

  if (errorSubjects || errorAssessmentResult) {
    return <ErrorComponent />
  }

  // Função para selecionar uma disciplina e atualizar o código da disciplina
  const handleSelectSubject = (subjectId: string, subjectCode: string) => {
    setSelectedSubject(subjectId)
    setSelectedSubjectCode(subjectCode) // Atualizando o código da disciplina
  }
  const filteredSubjects = dataSubjects?.filter(
    subjects =>
      subjects.status === 'INSCRITO' && subjects.result === 'EM_ANDAMENTO'
  )

  // Filtrando os resultados de avaliação para a disciplina selecionada
  const filteredAssessmentResults = dataAssessmentResultById?.filter(
    assessmentResult => {
      return (
        assessmentResult.assessment.subjectId === selectedSubjectCode &&
        !assessmentResult.assessment.assessmentType.startsWith('EXAME')
      )
    }
  )

  const filteredExams = dataAssessmentResultById?.filter(assessmentResult => {
    return (
      assessmentResult.assessment.subjectId === selectedSubjectCode &&
      assessmentResult.assessment.assessmentType.startsWith('EXAME')
    )
  })

  const filterWeight = filteredAssessmentResults?.map(assessmentResult => {
    return assessmentResult.assessment.weight
  })

  const sumWeight = filterWeight?.reduce<number>((acc, curr) => {
    const accValue = acc ?? 0
    const currValue = curr ?? 0
    return accValue + currValue
  }, 0)

  const averageFrequency = filteredAssessmentResults
    ?.reduce((acc, curr) => {
      const weight = curr.assessment.weight ?? 0
      const grade = curr.grade ?? 0
      return acc + (weight * grade) / 100
    }, 0)
    .toFixed(2)

  const filterExamsGrade = filteredExams
    ?.reduce((acc, curr) => {
      const grade = curr.grade ?? 0
      const sum = acc + grade
      return sum
    }, 0)
    .toFixed(2)

  const averageFinal = (Number(averageFrequency) + Number(filterExamsGrade)) / 2

  return (
    <div className="w-full mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center text-amber-600 mb-6">
        Avaliações
      </h1>

      {/* Lista de disciplinas */}
      <div className="mb-6">
        {Array.isArray(filteredSubjects) && filteredSubjects.length > 0 ? (
          <>
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Escolha uma disciplina
              </h2>
              <select
                onChange={e => {
                  const selectedSubjectId = e.target.value
                  const selectedSubjectData = dataSubjects?.find(
                    subject => subject.id === selectedSubjectId
                  )
                  if (selectedSubjectData) {
                    handleSelectSubject(
                      selectedSubjectId,
                      selectedSubjectData.subjectId
                    ) // Passando o código da disciplina
                  }
                }}
                value={selectedSubject}
                className="w-full text-gray-700 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma disciplina</option>
                {filteredSubjects?.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subjectId} - {subject.Subject.subjectName}
                  </option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                Resultados da Avaliação
              </h2>
              {Array.isArray(filteredAssessmentResults) &&
              filteredAssessmentResults.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                  <thead className="bg-amber-500 text-white text-center">
                    <tr>
                      <th className="p-3 border-b">Disciplina</th>
                      <th className="p-3 border-b">Nota</th>
                      <th className="p-3 border-b">Data da Avaliação</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    {filteredAssessmentResults.map(assessmentResult => (
                      <tr key={assessmentResult.id}>
                        <td className="p-3 border-b text-gray-700">
                          {assessmentResult.assessment.name}
                        </td>
                        <td className="p-3 border-b text-gray-700">
                          {assessmentResult.grade}
                        </td>
                        <td className="p-3 border-b text-gray-700">
                          {new Date(
                            assessmentResult.assessment.dateApplied
                          ).toLocaleDateString()}
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

            {/* Componentes adicionais quando a soma for 100 */}
            {sumWeight === 100 && (
              <div className="mt-8 space-y-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-xl font-semibold text-green-800 mb-4">
                    Situação da disciplina
                  </h3>
                  <p>Média frequência: {averageFrequency}</p>
                  {averageFrequency && Number(averageFrequency) < 10 ? (
                    <div>
                      <p>Situação: Reprovado</p>
                    </div>
                  ) : (
                    <div>
                      <p>Situação: Admitido para exame normal</p>
                      {Array.isArray(filteredExams) &&
                        filteredExams.length > 0 && (
                          <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                            <thead className="bg-amber-500 text-white text-center">
                              <tr>
                                <th className="p-3 border-b">Exame</th>
                                <th className="p-3 border-b">Nota</th>
                                <th className="p-3 border-b">Situacao</th>
                              </tr>
                            </thead>
                            <tbody className="text-center">
                              {filteredExams.map(exam => (
                                <tr key={exam.id}>
                                  <td className="p-3 border-b text-gray-700">
                                    {exam.assessment.name}
                                  </td>
                                  <td className="p-3 border-b text-gray-700">
                                    {exam.grade}
                                  </td>
                                  <td className="p-3 border-b text-gray-700">
                                    {exam.grade >= 10
                                      ? 'Aprovado'
                                      : 'Reprovado'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot className="bg-amber-500 text-white text-center w-full">
                              <tr>
                                <td
                                  className="p-3 border-b text-gray-700"
                                  colSpan={2}
                                >
                                  <span>Média final</span>
                                </td>
                                <td className="p-3 border-b text-gray-700">
                                  <span>{averageFinal}</span>
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-gray-500">
            Nenhuma disciplina disponível. Caso não tenha disciplinas
            disponíveis, verifique se você está inscrito em alguma disciplina.
          </p>
        )}
      </div>
    </div>
  )
}
