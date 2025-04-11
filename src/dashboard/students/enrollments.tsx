import Button from '@/component/Button'
import { getRegistration, type RegistrationResponse } from '@/http/registration'
import {
  createStudentsSubjects,
  getStudentsSubjectsByStudentId,
 type StudentsSubjectsWithExtraDataResponse,
} from '@/http/students-subjects'
import {
  getSubjects,
  type subjectResponse,
} from '@/http/subjects'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export function Enrollments() {
  // Estados para armazenar as seleções do ano e semestre
  const [year, setYear] = useState<string>('')
  const [yearAdd, setYearAdd] = useState<string>('')
  const [yearAdd2, setYearAdd2] = useState<string>('')
  const [yearAdd3, setYearAdd3] = useState<string>('')

  const [semester, setSemester] = useState<string>('')
  const [semesterAdd, setSemesterAdd] = useState<string>('')
  const [semesterAdd2, setSemesterAdd2] = useState<string>('')
  const [semesterAdd3, setSemesterAdd3] = useState<string>('')

  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedSubjectAdd, setSelectedSubjectAdd] = useState('')
  const [selectedSubjectAdd2, setSelectedSubjectAdd2] = useState('')
  const [selectedSubjectAdd3, setSelectedSubjectAdd3] = useState('')

  const [showExtraFields, setShowExtraFields] = useState(false)
  const [showResume, setShowResume] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)

  const [subjectCodes, setSubjectCodes] = useState<string[]>([])

  const studentId = localStorage.getItem('student_login_id')

  if (!studentId) {
    return (
      <div className="text-center text-red-500">
        ID de estudante não encontrado.
      </div>
    )
  }
  // console.log('Header', studentId)

  const { data: dataRegistration, isLoading: isLoadingRegistration } = useQuery<RegistrationResponse[]>({
    queryKey: ['courses'],
    queryFn: getRegistration,
  })
  
  // console.log('data registration: ', dataRegistration)

  const {
    data: dataSubjects,
    isLoading: isLoadingSubjects,
    isError: isErrorSubjects,
  } = useQuery<subjectResponse[]>({
    queryKey: ['subjects', year, semester],
    queryFn: getSubjects,
    enabled: !!year && !!semester,
  })

  console.log('Disciplinas do curso:', dataSubjects)

  const {
    data: dataSubjectsStudent,
    isLoading: isLoadingSubjectsStudents,
    // isError: isErrorSubjectsStudents,
  } = useQuery<StudentsSubjectsWithExtraDataResponse[]>({
    queryKey: ['student_subjects', studentId],
    queryFn: () =>
      studentId
        ? getStudentsSubjectsByStudentId(studentId)
        : Promise.reject('ID não encontrado'),
    enabled: !!studentId, // Só executa a query se o ID existir
  })

  console.log('Disciplinas:', dataSubjectsStudent)

  if (isLoadingSubjects || isLoadingSubjectsStudents || isLoadingRegistration)
    return <div className="text-center text-lg">Carregando...</div>
  if (isErrorSubjects)
    return (
      <div className="text-center text-red-500">
        Erro ao carregar as cadeiras
      </div>
    )


  const findCourseId = dataRegistration?.find(
    course => course.student_id === studentId
  )

  // console.log('filterted course', findCourseId)

  const courseId = findCourseId?.course_id
  if (!courseId) {
    return <div className="text-center text-red-500">Curso não encontrado.</div>
  }

  // console.log('course id: ', courseId)


  const filteredSubjectsByCourse = dataSubjects?.filter(
    subjects => subjects.courseId === courseId
  )

  console.log('filtered subjects: ', filteredSubjectsByCourse)

 

  const filteredSubjects = filteredSubjectsByCourse?.filter(subject => {
    if (!year || !semester) {
      return (
        <div className="text-center text-lg">Selecione ano e semestre.</div>
      )
    }
    return subject.year_study === year && subject.semester === semester
  })
  const filteredSubjectsAdd = filteredSubjectsByCourse?.filter(subject => {
    return subject.year_study === yearAdd && subject.semester === semesterAdd
  })
  const filteredSubjectsAdd2 = filteredSubjectsByCourse?.filter(subject => {
    return subject.year_study === yearAdd2 && subject.semester === semesterAdd2
  })
  const filteredSubjectsAdd3 = filteredSubjectsByCourse?.filter(subject => {
    return subject.year_study === yearAdd3 && subject.semester === semesterAdd3
  })

 

  function isAlreadyEnrolled(subjectCode: string): boolean {
    return (
      dataSubjectsStudent?.some(
        enrolledSubject => enrolledSubject.disciplineId === subjectCode
      ) ?? false
    )
  }

  const filteredSubjectsEnrolled = dataSubjectsStudent?.filter(
    subjects =>
      subjects.status === 'INSCRITO' && subjects.result === 'EM_ANDAMENTO'
  )

  if (filteredSubjectsEnrolled) {
    console.log('Filtered subjects enrolled:', filteredSubjectsEnrolled)
  }

  async function handleEnrollClick() {
    const allCodes = [
      ...(filteredSubjects ?? []).map(subject => subject.codigo),
      selectedSubject &&
        filteredSubjectsAdd?.find(
          subject => subject.disciplineName === selectedSubject
        )?.codigo,
      selectedSubjectAdd &&
        filteredSubjectsAdd2?.find(
          subject => subject.disciplineName === selectedSubjectAdd
        )?.codigo,
      selectedSubjectAdd2 &&
        filteredSubjectsAdd2?.find(
          subject => subject.disciplineName === selectedSubjectAdd2
        )?.codigo,
      selectedSubjectAdd3 &&
        filteredSubjectsAdd3?.find(
          subject => subject.disciplineName === selectedSubjectAdd3
        )?.codigo,
    ]
      .filter(Boolean)
      .map(code => code as string) // Assegura que estamos trabalhando com uma string válida

    // Verifica se o estudante já está inscrito em alguma disciplina selecionada
    const unenrolledSubjects = allCodes.filter(
      subjectCode => !isAlreadyEnrolled(subjectCode)
    )

    if (unenrolledSubjects.length === 0) {
      alert(
        'Você já submeteu pedido de inscrição em todas as disciplinas selecionadas.'
      )
      return
    }

    try {
      await createStudentsSubjects({
        student_id: studentId ?? '',
        disciplineIds: unenrolledSubjects,
      })
    } catch (error) {
      console.error('Erro ao inscrever aluno nas disciplinas:', error)
      alert(
        'Ocorreu um erro ao tentar inscrever o aluno nas disciplinas. Tente novamente.'
      )
    }

    setSubjectCodes(unenrolledSubjects)
    setIsEnrolled(true)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 w-full overflow-y-auto max-h-150">
      {/* Se já estiver matriculado em alguma disciplina */}
      {Array.isArray(filteredSubjectsEnrolled) &&
      filteredSubjectsEnrolled.length > 0 ? (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Cadeiras em Andamento</h2>
          <ul className="space-y-2 overflow-y-auto max-h-96">
            {filteredSubjectsEnrolled.map(subject => (
              <li
                key={subject.id}
                className="p-4 border border-gray-200 rounded-lg shadow-sm bg-green-100"
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {subject.discipline.disciplineName}
                  </span>
                  <span className="text-gray-500">{subject.disciplineId}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-center mb-6">
            Inscrição em Disciplinas
          </h1>

          <div className="flex space-x-4 mb-6">
            <div className="flex-1">
              <label
                htmlFor="year"
                className="block text-lg font-semibold mb-2"
              >
                Ano:
              </label>
              <select
                id="year"
                value={year}
                onChange={e => setYear(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione o ano</option>
                <option value="PRIMEIRO_ANO">1 Ano</option>
                <option value="SEGUNDO_ANO">2 Ano</option>
                <option value="TERCEIRO_ANO">3 Ano</option>
                <option value="QUARTO_ANO">4 Ano</option>
              </select>
            </div>

            <div className="flex-1">
              <label
                htmlFor="semester"
                className="block text-lg font-semibold mb-2"
              >
                Semestre:
              </label>
              <select
                id="semester"
                value={semester}
                onChange={e => setSemester(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Selecione o semestre</option>
                <option value="PRIMEIRO_SEMESTRE">1 Semestre</option>
                <option value="SEGUNDO_SEMESTRE">2 Semestre</option>
              </select>
            </div>
          </div>

          <div>
            {filteredSubjects && filteredSubjects.length > 0 ? (
              <div>
                <h2 className="text-2xl font-semibold mb-4">
                  Disciplinas Disponíveis
                </h2>
                <ul className="space-y-2 overflow-y-auto max-h-96">
                  {filteredSubjects.map(subject => (
                    <li
                      key={subject.codigo}
                      className="p-4 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {subject.disciplineName}
                        </span>
                        <span className="text-gray-500">{subject.codigo}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center text-lg text-gray-500">
                Nenhuma disciplina encontrada para o ano e semestre
                selecionados.
              </div>
            )}
          </div>

          <Button
            variant="primary"
            className="m-4"
            onClick={() => setShowExtraFields(!showExtraFields)}
          >
            Cadeira em Atraso
          </Button>

          {showExtraFields && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-4">
                Adicionar Disciplina
              </h2>
              {/* Cadeiras Adicionais 1 */}
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <label
                    htmlFor="yearAdd"
                    className="block text-lg font-semibold mb-2"
                  >
                    Ano:
                  </label>
                  <select
                    id="yearAdd"
                    value={yearAdd}
                    onChange={e => setYearAdd(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione o ano</option>
                    <option value="PRIMEIRO_ANO">1 Ano</option>
                    <option value="SEGUNDO_ANO">2 Ano</option>
                    <option value="TERCEIRO_ANO">3 Ano</option>
                    <option value="QUARTO_ANO">4 Ano</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="semesterAdd"
                    className="block text-lg font-semibold mb-2"
                  >
                    Semestre:
                  </label>
                  <select
                    id="semesterAdd"
                    value={semesterAdd}
                    onChange={e => setSemesterAdd(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione o semestre</option>
                    <option value="PRIMEIRO_SEMESTRE">1 Semestre</option>
                    <option value="SEGUNDO_SEMESTRE">2 Semestre</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="subjectAdd"
                    className="block text-lg font-semibold mb-2"
                  >
                    Cadeira:
                  </label>
                  <select
                    id="subjectAdd"
                    value={selectedSubject}
                    onChange={e => setSelectedSubject(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="">Selecione um curso</option>
                    {filteredSubjectsAdd?.map(students => (
                      <option
                        key={students.codigo}
                        value={students.disciplineName}
                      >
                        {students.disciplineName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cadeiras Adicionais 2 */}
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <label
                    htmlFor="yearAdd2"
                    className="block text-lg font-semibold mb-2"
                  >
                    Ano:
                  </label>
                  <select
                    id="yearAdd2"
                    value={yearAdd2}
                    onChange={e => setYearAdd2(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione o ano</option>
                    <option value="PRIMEIRO_ANO">1 Ano</option>
                    <option value="SEGUNDO_ANO">2 Ano</option>
                    <option value="TERCEIRO_ANO">3 Ano</option>
                    <option value="QUARTO_ANO">4 Ano</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="semesterAdd2"
                    className="block text-lg font-semibold mb-2"
                  >
                    Semestre:
                  </label>
                  <select
                    id="semesterAdd2"
                    value={semesterAdd2}
                    onChange={e => setSemesterAdd2(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione o semestre</option>
                    <option value="PRIMEIRO_SEMESTRE">1 Semestre</option>
                    <option value="SEGUNDO_SEMESTRE">2 Semestre</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="subjectAdd2"
                    className="block text-lg font-semibold mb-2"
                  >
                    Cadeira:
                  </label>
                  <select
                    id="subjectAdd2"
                    value={selectedSubjectAdd2}
                    onChange={e => setSelectedSubjectAdd2(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="">Selecione um curso</option>
                    {filteredSubjectsAdd2?.map(students => (
                      <option
                        key={students.codigo}
                        value={students.disciplineName}
                      >
                        {students.disciplineName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Cadeiras Adicionais 3 */}
              <div className="flex space-x-4 mb-6">
                <div className="flex-1">
                  <label
                    htmlFor="yearAdd3"
                    className="block text-lg font-semibold mb-2"
                  >
                    Ano:
                  </label>
                  <select
                    id="yearAdd3"
                    value={yearAdd3}
                    onChange={e => setYearAdd3(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione o ano</option>
                    <option value="PRIMEIRO_ANO">1 Ano</option>
                    <option value="SEGUNDO_ANO">2 Ano</option>
                    <option value="TERCEIRO_ANO">3 Ano</option>
                    <option value="QUARTO_ANO">4 Ano</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="semesterAdd3"
                    className="block text-lg font-semibold mb-2"
                  >
                    Semestre:
                  </label>
                  <select
                    id="semesterAdd3"
                    value={semesterAdd3}
                    onChange={e => setSemesterAdd3(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Selecione o semestre</option>
                    <option value="PRIMEIRO_SEMESTRE">1 Semestre</option>
                    <option value="SEGUNDO_SEMESTRE">2 Semestre</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="subjectAdd3"
                    className="block text-lg font-semibold mb-2"
                  >
                    Cadeira:
                  </label>
                  <select
                    id="subjectAdd3"
                    value={selectedSubjectAdd3}
                    onChange={e => setSelectedSubjectAdd3(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="">Selecione um curso</option>
                    {filteredSubjectsAdd3?.map(students => (
                      <option
                        key={students.codigo}
                        value={students.disciplineName}
                      >
                        {students.disciplineName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          <Button onClick={() => setShowResume(!showResume)}>
            {showResume ? 'Esconder Resumo' : 'Resumo'}
          </Button>

          {showResume && (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
                <h2 className="text-2xl font-semibold mb-4">
                  Resumo da Inscrição
                </h2>

                <div>
                  <h3 className="text-xl font-medium">
                    Disciplinas Obrigatórias:
                  </h3>
                  {filteredSubjects && filteredSubjects.length > 0 ? (
                    <ul className="space-y-2">
                      {filteredSubjects.map(subject => (
                        <li key={subject.codigo} className="p-2 border-b">
                          {subject.disciplineName} - Código: {subject.codigo}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>
                      Nenhuma disciplina encontrada para o ano e semestre
                      selecionados.
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-xl font-medium">
                    Disciplinas Adicionais Selecionadas:
                  </h3>

                  <div className="space-y-2">
                    {selectedSubject && <p>1ª Cadeira: {selectedSubject}</p>}
                    {/* {selectedSubjectAdd && <p>2ª Cadeira: {selectedSubjectAdd}</p>} */}
                    {selectedSubjectAdd2 && (
                      <p>3ª Cadeira: {selectedSubjectAdd2}</p>
                    )}
                    {selectedSubjectAdd3 && (
                      <p>4ª Cadeira: {selectedSubjectAdd3}</p>
                    )}
                  </div>
                </div>
                <div className="w-full mt-4 text-center flex justify-between items-center space-x-4">
                  {/* Botão Fechar */}
                  <button
                    type="button"
                    onClick={() => setShowResume(!showResume)}
                    className=" bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-200 ease-in-out w-full sm:w-auto"
                  >
                    Fechar
                  </button>

                  {/* Botão Finalizar Inscrição */}
                  {showResume && !isEnrolled && (
                    <button
                      type="button"
                      onClick={handleEnrollClick}
                      className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-200 ease-in-out w-full sm:w-auto"
                    >
                      Finalizar Inscrição
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Mensagem de confirmação após inscrição */}
          {isEnrolled && (
            <div className="mt-6 text-center text-green-500">
              Submissão da inscrição realizada com sucesso! Códigos das
              disciplinas: {subjectCodes.join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
