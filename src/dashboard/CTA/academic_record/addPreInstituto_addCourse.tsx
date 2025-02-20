import { getCourses } from "@/http/courses"
import { getRegistration, postRegistration } from "@/http/registration"
import { createPreInstituto } from "@/http/signup/pre_instituto"
import { Education_Officer } from "@/registration/education_officer"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { z } from "zod"

const schema = z.object({
  schoolLevel: z.enum(['CLASSE_10', 'CLASSE_12', 'LICENCIATURA'], {
    errorMap: () => ({ message: 'Selecione o nível acadêmico' }),
  }),
  schoolName: z.string().min(1, { message: 'Nome da Escola é obrigatório' }),
  schoolProvincy: z.enum([
    'MAPUTO_CIDADE', 'MAPUTO_PROVINCIA', 'GAZA', 'INHAMBANE',
    'MANICA', 'SOFALA', 'TETE', 'ZAMBEZIA', 'NAMPULA', 'CABO_DELGADO', 'NIASSA',
  ], {
    errorMap: () => ({ message: 'Selecione a província onde a escola está localizada' }),
  }),
})

type Course = {
  id: string
  createdAt: Date
  updatedAt: Date
  courseName: string
  courseDescription: string | null
  courseDuration: number
  levelCourse: 'CURTA_DURACAO' | 'TECNICO_MEDIO' | 'LICENCIATURA' | 'MESTRADO' | 'RELIGIOSO'
  period: 'LABORAL' | 'POS_LABORAL'
  totalVacancies: number
  availableVacancies: number | null
}

type CourseResponse = { course: Course[] }
type Registration = { course_id: string, student_id: string }
type RegistrationResponse = { registration: Registration[] }

