import Button from '@/components/Button'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import {
  createAssessment,
  getAssessmentsBySubjectId,
  deleteAssessment,
  getAssessmentById,
  updateAssessment,
} from '@/http/assessment'
import {
  createAssessmentResult,
  getAllAssessmentsResult,
  getAssessmentResultByAssessmentId,
} from '@/http/assessmentResult'
import {
  getStudentsSubjectsBySubjectId,
  type StudentsSubjectsWithExtraDataResponse,
} from '@/http/students-subjects'
import { getTeacherSubjectByTeacherId } from '@/http/teacherSubjects'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const assessmentSchema = z.object({
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  type: z.enum(
    [
      'TESTE_INDIVIDUAL',
      'TESTE_GRUPO',
      'TRABALHO_INDIVIDUAL',
      'TRABALHO_GRUPO',
      'EXAME_NORMAL',
      'EXAME_RECORRENCIA',
      'EXAME_ESPECIAL',
    ],
    {
      message: 'Tipo de avaliação é obrigatório',
    }
  ),
  dateApplied: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Data inválida',
    })
    .transform(date => dayjs(date, 'YYYY-MM-DD').toDate()),
  weight: z
    .string()
    .refine(val => !Number.isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Peso deve ser um número positivo',
    })
    .refine(
      val => {
        const num = Number(val)
        return num <= 100
      },
      {
        message: 'Peso não pode ser maior que 100',
      }
    )
    .transform(val => Number(val)),
})

