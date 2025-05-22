import Button from '@/components/Button'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorComponent } from '@/components/ErrorComponent'
import { getRegistration, type RegistrationResponse } from '@/http/registration'
import {
  createStudentsSubjects,
  getStudentsSubjects,
  getStudentsSubjectsByStudentId,
  type StudentsSubjectsWithExtraDataResponse,
} from '@/http/students-subjects'
import {
  getSubjects,
  getSubjectsByCourseId,
  type subjectResponse,
} from '@/http/subjects'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

export function Enrollments() {
  // ====== States ======
  // Year and Semester States
  const [year, setYear] = useState<string>('')
  const [yearAdd, setYearAdd] = useState<string>('')
  const [yearAdd2, setYearAdd2] = useState<string>('')
  const [yearAdd3, setYearAdd3] = useState<string>('')

  const [semester, setSemester] = useState<string>('')
  const [semesterAdd, setSemesterAdd] = useState<string>('')
  const [semesterAdd2, setSemesterAdd2] = useState<string>('')
  const [semesterAdd3, setSemesterAdd3] = useState<string>('')

  // Subject Selection States
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedSubjectAdd, setSelectedSubjectAdd] = useState('')
  const [selectedSubjectAdd2, setSelectedSubjectAdd2] = useState('')
  const [selectedSubjectAdd3, setSelectedSubjectAdd3] = useState('')

  // UI Control States
  const [showExtraFields, setShowExtraFields] = useState(false)
  const [showResume, setShowResume] = useState(false)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [subjectCodes, setSubjectCodes] = useState<string[]>([])

  // ====== Authentication ======
  const studentId = localStorage.getItem('student_login_id')
  if (!studentId) {
    return <ErrorComponent message="Usuário não autenticado" />
  }

  const course_id = localStorage.getItem('course_id')
  if (!course_id) {
    return (
      <ErrorComponent message=" Curso não encontrado. Inscreva-se em um curso" />
    )
  }

  // ====== API Queries ======

  const {
    data: dataSubjects,
    isLoading: isLoadingSubjects,
    isError: isErrorSubjects,
  } = useQuery<subjectResponse[]>({
    queryKey: ['subjects', year, semester],
    queryFn: getSubjects,
    enabled: !!year && !!semester,
  })

  const {
    data: dataSubjectsStudent,
    isLoading: isLoadingSubjectsStudents,
    isError: isErrorSubjectsStudents,
  } = useQuery<StudentsSubjectsWithExtraDataResponse[]>({
    queryKey: ['student_subjects', studentId],
    queryFn: () =>
      studentId
        ? getStudentsSubjectsByStudentId(studentId)
        : Promise.reject('ID não encontrado'),
    enabled: !!studentId,
  })

  // console.log('dataSubjectsStudent: ', dataSubjectsStudent)

  // ====== Loading and Error States ======
  if (isLoadingSubjects || isLoadingSubjectsStudents) {
    return <LoadingSkeleton />
  }

  if (isErrorSubjects || isErrorSubjectsStudents) {
    return <ErrorComponent />
  }

  // ====== Data Processing ======
  const filteredSubjectsByCourse = dataSubjects?.filter(
    subjects => subjects.courseId === course_id
  )

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

  // ====== Helper Functions ======
  function isAlreadyEnrolled(subjectCode: string): boolean {
    return (
      dataSubjectsStudent?.some(
        enrolledSubject => enrolledSubject.subjectId === subjectCode
      ) ?? false
    )
  }

  const filteredSubjectsEnrolled = dataSubjectsStudent?.filter(
    subjects =>
      subjects.status === 'INSCRITO' && subjects.result === 'EM_ANDAMENTO'
  )

  // ====== Event Handlers ======
  async function handleEnrollClick() {
    const allCodes = [
      ...(filteredSubjects ?? []).map(subject => subject.codigo),
      selectedSubject &&
        filteredSubjectsAdd?.find(
          subject => subject.subjectName === selectedSubject
        )?.codigo,
      selectedSubjectAdd &&
        filteredSubjectsAdd2?.find(
          subject => subject.subjectName === selectedSubjectAdd
        )?.codigo,
      selectedSubjectAdd2 &&
        filteredSubjectsAdd2?.find(
          subject => subject.subjectName === selectedSubjectAdd2
        )?.codigo,
      selectedSubjectAdd3 &&
        filteredSubjectsAdd3?.find(
          subject => subject.subjectName === selectedSubjectAdd3
        )?.codigo,
    ]
      .filter(Boolean)
      .map(code => code as string)

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
      const response = await createStudentsSubjects({
        studentId: studentId ?? '',
        subjectIds: unenrolledSubjects,
      })

      console.log('Dados recebido da api:', response)

      // console.log('response: ', response)

      if (response.error) {
        alert(`Erro ao realizar inscrição: ${response.error}`)
        return
      }

      if (response.status === 'success') {
        alert('Inscrição realizada com sucesso!')

        // Atualiza a lista de disciplinas do aluno
        const updatedSubjects = await getStudentsSubjectsByStudentId(
          studentId ?? ''
        )
        if (updatedSubjects) {
          // Atualiza o estado com as disciplinas atualizadas
          setSubjectCodes(updatedSubjects.map(subject => subject.subjectId))
        }

        // Fazer o download do comprovante de inscrição

        if (response.registrationResponse) {
          const registrationResponse = response.registrationResponse
          const blob = new Blob([registrationResponse], {
            type: 'application/pdf',
          })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `comprovante_inscricao_${studentId}.pdf`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      }
    } catch (error) {
      console.error('Erro ao inscrever aluno nas disciplinas:', error)
      alert(
        'Ocorreu um erro ao tentar inscrever o aluno nas disciplinas. Tente novamente.'
      )
    }

    setSubjectCodes(unenrolledSubjects)
    setIsEnrolled(true)
  }

  // ====== UI Components ======
  interface YearSemesterSelectProps {
    year: string
    semester: string
    setYear: (value: string) => void
    setSemester: (value: string) => void
    prefix?: string
  }

  const YearSemesterSelect = ({
    year,
    semester,
    setYear,
    setSemester,
    prefix = '',
  }: YearSemesterSelectProps) => (
    <div className="flex space-x-4 mb-6">
      <div className="flex-1">
        <label
          htmlFor={`year${prefix}`}
          className="block text-lg font-semibold mb-2"
        >
          Ano:
        </label>
        <select
          id={`year${prefix}`}
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
          htmlFor={`semester${prefix}`}
          className="block text-lg font-semibold mb-2"
        >
          Semestre:
        </label>
        <select
          id={`semester${prefix}`}
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
  )

  interface SubjectSelectProps {
    subjects: subjectResponse[] | undefined
    value: string
    onChange: (value: string) => void
    prefix?: string
  }

  const SubjectSelect = ({
    subjects,
    value,
    onChange,
    prefix = '',
  }: SubjectSelectProps) => (
    <div className="flex-1">
      <label
        htmlFor={`subject${prefix}`}
        className="block text-lg font-semibold mb-2"
      >
        Cadeira:
      </label>
      <select
        id={`subject${prefix}`}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2"
      >
        <option value="">Selecione um curso</option>
        {subjects?.map((student: subjectResponse) => (
          <option key={student.codigo} value={student.subjectName}>
            {student.subjectName}
          </option>
        ))}
      </select>
    </div>
  )

  // ====== Main Render ======
  return (
    <div className="max-w-4xl mx-auto p-6 w-full overflow-y-auto max-h-150">
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
                    {subject.Subject.subjectName}
                  </span>
                  <span className="text-gray-500">{subject.subjectId}</span>
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

          <YearSemesterSelect
            year={year}
            semester={semester}
            setYear={setYear}
            setSemester={setSemester}
          />

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
                        {/* <span className="font-medium text-lg text-gray-800">
                          {subject.disciplineName}
                        </span> */}
                        <span className="text-gray-500">{subject.codigo}</span>
                        <span className="text-gray-500">
                          {subject.subjectName}
                        </span>
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

              {/* Additional Subject 1 */}
              <div className="flex space-x-4 mb-6">
                <YearSemesterSelect
                  year={yearAdd}
                  semester={semesterAdd}
                  setYear={setYearAdd}
                  setSemester={setSemesterAdd}
                  prefix="Add"
                />
                <SubjectSelect
                  subjects={filteredSubjectsAdd}
                  value={selectedSubject}
                  onChange={setSelectedSubject}
                  prefix="Add"
                />
              </div>

              {/* Additional Subject 2 */}
              <div className="flex space-x-4 mb-6">
                <YearSemesterSelect
                  year={yearAdd2}
                  semester={semesterAdd2}
                  setYear={setYearAdd2}
                  setSemester={setSemesterAdd2}
                  prefix="Add2"
                />
                <SubjectSelect
                  subjects={filteredSubjectsAdd2}
                  value={selectedSubjectAdd2}
                  onChange={setSelectedSubjectAdd2}
                  prefix="Add2"
                />
              </div>

              {/* Additional Subject 3 */}
              <div className="flex space-x-4 mb-6">
                <YearSemesterSelect
                  year={yearAdd3}
                  semester={semesterAdd3}
                  setYear={setYearAdd3}
                  setSemester={setSemesterAdd3}
                  prefix="Add3"
                />
                <SubjectSelect
                  subjects={filteredSubjectsAdd3}
                  value={selectedSubjectAdd3}
                  onChange={setSelectedSubjectAdd3}
                  prefix="Add3"
                />
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
                          {subject.subjectName} - Código: {subject.codigo}
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
                    {selectedSubjectAdd2 && (
                      <p>3ª Cadeira: {selectedSubjectAdd2}</p>
                    )}
                    {selectedSubjectAdd3 && (
                      <p>4ª Cadeira: {selectedSubjectAdd3}</p>
                    )}
                  </div>
                </div>

                <div className="w-full mt-4 text-center flex justify-between items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowResume(!showResume)}
                    className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-red-600 transition duration-200 ease-in-out w-full sm:w-auto"
                  >
                    Fechar
                  </button>

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
