import { getRegistration, validateRegistration } from '@/http/registration'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

type registrationSchema = {
  course_id: string
  student_id: string
  id: string
  registrationStatus:
    | 'PENDENTE'
    | 'CONFIRMADO'
    | 'CANCELADO'
    | 'TRANCADO'
    | 'INSCRITO'
    | 'NAO_INSCRITO'
  student: {
    surname: string
    name: string
    dateOfBirth: string
    email: string
    phone: string
  }
  course: {
    courseName: string
    levelCourse:
      | 'CURTA_DURACAO'
      | 'TECNICO_MEDIO'
      | 'LICENCIATURA'
      | 'MESTRADO'
      | 'RELIGIOSO'
    period: 'LABORAL' | 'POS_LABORAL'
    duration: string
  }
  createdAt: Date
  updatedAt: Date | null
  confirmationDate: Date | null
}

export function Enrollment_Academic_Record() {
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [studentId, setStudentId] = useState<string>('')
  const [studentData, setStudentData] = useState<registrationSchema | null>(
    null
  )
  const [isEnrollmentCompleted, setIsEnrollmentCompleted] = useState<
    boolean | null
  >(null)
  const [filterLevel, setFilterLevel] = useState<string>('') // Filtro de nível acadêmico
  const [filterStatus, setFilterStatus] = useState<string>('') // Filtro de status de matrícula

  // Consulta para buscar dados de matrícula
  const {
    data: dataRegistration,
    error: errorRegistration,
    isLoading: isLoadingRegistration,
  } = useQuery<registrationSchema[]>({
    queryKey: ['matricula'],
    queryFn: getRegistration,
  })

  if (isLoadingRegistration) return <div>Carregando dados...</div>
  if (errorRegistration)
    return (
      <div>
        Erro:{' '}
        {errorRegistration instanceof Error
          ? errorRegistration.message
          : 'Erro desconhecido'}
      </div>
    )
  if (!dataRegistration || dataRegistration.length === 0)
    return <div>Não há matrículas disponíveis no momento.</div>

  const filteredStudents = dataRegistration.filter(student => {
    console.log(student)
    const matchesCourse =
      student.course.courseName === selectedCourse || !selectedCourse
    const matchesLevel =
      student.course.levelCourse === filterLevel || !filterLevel
    const matchesStatus =
      student.registrationStatus === filterStatus || !filterStatus
    return matchesCourse && matchesLevel && matchesStatus
  })

  const totalEnrolled = dataRegistration.length
  const totalCompleted = dataRegistration.filter(
    student => student.registrationStatus === 'CONFIRMADO'
  ).length
  const totalPending = dataRegistration.filter(
    student => student.registrationStatus === 'PENDENTE'
  ).length

  const fetchStudentData = () => {
    if (!studentId) {
      alert('Por favor, insira um ID de estudante.')
      return
    }
    const student = dataRegistration.find(
      student => student.student_id === studentId
    )
    if (student) {
      setStudentData(student)
      setIsEnrollmentCompleted(student.registrationStatus === 'CONFIRMADO')
    } else {
      setStudentData(null)
      alert('Estudante não encontrado.')
    }
  }

  const validateEnrollment = async (studentId: string) => {
    const student = dataRegistration.find(
      student => student.student_id === studentId
    )
    if (student) {
      if (student.registrationStatus === 'CONFIRMADO') {
        alert('Esta matrícula já está confirmada!')
        return
      }
      await validateRegistration(studentId)
      setIsEnrollmentCompleted(true)
      alert(
        `Matrícula de ${student.student.name} ${student.student.surname} validada!`
      )
    } else {
      alert('Estudante não encontrado.')
    }
  }

  return (
    <div className="w-full p-6 space-y-6 bg-gray-50 rounded-lg shadow-md">
      {/* Filtros e pesquisa */}
      <div className="flex justify-between items-center space-x-4">
        {/* Filtro de Status da Matrícula */}
        <div className="flex items-center space-x-2">
          <label htmlFor="status" className="text-sm font-semibold">
            Status:
          </label>
          <select
            id="status"
            className="border rounded p-2 text-sm"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="PENDENTE">Pendente</option>
            <option value="CONFIRMADO">Confirmado</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        {/* Filtro de Nível Acadêmico */}
        <div className="flex items-center space-x-2">
          <label htmlFor="level" className="text-sm font-semibold">
            Nível:
          </label>
          <select
            id="level"
            className="border rounded p-2 text-sm"
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="CURTA_DURACAO">Curta Duração</option>
            <option value="TECNICO_MEDIO">Técnico Médio</option>
            <option value="LICENCIATURA">Licenciatura</option>
            <option value="MESTRADO">Mestrado</option>
            <option value="RELIGIOSO">Religioso</option>
          </select>
        </div>

        {/* Filtro de Curso */}
        <div className="flex items-center space-x-2">
          <label htmlFor="course" className="text-sm font-semibold">
            Curso:
          </label>
          <select
            id="course"
            className="border rounded p-2 text-sm"
            value={selectedCourse}
            onChange={e => setSelectedCourse(e.target.value)}
          >
            <option value="">Todos</option>
            {dataRegistration.map((student, index) => (
              <option key={index} value={student.course.courseName}>
                {student.course.courseName}
              </option>
            ))}
          </select>
        </div>

        {/* Pesquisa de Estudante */}
        <div className="flex items-center space-x-2">
          <label htmlFor="studentId" className="text-sm font-semibold">
            Número:
          </label>
          <input
            id="studentId"
            type="text"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            className="border rounded p-2 text-sm"
            placeholder="ID Estudante"
          />
          <button
            type="button"
            onClick={fetchStudentData}
            className="bg-blue-600 text-white p-2 rounded-lg text-sm hover:bg-blue-700"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Cartões de Estatísticas */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-yellow-600 text-white p-4 rounded-lg shadow-lg text-center">
          <h3 className="text-sm font-semibold">Total de Matriculados</h3>
          <p className="text-xl">{totalEnrolled}</p>
        </div>
        <div className="bg-green-600 text-white p-4 rounded-lg shadow-lg text-center">
          <h3 className="text-sm font-semibold">Matrículas Completadas</h3>
          <p className="text-xl">{totalCompleted}</p>
        </div>
        <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg text-center">
          <h3 className="text-sm font-semibold">Matrículas Pendentes</h3>
          <p className="text-xl">{totalPending}</p>
        </div>
      </div>

      {/* Tabela de Alunos Matriculados */}
      <div className="mt-6 overflow-y-auto max-h-96">
        <h3 className="text-xl font-semibold mb-4">Alunos Matriculados</h3>
        <table className="min-w-full mt-6 table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-center px-1 py-1 text-sm">Nr de Estudante</th>
              <th className="text-center px-1 py-1 text-sm">Nome</th>
              <th className="text-center px-1 py-1 text-sm">Status</th>
              <th className="text-center px-1 py-1 text-sm">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map(student => (
                <tr
                  key={student.id}
                  className="bg-white hover:bg-gray-100 transition"
                >
                  <td className="text-center border px-1 py-1 text-sm">
                    {student.student_id}
                  </td>
                  <td className="text-center px-1 py-1 text-sm">
                    {student.student.name} {student.student.surname}
                  </td>
                  <td className="text-center px-1 py-1 text-sm">
                    {student.registrationStatus === 'CONFIRMADO'
                      ? 'Completada'
                      : 'Pendente'}
                  </td>
                  <td className="text-center px-1 py-1 text-sm">
                    {student.registrationStatus === 'PENDENTE' && (
                      <button
                        type="button"
                        onClick={() => validateEnrollment(student.student_id)}
                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Validar Matrícula
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-2 text-sm text-gray-500"
                >
                  Nenhum aluno encontrado com os filtros aplicados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Exibir dados do estudante */}
      {studentData && (
        <div className="mt-6 p-6 border rounded-lg bg-gray-50 overflow-y-auto max-h-80">
          <h3 className="text-xl font-semibold">Dados do Estudante</h3>
          <p>
            <strong>Nome:</strong> {studentData.student.name}{' '}
            {studentData.student.surname}
          </p>
          <p>
            <strong>Email:</strong> {studentData.student.email}
          </p>
          <p>
            <strong>Telefone:</strong> {studentData.student.phone}
          </p>
          <p>
            <strong>Status da Matrícula:</strong>{' '}
            {studentData.registrationStatus}
          </p>
        </div>
      )}
    </div>
  )
}
