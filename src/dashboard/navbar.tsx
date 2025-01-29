import React, { useState } from 'react'
import { Enrollments } from './enrollments'
import { Assessments } from './assessments'

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const handleSectionClick = (section: string) => {
    setActiveSection(section)
  }

  return (
    <nav className="bg-yellow-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
              aria-controls="mobile-menu"
              aria-expanded={mobileMenuOpen ? 'true' : 'false'}
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${mobileMenuOpen ? 'hidden' : 'block'} size-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
              <svg
                className={`${mobileMenuOpen ? 'block' : 'hidden'} size-6`}
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {/* Dashboard button with conditional class */}
                <a
                  href="#"
                  className={`rounded-md px-3 py-2 text-sm font-medium ${activeSection === 'dashboard' ? 'bg-yellow-700 text-white' : 'text-gray-300 hover:bg-yellow-700 hover:text-white'}`}
                  onClick={() => handleSectionClick('dashboard')}
                >
                  Dashboard
                </a>
                <a
                  href="#"
                  className={`rounded-md px-3 py-2 text-sm font-medium ${activeSection === 'avaliacao' ? 'bg-yellow-700 text-white' : 'text-gray-300 hover:bg-yellow-700 hover:text-white'}`}
                  onClick={() => handleSectionClick('avaliacao')}
                >
                  Avaliacao
                </a>
                <a
                  href="#"
                  className={`rounded-md px-3 py-2 text-sm font-medium ${activeSection === 'mensalidade' ? 'bg-yellow-700 text-white' : 'text-gray-300 hover:bg-yellow-700 hover:text-white'}`}
                  onClick={() => handleSectionClick('mensalidade')}
                >
                  Mensalidade
                </a>
                <a
                  href="#"
                  className={`rounded-md px-3 py-2 text-sm font-medium ${activeSection === 'inscricao' ? 'bg-yellow-700 text-white' : 'text-gray-300 hover:bg-yellow-700 hover:text-white'}`}
                  onClick={() => handleSectionClick('inscricao')}
                >
                  Inscricao
                </a>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button
              type="button"
              className="relative rounded-full bg-yellow-500 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
            >
              <span className="sr-only">View notifications</span>
              <svg
                className="size-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      <div
        className={`${mobileMenuOpen ? 'block' : 'hidden'} sm:hidden`}
        id="mobile-menu"
      >
        <div className="space-y-1 px-2 pt-2 pb-3">
          <a
            href="#"
            className={`block rounded-md px-3 py-2 text-base font-medium ${activeSection === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-white'}`}
            onClick={() => handleSectionClick('dashboard')}
          >
            Dashboard
          </a>
          <a
            href="#"
            className={`block rounded-md px-3 py-2 text-base font-medium ${activeSection === 'avaliacao' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            onClick={() => handleSectionClick('avaliacao')}
          >
            Avaliacao
          </a>
          <a
            href="#"
            className={`block rounded-md px-3 py-2 text-base font-medium ${activeSection === 'mensalidade' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            onClick={() => handleSectionClick('mensalidade')}
          >
            Mensalidade
          </a>
          <a
            href="#"
            className={`block rounded-md px-3 py-2 text-base font-medium ${activeSection === 'inscricao' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
            onClick={() => handleSectionClick('inscricao')}
          >
            Inscricao
          </a>
        </div>
      </div>

      {/* Exibindo o conteúdo de acordo com a seção clicada */}
      <div className="mt-8 p-4 text-white">
        {activeSection === 'dashboard' && (
          <div>
            <h2 className="text-xl font-semibold">Dashboard</h2>
            <p>Aqui estão os detalhes do Dashboard.</p>
          </div>
        )}
        {activeSection === 'avaliacao' && (
          <div>
            <h2 className="text-xl font-semibold">Informações de Avaliação</h2>
            <p>Aqui estão os detalhes sobre avaliações.</p>
            <Assessments />
          </div>
        )}
        {activeSection === 'mensalidade' && (
          <div>
            <h2 className="text-xl font-semibold">
              Informações de Mensalidade
            </h2>
            <p>Aqui estão os detalhes sobre mensalidades.</p>
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
