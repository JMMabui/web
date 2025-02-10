import { useState, useEffect } from 'react';

interface Student {
  id: string; // Usando um id único para cada estudante
  name: string;
  registered: boolean;
  course: string;
}

interface Course {
  name: string;
  totalSlots: number;
}

interface EnrollmentAcademicRecordProps {
  students: Student[];
  courses: Course[];
}

export function Enrollment_Academic_Record({
  students,
  courses,
}: EnrollmentAcademicRecordProps) {
  // Estados para as estatísticas
  const [selectedCourse, setSelectedCourse] = useState<string>(''); // Curso selecionado
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]); // Alunos filtrados por curso
  const [studentId, setStudentId] = useState<string>(''); // ID do estudante
  const [studentData, setStudentData] = useState<Student | null>(null); // Dados do estudante
  const [isEnrollmentCompleted, setIsEnrollmentCompleted] = useState<boolean | null>(null); // Status da matrícula

  // Efeito para recalcular as estatísticas e filtrar alunos quando a lista mudar
  useEffect(() => {
    // Estatísticas dinâmicas
    const totalEnrolled = students.length;
    const totalCompleted = students.filter(student => student.registered).length;
    const totalPending = students.filter(student => !student.registered).length;

    // Exibir ou manipular essas estatísticas conforme necessário no UI

    // Filtrar alunos por curso, se selecionado
    if (selectedCourse) {
      const filtered = students.filter(student => student.course === selectedCourse);
      setFilteredStudents(filtered);
    }
  }, [students, selectedCourse]);

  // Função para buscar dados do estudante
  const fetchStudentData = () => {
    const student = students.find(student => student.id === studentId); // Usando ID único
    if (student) {
      setStudentData(student);
      setIsEnrollmentCompleted(student.registered);
    } else {
      setStudentData(null);
      alert('Estudante não encontrado.');
    }
  };

  // Função para validar matrícula
  const validateEnrollment = () => {
    if (studentData) {
      setIsEnrollmentCompleted(true);
      alert(`Matrícula de ${studentData.name} validada!`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Cartões de Estatísticas */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-600 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Total de Matriculados</h3>
          <p className="text-2xl">{students.length}</p> {/* Exibindo o total diretamente */}
        </div>
        <div className="bg-green-600 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Matrículas Completadas</h3>
          <p className="text-2xl">{students.filter(student => student.registered).length}</p>
        </div>
        <div className="bg-red-600 text-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Matrículas Pendentes</h3>
          <p className="text-2xl">{students.filter(student => !student.registered).length}</p>
        </div>
      </div>

      {/* Formulário para buscar dados do estudante */}
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <label htmlFor="studentId" className="text-lg">ID do Estudante:</label>
          <input
            id="studentId"
            type="text"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            className="border rounded p-2"
            placeholder="Digite o ID do estudante"
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
            <p><strong>Nome:</strong> {studentData.name}</p>
            <p><strong>Curso:</strong> {studentData.course}</p>
            <p><strong>Status da Matrícula:</strong> {isEnrollmentCompleted ? 'Completada' : 'Pendente'}</p>

            {/* Validar Matrícula */}
            {!isEnrollmentCompleted && (
              <button
                type="button"
                onClick={validateEnrollment}
                className="mt-4 bg-green-600 text-white p-2 rounded-lg"
              >
                Validar Matrícula
              </button>
            )}
          </div>
        )}
      </div>

      {/* Selecionar o Curso */}
      <div className="flex items-center space-x-4">
        <label htmlFor="course" className="text-lg">Selecione o Curso:</label>
        <select
          id="course"
          className="border rounded p-2"
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Selecione</option>
          {courses.map(course => (
            <option key={course.name} value={course.name}>{course.name}</option>
          ))}
        </select>
      </div>

      {/* Exibir alunos filtrados */}
      {selectedCourse && filteredStudents.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Alunos Matriculados no Curso: {selectedCourse}</h3>
          <ul className="space-y-2 mt-4">
            {filteredStudents.map(student => (
              <li key={student.id} className="p-4 border rounded bg-gray-50">
                <p><strong>Nome:</strong> {student.name}</p>
                <p><strong>Status da Matrícula:</strong> {student.registered ? 'Completada' : 'Pendente'}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