export function Evaluations() {
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('')
  const [showAddAssessment, setShowAddAssessment] = useState<boolean>(false)
  const [selectedAction, setSelectedAction] = useState<string>('')
  const [assessmentId, setAssessmentId] = useState<string>('')
  const [assessmentData, setAssessmentData] = useState<any>(null)
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [showGradeReport, setShowGradeReport] = useState<boolean>(false)
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const [showStudent, setShowStudent] = useState<boolean>(false)
  const [studentGrade, setStudentGrade] = useState<{ [key: string]: number }>(
    {}
  )
  const [selectedType, setSelectedType] = useState<string>('')
  const [showDataAssessments, setShowDataAssessments] = useState<boolean>(true)

  const teacherId = localStorage.getItem('teacherId')

  const { data: dataTeacherSubjects, isLoading: isLoadingTeacherSubject } =
    useQuery({
      queryKey: ['teacherSubjects'],
      queryFn: () => getTeacherSubjectByTeacherId(teacherId || ''),
      refetchInterval: 3000,
    })

  // console.log('Dados do professor:', dataTeacherSubjects)

  const { data: dataAssessment } = useQuery({
    queryKey: ['assessment', turmaSelecionada],
    queryFn: () => getAssessmentsBySubjectId(turmaSelecionada),
    enabled: !!turmaSelecionada,
  })

  const { data: dataAssessmentResult } = useQuery({
    queryKey: ['assessment_result', assessmentId],
    queryFn: getAllAssessmentsResult,
    enabled: !!assessmentId,
  })

  // console.log('assessment result: ', dataAssessmentResult)

  const { data: dataStudentsSubject } = useQuery<
    StudentsSubjectsWithExtraDataResponse[]
  >({
    queryKey: ['students_subjects', turmaSelecionada],
    queryFn: () => getStudentsSubjectsBySubjectId(turmaSelecionada),
    enabled: !!turmaSelecionada,
  })

  // console.log('student: ', dataStudentsSubject)

  const filteredStudents = dataStudentsSubject?.filter(
    students =>
      students.result === 'EM_ANDAMENTO' && students.status === 'INSCRITO'
  )

  // console.log('estudantes filtrados: ', filteredStudents)

  const {
    register: registerAssessment,
    handleSubmit,
    formState,
    reset,
  } = useForm<z.infer<typeof assessmentSchema>>({
    resolver: zodResolver(assessmentSchema),
  })

  if (isLoadingTeacherSubject) {
    return <LoadingSkeleton />
  }

  const filteredSubjectsActiveted = dataTeacherSubjects?.filter(
    subject => subject.status === 'ATIVO'
  )

  const handleDisciplinaChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTurmaSelecionada(event.target.value)
  }

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(event.target.value)
  }

  // Quando a nota de um estudante for alterada
  const handleGradeChange = (studentId: string, grade: number) => {
    setStudentGrade(prevGrade => ({
      ...prevGrade,
      [studentId]: grade,
    }))
  }

  //   // Função para buscar e atualizar as avaliações
  // async function refreshAssessments() {
  //   const updatedAssessments = await getAllAssessments(); // Exemplo de função para obter todas as avaliações
  //   setAssessments(updatedAssessments); // Atualiza o estado com as novas avaliações
  // }

  async function handleOnSubmit(data: z.infer<typeof assessmentSchema>) {
    // console.log(data)
    try {
      const { name, type, dateApplied, weight } = data

      // Verificar se o tipo começa com "EXAME"
      if (type.startsWith('EXAME')) {
        // Lógica específica para tipos que começam com "EXAME"
        console.log('Tipo de avaliação é um exame:', type)
        await {
          name,
          type,
          dateApplied,
          weight: 100, // ou outra lógica relacionada
          subjectId: turmaSelecionada,
        }
      } else {
        // Lógica para tipos que não começam com "EXAME"
        console.log('Tipo de avaliação não é um exame:', type)

        // Neste caso, você pode enviar todos os dados, incluindo o peso
        await createAssessment({
          name,
          assessmentType: type,
          dateApplied,
          weight, // Envia o peso normalmente
          subjectId: turmaSelecionada,
        })
      }

      reset()
      setSuccessMessage('Avaliação criada com sucesso!')
      setShowAddAssessment(false)
    } catch (error) {
      console.error('Erro ao criar avaliação:', error)
      setSuccessMessage('Erro ao criar avaliação. Tente novamente.')
    }
  }

  const handleActionChange = (assessmentId: string, action: string) => {
    setAssessmentId(assessmentId)
    setSelectedAction(action)
    handleExecuteAction()
  }

  async function handleExecuteAction() {
    if (selectedAction === 'editar') {
      const assessment = await getAssessmentById(assessmentId)
      setAssessmentData(assessment)
      setShowEditForm(!showEditForm)
      setShowAddAssessment(false)
    } else if (selectedAction === 'eliminar') {
      try {
        await deleteAssessment(assessmentId)
        setSuccessMessage('Avaliação eliminada com sucesso!')
        alert('Alerta: Avaliação eliminada com sucesso!')
        //  await refreshAssessments
      } catch (error) {
        console.error('Erro ao eliminar avaliação:', error)
        setSuccessMessage('Erro ao eliminar avaliação.')
      }
    } else if (selectedAction === 'nota') {
      console.log('Lancamento de Notas')
      setShowStudent(!showStudent)
      setShowDataAssessments(false)
    }
  }

  async function handleOnEditAssessment(data: any) {
    try {
      const updatedAssessments = await updateAssessment(assessmentId, data)

      console.log('Avalicao actualizada com sucesso: ', updatedAssessments)
      setSuccessMessage('Avaliação atualizada com sucesso!')
      setShowEditForm(false)
    } catch (error) {
      setSuccessMessage('Erro ao editar avaliação.')
    }
  }

  // Função para calcular a média ponderada
  function calculateWeightedAverage(
    assessments: Array<{ grade: number; weight: number }>
  ): number {
    const totalWeight = assessments.reduce(
      (acc, assessment) => acc + assessment.weight,
      0
    )
    const weightedSum = assessments.reduce(
      (acc, assessment) => acc + assessment.grade * assessment.weight,
      0
    )

    return totalWeight > 0 ? weightedSum / totalWeight : 0
  }

  // Função para obter as avaliações de um estudante
  function getStudentAssessments(
    studentId: string,
    dataAssessment: any,
    dataAssessmentResult: any
  ) {
    return (
      dataAssessment
        ?.map((assessment: { id: string; weight: number }) => {
          const result = dataAssessmentResult?.find(
            (result: {
              assessmentId: string
              studentId: string
              grade: number
            }) =>
              result.assessmentId === assessment.id &&
              result.studentId === studentId
          )
          return result
            ? { grade: result.grade, weight: assessment.weight }
            : null
        })
        .filter(Boolean) || []
    )
  }

  // Função para determinar a situação do aluno
  function getStudentSituation(average: number) {
    return average >= 10.0 ? 'Admitido' : 'Excluído'
  }

  // Função para determinar o tipo de exame
  function getExamType(situation: string) {
    return situation === 'Admitido' ? 'Exame Normal' : 'Exame de Recurso'
  }

  // Modifique a função handleAddEvaluations para capturar as notas, studentId e subjectId
  async function handleAddEvaluations() {
    // Aqui vamos pegar as notas, o studentId e o subjectId
    const evaluations = filteredStudents?.map(student => ({
      studentId: student.studentId, // studentId de cada estudante
      // subjectId: turmaSelecionada, // subjectId (id da disciplina)
      grade: studentGrade[student.id] || 0, // Nota lançada, ou 0 caso não tenha sido lançada
    }))

    // console.log('Avaliações a serem enviadas: ', evaluations)

    try {
      const assessmentResults = await Promise.all(
        (evaluations ?? []).map(async evaluation => {
          return createAssessmentResult({
            assessmentId, // Id da avaliação que todos os estudantes devem ter
            studentId: evaluation.studentId,
            grade: evaluation.grade,
          })
        })
      )

      console.log('assessment result:, ', assessmentResults)
    } catch (error) {
      console.error('Erro ao criar avaliação:', error)
      setSuccessMessage('Erro ao criar avaliação. Tente novamente.')
    }
  }

  return (
    <div className="p-8 w-full bg-gray-50 min-h-screen">
      <div className="mb-6 flex items-center space-x-4">
        <div className="flex-1">
          <label
            htmlFor="disciplina"
            className="block text-lg font-medium text-gray-700 mb-2"
          >
            Selecione a Disciplina
          </label>
          <select
            id="disciplina"
            value={turmaSelecionada}
            onChange={handleDisciplinaChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            <option value="">Escolha uma disciplina</option>
            {filteredSubjectsActiveted
              ?.sort((a, b) => a.subjectId.localeCompare(b.subjectId))
              .map(subject => (
                <option key={subject.id} value={subject.subjectId}>
                  {subject.subjectId} - {subject.Subject.subjectName}
                </option>
              ))}
          </select>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              setShowAddAssessment(!showAddAssessment)
              setShowEditForm(false)
              reset()
            }}
          >
            Adicionar Avaliação
          </Button>
          <Button
            onClick={() => {
              setShowGradeReport(!showGradeReport)
              // setShowStudent(false)
              // setShowAddAssessment(false)
              // setShowEditForm(false)
            }}
          >
            Pauta
          </Button>
        </div>
      </div>

      {showDataAssessments && (
        <div>
          {dataAssessment && dataAssessment.length > 0 ? (
            <div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Avaliações para a disciplina:{' '}
                <span className="text-blue-600">{turmaSelecionada}</span>
              </h3>
              <div className="space-y-4">
                {dataAssessment.map(assessment => (
                  <div
                    key={assessment.id}
                    className="flex justify-between items-center bg-white p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col">
                      <span className="text-lg font-medium text-gray-700">
                        {assessment.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(assessment.dateApplied).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-lg font-medium text-gray-700">
                        {assessment.assessmentType}
                      </span>
                      <span className="text-sm text-gray-500">
                        Peso: {assessment.weight}%
                      </span>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() =>
                          handleActionChange(assessment.id, 'editar')
                        }
                        className="text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleActionChange(assessment.id, 'eliminar')
                        }
                        className="text-red-600 hover:underline ml-4"
                      >
                        Eliminar
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleActionChange(assessment.id, 'nota')
                        }
                        className="text-green-600 hover:underline ml-4"
                      >
                        Notas
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500">
              <p>Não há avaliações disponíveis para esta disciplina.</p>
            </div>
          )}
        </div>
      )}

      {showAddAssessment && (
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Criar Avaliação
          </h2>

          <form
            className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-lg"
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <div className="flex gap-6">
              <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nome
                </label>
                <input
                  id="name"
                  {...registerAssessment('name')}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                  placeholder="Nome da avaliação"
                />
                {formState.errors.name && (
                  <span className="text-red-500 text-sm">
                    {formState.errors.name.message}
                  </span>
                )}
              </div>

              <div className="flex-1">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tipo
                </label>
                <select
                  id="type"
                  {...registerAssessment('type')}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                  onChange={handleTypeChange} // Atualiza o estado ao mudar o tipo
                >
                  <option value="">--Escolha o Tipo--</option>
                  <option value="TESTE_INDIVIDUAL">Teste Individual</option>
                  <option value="TESTE_GRUPO">Teste em Grupo</option>
                  <option value="TRABALHO_INDIVIDUAL">
                    Trabalho Individual
                  </option>
                  <option value="TRABALHO_GRUPO">Trabalho em Grupo</option>
                  <option value="EXAME_NORMAL">Exame Normal</option>
                  <option value="EXAME_RECORRENCIA">
                    Exame de Recorrência
                  </option>
                  <option value="EXAME_ESPECIAL">Exame Especial</option>
                </select>
                {formState.errors.type && (
                  <span className="text-red-500 text-sm">
                    {formState.errors.type.message}
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-6 mt-4">
              <div className="flex-1">
                <label
                  htmlFor="dateApplied"
                  className="block text-sm font-medium text-gray-700"
                >
                  Data da Aplicação
                </label>
                <input
                  type="date"
                  id="dateApplied"
                  {...registerAssessment('dateApplied')}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                />
                {formState.errors.dateApplied && (
                  <span className="text-red-500 text-sm">
                    {formState.errors.dateApplied.message}
                  </span>
                )}
              </div>

              {/* Condicionalmente renderizar o campo Peso */}
              {selectedType !== 'EXAME_NORMAL' &&
                selectedType !== 'EXAME_RECORRENCIA' &&
                selectedType !== 'EXAME_ESPECIAL' && (
                  <div className="flex-1">
                    <label
                      htmlFor="weight"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Peso
                    </label>
                    <input
                      type="number"
                      id="weight"
                      {...registerAssessment('weight')}
                      className="w-full p-3 mt-2 border border-gray-300 rounded-md"
                      placeholder="Peso da avaliação"
                    />
                    {formState.errors.weight && (
                      <span className="text-red-500 text-sm">
                        {formState.errors.weight.message}
                      </span>
                    )}
                  </div>
                )}
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                type="submit"
                disabled={formState.isSubmitting}
                className="bg-amber-500 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-amber-600 transition duration-300 active:bg-amber-700"
              >
                {formState.isSubmitting ? 'Salvando...' : 'Salvar Avaliação'}
              </button>
            </div>
          </form>
        </div>
      )}

      {showEditForm && assessmentData && (
        <form
          className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-lg"
          onSubmit={handleSubmit(handleOnEditAssessment)}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Editar Avaliação
          </h2>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nome
            </label>
            <input
              id="name"
              {...registerAssessment('name')}
              defaultValue={assessmentData.name}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
              placeholder="Nome da avaliação"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700"
            >
              Tipo
            </label>
            <select
              id="type"
              {...registerAssessment('type')}
              defaultValue={assessmentData.type}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            >
              <option value="TESTE_INDIVIDUAL">Teste Individual</option>
              <option value="TESTE_GRUPO">Teste em Grupo</option>
              <option value="TRABALHO_INDIVIDUAL">Trabalho Individual</option>
              <option value="TRABALHO_GRUPO">Trabalho em Grupo</option>
              <option value="EXAME_NORMAL">Exame Normal</option>
              <option value="EXAME_RECORRENCIA">Exame de Recorrência</option>
              <option value="EXAME_ESPECIAL">Exame Especial</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="dateApplied"
              className="block text-sm font-medium text-gray-700"
            >
              Data da Aplicação
            </label>
            <input
              type="date"
              id="dateApplied"
              {...registerAssessment('dateApplied')}
              defaultValue={dayjs(assessmentData.dateApplied).format(
                'YYYY-MM-DD'
              )}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="weight"
              className="block text-sm font-medium text-gray-700"
            >
              Peso
            </label>
            <input
              type="number"
              id="weight"
              {...registerAssessment('weight')}
              defaultValue={assessmentData.weight}
              className="w-full p-3 mt-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={formState.isSubmitting}
              className="bg-amber-500 text-white px-6 py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-amber-600 transition duration-300 active:bg-amber-700"
            >
              Atualizar Avaliação
            </button>
          </div>
        </form>
      )}

      {showStudent && (
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Estudantes da disciplina {turmaSelecionada} - Avaliacao
          </h1>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Nota
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents?.map(student => (
                  <tr key={student.id} className="border-b">
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {student.student.name} {student.student.surname}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {student.status}
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={studentGrade[student.id] || ''}
                        onChange={e => {
                          const value = Number(e.target.value)

                          // Validação para garantir que a nota esteja entre 0 e 20
                          if (value >= 0 && value <= 20) {
                            handleGradeChange(student.id, value) // Atualiza a nota
                          } else {
                            // Caso a nota seja inválida, você pode exibir uma mensagem ou simplesmente ignorar
                            alert('A nota deve estar entre 0 e 20.')
                            console.log('A nota deve estar entre 0 e 20.')
                          }
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6 gap-6">
            <button
              type="button"
              className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition duration-300 active:bg-amber-700"
              onClick={() => {
                // Lógica para salvar as notas dos estudantes
                handleAddEvaluations()
                setShowDataAssessments(!showDataAssessments)
                setShowStudent(!showStudent)
              }}
            >
              Guardar Notas
            </button>

            <Button
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300 active:bg-red-700 "
              onClick={() => {
                setShowStudent(!showStudent)
                setShowDataAssessments(!showDataAssessments)
                // setShowGradeReport(!showGradeReport)
                // setShowAddAssessment(!showAddAssessment)
              }}
            >
              fechar
            </Button>
          </div>
        </div>
      )}
      {showGradeReport && (
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">Pauta</h1>

          {/* Tabela de Resultados */}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
              <thead>
                <tr className="border-b bg-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Nome
                  </th>
                  {dataAssessment?.map(assessment => (
                    <th
                      key={assessment.id}
                      className="px-6 py-3 text-left text-sm font-medium text-gray-700"
                    >
                      {assessment.name}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Média Ponderada
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Situação
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">
                    Exame
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents?.map(student => {
                  // Obter as avaliações do estudante
                  const studentAssessments = getStudentAssessments(
                    student.studentId,
                    dataAssessment,
                    dataAssessmentResult
                  )

                  // Calcular a média ponderada
                  const average = calculateWeightedAverage(studentAssessments)

                  // Determinar a situação e o exame
                  const situation = getStudentSituation(average)
                  const examType = getExamType(situation)

                  return (
                    <tr key={student.id} className="border-b">
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {student.student.name} {student.student.surname}
                      </td>

                      {dataAssessment?.map(assessment => {
                        const result = dataAssessmentResult?.find(
                          result =>
                            result.assessmentId === assessment.id &&
                            result.studentId === student.studentId
                        )
                        return (
                          <td
                            key={assessment.id}
                            className="px-6 py-4 text-sm text-gray-500"
                          >
                            {result ? result.grade : 'Não lançado'}
                          </td>
                        )
                      })}

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {average.toFixed(2)}{' '}
                        {/* Exibe a média ponderada com 2 casas decimais */}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {situation} {/* Exibe a situação do aluno */}
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {examType} {/* Exibe o tipo de exame */}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
