import { useState } from 'react'
import {
  User,
  CheckCircle,
  BookOpen,
  Clipboard,
  AlertCircle,
} from 'lucide-react' // Ícones de exemplo

export function Academic_Record() {
  // Dados fictícios para exemplo
  const [students, setStudents] = useState([
    { name: 'Aluno 1', registered: true, course: 'LAPA' },
    { name: 'Aluno 2', registered: false, course: 'LCA' },
    { name: 'Aluno 3', registered: true, course: 'LCA' },
    { name: 'Aluno 4', registered: true, course: 'LGA' },
    { name: 'Aluno 5', registered: false, course: 'LPST' },
    { name: 'Aluno 6', registered: false, course: 'LGA' },
    { name: 'Aluno 7', registered: true, course: 'LAPA' },
    { name: 'Aluno 8', registered: false, course: 'LD' },
    { name: 'Aluno 9', registered: true, course: 'LCA' },
    { name: 'Aluno 10', registered: false, course: 'LPST' },
    // Adicionando mais alunos
  ])

  const [courses, setCourses] = useState([
    { name: 'LAPA', totalSlots: 90 },
    { name: 'LCA', totalSlots: 90 },
    { name: 'LD', totalSlots: 90 },
    { name: 'LGA', totalSlots: 60 },
    { name: 'LPST', totalSlots: 60 },
    // Adicione mais cursos conforme necessário
  ])

  const [selectedCourse, setSelectedCourse] = useState('LAPA')

  // Cálculos baseados nos dados
  const totalStudents = students.length
  const studentsRegistered = students.filter(
    student => student.registered
  ).length
  const studentsPending = students.filter(student => !student.registered).length
  const totalCourses = courses.length
  const totalAvailableSlots = courses.reduce(
    (acc, course) => acc + course.totalSlots,
    0
  )
  const totalEnrolledSlots = students.filter(
    student => student.registered
  ).length
  const availableSlots = totalAvailableSlots - totalEnrolledSlots

  // Agrupando os alunos por curso
  const groupedByCourse = students.reduce(
    (acc: { [key: string]: typeof students }, student) => {
      if (!acc[student.course]) {
        acc[student.course] = []
      }
      acc[student.course].push(student)
      return acc
    },
    {}
  )

  const studentsInSelectedCourse = groupedByCourse[selectedCourse] || []

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Resumo do Dashboard</h2>

      {/* Cartões de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total de Alunos */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Total de Alunos</h3>
            <p className="text-xl font-bold">{totalStudents}</p>
          </div>
          <User className="w-12 h-12 text-yellow-600" />
        </div>

        {/* Alunos Inscritos */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Alunos Inscritos</h3>
            <p className="text-xl font-bold">{studentsRegistered}</p>
          </div>
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Matrículas Pendentes */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Matrículas Pendentes</h3>
            <p className="text-xl font-bold">{studentsPending}</p>
          </div>
          <AlertCircle className="w-12 h-12 text-orange-600" />
        </div>

        {/* Cursos Disponíveis */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Cursos Disponíveis</h3>
            <p className="text-xl font-bold">{totalCourses}</p>
          </div>
          <BookOpen className="w-12 h-12 text-blue-600" />
        </div>

        {/* Vagas Disponíveis */}
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Vagas Disponíveis</h3>
            <p className="text-xl font-bold">{availableSlots}</p>
          </div>
          <Clipboard className="w-12 h-12 text-red-600" />
        </div>
      </div>

      {/* Seleção de Curso */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Selecione um Curso</h3>
        <select
          className="border px-4 py-2 rounded-lg"
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
        >
          {courses.map(course => (
            <option key={course.name} value={course.name}>
              {course.name}
            </option>
          ))}
        </select>
      </div>

      {/* Detalhes dos Alunos por Curso */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">
          Detalhes dos Alunos - {selectedCourse}
        </h3>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-yellow-600 text-white">
                <th className="px-4 py-2 border border-gray-300">
                  Nome do Aluno
                </th>
                <th className="px-4 py-2 border border-gray-300">Curso</th>
                <th className="px-4 py-2 border border-gray-300">
                  Inscrição Concluída
                </th>
              </tr>
            </thead>
            <tbody>
              {studentsInSelectedCourse.map((student, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border border-gray-300">
                    {student.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {student.course}
                  </td>
                  <td className="px-4 py-2 border border-gray-300">
                    {student.registered ? 'Sim' : 'Não'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
