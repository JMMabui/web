import { Outlet, useNavigate } from 'react-router-dom';
import { Users, FileText, PlusCircle, LogOut, Home, Bell, UserCircle } from 'lucide-react';
import logo from '../../../assents/ismmalogo.png';
import type { LucideProps } from 'lucide-react';

const DefaultAvatar = () => <div className="w-8 h-8 bg-gray-300 rounded-full" />;

interface MenuItemProps {
  label: string;
  icon: React.ComponentType<LucideProps>;
  to: string;
}

const MenuItem = ({ label, icon: Icon, to }: MenuItemProps) => {
  const navigate = useNavigate();

  return (
    <li>
      <button
        type="button"
        onClick={() => navigate(to)}
        className="flex items-center gap-3 p-3 rounded-lg w-full text-left transition duration-300 hover:bg-yellow-700 focus:bg-yellow-800 focus:outline-none"
        aria-label={label}
      >
        <Icon size={20} className="text-white" />
        <span>{label}</span>
      </button>
    </li>
  );
};

export function DashboardLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-yellow-600 text-white p-5 flex flex-col">
        <div className="text-2xl font-bold mb-6">
          <img src={logo} alt="ISMMA LOGO" className="w-full h-auto" />
        </div>
        <h2 className="text-2xl text-white font-bold mb-8">Dashboard RH</h2>
        <nav className="flex-1">
          <ul className="space-y-4">
            {/* Itens do Menu de Navegação */}
            <MenuItem label="Dashboard" icon={Home} to="/human_resources/dashboard" />
            <MenuItem label="Funcionários" icon={Users} to="/human_resources/employee" />
            <MenuItem label="Relatórios" icon={FileText} to="/human_resources/reports" />
            <MenuItem label="Adicionar Funcionário" icon={PlusCircle} to="/human_resources/add_employee" />
            <li>
              <button
                type="button"
                className="flex items-center space-x-3 p-3 rounded-lg w-full text-left transition duration-300 hover:bg-yellow-700 focus:bg-yellow-800 focus:outline-none"
                aria-label="Sair"
              >
                <LogOut size={20} className="text-white" />
                <span>Sair</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-50">
        {/* Top Nav */}
        <header className="flex items-center justify-between bg-white p-4 shadow">
         
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
            <div className="flex items-center gap-2 cursor-pointer">
              {UserCircle ? (
                <UserCircle className="w-8 h-8" />
              ) : (
                <DefaultAvatar />
              )}
              <span className="font-medium">Almeida Tomas</span>
            </div>
          </div>

          <div>
            <button type="button" className="px-4 py-2  bg-yellow-600 text-white rounded-md">
              perfil
            </button>

            <button type="button" className="px-4 py-2 bg-zinc-400 text-white rounded-md ml-2">
              Sair
            </button>
          </div>
        </header>

        {/* Content that will change based on route */}
        <Outlet />
      </div>
    </div>
  );
}
