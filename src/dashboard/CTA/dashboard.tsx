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
} from 'lucide-react'
import logo from '../../assents/ismmalogo.png'
import { Academic_Record } from './academic_record/dashboard_academic_record'
import { Finance } from './finance/dashboard_finance'
import { Human_Resourses } from './human resources/dashboard_human_resourses'
import { Library_Departament } from './Library/dashboard_library'
// import { Avatar } from '@/components/ui/avatar'

// Fix: Ensure Avatar is correctly imported or replace with a fallback component
const DefaultAvatar = () => <div className="w-8 h-8 bg-gray-300 rounded-full" />

export function Dashboard_cta() {
  const [active, setActive] = useState('Dashboard')

  const menuItems = [
    { name: 'Dashboard', icon: Home },
    { name: 'Financas', icon: Wallet },
    { name: 'Registro Academico', icon: FileTextIcon },
    { name: 'Turmas', icon: User2Icon },
    { name: 'Recursos Humanos', icon: Users },
    { name: 'Biblioteca', icon: Library },
  ]

  const renderMainContent = () => {
    switch (active) {
      case 'Dashboard':
        return <div>Dashboard Content</div>
      case 'Financas':
        return (
          <div>
            <Finance />
          </div>
        )
      case 'Registro Academico':
        return (
          <div>
            <Academic_Record />
          </div>
        )
      case 'Turmas':
        return <div>Turmas Content</div>
      case 'Recursos Humanos':
        return (
          <div>
            <Human_Resourses />
          </div>
        )
      case 'Biblioteca':
        return (
          <div>
            <Library_Departament />
          </div>
        )
      default:
        return <div>Welcome to the Dashboard!</div>
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-yellow-600 text-white p-5 flex flex-col">
        <div className="text-2xl font-bold mb-6">
          <img src={logo} alt="ISMMA LOGO" />
        </div>
        <nav className="flex-1">
          {menuItems.map(({ name, icon: Icon }) => (
            <button
              key={name}
              type="button"
              onClick={() => setActive(name)}
              className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition ${
                active === name ? 'bg-yellow-800' : 'hover:bg-yellow-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              {name}
            </button>
          ))}
        </nav>
        {/* <div className="mt-6 border-t border-indigo-500 pt-4">
          <h3 className="text-sm uppercase opacity-75 mb-2">Your teams</h3>
          <ul>
            {['Heroicons', 'Tailwind Labs', 'Workcation'].map(team => (
              <li
                key={team}
                className="p-2 text-sm opacity-90 hover:opacity-100"
              >
                {team}
              </li>
            ))}
          </ul>
        </div> */}
        <button
          type="button"
          className="mt-auto flex items-center gap-2 p-3 rounded-lg hover:bg-yellow-700"
        >
          <Settings className="w-5 h-5 " /> Settings
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
