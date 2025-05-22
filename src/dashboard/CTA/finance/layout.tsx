import { useState } from 'react'
import {
  Home,
  FileText,
  CreditCard,
  BarChart,
  Settings,
  Bell,
  UserCircle,
  ChevronDown,
} from 'lucide-react'
import logo from '../../../assets/ismmalogo.png'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  type employeeExtended,
  getEmployeeByEmail,
} from '@/http/employee/employee'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from '@/components/LoadingSpinner'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'

export function DashboardLayoutFinances() {
  const [active, setActive] = useState('Dashboard')
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const navigate = useNavigate()
  const email = localStorage.getItem('email')

  if (!email) {
    alert('Efectue login para ter acesso')
    navigate('/')
    return null
  }

  const { data: dataUser, isLoading: isLoadingUser } = useQuery<
    employeeExtended[]
  >({
    queryKey: ['user'],
    queryFn: () =>
      email ? getEmployeeByEmail(email) : Promise.reject('Login ID is null'),
    enabled: !!email,
  })

  if (isLoadingUser) {
    return <LoadingSkeleton />
  }

  const user = dataUser?.map(user => user.user)

  const menuItems = [
    {
      name: 'Dashboard',
      icon: Home,
      route: '/finances/dashboard',
      submenu: [],
    },
    {
      name: 'Facturas',
      icon: FileText,
      route: '/finances/invoices',
      submenu: [],
    },
    {
      name: 'Pagamentos',
      icon: CreditCard,
      route: '/finances/payments',
      submenu: [],
    },
    { name: 'Relatórios', icon: BarChart, route: '', submenu: [] },
    // {
    //   name: 'Configurações',
    //   icon: Settings,
    //   route: '/configuracoes',
    //   submenu: [],
    // },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-yellow-600 text-white p-5 flex flex-col shadow-lg">
        <div className="flex items-center justify-center mb-6">
          <img
            src={logo}
            className="text-2xl font-bold mb-6"
            alt="ISMMA LOGO"
          />
        </div>
        <nav className="flex-1 space-y-2">
          {menuItems.map(({ name, icon: Icon, route, submenu }) => (
            <div key={name}>
              <button
                type="button"
                onClick={() => {
                  setOpenDropdown(openDropdown === name ? null : name)
                  setActive(name)
                  navigate(route)
                }}
                className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition font-medium ${active === name ? 'bg-yellow-800' : 'hover:bg-yellow-700'}`}
              >
                <Icon className="w-5 h-5" />
                {name}
                {submenu.length > 0 && (
                  <ChevronDown
                    className={`ml-auto transform ${openDropdown === name ? 'rotate-180' : ''}`}
                  />
                )}
              </button>
              {submenu.length > 0 && openDropdown === name && (
                <div className="pl-8 pt-2 space-y-2">
                  {submenu.map(({ name: subName, route: subRoute }) => (
                    <button
                      key={subName}
                      type="button"
                      className={`w-full p-2 rounded-lg text-left text-white hover:bg-yellow-700 ${active === subName ? 'bg-yellow-800' : ''}`}
                      onClick={() => {
                        setActive(subName)
                        navigate(subRoute)
                      }}
                    >
                      {subName}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <button
          type="button"
          onClick={() => navigate('/configuracoes')}
          className="mt-auto flex items-center gap-2 p-3 rounded-lg hover:bg-yellow-700 transition"
        >
          <Settings className="w-5 h-5" /> Configurações
        </button>
      </aside>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="flex items-center justify-between bg-white p-4 shadow-md">
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer hover:text-gray-800" />
            <div className="flex items-center gap-2 cursor-pointer">
              <UserCircle className="w-8 h-8" />
              <span className="font-medium">
                {user?.map(name => name.name)}{' '}
                {user?.map(surname => surname.surname)}
              </span>
            </div>
          </div>
        </header>
        {/* Main Content Area */}
        <main className="flex-1 flex items-center justify-center m-4 rounded-lg border-dashed border-gray-300 bg-gray-50 shadow-sm">
          <Outlet />
        </main>
        {/* Footer */}
        <footer className="bg-gray-200 p-4 text-center text-sm font-medium">
          &copy; 2025 ISMMA - Todos os direitos reservados.
        </footer>
      </div>
    </div>
  )
}
