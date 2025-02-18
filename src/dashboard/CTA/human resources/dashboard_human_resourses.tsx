import { Users, User, FileText, BarChart, PlusCircle, LogOut } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const employeesData = [
  { id: 1, name: 'João Silva', department: 'TI', position: 'Desenvolvedor', status: 'Ativo' },
  { id: 2, name: 'Maria Oliveira', department: 'Financeiro', position: 'Analista', status: 'Inativo' },
  { id: 3, name: 'Carlos Souza', department: 'RH', position: 'Coordenador', status: 'Ativo' },
  { id: 4, name: 'Ana Santos', department: 'Marketing', position: 'Gerente', status: 'Ativo' },
  { id: 5, name: 'Pedro Lima', department: 'TI', position: 'Analista', status: 'Ativo' },
];

const departmentData = [
  { department: 'TI', count: 2 },
  { department: 'Financeiro', count: 1 },
  { department: 'RH', count: 1 },
  { department: 'Marketing', count: 1 },
];

export function Dashboard_Human_Resourses() {
  const navigate = useNavigate();
  navigate('/dashboard/human_resources')
  const [activeEmployees, setActiveEmployees] = useState<number>(employeesData.filter(emp => emp.status === 'Ativo').length);
  const [inactiveEmployees, setInactiveEmployees] = useState<number>(employeesData.filter(emp => emp.status === 'Inativo').length);

  return (
    <div className="flex">
      <div className="flex-1 p-6 bg-gray-50">
        {/* Resumo Geral */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Total de Funcionários</h2>
              <p className="text-3xl font-bold text-gray-700">{employeesData.length}</p>
            </div>
            <Users size={40} className="text-blue-500" />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Funcionários Ativos</h2>
              <p className="text-3xl font-bold text-gray-700">{activeEmployees}</p>
            </div>
            <User size={40} className="text-green-500" />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Funcionários Inativos</h2>
              <p className="text-3xl font-bold text-gray-700">{inactiveEmployees}</p>
            </div>
            <FileText size={40} className="text-red-500" />
          </div>
        </div>

        {/* Outros conteúdos */}
      </div>
    </div>
  );
}
