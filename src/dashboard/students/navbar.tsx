import { useState } from 'react'
import { Enrollments } from './enrollments'
import { Assessments } from './assessments'
import { Dashboard } from './dashboard'
import { MonthlyFee } from './monthlyFee'

const NavbarLink = ({
  section,
  activeSection,
  handleSectionClick,
}: {
  section: string
  activeSection: string
  handleSectionClick: (section: string) => void
}) => (
  <a
    href="#"
    className={`rounded-md px-3 py-2 text-sm font-medium ${activeSection === section ? 'bg-yellow-700 text-white' : 'text-gray-300 hover:bg-yellow-700 hover:text-white'}`}
    onClick={() => handleSectionClick(section)}
  >
    {section.charAt(0).toUpperCase() + section.slice(1)}{' '}
    {/* Capitalize the first letter */}
  </a>
)

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard') // Inicializando com 'dashboard'
  const sections = ['dashboard', 'avaliacao', 'mensalidade', 'inscricao']

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  const handleSectionClick = (section: string) => setActiveSection(section)

  return (
    <nav className="bg-yellow-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-between sm:items-stretch sm:justify-start">
          <div className="hidden sm:block">
            <div className="flex space-x-4">
              {/* Links para Desktop */}
              {sections.map(section => (
                <NavbarLink
                  key={section}
                  section={section}
                  activeSection={activeSection}
                  handleSectionClick={handleSectionClick}
                />
              ))}
            </div>
          </div>

          {/* Botão de Menu Mobile */}
          <div className="sm:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen ? 'true' : 'false'}
              aria-controls="mobile-menu"
              className="text-gray-300 hover:bg-yellow-700 hover:text-white p-2 rounded-md"
            >
              <span className="sr-only">Abrir menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <div
          className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}
          id="mobile-menu"
        >
          <div className="space-y-1 px-2 pt-2 pb-3">
            {sections.map(section => (
              <NavbarLink
                key={section}
                section={section}
                activeSection={activeSection}
                handleSectionClick={handleSectionClick}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo das Seções */}
      <div className="mt-8 p-4 text-white">
        {activeSection === 'dashboard' && (
          <div>
            <Dashboard />
          </div>
        )}
        {activeSection === 'avaliacao' && (
          <div>
            <Assessments />
          </div>
        )}
        {activeSection === 'mensalidade' && (
          <div>
            <MonthlyFee />
          </div>
        )}
        {activeSection === 'inscricao' && (
          <div>
            <Enrollments />
          </div>
        )}
      </div>
    </nav>
  )
}
