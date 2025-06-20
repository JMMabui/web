import { useState } from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
import { api } from '@/lib/api'
import {
  Calendar,
  Check,
  X,
  AlertTriangle,
  Download,
  BarChart3,
  History,
  User,
  BookOpen,
  Clock,
  TrendingUp,
  Users,
  FileText,
  Search,
} from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Attendance {
  id: string
  studentId: string
  studentName: string
  date: string
  status: 'present' | 'absent' | 'justified'
  justification?: string
  disciplineId: string
}

interface StudentAttendanceHistory {
  studentId: string
  studentName: string
  totalClasses: number
  presentCount: number
  absentCount: number
  justifiedCount: number
  attendancePercentage: number
  history: Attendance[]
}

export function Attendance() {
  const queryClient = useQueryClient()
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('')
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  )
  const [showJustificationModal, setShowJustificationModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedAttendance, setSelectedAttendance] =
    useState<Attendance | null>(null)
  const [selectedStudent, setSelectedStudent] =
    useState<StudentsSubjectsWithExtraDataResponse | null>(null)
  const [justification, setJustification] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'present' | 'absent' | 'justified'
  >('all')

  // Buscar disciplinas do professor
  const {
    data: dataTeacherSubjects,
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

  // Buscar alunos da turma selecionada
  const {
    data: dataStudentsSubjects,
    isLoading: isLoadingStudents,
    isError: isErrorStudents,
  } = useQuery<StudentsSubjectsWithExtraDataResponse[]>({
    queryKey: ['studentsSubjects', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) throw new Error('turma not found')
      return getStudentsSubjectsBySubjectId(selectedDiscipline)
    },
    enabled: !!selectedDiscipline,
  })

  // Buscar presenças da data selecionada
  const { data: attendance } = useQuery({
    queryKey: ['attendance', selectedDiscipline, selectedDate],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const response = await api.get(
        `/attendance?disciplineId=${selectedDiscipline}&date=${selectedDate}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Buscar histórico de presenças (últimos 30 dias)
  const { data: attendanceHistory } = useQuery({
    queryKey: ['attendanceHistory', selectedDiscipline],
    queryFn: async () => {
      if (!selectedDiscipline) return []
      const thirtyDaysAgo = format(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        'yyyy-MM-dd'
      )
      const response = await api.get(
        `/attendance/history?disciplineId=${selectedDiscipline}&startDate=${thirtyDaysAgo}`
      )
      return response.json()
    },
    enabled: !!selectedDiscipline,
  })

  // Update attendance mutation
  const updateAttendanceMutation = useMutation({
    mutationFn: async ({
      studentId,
      status,
      justification,
    }: {
      studentId: string
      status: 'present' | 'absent' | 'justified'
      justification?: string
    }) => {
      await api.post('/attendance', {
        studentId,
        disciplineId: selectedDiscipline,
        date: selectedDate,
        status,
        justification,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] })
      queryClient.invalidateQueries({ queryKey: ['attendanceHistory'] })
      setShowJustificationModal(false)
      setSelectedAttendance(null)
      setJustification('')
      alert('Frequência atualizada com sucesso.')
    },
  })

  if (isLoadingTeacherSubjects || isLoadingStudents) return <LoadingSkeleton />
  if (isErrorTeacherSubjects || isErrorStudents) return <ErrorComponent />

  const filteredSubjects = dataTeacherSubjects?.filter(
    s => s.status === 'ATIVO'
  )
  const filteredStudents = dataStudentsSubjects?.filter(
    s => s.status === 'INSCRITO' && s.result === 'EM_ANDAMENTO'
  )

  // Função auxiliar para obter status de presença
  const getAttendanceStatus = (studentId: string) => {
    try {
      if (!attendance || !Array.isArray(attendance)) return undefined
      const found = attendance.find(
        (a: Attendance) => a.studentId === studentId
      )
      return found?.status
    } catch (error) {
      console.error('Error in getAttendanceStatus:', error)
      return undefined
    }
  }

  // Filtrar alunos por busca e status
  const filteredAndSearchedStudents = filteredStudents?.filter(student => {
    const matchesSearch =
      student.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student.documentNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    // Temporariamente removido o filtro por status para evitar erro
    return matchesSearch
  })

  // Calcular estatísticas de frequência por aluno
  const calculateAttendanceStats = (
    studentId: string
  ): StudentAttendanceHistory => {
    const studentHistory =
      attendanceHistory?.filter((a: Attendance) => a.studentId === studentId) ||
      []
    const totalClasses = studentHistory.length
    const presentCount = studentHistory.filter(
      (a: Attendance) => a.status === 'present'
    ).length
    const absentCount = studentHistory.filter(
      (a: Attendance) => a.status === 'absent'
    ).length
    const justifiedCount = studentHistory.filter(
      (a: Attendance) => a.status === 'justified'
    ).length
    const attendancePercentage =
      totalClasses > 0 ? (presentCount / totalClasses) * 100 : 0

    return {
      studentId,
      studentName:
        filteredStudents?.find(s => s.student.id === studentId)?.student.name ||
        '',
      totalClasses,
      presentCount,
      absentCount,
      justifiedCount,
      attendancePercentage,
      history: studentHistory,
    }
  }

  // Calcular estatísticas gerais
  const calculateGeneralStats = () => {
    if (!filteredStudents)
      return { total: 0, present: 0, absent: 0, justified: 0, average: 0 }

    const stats = filteredStudents.map(student =>
      calculateAttendanceStats(student.student.id)
    )
    const total = stats.length
    const present = stats.reduce((sum, stat) => sum + stat.presentCount, 0)
    const absent = stats.reduce((sum, stat) => sum + stat.absentCount, 0)
    const justified = stats.reduce((sum, stat) => sum + stat.justifiedCount, 0)
    const average =
      total > 0
        ? stats.reduce((sum, stat) => sum + stat.attendancePercentage, 0) /
          total
        : 0

    return { total, present, absent, justified, average }
  }

  // Export attendance report
  const exportReport = async () => {
    if (!filteredStudents) return

    const headers = [
      'Aluno',
      'Total de Aulas',
      'Presente',
      'Ausente',
      'Justificado',
      'Percentual de Frequência',
    ]
    const rows = filteredStudents.map(student => {
      const stats = calculateAttendanceStats(student.student.id)
      return [
        student.student.name,
        stats.totalClasses,
        stats.presentCount,
        stats.absentCount,
        stats.justifiedCount,
        `${stats.attendancePercentage.toFixed(1)}%`,
      ]
    })

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(',')),
    ].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `relatorio-frequencia-${selectedDiscipline}-${format(new Date(), 'yyyy-MM-dd')}.csv`
    link.click()
  }

  const handleJustification = (
    student: StudentsSubjectsWithExtraDataResponse
  ) => {
    setSelectedAttendance({
      id: '',
      studentId: student.student.id,
      studentName: student.student.name,
      date: selectedDate,
      status: 'absent',
      disciplineId: selectedDiscipline,
    })
    setShowJustificationModal(true)
  }

  const handleHistory = (student: StudentsSubjectsWithExtraDataResponse) => {
    setSelectedStudent(student)
    setShowHistoryModal(true)
  }

  const submitJustification = () => {
    if (!selectedAttendance) return
    updateAttendanceMutation.mutate({
      studentId: selectedAttendance.studentId,
      status: 'justified',
      justification,
    })
  }

  const getStatusColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'justified':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const generalStats = calculateGeneralStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Calendar className="h-8 w-8" />
                Controle de Frequência
              </h1>
              <p className="text-blue-100 mt-2">
                Gerencie a presença dos alunos de forma eficiente
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowReportModal(true)}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Relatório Geral
              </Button>
              <Button
                onClick={exportReport}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Cards de seleção */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Disciplina
                </h3>
                <p className="text-sm text-gray-600">Selecione a disciplina</p>
              </div>
            </div>
            <select
              value={selectedDiscipline}
              onChange={e => setSelectedDiscipline(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="">Selecione uma disciplina</option>
              {filteredSubjects?.map(subject => (
                <option key={subject.id} value={subject.subjectId}>
                  {subject.Subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Data da Aula
                </h3>
                <p className="text-sm text-gray-600">Selecione a data</p>
              </div>
            </div>
            <Input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Estatísticas gerais */}
        {selectedDiscipline && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Alunos</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {generalStats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Presentes</p>
                  <p className="text-2xl font-bold text-green-600">
                    {generalStats.present}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <X className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ausentes</p>
                  <p className="text-2xl font-bold text-red-600">
                    {generalStats.absent}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Justificados</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {generalStats.justified}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Média Geral</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {generalStats.average.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de presença */}
        {selectedDiscipline && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Lista de Presença
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {format(new Date(selectedDate), "dd 'de' MMMM 'de' yyyy")}
                  </p>
                </div>

                {/* Filtros e busca */}
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar aluno..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <select
                    value={filterStatus}
                    onChange={e => setFilterStatus(e.target.value as any)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Todos</option>
                    <option value="present">Presentes</option>
                    <option value="absent">Ausentes</option>
                    <option value="justified">Justificados</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {filteredAndSearchedStudents?.map(student => {
                  const currentStatus = getAttendanceStatus(student.student.id)
                  const stats = calculateAttendanceStats(student.student.id)

                  return (
                    <div
                      key={student.student.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 bg-gradient-to-r from-gray-50 to-white"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <User className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">
                              {student.student.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {student.student.documentNumber}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(stats.attendancePercentage)}`}
                            >
                              {stats.attendancePercentage.toFixed(1)}% de
                              frequência
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleHistory(student)}
                              className="flex items-center gap-1"
                            >
                              <History className="h-4 w-4" />
                              Histórico
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant={
                            currentStatus === 'present' ? 'primary' : 'outline'
                          }
                          size="sm"
                          onClick={() =>
                            updateAttendanceMutation.mutate({
                              studentId: student.student.id,
                              status: 'present',
                            })
                          }
                          className="flex items-center gap-1"
                        >
                          <Check className="h-4 w-4" />
                          Presente
                        </Button>
                        <Button
                          variant={
                            currentStatus === 'absent' ? 'danger' : 'outline'
                          }
                          size="sm"
                          onClick={() =>
                            updateAttendanceMutation.mutate({
                              studentId: student.student.id,
                              status: 'absent',
                            })
                          }
                          className="flex items-center gap-1"
                        >
                          <X className="h-4 w-4" />
                          Ausente
                        </Button>
                        <Button
                          variant={
                            currentStatus === 'justified'
                              ? 'secondary'
                              : 'outline'
                          }
                          size="sm"
                          onClick={() => handleJustification(student)}
                          className="flex items-center gap-1"
                        >
                          <AlertTriangle className="h-4 w-4" />
                          Justificado
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredAndSearchedStudents?.length === 0 && (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Nenhum aluno encontrado</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {!selectedDiscipline && (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Selecione uma disciplina
            </h3>
            <p className="text-gray-500">
              Escolha uma disciplina para começar a registrar as presenças
            </p>
          </div>
        )}

        {/* Modal de Justificativa */}
        {showJustificationModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-2">
                Justificativa de Ausência
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Justificativa para {selectedAttendance?.studentName}
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Justificativa</label>
                  <Input
                    value={justification}
                    onChange={e => setJustification(e.target.value)}
                    placeholder="Digite a justificativa da ausência"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowJustificationModal(false)
                      setSelectedAttendance(null)
                      setJustification('')
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button onClick={submitJustification}>Salvar</Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Histórico */}
        {showHistoryModal && selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">
                Histórico de Presenças
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {selectedStudent.student.name} - Últimos 30 dias
              </p>

              {(() => {
                const stats = calculateAttendanceStats(
                  selectedStudent.student.id
                )
                return (
                  <div className="space-y-4">
                    <div className="grid grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-600">Total de Aulas</p>
                        <p className="text-2xl font-bold">
                          {stats.totalClasses}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Presente</p>
                        <p className="text-2xl font-bold text-green-600">
                          {stats.presentCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Ausente</p>
                        <p className="text-2xl font-bold text-red-600">
                          {stats.absentCount}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Frequência</p>
                        <p
                          className={`text-2xl font-bold ${getStatusColor(stats.attendancePercentage)}`}
                        >
                          {stats.attendancePercentage.toFixed(1)}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Histórico Detalhado</h4>
                      {stats.history.map((record, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded"
                        >
                          <div>
                            <p className="font-medium">
                              {format(new Date(record.date), 'dd/MM/yyyy')}
                            </p>
                            {record.justification && (
                              <p className="text-sm text-gray-600">
                                Justificativa: {record.justification}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              record.status === 'present'
                                ? 'bg-green-100 text-green-800'
                                : record.status === 'justified'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {record.status === 'present'
                              ? 'Presente'
                              : record.status === 'justified'
                                ? 'Justificado'
                                : 'Ausente'}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowHistoryModal(false)
                          setSelectedStudent(null)
                        }}
                      >
                        Fechar
                      </Button>
                    </div>
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        {/* Modal de Relatório Geral */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
              <h3 className="text-lg font-semibold mb-2">
                Relatório Geral de Frequência
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Últimos 30 dias -{' '}
                {
                  filteredSubjects?.find(
                    s => s.subjectId === selectedDiscipline
                  )?.Subject.subjectName
                }
              </p>

              <div className="space-y-4">
                {filteredStudents?.map(student => {
                  const stats = calculateAttendanceStats(student.student.id)
                  return (
                    <div
                      key={student.student.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <User className="h-8 w-8 text-gray-400" />
                        <div>
                          <p className="font-medium">{student.student.name}</p>
                          <p className="text-sm text-gray-600">
                            {student.student.documentNumber}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Presente</p>
                          <p className="text-lg font-bold text-green-600">
                            {stats.presentCount}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Ausente</p>
                          <p className="text-lg font-bold text-red-600">
                            {stats.absentCount}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Justificado</p>
                          <p className="text-lg font-bold text-yellow-600">
                            {stats.justifiedCount}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Frequência</p>
                          <p
                            className={`text-lg font-bold ${getStatusColor(stats.attendancePercentage)}`}
                          >
                            {stats.attendancePercentage.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowReportModal(false)}
                >
                  Fechar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