export function AddPreInstituto_addCourse() {
  const [message, setMessage] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [coursesByLevel, setCoursesByLevel] = useState<Record<string, Course[]>>({})
  const [formData, setFormData] = useState({
    selectedLevel: '',
    selectedPeriod: '',
    selectedCourse: null as Course | null,
  })

  const { id } = useParams(); // Acessa o id da URL

  const navigate = useNavigate()

  console.log('ID do estudante:', id);

  const studentId = id; // Atribui o id do estudante a uma variável

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  const { data: dataCourses, error: coursesError, isLoading: isLoadingCourse } = useQuery<CourseResponse>({
    queryKey: ['course_data'],
    queryFn: getCourses,
  })

  const { data: dataRegistration } = useQuery<RegistrationResponse>({
    queryKey: ['Registration_data'],
    queryFn: getRegistration,
  })

  useEffect(() => {
    if (dataCourses?.course) {
      const groupedCourses: Record<string, Course[]> = {}
      dataCourses.course.forEach(course => {
        if (!groupedCourses[course.levelCourse]) {
          groupedCourses[course.levelCourse] = []
        }
        groupedCourses[course.levelCourse].push(course)
      })
      setCoursesByLevel(groupedCourses)
    }
  }, [dataCourses])

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const level = e.target.value
    setFormData(prevState => ({
      ...prevState,
      selectedLevel: level,
      selectedPeriod: '',
      selectedCourse: null,
    }))
    setCourses(coursesByLevel[level] || [])
  }

  const handlePeriodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const period = e.target.value.toUpperCase()
    setFormData(prevState => ({
      ...prevState,
      selectedPeriod: period,
      selectedCourse: null,
    }))
    if (formData.selectedLevel && coursesByLevel[formData.selectedLevel]) {
      setCourses(coursesByLevel[formData.selectedLevel].filter(course => course.period === period))
    }
  }

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseName = e.target.value
    const course = courses.find(course => course.courseName === courseName) || null
    setFormData(prevState => ({
      ...prevState,
      selectedCourse: course,
    }))
  }

  const onSubmit = async (data: any) => {
    // Combine os dados do formulário com os dados do curso selecionado
    const formDataWithCourse = {
      ...data,  // Dados coletados do formulário
      selectedCourse: formData.selectedCourse,
      selectedLevel: formData.selectedLevel,
      selectedPeriod: formData.selectedPeriod,
    };
  
    console.log('Dados do formulário com curso:', formDataWithCourse);

    if (!formData.selectedCourse || !studentId) {
        setMessage('Erro: Selecione um curso e certifique-se de estar logado.')
        return
      }
  
      // Verificar se o estudante já está inscrito em algum curso
      if (dataRegistration?.registration) {
        const existingRegistration = dataRegistration.registration.find(
          reg => reg.student_id === studentId
        )
  
        if (existingRegistration) {
          // Encontrar o nome do curso ao qual o estudante já está inscrito
          const registeredCourse = dataCourses?.course.find(
            course => course.id === existingRegistration.course_id
          )
  
          setMessage(
            `Erro: Você já está registrado no curso "${registeredCourse?.levelCourse
              .replace(/_/g, ' ') // Substitui _ por espaço
              .toLowerCase() // Converte para minúsculas
              .replace(/\b\w/g, char =>
                char.toUpperCase()
              )} em ${registeredCourse?.courseName} - ${registeredCourse?.period.toLowerCase() === 'laboral' ? 'Laboral' : 'Pós-laboral'}".`
          )
          return
        }
      }
  
    // Aqui você pode chamar uma função para fazer a inscrição ou qualquer outra lógica necessária
    // Exemplo de como pode enviar os dados
    try {
      // Supondo que você tenha uma função para enviar os dados
       const preInstituto = await createPreInstituto({
              schoolLevel: data.schoolLevel,
              schoolName: data.schoolName,
              schoolProvincy: data.schoolProvincy,
              student_id: studentId,
        })

        console.log('Dados do pré-instituto:', preInstituto);

        const registerStudentCourse = await postRegistration({
            course_id: formData.selectedCourse.id,
            student_id: studentId,
        })
        console.log('Dados da inscrição:', registerStudentCourse);

        navigate('/academic_record/students') // Navega para a página de registro acadêmico

      // Lógica de sucesso, como redirecionar para outra página ou mostrar mensagem
      setMessage("Inscrição realizada com sucesso!");
    } catch (error) {
      // Lógica de erro
      setMessage("Erro ao realizar a inscrição!");
    }
  };
  

  if (isLoadingCourse) return <div>Carregando cursos...</div>
  if (coursesError instanceof Error) return <div>Erro: {coursesError.message}</div>

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Pré-escola</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {/* Nível Acadêmico */}
          <div className="sm:col-span-2">
            <label htmlFor="schoolLevel" className="block text-sm font-medium text-gray-900">
              Nível Acadêmico
            </label>
            <select
              id="schoolLevel"
              {...register('schoolLevel')}
              value={formData.selectedLevel}
              onChange={handleLevelChange}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            >
              <option value="">-- Selecione --</option>
              {['CLASSE_10', 'CLASSE_12', 'LICENCIATURA'].map(option => (
                <option key={option} value={option}>
                  {option.replace('_', ' ').charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            {errors.schoolLevel && <p className="text-red-500 text-sm">{String(errors.schoolLevel.message)}</p>}
          </div>

          {/* Nome da Escola */}
          <div className="sm:col-span-3">
            <label htmlFor="schoolName" className="block text-sm font-medium text-gray-900">
              Nome da Escola
            </label>
            <input
              id="schoolName"
              {...register('schoolName')}
              type="text"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
            {errors.schoolName && <p className="text-red-500 text-sm">{String(errors.schoolName.message)}</p>}
          </div>

          {/* Província */}
          <div className="sm:col-span-2">
            <label htmlFor="schoolProvincy" className="block text-sm font-medium text-gray-900">
              Província
            </label>
            <select
              id="schoolProvincy"
              {...register('schoolProvincy')}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            >
              {['MAPUTO_CIDADE', 'MAPUTO_PROVINCIA', 'GAZA', 'INHAMBANE', 'MANICA', 'SOFALA', 'TETE', 'ZAMBEZIA', 'NAMPULA', 'CABO_DELGADO', 'NIASSA'].map(option => (
                <option key={option} value={option}>
                  {option.replace('_', ' ').charAt(0).toUpperCase() + option.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
            {errors.schoolProvincy && <p className="text-red-500 text-sm">{String(errors.schoolProvincy.message)}</p>}
          </div>

          <div className="sm:col-span-6">
            <h2 className="text-lg font-semibold mb-4">Pré-escola</h2>
          </div>

          {/* Nível Acadêmico e Período */}
          <div className="sm:col-span-2">
            <label className="block font-semibold">Nível Acadêmico</label>
            <select
              className="border p-2 rounded-md w-full mt-1"
              onChange={handleLevelChange}
              value={formData.selectedLevel}
            >
              <option value="">-- Escolha --</option>
              {Object.keys(coursesByLevel).map(level => (
                <option key={level} value={level}>
                  {level.replace('_', ' ').charAt(0).toUpperCase() + level.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold">Período</label>
            <select
              className="border p-2 rounded-md w-full mt-1"
              onChange={handlePeriodChange}
              value={formData.selectedPeriod}
              disabled={!formData.selectedLevel}
            >
              <option value="">-- Selecione o período --</option>
              <option value="LABORAL">Laboral</option>
              <option value="POS_LABORAL">Pós-laboral</option>
            </select>
          </div>

          {/* Curso */}
          <div className="col-span-5">
            <label className="block font-semibold">
              Cursos <span className="text-gray-500">(selecione um curso baseado na disponibilidade)</span>
            </label>
            <select
              className="border p-2 rounded-md w-full mt-1"
              onChange={handleCourseChange}
              value={formData.selectedCourse?.courseName || ''}
              disabled={!formData.selectedLevel || !formData.selectedPeriod}
            >
              <option value="">-- Selecione o curso --</option>
              {courses.map(course => (
                <option key={course.id} value={course.courseName}>
                  {course.courseName
                    .toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Exibe a parte do Encarregado de Educação se o nível acadêmico for "10 Classe" */}
          {formData.selectedLevel === 'CLASSE_10' && <Education_Officer />}
        </div>

        <h3 className="mt-6 font-semibold">Curso Selecionado</h3>
        <div className="bg-gray-200 p-4 mt-2 rounded-md">
            <table className="w-full text-left">
            <thead>
                <tr className="border-b">
                {/* <th className="p-2">ID</th> */}
                <th className="p-2">Nível Acadêmico</th>
                <th className="p-2">Nome do Curso</th>
                <th className="p-2">Período</th>
                <th className="p-2">Vagas Disponíveis</th>
                </tr>
            </thead>
            <tbody>
                {formData.selectedCourse ? (
                <tr>
                    {/* <td className="p-2">{selectedCourse.id}</td> */}
                    <td className="p-2">
                    {formData.selectedCourse.levelCourse
                        ? formData.selectedCourse.levelCourse.charAt(0).toUpperCase() +
                        formData.selectedCourse.levelCourse.slice(1).toLowerCase()
                        : ''}
                    </td>
                    <td className="p-2">
                    {formData.selectedCourse.courseName
                        .toLowerCase()
                        .split(' ')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </td>
                    <td className="p-2">
                    {formData.selectedCourse.period
                        ? formData.selectedCourse.period.charAt(0).toUpperCase() +
                        formData.selectedCourse.period.slice(1).toLowerCase()
                        : ''}
                    </td>
                    <td className="p-2">
                    {formData.selectedCourse.availableVacancies} vagas
                    </td>
                </tr>
                ) : (
                <tr>
                    <td className="p-2 text-gray-500" colSpan={5}>
                    Nenhum curso selecionado
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        <button type="submit" className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md">
          Confirmar Inscrição
        </button>

        {/* Display the message */}
        {message && (
          <div className={`mt-4 p-2 rounded-md ${message.includes('Erro') ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  )
}
