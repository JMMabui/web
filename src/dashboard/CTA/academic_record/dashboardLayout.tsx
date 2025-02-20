import { useState } from 'react';
import { Home, Users, Settings, Bell, UserCircle, FileTextIcon, User2Icon, ChevronDown } from 'lucide-react';
import logo from '../../../assents/ismmalogo.png';
import { Outlet, useNavigate } from 'react-router-dom';

const DefaultAvatar = () => <div className="w-8 h-8 bg-gray-300 rounded-full" />;

export function DashboardLayout2() {
  const [active, setActive] = useState('Dashboard');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', icon: Home, route: '/academic_record/dashboard' },
    { name: 'Cursos', icon: FileTextIcon, route: '/academic_record/courses' },
    { name: 'Estudantes', icon: User2Icon, route: '/academic_record/students' },
    { name: 'Inscrições', icon: FileTextIcon, route: '/academic_record/enrollment' },
    { name: 'Docentes', icon: Users, route: '/academic_record/teachers' },
    { name: 'Emissão de Documentos', icon: FileTextIcon, route: '/academic_record/documents' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-yellow-600 text-white p-5 flex flex-col">
        <div className="text-2xl font-bold mb-6">
          <img src={logo} alt="ISMMA LOGO" />
        </div>
        <nav className="flex-1">
          {menuItems.map(({ name, icon: Icon, route }) => (
            <div key={name}>
              {/* Item principal */}
              <button
                type="button"
                onClick={() => {
                  if (openDropdown === name) {
                    setOpenDropdown(null); // Fecha o dropdown se clicar no item ativo
                  } else {
                    setOpenDropdown(name); // Abre o dropdown para o item selecionado
                  }
                  setActive(name);
                  navigate(route); // Navegar para a rota
                }}
                className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition ${active === name ? 'bg-yellow-800' : 'hover:bg-yellow-700'}`}
              >
                <Icon className="w-5 h-5" />
                {name}
                {name === 'Cursos' || name === 'Estudantes' || name === 'Docentes' || name === 'Emissão de Documentos' ? (
                  <ChevronDown className={`ml-auto transform ${openDropdown === name ? 'rotate-180' : ''}`} />
                ) : null}
              </button>

              {/* Dropdowns */}
              {name === 'Cursos' && openDropdown === name && (
                <div className="pl-8 pt-2 space-y-2">
                  <button 
                    className="text-white hover:bg-yellow-700 w-full p-2 rounded-lg text-left"
                    onClick={() => navigate('/academic_record/add-course')} // Substitua com a rota de adicionar curso
                  >
                    Adicionar Curso
                  </button>
                  <button 
                    className="text-white hover:bg-yellow-700 w-full p-2 rounded-lg text-left"
                    onClick={() => navigate('/academic_record/add-subject')} // Substitua com a rota de adicionar disciplina
                  >
                    Adicionar Disciplina
                  </button>
                </div>
              )}

              {name === 'Estudantes' && openDropdown === name && (
                <div className="pl-8 pt-2 space-y-2">
                  <button 
                    className="text-white hover:bg-yellow-700 w-full p-2 rounded-lg text-left"
                    onClick={() => navigate('/academic_record/student-profile')} // Substitua com a rota de perfil do estudante
                  >
                    Perfil do Estudante
                  </button>
                  <button 
                    className="text-white hover:bg-yellow-700 w-full p-2 rounded-lg text-left"
                    onClick={() => navigate('/academic_record/new-student')} // Substitua com a rota de novo estudante
                  >
                    Novo Estudante
                  </button>
                </div>
              )}

              {name === 'Docentes' && openDropdown === name && (
                <div className="pl-8 pt-2 space-y-2">
                  <button 
                    className="text-white hover:bg-yellow-700 w-full p-2 rounded-lg text-left"
                    onClick={() => navigate('/academic_record/add-teacher')} // Substitua com a rota de adicionar docente
                  >
                    Adicionar Docente
                  </button>
                  <button 
                    className="text-white hover:bg-yellow-700 w-full p-2 rounded-lg text-left"
                    onClick={() => navigate('/academic_record/assign-subject')} // Substitua com a rota de alocar disciplina
                  >
                    Alocar Disciplina
                  </button>
                </div>
              )}

              {name === 'Emissão de Documentos' && openDropdown === name && (
                <div className="pl-8 pt-2 space-y-2">
                  <button 
                    className="text-white hover:bg-yellow-700 w-full p-2 rounded-lg text-left"
                    onClick={() => navigate('/academic_record/certificate')} // Substitua com a rota de certificado
                  >
                    Certificado
                  </button>
                  <button 
                    className="text-white hover:bg-yellow-700 w-full p-2 rounded-lg text-left"
                    onClick={() => navigate('/academic_record/diploma')} // Substitua com a rota de diploma
                  >
                    Diploma
                  </button>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Toggle Sidebar Button */}
        <button
          type="button"
          onClick={() => {}}
          className="mt-auto flex items-center gap-2 p-3 rounded-lg hover:bg-yellow-700"
        >
          <Settings className="w-5 h-5 " /> Configurações
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="flex items-center justify-between bg-white p-4 shadow">
          <input
            type="text"
            placeholder="Search"
            className="border rounded px-3 py-1 w-1/3"
          />

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
        </header>

        {/* Main Content Area */}
        <main className="flex-1 flex items-center justify-center border m-4 rounded-lg border-dashed border-gray-300 bg-gray-50">
          {/* O conteúdo da página será renderizado aqui */}
          <Outlet /> {/* O conteúdo será substituído com base na rota */}
        </main>

        {/* Footer */}
        <footer className="bg-gray-200 p-4 text-center">
          <span>&copy; 2025 ISMMA - Todos os direitos reservados.</span>
        </footer>
      </div>
    </div>
  );
}
