import { Clipboard, CreditCard, FileText, Home, UserCircle } from 'lucide-react'
import logo from '../../assets/ismmalogo.png'
import { useQuery } from '@tanstack/react-query'
import { getStudentData } from '@/http/signup/header'
import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  getStudentsSubjectsByStudentId,
  type StudentsSubjectsWithExtraDataResponse,
} from '@/http/students-subjects'
import {LoadingSpinner} from '@/components/LoadingSpinner'

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
  if (!id) {
    alert('Usuario nao reconhecido, por favor faça login novamente')
    navigate('/login')
  }

  // Verificação para garantir que o ID exista
  const { data, isLoading, isError } = useQuery({
    queryKey: ['header', id],
    queryFn: () =>
      id ? getStudentData(id) : Promise.reject('ID não encontrado'),
    enabled: !!id, // Só executa a query se o ID existir
  })
  // console.log('Data:', data)

  const { data: dataSubject } = useQuery<
    StudentsSubjectsWithExtraDataResponse[]
  >({
    queryKey: ['student_subjects', id],
    queryFn: () =>
      id
        ? getStudentsSubjectsByStudentId(id)
        : Promise.reject('ID não encontrado'),
    enabled: !!id, // Só executa a query se o ID existir
  })

  // console.log('Data subjects:', dataSubject)

  // if (isLoading) {
  //   return <LoadingSpinner />
  // }

  if (isError) {
    return (
      <header className="flex justify-center items-center h-32 bg-gray-200 text-gray-700">
        <p>Ocorreu um erro ao carregar os dados.</p>
      </header>
    )
  }

  const filteredSubjects = dataSubject?.filter(
    subjects =>
      subjects.status === 'INSCRITO' && subjects.result === 'EM_ANDAMENTO'
  )
  // console.log('Filtered subjects:', filteredSubjects)

  const student = data
  // console.log('Student:', student)
  const course = student?.Registration[0]?.course
  // console.log('Course:', course)
  const courseId = student?.Registration[0]?.course.id
  // console.log('Course ID:', courseId)

  localStorage.setItem('courseId', courseId || '')

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
      route: '/student/assessments',
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`w-80 h-screen bg-gradient-to-b from-yellow-500 to-yellow-600 p-6 flex flex-col space-y-6 shadow-lg transition-all duration-300 fixed ${mobileMenuOpen ? 'block' : 'hidden sm:block'}`}
      >
        <div className="flex items-center mb-6">
          <img src={logo} alt="Logo do Sistema" className="w-16 h-16 mr-4" />
          <h1 className="text-2xl font-bold text-white">SIGAMMA</h1>
        </div>

        <div className="flex flex-col items-center text-left space-y-4 bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="relative">
            <UserCircle className="w-24 h-24 text-white" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-yellow-500"></div>
          </div>
          <div className="text-white space-y-2">
            <p className="font-medium">
              {formatText(student?.name || '')} {formatText(student?.surname || '')}
            </p>
            <p className="text-sm text-yellow-100">
              Nº Estudante: {student?.id}
            </p>
            <p className="text-sm text-yellow-100">
              {course
                ? formatText(course?.courseName || 'Curso não disponível')
                : 'Nenhum curso encontrado.'}
            </p>
            <p className="text-sm text-yellow-100">
              Ano: 2025
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = activeSection === item.name.toLowerCase();
            return (
              <a
                key={item.name}
                href={item.route}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 relative ${
                  isActive
                    ? 'bg-white text-yellow-600 shadow-md'
                    : 'text-white hover:bg-white/10'
                }`}
                onClick={() => handleSectionClick(item.name.toLowerCase())}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-yellow-400 rounded-r-full" />
                )}
                <item.icon className={`w-5 h-5 transition-transform duration-300 ${
                  isActive ? 'scale-110' : 'group-hover:scale-110'
                }`} />
                <span className={`font-medium transition-all duration-300 ${
                  isActive ? 'translate-x-1' : 'group-hover:translate-x-1'
                }`}>
                  {item.name}
                </span>
                {isActive && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                  </div>
                )}
              </a>
            );
          })}
        </nav>

        {/** Cadeiras que estao a decorrer */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
          <h2 className="text-white font-semibold mb-4">
            Cadeiras A Fazer
          </h2>

          {Array.isArray(filteredSubjects) && filteredSubjects.length > 0 ? (
            <div className="space-y-2">
              {filteredSubjects.map(assessmentResult => (
                <div
                  key={assessmentResult.id}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-3 text-white hover:bg-white/30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{assessmentResult.subjectId}</span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      Em andamento
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-yellow-100 text-sm">
              Nenhuma cadeira em andamento.
            </p>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="sm:hidden fixed bottom-4 right-4 bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transition-colors duration-300"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 sm:ml-80">
        <Outlet />
      </div>
    </div>
  )
}
