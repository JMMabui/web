import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation } from '@tanstack/react-query';
import { PlusCircle, User, Search, Clipboard } from 'lucide-react';

type Teacher = {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile: string;
  discipline: string;
  workload: number; // Carga horária
};

type TeacherFormData = {
  name: string;
  email: string;
  phone: string;
  profile: string;
};

type TeacherResponse = {
  teachers: Teacher[];
};

export function TeachersDashboard() {
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Consulta para obter os docentes
  const { data: teacherData, error, isLoading } = useQuery<TeacherResponse>({
    queryKey: ['teachers'],
    queryFn: async () => {
      // Aqui você colocaria a chamada de API para buscar os docentes
      return { teachers: [] }; // Exemplo de dados
    },
  });

  // Mutação para adicionar docente
  const addTeacherMutation = useMutation({
    mutationFn: async (newTeacher: TeacherFormData) => {
      // Chamada de API para adicionar docente
    },
    onSuccess: () => {
      setIsAddingTeacher(false);
    },
  });

  // Função de pesquisa
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filtro dos docentes com base no nome
  const filteredTeachers = teacherData?.teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { register, handleSubmit, reset } = useForm<TeacherFormData>();

  const onSubmit = (data: TeacherFormData) => {
    addTeacherMutation.mutate(data);
    reset();
  };

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Gestão de Docentes</h2>

      {/* Pesquisa */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Pesquisar Docente..."
          className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Cards de docentes */}
        {filteredTeachers?.map((teacher) => (
          <div
            key={teacher.id}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center"
          >
            <User className="w-16 h-16 text-blue-600 mb-4" />
            <h3 className="text-lg font-medium">{teacher.name}</h3>
            <p className="text-sm text-gray-600">{teacher.email}</p>
            <p className="text-sm text-gray-600">{teacher.phone}</p>
            <p className="text-sm text-gray-600">{teacher.discipline}</p>
            <p className="text-sm text-gray-600">Carga Horária: {teacher.workload} horas</p>

            <div className="mt-4 flex space-x-2">
              <button
                type='button'
                onClick={() => setSelectedTeacher(teacher)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Ver Perfil
              </button>
              <button
              type='button'
                onClick={() => alert(`Alocar docente ${teacher.name} a disciplina`)}
                className="bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Alocar Disciplina
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para ver o perfil do docente */}
      {selectedTeacher && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-sm">
            <h3 className="text-2xl font-semibold mb-4">Perfil de {selectedTeacher.name}</h3>
            <p><strong>Email:</strong> {selectedTeacher.email}</p>
            <p><strong>Telefone:</strong> {selectedTeacher.phone}</p>
            <p><strong>Disciplina:</strong> {selectedTeacher.discipline}</p>
            <p><strong>Carga Horária:</strong> {selectedTeacher.workload} horas</p>
            <p><strong>Perfil:</strong> {selectedTeacher.profile}</p>
            <button
            type='button'
              onClick={() => setSelectedTeacher(null)}
              className="bg-red-600 text-white py-2 px-4 rounded-lg mt-4"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Botão para adicionar docente */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => setIsAddingTeacher(true)}
          className="bg-green-600 text-white py-2 px-6 rounded-lg flex items-center justify-center space-x-2"
        >
          <PlusCircle className="w-6 h-6" />
          <span>Adicionar Novo Docente</span>
        </button>
      </div>

      {/* Formulário para adicionar docente */}
      {isAddingTeacher && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Adicionar Docente</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-lg font-medium">Nome</label>
              <input
                type="text"
                {...register('name', { required: 'Nome é obrigatório' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Email</label>
              <input
                type="email"
                {...register('email', { required: 'Email é obrigatório' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Telefone</label>
              <input
                type="text"
                {...register('phone', { required: 'Telefone é obrigatório' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Perfil</label>
              <textarea
                {...register('profile', { required: 'Perfil é obrigatório' })}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white py-2 px-6 rounded-lg"
              >
                Adicionar Docente
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
