import { useState, useEffect } from 'react'
import {
  Home,
  Settings,
  Bell,
  UserCircle,
  FileTextIcon,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
} from 'lucide-react'
import logo from '../../assets/ismmalogo.png'
import { Outlet, useNavigate } from 'react-router-dom'
import { useTheme } from '@/hooks/useTheme'
import { Notifications } from '@/components/Notifications'
import { useQuery } from '@tanstack/react-query'
import { getTeacherByEmail, type teacherResponse } from '@/http/teacher'

const DefaultAvatar = () => <div className="w-8 h-8 bg-gray-300 rounded-full" />

export function LayoutTeachers() {
  const [active, setActive] = useState<string | null>('Dashboard')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [showNotifications, setShowNotifications] = useState(false)
  const { theme, toggleTheme } = useTheme()
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
      icon: FileTextIcon,
      route: '/teacher/class-management',
      submenu: [
        {
          name: 'Histórico de Atividades',
          route: '/teacher/activity-history',
        },
        {
          name: 'Anúncios/Comunicados',
          route: '/teacher/announcements',
        },
      ],
    },
    {
      name: 'Avaliações',
      icon: FileTextIcon,
      route: '/teacher/evaluations',
      submenu: [],
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

  console.log('Dados do professor:', dataPersonal)

  const userName = dataPersonal?.name || 'Nome do Professor'
  const userSurname = dataPersonal?.surname || 'Sobrenome do Professor'
  const userType = dataPersonal?.teacherType || 'Tipo de Professor'
  const userStatus = dataPersonal?.statusTeacher || 'Status do Professor'

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
    <div
      className={`flex h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}
    >
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
        } fixed md:relative w-64 bg-yellow-600 text-white p-5 flex flex-col transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="text-2xl font-bold mb-6">
          <img src={logo} alt="ISMMA LOGO" className="w-full" />
        </div>
        <nav className="flex-1">
          {menuItems.map(({ name, icon: Icon, route, submenu }) => (
            <div key={name}>
              <button
                type="button"
                onClick={() => {
                  if (openDropdown === name) {
                    setOpenDropdown(null)
                  } else {
                    setOpenDropdown(name)
                  }
                  setActive(name)
                  navigate(route)
                }}
                className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition ${
                  active === name ? 'bg-yellow-800' : 'hover:bg-yellow-700'
                }`}
                aria-expanded={openDropdown === name}
                aria-controls={`submenu-${name}`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
                {name}
                {submenu.length > 0 && (
                  <ChevronDown
                    className={`ml-auto transform ${
                      openDropdown === name ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                )}
              </button>

              {submenu.length > 0 && openDropdown === name && (
                <section id={`submenu-${name}`} className="pl-8 pt-2 space-y-2">
                  {submenu.map(({ name: subName, route: subRoute }) => (
                    <button
                      key={subName}
                      type="button"
                      className={`text-white hover:bg-yellow-700 w-full p-2 rounded-lg text-left ${
                        active === subName ? 'bg-yellow-800' : ''
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
            onClick={toggleTheme}
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-yellow-700 w-full"
            aria-label={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            {theme === 'dark' ? 'Tema Claro' : 'Tema Escuro'}
          </button>

          <button
            type="button"
            onClick={() => {}}
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-yellow-700 w-full"
          >
            <Settings size={20} />
            Configurações
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header
          className={`flex items-center justify-between p-4 shadow ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}
        >
          {/* Lado Esquerdo */}
          <div className="flex items-center gap-2">
            {UserCircle ? (
              <UserCircle className="w-8 h-8" />
            ) : (
              <DefaultAvatar />
            )}
            <span className="font-medium">
              {userName} {userSurname}
            </span>
            <span className="font-medium">
              -{' '}
              {userType.charAt(0).toUpperCase() +
                userType.slice(1).toLowerCase()}
            </span>
          </div>

          {/* Lado Direito */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Notificações"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            {showNotifications && <Notifications />}
          </div>
        </header>

        {/* Main Content Area */}
        <main
          className={`flex-1 p-4 ${
            theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          <Outlet />
        </main>

        {/* Footer */}
        <footer
          className={`p-4 text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          <span>&copy; 2025 ISMMA - Todos os direitos reservados.</span>
        </footer>
      </div>
    </div>
  )
}
