import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircle, User } from 'lucide-react';
import { getRegistration } from '@/http/registration';
import { useQuery } from '@tanstack/react-query';

type registrationSchema = {
    course_id: string
    student_id: string
    id: string
    registrationStatus:
      | 'PENDENTE'
      | 'CONFIRMADO'
      | 'CANCELADO'
      | 'TRANCADO'
      | 'INSCRITO'
      | 'NAO_INSCRITO'
    student: {
      surname: string
      name: string
    }
    course: {
      courseName: string
      levelCourse:
        | 'CURTA_DURACAO'
        | 'TECNICO_MEDIO'
        | 'LICENCIATURA'
        | 'MESTRADO'
        | 'RELIGIOSO'
      period: 'LABORAL' | 'POS_LABORAL'
    }
    createdAt: Date
    updatedAt: Date | null
  }

type registrationResponse = {
    registration: registrationSchema[]
  }

export function StudentsFiticios() {
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<registrationSchema | null>(null);

  const { data: dataRegistration, error: RegistrationError, isLoading: isLoadingRegistration } = useQuery<registrationResponse>({
    queryKey: ['students_data'],
    queryFn: getRegistration,
  });

  if (isLoadingRegistration) {
    return <div>Carregando...</div>;
  }

  if (RegistrationError) {
    return <div>Erro ao carregar os dados dos estudantes: {RegistrationError.message}</div>;
  }

  const registrationData = dataRegistration?.registration;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = registrationData?.filter(student =>
    student.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );


//   const onSubmit = async (data: StudentFormData) => {
//     console.log('Novo estudante adicionado', data);
//     reset();
//     setIsAddingStudent(false);
//   };

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Gestão de Estudantes</h2>

      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Pesquisar Estudante..."
          className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents?.map((student) => (
          <div key={student.id} className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <User className="w-16 h-16 text-blue-600 mb-4" />
            <h3 className="text-lg font-medium">{student.student.name} {student.student.surname}</h3>
            <p className="text-sm text-gray-600">{student.student_id}</p>
            <p className="text-sm text-gray-600">{student.course.courseName}</p>
            <p className="text-sm text-gray-600">{student.registrationStatus}</p>
            {/* <p className="text-sm text-gray-600">Média: {student.grade}</p> */}
            <div className="mt-4 flex space-x-2">
              <button
                type="button"
                onClick={() => setSelectedStudent(student)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Ver Perfil
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedStudent && (
  <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-8 max-w-sm">
      <h3 className="text-2xl font-semibold mb-4">
        Perfil de {selectedStudent.student.name} {selectedStudent.student.surname}
      </h3>
      <p><strong>Numero de Estudante:</strong> {selectedStudent.student_id}</p>
      <p><strong>Nivel Academico:</strong> {selectedStudent.course.levelCourse}</p>
      <p><strong>Curso:</strong> {selectedStudent.course.courseName}</p>
      <p><strong>Periodo:</strong> {selectedStudent.course.period}</p>
      <p><strong>Estado da Matricula:</strong> {selectedStudent.registrationStatus}</p>

      <div className="flex space-x-2 mt-4">
        {/* Botão Fechar */}
        <button
          type="button"
          onClick={() => setSelectedStudent(null)}
          className="bg-red-600 text-white py-2 px-4 rounded-lg w-full"
        >
          Fechar
        </button>

        {/* Botão Perfil Completo */}
        <button
          type="button"
          onClick={() => window.open(`/student_profile/${selectedStudent.student_id}`, '_blank')}
          className="bg-red-600 text-white py-2 px-4 rounded-lg w-full"
        >
          Perfil Completo
        </button>
      </div>
    </div>
  </div>
)}


      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => setIsAddingStudent(true)}
          className="bg-green-600 text-white py-2 px-6 rounded-lg flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-6 h-6" />
          <span>Adicionar Novo Estudante</span>
        </button>
      </div>

      {/* {isAddingStudent && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Adicionar Estudante</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formFields.map(({ name, label, type }) => (
              <div key={name}>
                <label className="block text-lg font-medium">{label}</label>
                <input
                  type={type}
                  {...register(name as keyof StudentFormData, { required: `${label} é obrigatório` })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                {errors[name as keyof StudentFormData] && <span className="text-red-500 text-sm">{errors[name as keyof StudentFormData]?.message}</span>}
              </div>
            ))}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg"
              >
                Adicionar Estudante
              </button>
            </div>
          </form>
        </div>
      )} */}
    </div>
  );
}
