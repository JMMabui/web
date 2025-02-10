import { useState } from 'react'
import {
  Home,
  Users,
  Settings,
  Bell,
  Library,
  User2Icon,
  FileTextIcon,
  Wallet,
  UserCircle,
  SearchIcon,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import logo from '../../assents/ismmalogo.png'
import { Academic_Record } from './academic_record/dashboard_academic_record'
import { Finance } from './finance/dashboard_finance'
import { Human_Resourses } from './human resources/dashboard_human_resourses'
import { Library_Departament } from './Library/dashboard_library'
import { Enrollment_Academic_Record } from './academic_record/registration_academic_record'

const DefaultAvatar = () => <div className="w-8 h-8 bg-gray-300 rounded-full" />

export function Dashboard_cta() {
  const [active, setActive] = useState('Dashboard')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    { name: 'Dashboard', icon: Home, subMenu: [] },
    {
      name: 'Financas',
      icon: Wallet,
      subMenu: ['Relatórios', 'Pagamentos', 'Transações'],
    },
    {
      name: 'Registro Academico',
      icon: FileTextIcon,
      subMenu: ['Matrículas', 'Cursos', 'Turma'],
    },
    {
      name: 'Turmas',
      icon: User2Icon,
      subMenu: ['Lista de Turmas', 'Horários', 'Professores'],
    },
    {
      name: 'Recursos Humanos',
      icon: Users,
      subMenu: ['Funcionários', 'Folha de Pagamento'],
    },
    {
      name: 'Biblioteca',
      icon: Library,
      subMenu: ['Livros', 'Empréstimos', 'Devoluções'],
    },
  ]

  const renderMainContent = () => {
    switch (active) {
      case 'Dashboard':
        return <div>Dashboard Content</div>
      case 'Financas':
        return <Finance />
      case 'Registro Academico':
        return <Academic_Record />
      case 'Turmas':
        return <div>Turmas Content</div>
      case 'Recursos Humanos':
        return <Human_Resourses />
      case 'Biblioteca':
        return <Library_Departament />
      case 'Relatórios':
        return <div>Relatórios Content</div>
      case 'Pagamentos':
        return <div>Pagamentos Content</div>
      case 'Transações':
        return <div>Transações Content</div>
      case 'Matrículas':
        return (
          <div>
            <Enrollment_Academic_Record />
          </div>
        )
      case 'Cursos':
        return <div>Cursos Content</div>
      case 'Turma':
        return <div>Turmas Content</div>
      case 'Lista de Turmas':
        return <div>Lista de Turmas Content</div>
      case 'Horários':
        return <div>Horários Content</div>
      case 'Professores':
        return <div>Professores Content</div>
      case 'Funcionários':
        return <div>Funcionários Content</div>
      case 'Folha de Pagamento':
        return <div>Folha de Pagamento Content</div>
      case 'Livros':
        return <div>Livros Content</div>
      case 'Empréstimos':
        return <div>Empréstimos Content</div>
      case 'Devoluções':
        return <div>Devoluções Content</div>
      default:
        return <div>Welcome to the Dashboard!</div>
    }
  }

  const handleDropdownToggle = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-16'
        } bg-yellow-600 text-white p-5 flex flex-col transition-all duration-300 ease-in-out lg:w-64 lg:h-max md:w-48 sm:w-16`}
      >
        <div className="text-2xl font-bold mb-6">
          <img src={logo} alt="ISMMA LOGO" />
        </div>
        <nav className="flex-1">
          {menuItems.map(({ name, icon: Icon, subMenu }) => (
            <div key={name}>
              {/* Main button */}
              <button
                type="button"
                onClick={() => {
                  setActive(name)
                  handleDropdownToggle(name)
                }}
                className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition ${
                  active === name ? 'bg-yellow-800' : 'hover:bg-yellow-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {isSidebarOpen && name}
                {subMenu.length > 0 &&
                  (openDropdown === name ? (
                    <ChevronUp className="ml-auto w-5 h-5" />
                  ) : (
                    <ChevronDown className="ml-auto w-5 h-5" />
                  ))}
              </button>

              {/* Dropdown */}
              {openDropdown === name && subMenu.length > 0 && (
                <div className="pl-8 mt-2 space-y-2">
                  {subMenu.map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setActive(item)}
                      className="block text-left w-full p-2 rounded-lg hover:bg-yellow-700 text-sm"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Toggle Sidebar Button */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="mt-auto flex items-center gap-2 p-3 rounded-lg hover:bg-yellow-700"
        >
          <Settings className="w-5 h-5 " /> {isSidebarOpen ? 'Fechar' : 'Abrir'}
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
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
        <main className="flex-1 flex items-center justify-center border m-4 rounded-lg border-dashed border-gray-300 bg-gray-50">
          {renderMainContent()}
        </main>
      </div>
    </div>
  )
}
