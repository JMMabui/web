import ErrorMessage from '@/component/error-message'
import { type CourseResponse, getCourses } from '@/http/courses'
import {
  checkIfCodeExists,
  getSubjects,
  PostSubjects,
  type subjectResponse,
  type SubjectsRequest,
} from '@/http/subjects'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

export function AddSubject() {
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([])
  const [showForm, setShowForm] = useState<boolean>(false)

  // Pega o parâmetro `id` da URL (opcional)
  const { id } = useParams<{ id?: string }>() // O id é opcional

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue, // Função para setar valores no formulário
  } = useForm<SubjectsRequest>()

  const {
    data: dataCourses,
    error: coursesError,
    isLoading: isLoadingCourses,
  } = useQuery<CourseResponse[]>({
    queryKey: ['courses_data'],
    queryFn: getCourses,
  })

  const { data: dataSubjects } = useQuery<subjectResponse[]>({
    queryKey: ['data_subjects'],
    queryFn: getSubjects,
  })

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const courseId = event.target.value
    const selectedCourses = dataCourses?.filter(
      course => course.courseName === courseId
    )
    setSelectedCourseIds(selectedCourses?.map(course => course.id) || [])
  }

  if (isLoadingCourses) return <div>Carregando cursos...</div>
  if (coursesError instanceof Error)
    return <div>Erro: {coursesError.message}</div>

  const groupedCourses = dataCourses?.reduce<Record<string, Set<string>>>(
    (acc, course) => {
      const level = course.levelCourse.replace('_', ' ').toUpperCase()
      acc[level] = acc[level] || new Set()
      acc[level].add(course.courseName)
      return acc
    },
    {}
  )

  const filteredSubjects = dataSubjects?.filter(
    subject => subject.courseId && selectedCourseIds.includes(subject.courseId)
  )

  useEffect(() => {
    // Se um ID de curso for fornecido, selecionar automaticamente o curso
    if (id && dataCourses) {
      const course = dataCourses.find(course => course.id === id)
      if (course) {
        // Preenche o select com o curso encontrado
        setValue('courseId', course.courseName) // Define o valor no formulário para o curso
        setSelectedCourseIds([course.id]) // Atualiza o estado de cursos selecionados
      }
    }
  }, [id, dataCourses, setValue])

  const onSubmit = async (data: SubjectsRequest) => {
    const codeExists = await checkIfCodeExists(data.codigo)
    if (codeExists) {
      alert('Este código de disciplina já existe!')
      return
    }

    if (selectedCourseIds.length === 0) {
      alert('Por favor, selecione um curso.')
      return
    }

    try {
      await Promise.all(
        selectedCourseIds.map(courseId =>
          PostSubjects({
            ...data,
            codigo: data.codigo.toUpperCase(),
            credits: Number(data.credits),
            hcs: Number(data.hcs),
            courseId,
          })
        )
      )

      alert(`Disciplina ${data.codigo} adicionada com sucesso!`)
      reset()
      setSelectedCourseIds([])
    } catch (error) {
      alert('Erro ao adicionar disciplina. Tente novamente.')
    }
  }

  return (
    <div className="w-full mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-900">Disciplina</h1>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-900">
          Selecione o Curso
        </label>
        <select
          id="course"
          onChange={handleCourseChange}
          value={selectedCourseIds[0] || ''} // Selecione o curso com base no estado
          className="w-full rounded-md bg-white py-1.5 px-3 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2"
        >
          <option value="">-- Selecione um curso --</option>
          {groupedCourses &&
            Object.entries(groupedCourses).map(([level, courses]) => (
              <optgroup key={level} label={level}>
                {[...courses].map(courseName => (
                  <option key={courseName} value={courseName}>
                    {courseName}
                  </option>
                ))}
              </optgroup>
            ))}
        </select>
      </div>

      <div className="mt-6">
        <button
          type="button"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg focus:ring-2 focus:ring-indigo-600"
          onClick={() => setShowForm(!showForm)}
        >
          Adicionar Disciplina
        </button>
      </div>

      {showForm && (
        <div className="mt-6">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {['codigo', 'disciplineName', 'credits', 'hcs'].map(name => (
              <div key={name} className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-900">
                  {name.replace(/([A-Z])/g, ' $1').toUpperCase()}
                </label>
                <input
                  type={
                    name === 'credits' || name === 'hcs' ? 'number' : 'text'
                  }
                  {...register(name as keyof SubjectsRequest)}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2"
                />
                {errors[name as keyof SubjectsRequest] && (
                  <ErrorMessage
                    error={{
                      message: errors[name as keyof SubjectsRequest]?.message,
                    }}
                  />
                )}
              </div>
            ))}

            {[
              {
                label: 'Ano Acadêmico',
                name: 'year_study',
                options: [
                  { value: 'PRIMEIRO_ANO', label: '1º Ano' },
                  { value: 'SEGUNDO_ANO', label: '2º Ano' },
                  { value: 'TERCEIRO_ANO', label: '3º Ano' },
                  { value: 'QUARTO_ANO', label: '4º Ano' },
                ],
              },
              {
                label: 'Semestre',
                name: 'semester',
                options: [
                  { value: 'PRIMEIRO_SEMESTRE', label: '1º Semestre' },
                  { value: 'SEGUNDO_SEMESTRE', label: '2º Semestre' },
                ],
              },
              {
                label: 'Tipo de Disciplina',
                name: 'disciplineType',
                options: [
                  { value: 'NUCLEAR', label: 'Nuclear' },
                  { value: 'COMPLEMENTAR', label: 'Complementar' },
                ],
              },
            ].map(({ label, name, options }) => (
              <div key={name} className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-900">
                  {label}
                </label>
                <select
                  {...register(name as keyof SubjectsRequest)}
                  className="w-full rounded-md bg-white py-1.5 px-3 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2"
                >
                  <option value="">-- Selecione --</option>
                  {options.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg focus:ring-2 focus:ring-indigo-600"
            >
              Guardar Disciplina
            </button>
          </form>
        </div>
      )}

      {filteredSubjects && filteredSubjects.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Disciplinas do Curso
          </h2>
          <table className="w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Código</th>
                <th className="border border-gray-300 px-4 py-2">Nome</th>
                <th className="border border-gray-300 px-4 py-2">Créditos</th>
                <th className="border border-gray-300 px-4 py-2">Horas</th>
                <th className="border border-gray-300 px-4 py-2">Ano</th>
                <th className="border border-gray-300 px-4 py-2">Semestre</th>
                <th className="border border-gray-300 px-4 py-2">Tipo</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubjects.map(subject => (
                <tr key={subject.codigo} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">
                    {subject.codigo}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {subject.disciplineName}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {subject.credits}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {subject.hcs}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {subject.year_study}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {subject.semester}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {subject.disciplineType}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
