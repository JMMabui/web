import { getRegistration } from '@/http/registration'
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
  }
  createdAt: Date
  updatedAt: Date | null
}

type registrationResponse = {
  registration: registrationSchema[]
}

export function Enrollment_Academic_Record() {
  // Estados para armazenar dados
  const [selectedCourse, setSelectedCourse] = useState<string>('') // Curso selecionado
  const [studentId, setStudentId] = useState<string>('') // ID do estudante
  const [studentData, setStudentData] = useState<any>() // Dados do estudante
  const [isEnrollmentCompleted, setIsEnrollmentCompleted] = useState<
    boolean | null
  >(null) // Status da matrícula

  // Consulta para buscar dados de matrícula
  const {
    data: dataRegistration,
    error: errorRegistration,
    isLoading: isLoadingRegistration,
  } = useQuery<registrationResponse>({
    queryKey: ['matricula'],
    queryFn: getRegistration,
  })

  if (isLoadingRegistration) return <div>Carregando cursos...</div>
  if (errorRegistration instanceof Error)
    return <div>Erro: {errorRegistration.message}</div>
  if (!dataRegistration)
    return <div>Não há matriculas disponíveis no momento.</div>

  // Filtrando os estudantes por curso
  const filteredStudents = dataRegistration.registration.filter(
    student => student.course.courseName === selectedCourse
  )

  // Contagem de matrículas
  const totalEnrolled = dataRegistration.registration.length // Total de matriculados
  const totalCompleted = dataRegistration.registration.filter(
    student => student.registrationStatus === 'CONFIRMADO'
  ).length
  const totalPending = dataRegistration.registration.filter(student => {
    console.log(student.registrationStatus) // Verificar o valor do status
    return student.registrationStatus === 'PENDENTE'
  }).length

  // Função para buscar dados do estudante
  const fetchStudentData = () => {
    const student = dataRegistration.registration.find(
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

  // Função para validar matrícula
  const validateEnrollment = (studentId: string) => {
    const student = dataRegistration.registration.find(
      student => student.student_id === studentId
    )
    if (student) {
      student.registrationStatus = 'CONFIRMADO' // Atualiza o status para confirmado
      setIsEnrollmentCompleted(true)
      alert(
        `Matrícula de ${student.student.name} ${student.student.surname} validada!`
      )
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Cartões de estatísticas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-600 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Total de Matriculados</h3>
          <p className="text-2xl">{totalEnrolled}</p>
        </div>
        <div className="bg-green-600 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Matrículas Completadas</h3>
          <p className="text-2xl">{totalCompleted}</p>
        </div>
        <div className="bg-red-600 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Matrículas Pendentes</h3>
          <p className="text-2xl">{totalPending}</p>
        </div>
      </div>

      {/* Seletor de Curso */}
      <div className="flex items-center space-x-4">
        <label htmlFor="course" className="text-lg">
          Selecione o Curso:
        </label>
        <select
          id="course"
          className="border rounded p-2"
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
        >
          <option value="">Selecione</option>
          {dataRegistration.registration.map(course => (
            <option key={course.id} value={course.course.courseName}>
              {course.course.courseName}
            </option>
          ))}
        </select>
      </div>

      {/* Exibir tabela de alunos */}
      {selectedCourse && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">
            Alunos Matriculados no Curso: {selectedCourse}
          </h3>
          <table className="min-w-full mt-4 table-auto border-collapse border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-center px-4 py-2">Nr de Estudante</th>
                <th className="text-center px-4 py-2">Nome</th>
                <th className="text-center px-4 py-2">Status da Matrícula</th>
                <th className="text-center px-4 py-2">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map(student => (
                  <tr key={student.id} className="bg-white">
                    <td className="text-center border px-4 py-2">
                      {student.student_id}
                    </td>
                    <td className="text-center px-4 py-2">
                      {student.student.name} {student.student.surname}
                    </td>
                    <td className="text-center px-4 py-2">
                      {student.registrationStatus === 'CONFIRMADO'
                        ? 'Completada'
                        : 'Pendente'}
                    </td>
                    <td className="text-center px-4 py-2">
                      {student.registrationStatus === 'PENDENTE' && (
                        <button
                          type="button"
                          onClick={() => validateEnrollment(student.student_id)}
                          className="bg-green-600 text-white p-2 rounded-lg"
                        >
                          Validar Matrícula
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    Nenhum aluno encontrado neste curso.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Formulário para buscar estudante */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label htmlFor="studentId" className="text-lg">
            Número do Estudante:
          </label>
          <input
            id="studentId"
            type="text"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            className="border rounded p-2"
            placeholder="Digite o número do estudante"
          />
          <button
            type="button"
            onClick={fetchStudentData}
            className="bg-blue-600 text-white p-2 rounded-lg"
          >
            Buscar Estudante
          </button>
        </div>

        {/* Exibir dados do estudante */}
        {studentData && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <h3 className="text-xl font-semibold">Dados do Estudante</h3>
            <p>
              <strong>Nome:</strong> {studentData.student.name}{' '}
              {studentData.student.surname}
            </p>
            <p>
              <strong>Curso:</strong> {studentData.course.courseName}
            </p>
            <p>
              <strong>Status da Matrícula:</strong>{' '}
              {isEnrollmentCompleted ? 'Completada' : 'Pendente'}
            </p>

            {/* Validar matrícula */}
            {studentData && !isEnrollmentCompleted && (
              <button
                type="button"
                onClick={() => validateEnrollment(studentData.student_id)}
                className="mt-4 bg-green-600 text-white p-2 rounded-lg"
              >
                Validar Matrícula
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
