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

  const formatPeriodo = (yearStudy: string, semester: string) => {
    const semestreFormatado = formSemester(semester)
    const anoFormatado = formatYear(yearStudy)
    return `${anoFormatado} - ${semestreFormatado}`
  }
  const formSemester = (semester: string) => {
    switch (semester) {
      case 'PRIMEIRO_SEMESTRE':
        return '1º Semestre'
      case 'SEGUNDO_SEMESTRE':
        return '2º Semestre'
      default:
        return semester
    }
  }

  const formatYear = (yearStudy: string) => {
    switch (yearStudy) {
      case 'PRIMEIRO_ANO':
        return '1º Ano'
      case 'SEGUNDO_ANO':
        return '2º Ano'
      case 'TERCEIRO_ANO':
        return '3º Ano'
      case 'QUARTO_ANO':
        return '4º Ano'
      default:
        return yearStudy
    }
  }

  // console.log("disciplinas inscrito",filteredSubjectsEnrolled)
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Inscrições</h1>
          <p className="text-purple-100">
            Gerencie suas inscrições em disciplinas
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/90 backdrop-blur-sm shadow-sm rounded-2xl p-8 border border-gray-100">
          {/* Current Enrollments */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Disciplinas Atuais
            </h2>
            {filteredSubjectsEnrolled && filteredSubjectsEnrolled.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubjectsEnrolled.map(subject => (
                  <div
                    key={subject.id}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {subject.subjectId}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {subject.Subject.subjectName}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                        Em andamento
                      </span>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>
                          Ano:{' '}
                          {formatPeriodo(
                            subject.Subject.year_study,
                            subject.Subject.semester
                          )}
                        </span>
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-500">
                          Status: {subject.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <p className="text-gray-500">
                  Você não está inscrito em nenhuma disciplina no momento.
                </p>
              </div>
            )}
          </div>

          {/* New Enrollment Form */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Nova Inscrição
            </h2>
            <form className="space-y-8">
              {/* Primary Subject Selection */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Disciplina Principal
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <YearSemesterSelect
                    year={year}
                    semester={semester}
                    setYear={setYear}
                    setSemester={setSemester}
                  />
                  <SubjectSelect
                    subjects={filteredSubjects}
                    value={selectedSubject}
                    onChange={setSelectedSubject}
                  />
                </div>
              </div>

              {/* Additional Subjects */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Disciplinas Adicionais
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowExtraFields(!showExtraFields)}
                    className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 transition-colors duration-300"
                  >
                    <span>{showExtraFields ? 'Ocultar' : 'Adicionar'}</span>
                    <svg
                      className={`w-5 h-5 transform transition-transform duration-300 ${
                        showExtraFields ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>

                {showExtraFields && (
                  <div className="space-y-6">
                    {/* Additional Subject 1 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h4 className="text-md font-semibold text-gray-800 mb-4">
                        Disciplina Adicional 1
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <YearSemesterSelect
                          year={yearAdd}
                          semester={semesterAdd}
                          setYear={setYearAdd}
                          setSemester={setSemesterAdd}
                          prefix="add"
                        />
                        <SubjectSelect
                          subjects={filteredSubjectsAdd}
                          value={selectedSubjectAdd}
                          onChange={setSelectedSubjectAdd}
                          prefix="add"
                        />
                      </div>
                    </div>

                    {/* Additional Subject 2 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h4 className="text-md font-semibold text-gray-800 mb-4">
                        Disciplina Adicional 2
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <YearSemesterSelect
                          year={yearAdd2}
                          semester={semesterAdd2}
                          setYear={setYearAdd2}
                          setSemester={setSemesterAdd2}
                          prefix="add2"
                        />
                        <SubjectSelect
                          subjects={filteredSubjectsAdd2}
                          value={selectedSubjectAdd2}
                          onChange={setSelectedSubjectAdd2}
                          prefix="add2"
                        />
                      </div>
                    </div>

                    {/* Additional Subject 3 */}
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h4 className="text-md font-semibold text-gray-800 mb-4">
                        Disciplina Adicional 3
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <YearSemesterSelect
                          year={yearAdd3}
                          semester={semesterAdd3}
                          setYear={setYearAdd3}
                          setSemester={setSemesterAdd3}
                          prefix="add3"
                        />
                        <SubjectSelect
                          subjects={filteredSubjectsAdd3}
                          value={selectedSubjectAdd3}
                          onChange={setSelectedSubjectAdd3}
                          prefix="add3"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleEnrollClick}
                  className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Realizar Inscrição
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
