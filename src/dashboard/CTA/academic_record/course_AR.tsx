import { useState } from 'react';
import { PlusCircle, BookOpen, Clipboard } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getCourses, addCourse } from '@/http/courses';

type Course = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  courseName: string;
  courseDescription: string;
  courseDuration: number;
  levelCourse: 'CURTA_DURACAO' | 'TECNICO_MEDIO' | 'LICENCIATURA' | 'MESTRADO' | 'RELIGIOSO';
  period: 'LABORAL' | 'POS_LABORAL';
  totalVacancies: number;
  availableVacancies: number;
  disciplines: string[]; // Adicionando uma propriedade para disciplinas
};

type CourseFormData = {
  courseName: string;
  courseDescription: string;
  courseDuration: number;
  levelCourse: 'CURTA_DURACAO' | 'TECNICO_MEDIO' | 'LICENCIATURA' | 'MESTRADO' | 'RELIGIOSO';
  period: 'LABORAL' | 'POS_LABORAL';
  totalVacancies: number;
  availableVacancies: number;
};

type CourseResponse = {
  course: Course[];
};

export function CoursesDashboard() {
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [coursesToShow, setCoursesToShow] = useState(5); // Para controlar a quantidade de cursos exibidos

  const { data: dataCourses, error: coursesError, isLoading: isLoadingCourses } = useQuery<CourseResponse>({
    queryKey: ['courses_data'],
    queryFn: getCourses,
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<CourseFormData>();

  const addCourseMutation = useMutation<any, Error, CourseFormData>({
    mutationFn: addCourse,
    onSuccess: () => {
      reset();
      setIsAddingCourse(false);
    },
    onError: (error) => {
      console.error('Erro ao adicionar curso:', error);
    },
  });

  if (isLoadingCourses) return <div>Carregando cursos...</div>;
  if (coursesError instanceof Error) return <div>Erro: {coursesError.message}</div>;

  const totalCourses = dataCourses?.course.length || 0;

  const coursesByLevel = dataCourses?.course.reduce((acc, course) => {
    acc[course.levelCourse] = (acc[course.levelCourse] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const displayedCourses = dataCourses?.course.slice(0, coursesToShow); // Limitando a quantidade de cursos

  const onSubmit = (data: CourseFormData) => {
    const courseData = {
      ...data,
      courseDuration: Number.parseInt(data.courseDuration.toString(), 10),
      totalVacancies: Number.parseInt(data.totalVacancies.toString(), 10),
      availableVacancies: Number.parseInt(data.availableVacancies.toString(), 10),
    };

    console.log(courseData);
    addCourseMutation.mutate(courseData);
  };

  const loadMoreCourses = () => {
    setCoursesToShow((prev) => prev + 5); // Carregar mais 5 cursos
  };

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Dashboard de Cursos</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Total de Cursos</h3>
            <p className="text-xl font-bold">{totalCourses}</p>
          </div>
          <BookOpen className="text-blue-600 w-12 h-12" />
        </div>

        {Object.entries(coursesByLevel || {}).map(([level, count]) => (
          <div key={level} className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Cursos de {level}</h3>
              <p className="text-xl font-bold">{count}</p>
            </div>
            <Clipboard className="text-green-600 w-12 h-12" />
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => setIsAddingCourse(true)}
          className="bg-green-600 text-white py-2 px-6 rounded-lg flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-6 h-6" />
          <span>Adicionar Novo Curso</span>
        </button>
      </div>

      {isAddingCourse && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Adicionar Curso</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-lg font-medium">Nome do Curso</label>
              <input
                type="text"
                {...register('courseName', { required: 'Nome do curso é obrigatório' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              {errors.courseName && <p className="text-red-600 text-sm">{errors.courseName.message}</p>}
            </div>

            <div>
              <label className="block text-lg font-medium">Descrição</label>
              <textarea
                {...register('courseDescription', { required: 'Descrição é obrigatória' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              {errors.courseDescription && <p className="text-red-600 text-sm">{errors.courseDescription.message}</p>}
            </div>

            <div>
              <label className="block text-lg font-medium">Nível Acadêmico</label>
              <select
                {...register('levelCourse', { required: 'Nível acadêmico é obrigatório' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="">Selecione o Nível</option>
                <option value="LICENCIATURA">Licenciatura</option>
                <option value="MESTRADO">Mestrado</option>
                <option value="CURTA_DURACAO">Curta Duração</option>
                <option value="TECNICO_MEDIO">Técnico Médio</option>
                <option value="RELIGIOSO">Religioso</option>
              </select>
              {errors.levelCourse && <p className="text-red-600 text-sm">{errors.levelCourse.message}</p>}
            </div>

            <div>
              <label className="block text-lg font-medium">Duração do Curso</label>
              <input
                type="text"
                {...register('courseDuration', { required: 'Duração do curso é obrigatória' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              {errors.courseDuration && <p className="text-red-600 text-sm">{errors.courseDuration.message}</p>}
            </div>

            <div>
              <label className="block text-lg font-medium">Período</label>
              <select
                {...register('period', { required: 'Período é obrigatório' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="">Selecione o Período</option>
                <option value="LABORAL">Laboral</option>
                <option value="POS_LABORAL">Pós-Laboral</option>
              </select>
              {errors.period && <p className="text-red-600 text-sm">{errors.period.message}</p>}
            </div>

            <div>
              <label className="block text-lg font-medium">Total de Vagas</label>
              <input
                type="number"
                {...register('totalVacancies', { required: 'Total de vagas é obrigatório' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              {errors.totalVacancies && <p className="text-red-600 text-sm">{errors.totalVacancies.message}</p>}
            </div>

            <div>
              <label className="block text-lg font-medium">Vagas Disponíveis</label>
              <input
                type="number"
                {...register('availableVacancies', { required: 'Vagas disponíveis é obrigatório' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              {errors.availableVacancies && <p className="text-red-600 text-sm">{errors.availableVacancies.message}</p>}
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg"
              >
                Adicionar Curso
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabela de Cursos */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Cursos Cadastrados</h3>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr>
              <th className='py-2 px-4 border-b text-left'>Nivel Academico</th>
              <th className="py-2 px-4 border-b text-left">Nome do Curso</th>
              <th className="py-2 px-4 border-b text-left">Periodo</th>
              <th className="py-2 px-4 border-b text-left">Descrição</th>
              <th className="py-2 px-4 border-b text-left">Vagas Totais</th>
              <th className="py-2 px-4 border-b text-left">Vagas Disponíveis</th>
              <th className="py-2 px-4 border-b text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {displayedCourses?.map((course) => (
              <tr key={course.id}>
                <td className="py-2 px-4 border-b">{course.levelCourse.charAt(0).toUpperCase() + course.levelCourse.slice(1).toLowerCase()}</td>
<td className="py-2 px-4 border-b">{course.courseName.charAt(0).toUpperCase() + course.courseName.slice(1).toLowerCase()}</td>
<td className="py-2 px-4 border-b">{course.period.charAt(0).toUpperCase() + course.period.slice(1).toLowerCase()}</td>
                <td className="py-2 px-4 border-b">{course.courseDescription}</td>
                <td className="py-2 px-4 border-b">{course.totalVacancies}</td>
                <td className="py-2 px-4 border-b">{course.availableVacancies}</td>
                <td className="py-2 px-4 border-b">
                  <button 
                    type="button"
                    className="bg-blue-600 text-white py-1 px-4 rounded-lg"
                  >
                    Adicionar Disciplina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Se houver mais cursos, permite carregar mais */}
        {totalCourses > coursesToShow && (
          <div className="mt-4 text-center">
            <button
            type='button'
              onClick={loadMoreCourses}
              className="bg-blue-600 text-white py-2 px-6 rounded-lg"
            >
              Carregar mais cursos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
