import type { RegistrationResponse } from '@/http/registration'

interface StudentsTableProps {
  students: RegistrationResponse[] | undefined
  onSelectStudent: (student: RegistrationResponse) => void
}

export function StudentsTable({
  students,
  onSelectStudent,
}: StudentsTableProps) {
  return (
    <div className="overflow-x-auto max-h-full">
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
          {students?.map(student => (
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
                  onClick={() => onSelectStudent(student)}
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
  )
}
