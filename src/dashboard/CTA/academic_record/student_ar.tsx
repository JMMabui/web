import { useEffect, useState } from 'react'
import { getRegistration } from '@/http/registration'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import type { RegistrationResponse } from '../../../http/registration'
import { ErrorComponent } from '@/components/ErrorComponent'
import LoadingSpinner from '@/components/LoadingSpinner'

export function Students_ar() {
  const [isAddingStudent] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStudent, setSelectedStudent] =
    useState<RegistrationResponse | null>(null)

  const navegate = useNavigate()

  const {
    data: dataRegistration,
    error: RegistrationError,
    isLoading: isLoadingRegistration,
  } = useQuery<RegistrationResponse[]>({
    queryKey: ['students_data'],
    queryFn: getRegistration,
  })

  useEffect(() => {
    if (isAddingStudent) {
      navegate('/academic_record/student_ar/add_student')
    }
  }, [isAddingStudent, navegate])

  if (isLoadingRegistration) {
    return <LoadingSpinner />
  }

  if (RegistrationError) {
    return <ErrorComponent />
  }

  const registrationData = dataRegistration

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const filteredStudents = registrationData?.filter(student => {
    const searchTermLower = searchTerm.toLowerCase()
    return (
      student.studentId.includes(searchTermLower) ||
      student.student.name.toLowerCase().includes(searchTermLower) ||
      student.student.surname.toLowerCase().includes(searchTermLower)
    )
  })

  return (
    <div className="p-6 w-full h-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Gestão de Estudantes
      </h2>
      <div className="mb-6 flex justify-end">
        <input
          type="text"
          placeholder="Pesquisar Estudante..."
          className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="overflow-x-auto max-h-full">
        {' '}
        {/* Define o scroll */}
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b text-left">Nome</th>
              <th className="px-4 py-2 border-b text-left">
                Número de Estudante
              </th>
              <th className="px-4 py-2 border-b text-left">Curso</th>
              <th className="px-4 py-2 border-b text-left">
                Estado da Matrícula
              </th>
              <th className="px-4 py-2 border-b text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents?.map(student => (
              <tr key={student.id} className="hover:bg-gray-100">
                <td className="px-4 py-2 border-b">
                  {student.student.name} {student.student.surname}
                </td>
                <td className="px-4 py-2 border-b">{student.studentId}</td>
                <td className="px-4 py-2 border-b">
                  {student.course.courseName}
                </td>
                <td className="px-4 py-2 border-b">
                  {student.registrationStatus}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(student)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg"
                  >
                    Ver Perfil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-sm">
            <h3 className="text-2xl font-semibold mb-4">
              Perfil de {selectedStudent.student.name}{' '}
              {selectedStudent.student.surname}
            </h3>
            <p>
              <strong>Numero de Estudante:</strong> {selectedStudent.studentId}
            </p>
            <p>
              <strong>Nivel Academico:</strong>{' '}
              {selectedStudent.course.levelCourse}
            </p>
            <p>
              <strong>Curso:</strong> {selectedStudent.course.courseName}
            </p>
            <p>
              <strong>Periodo:</strong> {selectedStudent.course.period}
            </p>
            <p>
              <strong>Estado da Matricula:</strong>{' '}
              {selectedStudent.registrationStatus}
            </p>
            <div className="flex space-x-2 mt-4">
              {/* Botão Fechar */}
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="bg-red-600 text-white py-2 px-4 rounded-lg w-full"
              >
                Fechar
              </button>

              {/* Botão Perfil Completo */}
              <button
                type="button"
                onClick={() =>
                  window.open(
                    `/student_profile/${selectedStudent.studentId}`,
                    '_blank'
                  )
                }
                className="bg-red-600 text-white py-2 px-4 rounded-lg w-full"
              >
                Perfil Completo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
