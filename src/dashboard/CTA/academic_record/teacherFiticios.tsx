import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PlusCircle, User } from 'lucide-react';

type Teacher = {
  id: string;
  name: string;
  email: string;
  phone: string;
  profile: string;
  discipline: string;
  workload: number; // Carga horária
  allocations: { period: string; discipline: string }[]; // Alocações por período
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

export function TeachersFiticios() {
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [allocationPeriod, setAllocationPeriod] = useState<string>(''); // Período da alocação
  const [allocationDiscipline, setAllocationDiscipline] = useState<string>(''); // Disciplina da alocação
  const [isAllocating, setIsAllocating] = useState<boolean>(false); // Controla se o formulário de alocação está aberto

  // Dados fictícios de docentes
  const teacherData: TeacherResponse = {
    teachers: [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao.silva@example.com',
        phone: '1234-5678',
        profile: 'Professor de Matemática e Ciências Exatas',
        discipline: 'Matemática',
        workload: 20,
        allocations: [],
      },
      {
        id: '2',
        name: 'Maria Oliveira',
        email: 'maria.oliveira@example.com',
        phone: '9876-5432',
        profile: 'Professora de História e Ciências Humanas',
        discipline: 'História',
        workload: 15,
        allocations: [],
      },
      {
        id: '3',
        name: 'Carlos Souza',
        email: 'carlos.souza@example.com',
        phone: '5555-1234',
        profile: 'Professor de Física e Ciências Exatas',
        discipline: 'Física',
        workload: 25,
        allocations: [],
      },
    ],
  };

  // Função de pesquisa
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Filtro dos docentes com base no nome
  const filteredTeachers = teacherData.teachers.filter((teacher) =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { register, handleSubmit, reset } = useForm<TeacherFormData>();

  const onSubmit = (data: TeacherFormData) => {
    console.log('Novo docente adicionado', data);
    reset();
    setIsAddingTeacher(false);
  };

  const handleAllocation = (teacherId: string) => {
    // Encontrar o docente e adicionar a alocação
    const teacher = teacherData.teachers.find((teacher) => teacher.id === teacherId);
    if (teacher) {
      teacher.allocations.push({
        period: allocationPeriod,
        discipline: allocationDiscipline,
      });
      alert(`Docente ${teacher.name} alocado(a) para ${allocationDiscipline} no período ${allocationPeriod}.`);
    }
    setIsAllocating(false); // Fechar o formulário de alocação
    setSelectedTeacher(null); // Resetar a seleção de docente
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
        {filteredTeachers.map((teacher) => (
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
                type="button"
                onClick={() => setSelectedTeacher(teacher)}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg"
              >
                Ver Perfil
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedTeacher(teacher); // Seleciona o docente ao clicar no botão
                  setAllocationPeriod(''); // Reseta o período e disciplina
                  setAllocationDiscipline('');
                  setIsAllocating(true); // Abre o formulário de alocação
                }}
                className="bg-green-600 text-white py-2 px-4 rounded-lg"
              >
                Alocar Disciplina
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para ver o perfil do docente */}
      {selectedTeacher && !isAllocating && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 max-w-sm">
            <h3 className="text-2xl font-semibold mb-4">Perfil de {selectedTeacher.name}</h3>
            <p><strong>Email:</strong> {selectedTeacher.email}</p>
            <p><strong>Telefone:</strong> {selectedTeacher.phone}</p>
            <p><strong>Disciplina:</strong> {selectedTeacher.discipline}</p>
            <p><strong>Carga Horária:</strong> {selectedTeacher.workload} horas</p>
            <p><strong>Perfil:</strong> {selectedTeacher.profile}</p>
            <button
              type="button"
              onClick={() => setSelectedTeacher(null)}
              className="bg-red-600 text-white py-2 px-4 rounded-lg mt-4"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Formulário para alocar docente */}
      {isAllocating && selectedTeacher && (
        <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Alocar Docente</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-lg font-medium">Período</label>
              <input
                type="text"
                value={allocationPeriod}
                onChange={(e) => setAllocationPeriod(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Ex: 2025.1"
              />
            </div>

            <div>
              <label className="block text-lg font-medium">Disciplina</label>
              <input
                type="text"
                value={allocationDiscipline}
                onChange={(e) => setAllocationDiscipline(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Ex: Matemática"
              />
            </div>

            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => {
                  handleAllocation(selectedTeacher.id); // Aloca o docente
                }}
                className="bg-blue-600 text-white py-2 px-6 rounded-lg"
              >
                Alocar
              </button>
            </div>
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
