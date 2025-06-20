import { useState, useEffect } from 'react'
import {
  Home,
  Settings,
  Bell,
  UserCircle,
  ChevronDown,
  Menu,
  X,
  Users,
  Calendar,
  ClipboardList,
  BarChart3,
  Library,
  Heart,
} from 'lucide-react'
import logo from '../../assets/ismmalogo.png'
import { Outlet, useNavigate } from 'react-router-dom'
import { Notifications } from '@/components/Notifications'
import { useQuery } from '@tanstack/react-query'
import { getTeacherByEmail } from '@/http/teacher'
import { Footer } from '@/components/footer'

const DefaultAvatar = () => <div className="w-8 h-8 bg-gray-300 rounded-full" />

export function LayoutTeachers() {
  const [active, setActive] = useState<string | null>('Dashboard')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const navigate = useNavigate()

  const menuItems = [
    {
      name: 'Dashboard',
      icon: Home,
      route: '/teacher/dashboard',
      submenu: [],
    },
    {
      name: 'Turmas',
      icon: Users,
      route: '/teacher/class-management',
      submenu: [
        { name: 'Gestão de Turmas', route: '/teacher/class-management' },
        { name: 'Histórico de Atividades', route: '/teacher/activity-history' },
        { name: 'Anúncios/Comunicados', route: '/teacher/announcements' },
        { name: 'Controle de Frequência', route: '/teacher/attendance' },
      ],
    },
    {
      name: 'Planejamento',
      icon: Calendar,
      route: '/teacher/lesson-planning',
      submenu: [
        { name: 'Planejamento de Aulas', route: '/teacher/lesson-planning' },
        { name: 'Conteúdo Programático', route: '/teacher/syllabus' },
      ],
    },
    {
      name: 'Avaliações',
      icon: ClipboardList,
      route: '/teacher/evaluations',
      submenu: [
        { name: 'Avaliações', route: '/teacher/evaluations' },
        { name: 'Recuperação', route: '/teacher/recovery' },
        { name: 'Competências', route: '/teacher/competencies' },
      ],
    },
    {
      name: 'Desempenho',
      icon: BarChart3,
      route: '/teacher/performance-analysis',
      submenu: [
        {
          name: 'Análise de Desempenho',
          route: '/teacher/performance-analysis',
        },
        { name: 'Relatórios', route: '/teacher/reports' },
      ],
    },
    {
      name: 'Apoio ao Aluno',
      icon: Heart,
      route: '/teacher/feedback',
      submenu: [
        { name: 'Feedback', route: '/teacher/feedback' },
        { name: 'Comunicação', route: '/teacher/communication' },
        { name: 'Portfólio', route: '/teacher/portfolio' },
        { name: 'Projetos', route: '/teacher/projects' },
      ],
    },
    {
      name: 'Outros',
      icon: Library,
      route: '/teacher/digital-library',
      submenu: [
        { name: 'Biblioteca Digital', route: '/teacher/digital-library' },
      ],
    },
  ]

  const email = localStorage.getItem('email')

  // Buscar dados da api
  const { data: dataPersonal } = useQuery({
    queryKey: ['personal_data'],
    queryFn: () =>
      email ? getTeacherByEmail(email) : Promise.reject('Invalid email'),
    enabled: !!email,
  })

  const userName = dataPersonal?.name || 'Nome do Professor'
  const userSurname = dataPersonal?.surname || 'Sobrenome do Professor'
  const userType = dataPersonal?.teacherType || 'Tipo de Professor'

  // Fechar sidebar em telas pequenas
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="flex h-screen">
      {/* Botão de toggle da sidebar para mobile */}
      <button
        type="button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-yellow-600 text-white md:hidden"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed md:relative w-64 bg-gradient-to-b from-yellow-600 to-yellow-700 text-white p-5 flex flex-col transition-all duration-300 ease-in-out z-40 shadow-lg`}
      >
        <div className="text-2xl font-bold mb-6 hover:opacity-90 transition-opacity">
          <img src={logo} alt="ISMMA LOGO" className="w-full" />
        </div>
        <div className="mb-6 p-4 bg-yellow-500/20 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            {UserCircle ? (
              <UserCircle className="w-12 h-12 text-white" />
            ) : (
              <DefaultAvatar />
            )}
            <div>
              <p className="font-semibold">
                {userName} {userSurname}
              </p>
              <p className="text-sm text-yellow-100">{userType}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Online</span>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          {menuItems.map(({ name, icon: Icon, route, submenu }) => (
            <div key={name}>
              <button
                type="button"
                onClick={() => {
                  if (submenu.length > 0) {
                    // Se tem submenu, apenas abre/fecha o dropdown
                    if (openDropdown === name) {
                      setOpenDropdown(null)
                    } else {
                      setOpenDropdown(name)
                    }
                    setActive(name)
                  } else {
                    // Se não tem submenu, navega para a rota
                    setActive(name)
                    navigate(route)
                  }
                }}
                className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition-all duration-200 ${
                  active === name
                    ? 'bg-yellow-800 shadow-md transform scale-[1.02]'
                    : 'hover:bg-yellow-700 hover:shadow-sm'
                }`}
                aria-expanded={openDropdown === name}
                aria-controls={`submenu-${name}`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium">{name}</span>
                {submenu.length > 0 && (
                  <ChevronDown
                    className={`ml-auto transform transition-transform duration-200 ${
                      openDropdown === name ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                )}
              </button>

              {submenu.length > 0 && openDropdown === name && (
                <section
                  id={`submenu-${name}`}
                  className="pl-8 pt-2 space-y-2 animate-fadeIn"
                >
                  {submenu.map(({ name: subName, route: subRoute }) => (
                    <button
                      key={subName}
                      type="button"
                      className={`text-white hover:bg-yellow-700 w-full p-2 rounded-lg text-left transition-all duration-200 ${
                        active === subName
                          ? 'bg-yellow-800 shadow-sm'
                          : 'hover:shadow-sm'
                      }`}
                      onClick={() => {
                        setActive(subName)
                        navigate(subRoute)
                      }}
                    >
                      {subName}
                    </button>
                  ))}
                </section>
              )}
            </div>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <button
            type="button"
            onClick={() => {}}
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-yellow-700 w-full transition-all duration-200 hover:shadow-sm group"
          >
            <Settings
              size={20}
              className="group-hover:rotate-90 transition-transform duration-300"
            />
            <span className="font-medium">Configurações</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="flex items-center justify-between p-4 shadow-md bg-white sticky top-0 z-30 backdrop-blur-sm bg-opacity-90 border-b border-gray-200">
          {/* Lado Esquerdo */}
          <div className="flex items-center gap-3">
            <div className="relative">
              {UserCircle ? (
                <UserCircle className="w-10 h-10 text-yellow-600" />
              ) : (
                <DefaultAvatar />
              )}
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">
                {userName} {userSurname}
              </span>
              <span className="text-sm text-gray-500">
                {userType.charAt(0).toUpperCase() +
                  userType.slice(1).toLowerCase()}
              </span>
            </div>
          </div>

          {/* Lado Direito */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
                aria-label="Notificações"
              >
                <Bell className="w-6 h-6 text-yellow-600" />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 transform transition-all duration-200 ease-in-out">
                  <Notifications />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}
