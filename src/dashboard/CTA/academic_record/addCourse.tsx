import { addCourse } from '@/http/courses'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'

type CourseFormData = {
  courseName: string
  courseDescription: string | null
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
}

export function AddCourse() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CourseFormData>()

  const addCourseMutation = useMutation<any, Error, CourseFormData>({
    mutationFn: (data: CourseFormData) => {
      const courseData = {
        ...data,
        courseDescription: data.courseDescription || '',
      }
      return addCourse(courseData)
    },
    onSuccess: () => {
      alert('Curso adicionado com sucesso!')
      reset()
    },
    onError: error => {
      console.error('Erro ao adicionar curso:', error)
    },
  })

  const onSubmit = (data: CourseFormData) => {
    console.log(data)
    const courseData = {
      ...data,
      courseDescription: data.courseDescription || '',
      courseDuration: Number.parseInt(data.courseDuration.toString(), 10),
      totalVacancies: Number.parseInt(data.totalVacancies.toString(), 10),
      availableVacancies: Number.parseInt(
        data.availableVacancies.toString(),
        10
      ),
    }
    addCourseMutation.mutate(courseData)
    // navigate('/academic_record/courses')
  }

  return (
    <div className="w-full mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-2xl font-semibold text-center">Adicionar Curso</h1>

        {/* Course Name */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">Nome do Curso</label>
          <input
            type="text"
            {...register('courseName', {
              required: 'Nome do curso é obrigatório',
            })}
            className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          {errors.courseName && (
            <p className="text-red-600 text-sm">{errors.courseName.message}</p>
          )}
        </div>

        {/* Course Description */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">Descrição</label>
          <textarea
            {...register('courseDescription')}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          {errors.courseDescription && (
            <p className="text-red-600 text-sm">
              {errors.courseDescription.message}
            </p>
          )}
        </div>

        {/* Level Course */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">Nível Acadêmico</label>
          <select
            {...register('levelCourse', {
              required: 'Nível acadêmico é obrigatório',
            })}
            className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="">Selecione o Nível</option>
            <option value="LICENCIATURA">Licenciatura</option>
            <option value="MESTRADO">Mestrado</option>
            <option value="CURTA_DURACAO">Curta Duração</option>
            <option value="TECNICO_MEDIO">Técnico Médio</option>
            <option value="RELIGIOSO">Religioso</option>
          </select>
          {errors.levelCourse && (
            <p className="text-red-600 text-sm">{errors.levelCourse.message}</p>
          )}
        </div>

        {/* Course Duration */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">
            Duração do Curso (em Meses)
          </label>
          <input
            type="number"
            {...register('courseDuration', {
              required: 'Duração do curso é obrigatória',
            })}
            className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          {errors.courseDuration && (
            <p className="text-red-600 text-sm">
              {errors.courseDuration.message}
            </p>
          )}
        </div>

        {/* Period */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">Período</label>
          <select
            {...register('period', { required: 'Período é obrigatório' })}
            className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="">Selecione o Período</option>
            <option value="LABORAL">Laboral</option>
            <option value="POS_LABORAL">Pós-Laboral</option>
          </select>
          {errors.period && (
            <p className="text-red-600 text-sm">{errors.period.message}</p>
          )}
        </div>

        {/* Total Vacancies */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">Total de Vagas</label>
          <input
            type="number"
            {...register('totalVacancies', {
              required: 'Total de vagas é obrigatório',
            })}
            className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          {errors.totalVacancies && (
            <p className="text-red-600 text-sm">
              {errors.totalVacancies.message}
            </p>
          )}
        </div>

        {/* Available Vacancies */}
        <div className="flex flex-col">
          <label className="text-lg font-medium">Vagas Disponíveis</label>
          <input
            type="number"
            {...register('availableVacancies', {
              required: 'Vagas disponíveis é obrigatório',
            })}
            className="w-full border border-gray-300 rounded-lg px-4 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
          {errors.availableVacancies && (
            <p className="text-red-600 text-sm">
              {errors.availableVacancies.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white py-1 px-6 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Adicionar Curso
          </button>
        </div>
      </form>
    </div>
  )
}
