import ErrorMessage from '@/component/error-message'
import { getCourses } from '@/http/courses'
import { checkIfCodeExists, PostSubjects } from '@/http/subjects'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

type Course = {
  id: string
  createdAt: Date
  updatedAt: Date
  courseName: string
  courseDescription: string
  courseDuration: number
  levelCourse:
    | 'CURTA_DURACAO'
    | 'TECNICO_MEDIO'
    | 'LICENCIATURA'
    | 'MESTRADO'
    | 'RELIGIOSO'
  period: 'LABORAL' | 'POS_LABORAL'
  totalVacancies: number
  availableVacancies: number
  disciplines: string[] // Adicionando uma propriedade para disciplinas
}

type CourseResponse = {
  course: Course[]
}

type subjectSchema = {
  codigo: string
  credits: number
  disciplineName: string
  disciplineType: 'NUCLEAR' | 'COMPLEMENTAR'
  hcs: number
  semester: 'PRIMEIRO_SEMESTRE' | 'SEGUNDO_SEMESTRE'
  year_study: 'PRIMEIRO_ANO' | 'SEGUNDO_ANO' | 'TERCEIRO_ANO' | 'QUARTO_ANO'
  courseId: string
}

export function AddSubject() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')
  const [isCodeExists, setIsCodeExists] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<subjectSchema>()

  const {
    data: dataCourses,
    error: coursesError,
    isLoading: isLoadingCourses,
  } = useQuery<CourseResponse>({
    queryKey: ['courses_data'],
    queryFn: getCourses,
  })

  const handleCourseChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const courseName = event.target.value
    const selectedCourse = dataCourses?.course.find(
      course => course.courseName === courseName
    )
    if (selectedCourse) {
      setSelectedCourseId(selectedCourse.id)
    }
  }

  if (isLoadingCourses) return <div>Carregando cursos...</div>
  if (coursesError instanceof Error)
    return <div>Erro: {coursesError.message}</div>

  const onSubmit = async (data: subjectSchema) => {
    const codeExists = await checkIfCodeExists(data.codigo)

    if (codeExists) {
      alert('Este código de disciplina já existe!')
      return // Impede o envio do formulário se o código já existir
    }

    // Verifica se um curso foi selecionado
    if (!selectedCourseId) {
      console.error('Nenhum curso selecionado!')
      return // Caso não tenha curso selecionado, não envia o formulário
    }

    try {
      // Envia os dados para o servidor
      const submitted = await PostSubjects({
        codigo: data.codigo,
        disciplineName: data.disciplineName,
        disciplineType: data.disciplineType,
        semester: data.semester,
        year_study: data.year_study,
        credits: Number(data.credits),
        hcs: Number(data.hcs),
        courseId: selectedCourseId, // Envia o ID do curso selecionado
      })

      // Exemplo de feedback (pode ser um toast, ou alerta)
      alert(`Disciplina ${data.codigo} adicionada com sucesso!`)

      reset()
      setSelectedCourseId('')
    } catch (error) {
      // Caso haja um erro, você pode exibir uma mensagem para o usuário
      console.error('Erro ao adicionar disciplina:', error)
      alert('Ocorreu um erro ao adicionar a disciplina. Tente novamente.')
    }
  }

  return (
    <div className="w-full mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-900">
        Adicionar Disciplina
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5">
          <label className="text-lg font-medium text-gray-900">
            Codigo da Disciplina
          </label>
          <input
            id="codigo"
            type="text"
            {...register('codigo')}
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-ind"
          />
          {errors.codigo && (
            <ErrorMessage error={{ message: errors.codigo?.message }} />
          )}
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="subjectName"
            className="block text-sm font-medium text-gray-900"
          >
            Nome da Disciplina
          </label>
          <div className="mt-2">
            <input
              id="subjectName"
              type="text"
              {...register('disciplineName')}
              autoComplete="subjectName"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-ind"
              placeholder="Nome da Disciplina"
            />
            {errors.disciplineName && (
              <ErrorMessage
                error={{ message: errors.disciplineName?.message }}
              />
            )}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="year_study"
            className="block text-sm font-medium text-gray-900"
          >
            Ano Academico
          </label>
          <div className="mt-2">
            <select
              id="year_study"
              {...register('year_study')}
              className="w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-ind"
            >
              <option value="">-- Selecione --</option>
              <option value="PRIMEIRO_ANO">1º Ano</option>
              <option value="SEGUNDO_ANO">2º Ano</option>
              <option value="TERCEIRO_ANO">3º Ano</option>
              <option value="QUARTO_ANO">4º Ano</option>
            </select>
            {errors.year_study && (
              <ErrorMessage error={{ message: errors.year_study?.message }} />
            )}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="semester"
            className="block text-sm font-medium text-gray-900"
          >
            Semestre
          </label>
          <div className="mt-2">
            <select
              id="semester"
              {...register('semester')}
              className="w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-ind"
            >
              <option value="">-- Selecione --</option>
              <option value="PRIMEIRO_SEMESTRE">1º Semestre</option>
              <option value="SEGUNDO_SEMESTRE">2º Semestre</option>
            </select>
            {errors.semester && (
              <ErrorMessage error={{ message: errors.semester?.message }} />
            )}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="credits"
            className="block text-sm font-medium text-gray-900"
          >
            Creditos
          </label>
          <div className="mt-2">
            <input
              id="credits"
              type="number"
              autoComplete="credits"
              {...register('credits')}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-ind"
            />
            {errors.credits && (
              <ErrorMessage error={{ message: errors.credits?.message }} />
            )}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="totalHours"
            className="block text-sm font-medium text-gray-900"
          >
            Total de Horas
          </label>
          <div className="mt-2">
            <input
              id="totalHours"
              type="number"
              autoComplete="totalHours"
              {...register('hcs')}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-ind"
            />
            {errors.hcs && (
              <ErrorMessage error={{ message: errors.hcs?.message }} />
            )}
          </div>
        </div>
        <div className="sm:col-span-2">
          <label
            htmlFor="disciplineType"
            className="block text-sm font-medium text-gray-900"
          >
            Tipo de Disciplina
          </label>
          <div className="mt-2">
            <select
              id="disciplineType"
              {...register('disciplineType')}
              className="w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-ind"
            >
              <option value="">-- Selecione --</option>
              <option value="NUCLEAR">Núclear</option>
              <option value="COMPLEMENTAR">Complementar</option>
            </select>
            {errors.disciplineType && (
              <ErrorMessage
                error={{ message: errors.disciplineType?.message }}
              />
            )}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="course"
            className="block text-sm font-medium text-gray-900"
          >
            Curso
          </label>
          <div className="mt-2">
            <select
              id="course"
              onChange={handleCourseChange}
              className="w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-ind"
            >
              <option value="">-- Selecione --</option>
              {dataCourses?.course.map(course => (
                <option key={course.id} value={course.courseName}>
                  {course.levelCourse
                    .replace('_', ' ')
                    .charAt(0)
                    .toUpperCase() +
                    course.levelCourse.slice(1).toLowerCase()}{' '}
                  em{' '}
                  {course.courseName
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            Adicionar Disciplina
          </button>
        </div>
      </form>
    </div>
  )
}
