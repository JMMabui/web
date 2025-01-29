import { useState } from 'react'

export function Inscricao() {
  const [selectedCourse, setSelectedCourse] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<string>('')
  const [courses, setCourses] = useState<Course[]>([]) // Define tipo para cursos
  const [courseAvailability, setCourseAvailability] = useState<number | null>(
    null
  ) // Vagas disponíveis

  // Tipo para o curso
  type Course = {
    name: string
    vacancies: number
  }

  // Dados dos cursos por nível acadêmico com as vagas
  const coursesByLevel: Record<string, Course[]> = {
    'Curta Duração': [{ name: 'Curso de Ensino de Infancia', vacancies: 10 }],
    'Técnico Médio': [
      { name: 'Técnico em Accao Social', vacancies: 5 },
      { name: 'Técnico em Contabilidade', vacancies: 8 },
      { name: 'Técnico em Educacao de Infancia', vacancies: 3 },
      { name: 'Técnico em Gestao de Recursos Humanos', vacancies: 7 },
    ],
    Licenciatura: [
      {
        name: 'Licenciatura em Administracao Publica e Auditoria',
        vacancies: 15,
      },
      { name: 'Licenciatura em Contabilidade e Auditoria', vacancies: 20 },
      { name: 'Licenciatura em Direito', vacancies: 12 },
      { name: 'Licenciatura em Filosofia e Etica', vacancies: 9 },
      {
        name: 'Licenciatura em Gestao Ambiental com Habilidade em Turismo',
        vacancies: 5,
      },
      { name: 'Licenciatura em Gestao de Empresas', vacancies: 10 },
      { name: 'Licenciatura em Gestao de Recursos Humanos', vacancies: 8 },
      { name: 'Licenciatura em Psicologia Social e do Trabalho', vacancies: 6 },
      { name: 'Licenciatura em Servico Social', vacancies: 13 },
    ],
    Religioso: [
      { name: 'Curso de Teologia da Vida Consagrada', vacancies: 2 },
      { name: 'Curso de Postulantes', vacancies: 4 },
      { name: 'Curso de Teologia Pastoral', vacancies: 3 },
    ],
    Mestrado: [{ name: 'Mestrado em Servico social', vacancies: 7 }],
  }

  // Atualiza os cursos disponíveis com base no nível acadêmico
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = e.target.value
    setSelectedLevel(level)
    // Atualiza a lista de cursos com base no nível selecionado
    if (coursesByLevel[level]) {
      setCourses(coursesByLevel[level])
    } else {
      setCourses([])
    }
    setSelectedCourse('') // Reseta o curso selecionado
    setCourseAvailability(null) // Reseta a disponibilidade do curso
  }

  // Atualiza a disponibilidade do curso quando ele é selecionado
  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseName = e.target.value
    setSelectedCourse(courseName)

    // Encontra o curso selecionado e define o número de vagas
    const course = courses.find(course => course.name === courseName)
    setCourseAvailability(course ? course.vacancies : null)
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-xl font-semibold">Inscrição</h2>
      <p className="text-gray-600">
        Atenção, só poderá se inscrever apenas a cursos que são compatíveis com
        o seu nível pré-escolar
      </p>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block font-semibold">Nível Acadêmico</label>
          <select
            className="border p-2 rounded-md w-full mt-1"
            onChange={handleLevelChange}
            value={selectedLevel}
          >
            <option>--Escolha--</option>
            <option>Curta Duração</option>
            <option>Técnico Médio</option>
            <option>Licenciatura</option>
            <option>Religioso</option>
            <option>Mestrado</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Período</label>
          <select className="border p-2 rounded-md w-full mt-1">
            <option>Laboral</option>
            <option>Pós-laboral</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block font-semibold">
            Cursos{' '}
            <span className="text-gray-500">
              (selecione um dos cursos com base na disponibilidade)
            </span>
          </label>
          <select
            className="border p-2 rounded-md w-full mt-1"
            onChange={handleCourseChange}
            value={selectedCourse}
            disabled={!selectedLevel}
          >
            <option>--Selecione o curso--</option>
            {courses.map(course => (
              <option key={course.name} value={course.name}>
                {course.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h3 className="mt-6 font-semibold">Selecionou</h3>
      <div className="bg-gray-200 p-4 mt-2 rounded-md">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Nome do curso</th>
              <th className="p-2">Vagas Disponíveis</th>
            </tr>
          </thead>
          <tbody>
            {selectedCourse && courseAvailability !== null && (
              <tr>
                <td className="p-2">{selectedCourse}</td>
                <td className="p-2">{courseAvailability} vagas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
