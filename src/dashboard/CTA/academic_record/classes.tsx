import { getRegistration, type RegistrationResponse } from '@/http/registration'
import { getSubjects, type subjectResponse } from '@/http/subjects'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

export function Classes() {
  const [className, setClassName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [selectedState, setSelectedState] = useState<string>('')
  const [classes, setClasses] = useState<any[]>([])
  const [yearStudy, setYearStudy] = useState<string>('PRIMEIRO_ANO')
  const [semester, setSemester] = useState<string>('PRIMEIRO_SEMESTRE')
  const [showForm, setShowForm] = useState(false) // Controla a visibilidade do formulário
  const [showSubjects, setShowSubjects] = useState(false)
  const [showStudents, setShowStudents] = useState(false)

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setYearStudy(e.target.value)
  }

  const handleSemesterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSemester(e.target.value)
  }

  // Consultas de dados
  const { data: dataSubjects } = useQuery<subjectResponse[]>({
    queryKey: ['dataSubjects'],
    queryFn: getSubjects,
  })

  const { data: dataRegistration } = useQuery<RegistrationResponse[]>({
    queryKey: ['dataRegistration'],
    queryFn: getRegistration,
  })

  // Filtrando as disciplinas com base no yearStudy e no selectedCourse
  const filteredSubjects =
    dataSubjects?.filter(
      subject =>
        subject.year_study === yearStudy &&
        subject.courseId === selectedCourse &&
        subject.semester === semester
    ) || []

  // Filtrando estudantes com base no selectedCourse
  const filteredStudents =
    dataRegistration?.filter(student => student.course_id === selectedCourse) ||
    []

  // Contabilizando o número de disciplinas e estudantes filtrados
  const disciplinesCount = filteredSubjects.length
  const studentCount = filteredStudents.length

  const sortedCourses = dataRegistration
    ?.map(student => student.course_id)
    .filter((value, index, self) => self.indexOf(value) === index)
    .map(courseId => {
      const student = dataRegistration?.find(
        student => student.course_id === courseId
      )
      return student
        ? {
            id: courseId,
            levelCourse: student.course.levelCourse,
            courseName: student.course.courseName,
            period: student.course.period,
          }
        : null
    })
    .filter(course => course !== null) as any[]

  useEffect(() => {
    if (selectedCourse && dataRegistration) {
      const selectedCourseData = dataRegistration.find(
        student => student.course_id === selectedCourse
      )
      if (selectedCourseData) {
        const ignoreWords = ['e', 'em', 'de', 'com']
        const courseLevel = selectedCourseData.course.levelCourse
          .charAt(0)
          .toUpperCase()
        const courseName = selectedCourseData.course.courseName
          .split(' ')
          .filter(word => !ignoreWords.includes(word.toLowerCase()))
          .map(word => word.charAt(0).toUpperCase())
          .join('')
        const period = selectedCourseData.course.period
          .toUpperCase()
          .includes('POS_LABORAL')
          ? 'PL'
          : selectedCourseData.course.period.charAt(0).toUpperCase()
        setClassName(`${courseLevel}${courseName} - ${period}`)
      }
    }
  }, [selectedCourse, dataRegistration])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newClass = {
      className,
      courseId: selectedCourse,
      disciplines: filteredSubjects.map(subjects => subjects.codigo),
      students: filteredStudents.map(student => student.id),
      semester: semester,
      state: selectedState,
      year: new Date().getFullYear(),
    }
    setClasses([...classes, newClass])
    console.log(newClass)

    // Após adicionar a turma, esconder o formulário novamente
    setShowForm(false)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Turmas</h1>

      {/* Botão para adicionar turma */}
      <div className="text-center mb-6">
        <button
          type="button"
          onClick={() => setShowForm(!showForm)} // Alterna a visibilidade do formulário
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {showForm ? 'Fechar Formulário' : 'Adicionar Turma'}
        </button>
      </div>

      {/* Formulário de criação de turma */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção do Curso */}
          <div>
            <label
              htmlFor="course"
              className="block text-sm font-medium text-gray-700"
            >
              Selecione o Curso:
            </label>
            <select
              id="course"
              value={selectedCourse}
              onChange={e => setSelectedCourse(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecione...</option>
              {sortedCourses?.map(course => (
                <option key={course.id} value={course.id}>
                  {course.levelCourse.charAt(0).toUpperCase() +
                    course.levelCourse.slice(1).toLowerCase()}{' '}
                  -{' '}
                  {course.courseName.charAt(0).toUpperCase() +
                    course.courseName.slice(1).toLowerCase()}{' '}
                  -{' '}
                  {course.period.charAt(0).toUpperCase() +
                    course.period.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Nome da Turma */}
          <div>
            <label
              htmlFor="className"
              className="block text-sm font-medium text-gray-700"
            >
              Nome da Turma:
            </label>
            <input
              id="className"
              type="text"
              placeholder="Editar se for necessário"
              value={className}
              onChange={e => setClassName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Ano da turma */}
          <div>
            <label
              htmlFor="year_study"
              className="block text-sm font-medium text-gray-700"
            >
              Ano da turma
            </label>
            <select
              id="year_study"
              name="year_study"
              value={yearStudy}
              onChange={handleYearChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="PRIMEIRO_ANO">1º Ano</option>
              <option value="SEGUNDO_ANO">2º Ano</option>
              <option value="TERCEIRO_ANO">3º Ano</option>
              <option value="QUARTO_ANO">4º Ano</option>
            </select>
          </div>

          {/**Semestre */}
          <div>
            <label
              htmlFor="semester"
              className="block text-sm font-medium text-gray-700"
            >
              Ano da turma
            </label>
            <select
              id="semester"
              name="semester"
              value={semester}
              onChange={handleSemesterChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="PRIMEIRO_SEMESTRE">1º Semestre</option>
              <option value="SEGUNDO_SEMESTRE">2º Semestre</option>
            </select>
          </div>

          {/* Descrição */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Descrição
            </label>
            <input
              id="description"
              type="text"
              placeholder="Ano atual, Nome do coordenador"
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Estado da Turma */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Estado da Turma
            </label>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Selecione ...</option>
              <option value="EM_ACTIVIDADE">Em Actividade</option>
              <option value="DESACTIVADO">Desativado</option>
            </select>
          </div>

          {/* Botão para Criar Turma */}
          <div className="text-center mt-6">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Criar Turma
            </button>
          </div>
        </form>
      )}

      {/* Tabela de Turmas */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-center mb-6">Turmas Criadas</h2>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="px-4 py-2">Nome da Turma</th>
              <th className="px-4 py-2">Ano</th>
              <th className="px-4 py-2">Disciplinas</th>
              <th className="px-4 py-2">Alunos</th>
              <th className="px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classe, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{classe.className}</td>
                <td className="px-4 py-2">{classe.year}</td>
                <td className="px-4 py-2">{disciplinesCount}</td>
                <td className="px-4 py-2">{studentCount}</td>
                <td className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => setShowSubjects(!showSubjects)}
                    className="text-indigo-600 hover:text-indigo-800 mr-4"
                  >
                    Ver Disciplinas
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowStudents(!showStudents)}
                    className="text-indigo-600 hover:text-indigo-800"
                  >
                    Ver Estudantes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showSubjects && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-100">
            <h3 className="text-xl font-semibold mb-4">Disciplinas</h3>
            <ul className="space-y-2">
              {filteredSubjects.map(subject => (
                <li key={subject.codigo} className="flex justify-between">
                  <span>{subject.disciplineName}</span>
                  <span className="text-sm text-gray-500">
                    Código: {subject.codigo}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showStudents && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-100">
            <h3 className="text-xl font-semibold mb-4">Estudantes</h3>
            <ul className="space-y-2">
              {filteredStudents.map(student => (
                <li key={student.id} className="flex justify-between">
                  <span>
                    {student.student.name} {student.student.surname}
                  </span>
                  <span className="text-sm text-gray-500">
                    codigo do estudante: {student.student_id}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
