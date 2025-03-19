import { Clipboard, CreditCard, FileText, Home, UserCircle } from 'lucide-react'
import logo from '../../assets/ismmalogo.png'
import { useQuery } from '@tanstack/react-query'
import { getStudentData } from '@/http/signup/header'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { getStudentsSubjectsById } from '@/http/students-subjects'

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
    className={`rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${activeSection === section ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-indigo-500 hover:text-white'}`}
    onClick={() => handleSectionClick(section)}
  >
    {section.charAt(0).toUpperCase() + section.slice(1)}
  </a>
)

export function LayoutStudents() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()

  const id = localStorage.getItem('student_login_id')

  // Verificação para garantir que o ID exista
  const { data, isLoading, isError } = useQuery({
    queryKey: ['header', id],
    queryFn: () =>
      id ? getStudentData(id) : Promise.reject('ID não encontrado'),
    enabled: !!id, // Só executa a query se o ID existir
  })

  const {
    data: dataSubject,
    isLoading: isLoadingSubjects,
    isError: isErrorSubjects,
  } = useQuery({
    queryKey: ['student_subjects', id],
    queryFn: () =>
      id ? getStudentsSubjectsById(id) : Promise.reject('ID não encontrado'),
    enabled: !!id, // Só executa a query se o ID existir
  })

  console.log('Data subjects:', dataSubject)

  if (isLoading || isLoadingSubjects) {
    return (
      <header className="flex justify-center items-center h-32 bg-gray-200 text-gray-700">
        <p>Carregando...</p>
      </header>
    )
  }

  if (isError || isErrorSubjects) {
    return (
      <header className="flex justify-center items-center h-32 bg-gray-200 text-gray-700">
        <p>Ocorreu um erro ao carregar os dados.</p>
      </header>
    )
  }

  const filteredSubjects = dataSubject?.filter(
    subjects =>
      subjects.status === 'INSCRITO' && subjects.result === 'REPROVADO'
  )
  console.log('Filtered subjects:', filteredSubjects)

  const student = data
  const course = student?.Registration[0]?.course
  const courseId = student?.Registration[0]?.course_id

  // Verificação se courseId existe e o armazena no localStorage
  if (courseId) {
    localStorage.setItem('course_id', courseId)
  } else {
    console.warn(
      'Course ID não encontrado. O valor não foi armazenado no localStorage.'
    )
  }

  // const idCourse = localStorage.getItem('course_id')
  // console.log('course id', idCourse) // Mostra o course_id armazenado

  const sections = ['dashboard', 'avaliacao', 'mensalidade', 'inscricao']

  const toggleMobileMenu = () => setMobileMenuOpen(prevState => !prevState)
  const handleSectionClick = (section: string) => {
    setActiveSection(section)
    setMobileMenuOpen(false)
  }

  const menuItems = [
    {
      name: 'dashboard',
      icon: Home,
      route: '/student/dashboard',
    },
    {
      name: 'Avaliacao',
      icon: FileText,
      route: '/student/assentiments',
    },
    {
      name: 'Mensalidade',
      icon: CreditCard,
      route: '/student/monthly-fee',
    },
    {
      name: 'Inscricao',
      icon: Clipboard,
      route: '/student/enrollment',
    },
  ]

  const formatText = (text: string) =>
    text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`w-80 h-screen bg-yellow-500 p-6 flex flex-col space-y-6 shadow-lg transition-all duration-300 ${mobileMenuOpen ? 'block' : 'hidden sm:block'}`}
      >
        <div className="flex items-center mb-4">
          <img src={logo} alt="Logo do Sistema" className="w-16 h-16 mr-4" />
          <h1 className="text-2xl font-semibold">SIGAMMA</h1>
        </div>

        <div className="flex flex-col items-center text-left space-y-4">
          <UserCircle className="w-24 h-24 text-gray-700" />
          <div>
            <p>
              <strong>Nome: </strong>
              {formatText(student?.name || '')},{' '}
              {formatText(student?.surname || '')}
            </p>
            <p>
              <strong>Nº Estudante:</strong> {student?.id}
            </p>
            <p>
              <strong>Curso:</strong>{' '}
              {course
                ? formatText(course?.courseName || 'Curso não disponível')
                : 'Nenhum curso encontrado.'}
            </p>
            <p>
              <strong>Ano:</strong> 2025
            </p>
          </div>
        </div>

        {/** Cadeiras que estao a decorrer */}
        <div>
          <h2 className="text-start font-semibold text-gray-800 mb-4">
            Cadeiras A Fazer
          </h2>
          {Array.isArray(filteredSubjects) &&
            filteredSubjects.length > 0 &&
            filteredSubjects.map(assessmentResult => (
              <tr key={assessmentResult.id}>
                <td className="p-3 border-b text-gray-700">
                  {assessmentResult.disciplineId}
                </td>
                <td className="p-3 border-b text-gray-700">
                  {assessmentResult.discipline.disciplineName}
                </td>
              </tr>
            ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <nav className="bg-indigo-100 shadow-md">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="hidden sm:flex space-x-4">
                {menuItems.map(({ name, icon: Icon, route }) => (
                  <div key={name} className="flex">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection(name)
                        navigate(route)
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg w-full text-left transition font-medium ${activeSection === name ? 'bg-yellow-800' : 'hover:bg-yellow-700'}`}
                    >
                      <Icon className="w-5 h-5" />
                      {name}
                    </button>
                  </div>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <div className="sm:hidden">
                <button
                  type="button"
                  onClick={toggleMobileMenu}
                  aria-expanded={mobileMenuOpen ? 'true' : 'false'}
                  aria-controls="mobile-menu"
                  className="text-gray-700 hover:bg-indigo-500 hover:text-white p-2 rounded-md"
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

            {/* Mobile Menu */}
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
        </nav>

        {/* Section Content */}
        <main className="flex-1 flex items-center justify-center m-4 rounded-lg border-dashed border-gray-300 bg-gray-50 shadow-sm">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
