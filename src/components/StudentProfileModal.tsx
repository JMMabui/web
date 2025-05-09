import type { RegistrationResponse } from '@/http/registration'

interface StudentProfileModalProps {
  student: RegistrationResponse
  onClose: () => void
}

export function StudentProfileModal({
  student,
  onClose,
}: StudentProfileModalProps) {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-sm">
        <h3 className="text-2xl font-semibold mb-4">
          Perfil de {student.student.name} {student.student.surname}
        </h3>
        <p>
          <strong>Numero de Estudante:</strong> {student.studentId}
        </p>
        <p>
          <strong>Nivel Academico:</strong> {student.course.levelCourse}
        </p>
        <p>
          <strong>Curso:</strong> {student.course.courseName}
        </p>
        <p>
          <strong>Periodo:</strong> {student.course.period}
        </p>
        <p>
          <strong>Estado da Matricula:</strong> {student.registrationStatus}
        </p>
        <div className="flex space-x-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-600 text-white py-2 px-4 rounded-lg w-full"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={() =>
              window.open(`/student_profile/${student.studentId}`, '_blank')
            }
            className="bg-red-600 text-white py-2 px-4 rounded-lg w-full"
          >
            Perfil Completo
          </button>
        </div>
      </div>
    </div>
  )
}
