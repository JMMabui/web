import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { getCourses, type CourseResponse } from '@/http/courses'
import { getSubjects, type SubjectsSchema } from '@/http/subjects'

type CourseSchema = {
  course: CourseResponse[]
}

type SubjectSchema = {
  discipline: SubjectsSchema[]
}

export function Teachers() {
  const [teacherName, setTeacherName] = useState('')
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
  const [teacherStatus, setTeacherStatus] = useState<string>('')

  // Carregar cursos
  const {
    data: dataCourses,
    isLoading: isLoadingCourses,
    isError: isErrorCourses,
  } = useQuery<CourseSchema>({
    queryKey: ['datacourses'],
    queryFn: getCourses,
  })

  // Carregar disciplinas
  const {
    data: dataSubjects,
    isLoading: isLoadingSubjects,
    isError: isErrorSubjects,
  } = useQuery<SubjectSchema>({
    queryKey: ['dataSubjects'],
    queryFn: getSubjects,
  })

  // Carregar docentes
  //   const {
  //     data: dataTeachers,
  //     isLoading: isLoadingTeachers,
  //     isError: isErrorTeachers,
  //   } = useQuery<TeacherSchema[]>({
  //     queryKey: ['dataTeachers'],
  //     queryFn: getTeachers,
  //   })

  useEffect(() => {
    if (isErrorCourses || isErrorSubjects) {
      console.error('Erro ao carregar os dados.')
    }
  }, [isErrorCourses, isErrorSubjects])

  if (isLoadingCourses || isLoadingSubjects) {
    return <div className="text-center">Carregando os dados ...</div>
  }

  // Lógica para criar docente
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      teacherName,
      courses: selectedCourses,
      subjects: selectedSubjects,
      status: teacherStatus,
    }

    console.log('Dados do Docente: ', data)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-6">Cadastrar Docente</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome do Docente */}
        <div>
          <label
            htmlFor="teacherName"
            className="block text-sm font-medium text-gray-700"
          >
            Nome do Docente:
          </label>
          <input
            id="teacherName"
            type="text"
            placeholder="Nome completo do docente"
            value={teacherName}
            onChange={e => setTeacherName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Cursos atribuídos ao docente */}
        <div>
          <label
            htmlFor="courses"
            className="block text-sm font-medium text-gray-700"
          >
            Cursos atribuídos:
          </label>
          <select
            multiple
            id="courses"
            value={selectedCourses}
            onChange={e =>
              setSelectedCourses(
                Array.from(e.target.selectedOptions, option => option.value)
              )
            }
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {dataCourses?.course.map(course => (
              <option key={course.id} value={course.id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>

        {/* Disciplinas atribuídas ao docente */}
        <div>
          <label
            htmlFor="subjects"
            className="block text-sm font-medium text-gray-700"
          >
            Disciplinas atribuídas:
          </label>
          <select
            multiple
            id="subjects"
            value={selectedSubjects}
            onChange={e =>
              setSelectedSubjects(
                Array.from(e.target.selectedOptions, option => option.value)
              )
            }
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {/* {dataSubjects?.discipline.map(subject => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))} */}
          </select>
        </div>

        {/* Status do Docente */}
        <div>
          <label
            htmlFor="teacherStatus"
            className="block text-sm font-medium text-gray-700"
          >
            Status:
          </label>
          <select
            id="teacherStatus"
            value={teacherStatus}
            onChange={e => setTeacherStatus(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Selecione o Status...</option>
            <option value="ATIVO">Ativo</option>
            <option value="INATIVO">Inativo</option>
          </select>
        </div>

        {/* Botão para salvar */}
        <div className="text-center mt-6">
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Cadastrar Docente
          </button>
        </div>
      </form>

      {/* Exibição de Docentes */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Docentes Cadastrados
        </h2>
        {/* <ul className="mt-4">
          {dataTeachers?.map(teacher => (
            <li key={teacher.id} className="p-4 border-b border-gray-300">
              <div className="font-semibold">{teacher.name}</div>
              <div className="text-sm text-gray-600">
                Cursos: {teacher.courses.join(', ')}
              </div>
              <div className="text-sm text-gray-600">
                Disciplinas: {teacher.subjects.join(', ')}
              </div>
              <div className="text-sm text-gray-600">
                Status: {teacher.status}
              </div>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  )
}
