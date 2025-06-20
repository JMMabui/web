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
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  FileText,
  Users,
  BarChart3,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

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

  const { data: dataStudentsSubject } = useQuery<
    StudentsSubjectsWithExtraDataResponse[]
  >({
    queryKey: ['students_subjects', turmaSelecionada],
    queryFn: () => getStudentsSubjectsBySubjectId(turmaSelecionada),
    enabled: !!turmaSelecionada,
  })

  const filteredStudents = dataStudentsSubject?.filter(
    students =>
      students.result === 'EM_ANDAMENTO' && students.status === 'INSCRITO'
  )

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

  async function handleOnSubmit(data: z.infer<typeof assessmentSchema>) {
    try {
      const { name, type, dateApplied, weight } = data

      // Verificar se o tipo começa com "EXAME"
      if (type.startsWith('EXAME')) {
        console.log('Tipo de avaliação é um exame:', type)
        await {
          name,
          type,
          dateApplied,
          weight: 100,
          subjectId: turmaSelecionada,
        }
      } else {
        console.log('Tipo de avaliação não é um exame:', type)

        await createAssessment({
          name,
          assessmentType: type,
          dateApplied,
          weight,
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
      grade: studentGrade[student.id] || 0, // Nota lançada, ou 0 caso não tenha sido lançada
    }))

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FileText className="h-8 w-8" />
                Sistema de Avaliações
              </h1>
              <p className="text-blue-100 mt-2">
                Gerencie suas avaliações e notas dos alunos
              </p>
            </div>
            {turmaSelecionada && (
              <div className="flex gap-4">
                <div className="px-4 py-2 rounded-lg bg-white/10">
                  <p className="text-sm text-blue-100">Total de Avaliações</p>
                  <p className="text-xl font-semibold">
                    {dataAssessment?.length || 0}
                  </p>
                </div>
                <div className="px-4 py-2 rounded-lg bg-white/10">
                  <p className="text-sm text-blue-100">Alunos</p>
                  <p className="text-xl font-semibold">
                    {filteredStudents?.length || 0}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Seleção de Disciplina */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Disciplina
                  </h3>
                  <p className="text-sm text-gray-600">
                    Selecione a disciplina
                  </p>
                </div>
              </div>
              <select
                value={turmaSelecionada}
                onChange={handleDisciplinaChange}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Selecione uma disciplina</option>
                {filteredSubjectsActiveted?.map(subject => (
                  <option key={subject.id} value={subject.subjectId}>
                    {subject.Subject.subjectName}
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={() => setShowAddAssessment(true)}
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
              disabled={!turmaSelecionada}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Avaliação
            </Button>
          </div>
        </div>

        {/* Mensagem de Sucesso */}
        {successMessage && (
          <div className="mb-8 p-4 rounded-lg bg-green-100 text-green-800 flex items-center justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>{successMessage}</span>
            </div>
            <Button
              onClick={() => setSuccessMessage('')}
              className="text-green-600 hover:text-green-800 transition-colors"
            >
              <AlertCircle className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Lista de Avaliações */}
        {turmaSelecionada && showDataAssessments && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Avaliações da Disciplina
                  </h3>
                  <p className="text-sm text-gray-600">
                    Total: {dataAssessment?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peso
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dataAssessment?.map((assessment: any) => (
                    <tr
                      key={assessment.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-yellow-100">
                            <FileText className="h-6 w-6 text-yellow-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {assessment.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {assessment.assessmentType.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {dayjs(assessment.dateApplied).format('DD/MM/YYYY')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className="bg-yellow-600 h-2.5 rounded-full"
                              style={{ width: `${assessment.weight}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm text-gray-600">
                            {assessment.weight}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={() =>
                              handleActionChange(assessment.id, 'editar')
                            }
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-5 h-5" />
                          </Button>
                          <Button
                            onClick={() =>
                              handleActionChange(assessment.id, 'nota')
                            }
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Lançar Notas"
                          >
                            <Target className="w-5 h-5" />
                          </Button>
                          <Button
                            onClick={() =>
                              handleActionChange(assessment.id, 'eliminar')
                            }
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Lançamento de Notas */}
        {showStudent && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Users className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Lançamento de Notas
                  </h3>
                  <p className="text-sm text-gray-600">
                    Total de Alunos: {filteredStudents?.length || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nome do Aluno
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nota
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredStudents?.map(student => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-600">
                                {student.student.name.charAt(0)}
                                {student.student.surname.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.student.name} {student.student.surname}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <input
                            type="number"
                            min="0"
                            max="20"
                            step="0.1"
                            value={studentGrade[student.id] || ''}
                            onChange={e =>
                              handleGradeChange(
                                student.id,
                                Number.parseFloat(e.target.value)
                              )
                            }
                            className="w-24 p-2 pl-8 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                            <Target className="h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            studentGrade[student.id] >= 10
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {studentGrade[student.id] >= 10
                            ? 'Aprovado'
                            : 'Reprovado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowStudent(false)
                    setShowDataAssessments(true)
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <Button
                  onClick={handleAddEvaluations}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white"
                >
                  Salvar Notas
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
