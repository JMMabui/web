import Button from '@/component/Button'
import {
  createAssessment,
  getAssessmentsBySubjectId,
  deleteAssessment,
  getAssessmentById,
  updateAssessment,
} from '@/http/assessment'
import { getAssessmentResultByAssessmentId } from '@/http/assessmentResult'
import { getStudentsSubjectsBySubjectId } from '@/http/students-subjects'
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

const assessmentResultSchema = z.object({
  assessmentId: z.string(),
  studentId: z.string(),
  grade: z.number(),
})

export function Evaluations() {
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('')
  const [showAddAssessment, setShowAddAssessment] = useState<boolean>(false)
  const [selectedAction, setSelectedAction] = useState<string>('')
  const [assessmentId, setAssessmentId] = useState<string>('')
  const [assessmentData, setAssessmentData] = useState<any>(null)
  const [successMessage, setSuccessMessage] = useState<string>('')
  const [showEditForm, setShowEditForm] = useState<boolean>(false)
  const [showStudent, setShowStudent] = useState<boolean>(false)
  const [studentGrade, setStudentGrade] = useState<{ [key: string]: number }>(
    {}
  )
  const [showDataAssessments, setShowDataAssessments] = useState<boolean>(true)

  const { data: dataTeacherSubjects, isLoading: isLoadingTeacherSubject } =
    useQuery({
      queryKey: ['teacherSubjects'],
      queryFn: () =>
        getTeacherSubjectByTeacherId('fda9ee19-a657-4590-9a69-6006695ae51e'),
      refetchInterval: 3000,
    })

  const { data: dataAssessment } = useQuery({
    queryKey: ['assessment', turmaSelecionada],
    queryFn: () => getAssessmentsBySubjectId(turmaSelecionada),
    enabled: !!turmaSelecionada,
  })

  const { data: dataAssessmentResult } = useQuery({
    queryKey: ['assessment_result', assessmentId],
    queryFn: () => getAssessmentResultByAssessmentId(assessmentId),
    enabled: !!assessmentId,
  })

  // console.log('assessment result: ', dataAssessmentResult)

  const { data: dataStudentsSubject } = useQuery({
    queryKey: ['students_subjects', turmaSelecionada],
    queryFn: () => getStudentsSubjectsBySubjectId(turmaSelecionada),
    enabled: !!turmaSelecionada,
  })

  console.log('student: ', dataStudentsSubject)

  const filteredStudents = dataStudentsSubject?.filter(
    students =>
      students.result === 'EM_ANDAMENTO' && students.status === 'INSCRITO'
  )

  console.log('estudantes filtrados: ', filteredStudents)

  const {
    register: registerAssessment,
    handleSubmit,
    formState,
    reset,
  } = useForm<z.infer<typeof assessmentSchema>>({
    resolver: zodResolver(assessmentSchema),
  })

  // const {
  //   register: registerAssessmentResult,
  //   handleSubmit: handleSubmitAssessmentResult,
  //   formState: formStateAssessmentResult,
  // } = useForm<z.infer<typeof assessmentResultSchema>>({
  //   resolver: zodResolver(assessmentResultSchema),
  // })

  if (isLoadingTeacherSubject) {
    return <div>Carregando...</div>
  }

  const filteredSubjectsActiveted = dataTeacherSubjects?.filter(
    subject => subject.status === 'ATIVO'
  )

  const handleDisciplinaChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTurmaSelecionada(event.target.value)
  }

  // Quando a nota de um estudante for alterada
  const handleGradeChange = (studentId: string, grade: number) => {
    setStudentGrade(prevGrade => ({
      ...prevGrade,
      [studentId]: grade,
    }))
  }

  async function handleOnSubmit(data: z.infer<typeof assessmentSchema>) {
    console.log(data)
    try {
      const { name, type, dateApplied, weight } = data
      const send = await createAssessment({
        name,
        type,
        dateApplied,
        weight,
        subjectId: turmaSelecionada,
      })
      console.log('dados Vindo da api: ', send)
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

  // Modifique a função handleAddEvaluations para capturar as notas, studentId e subjectId
  const handleAddEvaluations = () => {
    // Aqui vamos pegar as notas, o studentId e o subjectId
    const evaluations = filteredStudents?.map(student => ({
      studentId: student.id, // studentId de cada estudante
      subjectId: turmaSelecionada, // subjectId (id da disciplina)
      grade: studentGrade[student.id] || 0, // Nota lançada, ou 0 caso não tenha sido lançada
    }))

    console.log('Avaliações a serem enviadas: ', evaluations)

    // Aqui você pode fazer o que for necessário com esses dados, como enviar para a API
    // Exemplo de envio para API (substitua pelo método real que você vai usar):
    // sendAssessmentGrades(evaluations);
  }

  return (
    <div className="p-8 w-full bg-gray-50 min-h-screen">
      <div className="mb-6">
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
            ?.sort((a, b) => a.disciplineId.localeCompare(b.disciplineId))
            .map(subject => (
              <option key={subject.id} value={subject.disciplineId}>
                {subject.disciplineId} - {subject.discipline.disciplineName}
              </option>
            ))}
        </select>
        <Button
          onClick={() => {
            setShowAddAssessment(!showAddAssessment)
            setShowEditForm(false)
            reset()
          }}
        >
          Adicionar Avaliação
        </Button>
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
                        {assessment.type}
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
                        onChange={e =>
                          handleGradeChange(student.id, Number(e.target.value))
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-6">
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
          </div>
        </div>
      )}
    </div>
  )
}
