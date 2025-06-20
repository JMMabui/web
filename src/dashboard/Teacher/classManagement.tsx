import { useState } from 'react'
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
import {
  Download,
  Users,
  BookOpen,
  User,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  BarChart3,
  Calendar,
  GraduationCap,
} from 'lucide-react'
import Button from '@/components/Button'

export function ClassManagement() {
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'active' | 'inactive'
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
    queryKey: ['studentsSubjects', turmaSelecionada],
    queryFn: async () => {
      if (!turmaSelecionada) throw new Error('turma not found')
      return getStudentsSubjectsBySubjectId(turmaSelecionada)
    },
    enabled: !!turmaSelecionada,
  })

  if (isLoadingTeacherSubjects || isLoadingStudents) return <LoadingSkeleton />
  if (isErrorTeacherSubjects || isErrorStudents) return <ErrorComponent />

  const filteredSubjects = dataTeacherSubjects?.filter(
    s => s.status === 'ATIVO'
  )
  const filteredStudents = dataStudentsSubjects?.filter(
    s => s.status === 'INSCRITO' && s.result === 'EM_ANDAMENTO'
  )

  // Filtrar alunos por busca
  const filteredAndSearchedStudents = filteredStudents?.filter(student => {
    const matchesSearch =
      student.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.student.documentNumber
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      student.student.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Calcular estatísticas
  const calculateStats = () => {
    if (!filteredStudents)
      return { total: 0, active: 0, inactive: 0, averageAge: 0 }

    const total = filteredStudents.length
    const active = filteredStudents.filter(s => s.status === 'INSCRITO').length
    const inactive = total - active

    return { total, active, inactive, averageAge: 0 }
  }

  // Exportação mock de presenças (apenas nomes e disciplina)
  const exportToCSV = () => {
    if (!filteredStudents) return
    const headers = ['Aluno', 'Documento', 'Status', 'Disciplina']
    const rows = filteredStudents.map(s => [
      s.student.name,
      s.student.documentNumber || s.student.id,
      s.status,
      turmaSelecionada,
    ])
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join(
      '\n'
    )
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `alunos_turma_${turmaSelecionada}.csv`
    link.click()
  }

  const stats = calculateStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header com gradiente */}
        <div className="bg-gradient-to-r from-green-600 to-blue-700 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <GraduationCap className="h-8 w-8" />
                Gestão de Turmas
              </h1>
              <p className="text-green-100 mt-2">
                Gerencie suas turmas e alunos de forma eficiente
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => {}}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Relatórios
              </Button>
              <Button
                onClick={exportToCSV}
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
              <div className="p-2 bg-green-100 rounded-lg">
                <BookOpen className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Disciplina
                </h3>
                <p className="text-sm text-gray-600">Selecione a disciplina</p>
              </div>
            </div>
            <select
              value={turmaSelecionada}
              onChange={e => setTurmaSelecionada(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Informações da Turma
                </h3>
                <p className="text-sm text-gray-600">
                  Detalhes da disciplina selecionada
                </p>
              </div>
            </div>
            {turmaSelecionada && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Disciplina:</span>{' '}
                  {
                    filteredSubjects?.find(
                      s => s.subjectId === turmaSelecionada
                    )?.Subject.subjectName
                  }
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Status:</span> Ativa
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas gerais */}
        {turmaSelecionada && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Alunos</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stats.total}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.active}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <User className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Inativos</p>
                  <p className="text-2xl font-bold text-red-600">
                    {stats.inactive}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grupos</p>
                  <p className="text-2xl font-bold text-purple-600">0</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de alunos */}
        {turmaSelecionada && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Lista de Alunos
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {filteredAndSearchedStudents?.length || 0} alunos
                    encontrados
                  </p>
                </div>

                {/* Busca */}
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

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {filteredAndSearchedStudents?.map(student => (
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
                            {student.student.documentNumber ||
                              student.student.id}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium border ${
                              student.status === 'INSCRITO'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}
                          >
                            {student.status === 'INSCRITO'
                              ? 'Ativo'
                              : 'Inativo'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Ver
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
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

        {/* Seção de Grupos */}
        {turmaSelecionada && (
          <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Grupos de Trabalho
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Organize os alunos em grupos para atividades colaborativas
              </p>
            </div>

            <div className="p-6">
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Funcionalidade em Desenvolvimento
                </h3>
                <p className="text-gray-500 mb-4">
                  A funcionalidade de grupos será implementada em breve para
                  facilitar o trabalho colaborativo.
                </p>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 mx-auto"
                  disabled
                >
                  <Plus className="h-4 w-4" />
                  Criar Primeiro Grupo
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {!turmaSelecionada && (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Selecione uma disciplina
            </h3>
            <p className="text-gray-500">
              Escolha uma disciplina para começar a gerenciar sua turma
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
