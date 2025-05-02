import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from '@/components/Button'
import { format } from 'date-fns'
import {
  mockAttendance,
  getStudentAttendance,
  getStudentById,
} from '@/mockData'
import { useQuery } from '@tanstack/react-query'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorComponent } from '@/components/ErrorComponent'
import {
  getTeacherSubjectByTeacherId,
  type teacherSubjectResponse,
} from '@/http/teacherSubjects'
import {
  getStudentsSubjectsBySubjectId,
  type StudentsSubjectsWithExtraDataResponse,
} from '@/http/students-subjects'

export function ClassManagement() {
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  )
  const [showJustificativaModal, setShowJustificativaModal] = useState<{
    studentId: string
    date: string
  } | null>(null)
  const [justificativaText, setJustificativaText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetching data
  const {
    data: dataTeacherSubjectsApi,
    isLoading: isLoadingTeacherSubjects,
    isError: isErrorTeacherSubjects,
  } = useQuery<teacherSubjectResponse[]>({
    queryKey: ['teacher'],
    queryFn: async () => {
      const teacherId = localStorage.getItem('teacherId')
      if (!teacherId) throw new Error('teacher not found')
      return getTeacherSubjectByTeacherId(teacherId)
    },
    enabled: !!localStorage.getItem('teacherId'),
  })

  const {
    data: dataStudentsSubjectsApi,
    isLoading: isLoadingStudentSubjects,
    isError: isErrorStudentsSubejcts,
  } = useQuery<StudentsSubjectsWithExtraDataResponse[]>({
    queryKey: ['studentsSubjects', turmaSelecionada],
    queryFn: async () => {
      if (!turmaSelecionada) throw new Error('turma not found')
      return getStudentsSubjectsBySubjectId(turmaSelecionada)
    },
    enabled: !!turmaSelecionada,
  })

  // Using mock data
  const dataTeacherSubjects = dataTeacherSubjectsApi?.map(subjectData => ({
    ...subjectData,
    subject: {
      ...subjectData.Subject,
      year_study: subjectData.Subject.year_study,
      semester: subjectData.Subject.semester,
    },
  }))
  const dataStudentsSujects = dataStudentsSubjectsApi?.map(subjectData => ({
    ...subjectData,
    Subject: {
      ...subjectData.Subject,
      year_study: subjectData.Subject.year_study,
      semester: subjectData.Subject.semester,
    },
  }))

  if (isLoadingTeacherSubjects || isLoadingStudentSubjects) {
    return <LoadingSkeleton />
  }
  if (isErrorTeacherSubjects || isErrorStudentsSubejcts) {
    return <ErrorComponent />
  }

  const filteredSubjectsActiveted = dataTeacherSubjects?.filter(
    subject => subject.status === 'ATIVO'
  )

  // Filter students based on selected subject
  const filteredStudentsSubject = dataStudentsSujects?.filter(
    student =>
      student.status === 'INSCRITO' && student.result === 'EM_ANDAMENTO'
  )

  // Get attendance records for the selected subject
  const subjectAttendance = mockAttendance.find(
    attendance => attendance.subjectId === turmaSelecionada
  )

  // Handle subject selection
  const handleDisciplinaChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setTurmaSelecionada(event.target.value)
  }

  // Handle attendance change
  const handlePresencaChange = (studentId: string, presente: boolean) => {
    if (!subjectAttendance) return

    const existingRecord = subjectAttendance.records.find(
      record => record.date === selectedDate
    )

    if (existingRecord) {
      const studentRecord = existingRecord.students.find(
        s => s.studentId === studentId
      )
      if (studentRecord) {
        studentRecord.present = presente
        studentRecord.justification = null
      } else {
        existingRecord.students.push({
          studentId,
          present: presente,
          justification: null,
        })
      }
    } else {
      subjectAttendance.records.push({
        date: selectedDate,
        students: [
          {
            studentId,
            present: presente,
            justification: null,
          },
        ],
      })
    }

    toast.success(
      `Presença registrada para ${getStudentById(studentId)?.student.name}`
    )
  }

  // Handle justification submission
  const handleJustificativaSubmit = () => {
    if (!showJustificativaModal || !subjectAttendance) return

    const { studentId, date } = showJustificativaModal
    const record = subjectAttendance.records.find(r => r.date === date)
    if (record) {
      const studentRecord = record.students.find(s => s.studentId === studentId)
      if (studentRecord) {
        studentRecord.justification = justificativaText
      }
    }

    setShowJustificativaModal(null)
    setJustificativaText('')
    toast.success('Justificativa registrada com sucesso!')
  }

  // Export attendance to CSV
  const exportToCSV = () => {
    if (!filteredStudentsSubject || !subjectAttendance) return

    const headers = ['Aluno', 'Data', 'Presença', 'Justificativa']
    const rows = filteredStudentsSubject.flatMap(student => {
      return subjectAttendance.records.map(record => {
        const studentRecord = record.students.find(
          s => s.studentId === student.student.id
        )
        return [
          `${student.student.name} ${student.student.surname}`,
          format(new Date(record.date), 'dd/MM/yyyy'),
          studentRecord?.present ? 'Presente' : 'Ausente',
          studentRecord?.justification || '',
        ]
      })
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `presencas_${turmaSelecionada}_${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  return (
    <div className="p-8 w-full bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        {/* Filters */}
        <div className="mb-6 flex gap-4">
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
                ?.sort((a, b) =>
                  a.subject.subjectName.localeCompare(b.subject.subjectName)
                )
                .map(subject => (
                  <option key={subject.id} value={subject.subjectId}>
                    {subject.subject.subjectName}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex-1">
            <label
              htmlFor="data"
              className="block text-lg font-medium text-gray-700 mb-2"
            >
              Data
            </label>
            <input
              type="date"
              id="data"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {turmaSelecionada && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-medium">
                Alunos da Turma {turmaSelecionada}
              </h3>
              <Button onClick={exportToCSV} disabled={isLoading}>
                Exportar Relatório
              </Button>
            </div>

            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left">Aluno</th>
                  <th className="px-4 py-2 text-left">Faltas</th>
                  <th className="px-4 py-2 text-left">Presença</th>
                  <th className="px-4 py-2 text-left">Ausente</th>
                  <th className="px-4 py-2 text-left">Justificativa</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudentsSubject?.map((studentData, index) => {
                  const studentId = studentData.student.id
                  const attendance = getStudentAttendance(
                    studentId,
                    turmaSelecionada
                  )
                  const excluido = attendance.absent > 5
                  const alreadyMarked = subjectAttendance?.records
                    .find(record => record.date === selectedDate)
                    ?.students.find(s => s.studentId === studentId)

                  return (
                    <tr
                      key={index}
                      className={`${excluido ? 'bg-red-100' : 'bg-white'}`}
                    >
                      <td className="px-4 py-2">
                        {studentData.student.name} {studentData.student.surname}{' '}
                        {excluido && (
                          <span className="text-red-500">(Excluído)</span>
                        )}
                      </td>
                      <td className="px-4 py-2">{attendance.absent}</td>
                      <td className="px-4 py-2">
                        <Button
                          onClick={() => handlePresencaChange(studentId, true)}
                          disabled={!!alreadyMarked || excluido}
                          className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                          Presente
                        </Button>
                      </td>
                      <td className="px-4 py-2">
                        <Button
                          onClick={() => handlePresencaChange(studentId, false)}
                          disabled={!!alreadyMarked || excluido}
                          className="bg-red-500 text-white px-4 py-2 rounded-md"
                        >
                          Ausente
                        </Button>
                      </td>
                      <td className="px-4 py-2">
                        {alreadyMarked?.present === false && (
                          <Button
                            onClick={() =>
                              setShowJustificativaModal({
                                studentId,
                                date: selectedDate,
                              })
                            }
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                          >
                            Adicionar Justificativa
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {showJustificativaModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h3 className="text-xl font-semibold mb-4">
                Adicionar Justificativa
              </h3>
              <textarea
                value={justificativaText}
                onChange={e => setJustificativaText(e.target.value)}
                className="w-full p-2 border rounded-md mb-4"
                rows={4}
                placeholder="Digite a justificativa da falta..."
              />
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => setShowJustificativaModal(null)}
                  className="bg-gray-500 text-white"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleJustificativaSubmit}
                  className="bg-blue-500 text-white"
                >
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
