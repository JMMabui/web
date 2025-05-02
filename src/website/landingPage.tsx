import { useState, useEffect } from 'react'
import logo from '../assets/dark-logo.png'
import imagem1 from '../assets/imagen 1.jpeg'
import imagem2 from '../assets/imagen 2.png'
import imagem3 from '../assets/imagem 3.jpg'
import municipioMaputoLogo from '../assets/municipio de maputo.png'
import pucprLogo from '../assets/puc-pr-logo.png'
import padresImg from '../assets/padres-ismma.jpg'
import Button from '@/components/Button'
import { useNavigate } from 'react-router-dom'

const navigation = [
  { name: 'ISMMA', href: '#' },
  { name: 'Cursos', href: '#' },
  { name: 'Sobre', href: '#sobre' },
  { name: 'Contato', href: '#contato' },
  { name: 'Parceiros', href: '#parceiros' },
]

const images = [
  {
    src: imagem1,
    alt: 'Imagem 1',
    title: 'Acessibilidade',
    description:
      'Nossos cursos são acessíveis para todas as famílias ao redor do país.',
  },
  {
    src: imagem2,
    alt: 'Imagem 2',
    title: 'Natureza',
    description:
      'Lutamos pela restauração do Homem,' +
      'da sociedade, que precisa reencontrar os valores fundamentais,' +
      'essenciais para melhorar a sua qualidade de vida.',
  },
  {
    src: imagem3,
    alt: 'Imagem 3',
    title: 'Formação',
    description:
      'Formamos profissionais habilitados no desempenho de suas funções de forma eficciente, criativa, dinâmica e proactiva',
  },
]

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const navigate = useNavigate()

  // Função para avançar o carrossel
  const goToNext = () => {
    setCurrentIndex(prevIndex => (prevIndex + 1) % images.length)
  }

  // Função para voltar o carrossel
  const goToPrevious = () => {
    setCurrentIndex(
      prevIndex => (prevIndex - 1 + images.length) % images.length
    )
  }

  // Auto-change de slide a cada 3 segundos
  useEffect(() => {
    const interval = setInterval(goToNext, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50">
        <nav
          className="flex items-center justify-between p-4 sm:p-6 lg:px-8 bg-white/80 backdrop-blur-md shadow-sm"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">ISMMA</span>
              <img className="h-8 sm:h-12 w-auto" src={logo} alt="Logo ISMMA" />
            </a>
          </div>
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Abrir menu principal</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          </div>
          <div className="hidden lg:flex lg:gap-x-8 xl:gap-x-12">
            {navigation.map(item => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/login')}
              className="ml-4"
            >
              Login
            </Button>
          </div>
        </nav>
        {/* Mobile menu */}
        <dialog
          className={`lg:hidden ${mobileMenuOpen ? 'fixed inset-0 z-50' : 'hidden'}`}
          aria-modal="true"
        >
          <div
            className="fixed inset-0 bg-gray-900/80"
            onClick={() => setMobileMenuOpen(false)}
            onKeyDown={e => e.key === 'Escape' && setMobileMenuOpen(false)}
            role="button"
            tabIndex={0}
          />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-4 sm:px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">ISMMA</span>
                <img className="h-8 w-auto" src={logo} alt="Logo ISMMA" />
              </a>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Fechar menu</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map(item => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="py-6">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      navigate('/login')
                      setMobileMenuOpen(false)
                    }}
                    className="w-full"
                  >
                    Login
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </dialog>
      </header>

      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24 pt-10 sm:pb-32 lg:flex lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                  Novos Cursos
                </span>
                <span className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600">
                  <span>Inscrições Abertas</span>
                  <svg
                    className="h-5 w-5 text-gray-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </a>
            </div>
            <h1 className="mt-10 text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transformando Vidas Através da Educação
            </h1>
            <p className="mt-6 text-base sm:text-lg leading-8 text-gray-600">
              O ISMMA é uma instituição comprometida com a excelência acadêmica
              e a formação integral de profissionais éticos e competentes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-x-6">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/registration')}
                className="w-full sm:w-auto"
              >
                Inscreva-se Agora
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  document
                    .getElementById('cursos')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="w-full sm:w-auto"
              >
                Conheça Nossos Cursos
              </Button>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <img
                src={imagem1}
                alt="Estudantes ISMMA"
                className="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* About ISMMA Section */}
      <section id="sobre" className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Texto e Botão */}
            {/* Imagem */}
            <div className="flex justify-center lg:w-1/2">
              <img
                src={padresImg}
                alt="padres do ismma"
                className="w-full h-auto"
              />
            </div>
            <div className="flex flex-col items-center lg:items-start lg:w-1/2">
              <h2 className="text-3xl font-semibold text-gray-900 text-center lg:text-left">
                Conheça o ISMMA
              </h2>
              <p className="mt-4 text-lg text-gray-600 text-center lg:text-left">
                O Instituto Superior Maria Mãe de África (ISMMA) é uma
                Instituição Académica de nível superior, privada, cuja
                idoneidade é reconhecida pela Conferência Episcopal de
                Moçambique (CEM) e pertence à Conferência dos Institutos
                Religiosos de Moçambique (CIRMO). Trata-se de uma Instituição
                que pretende contribuir para a construção de uma sociedade mais
                justa e mais humana, que respeita os Direitos fundamentais da
                pessoa, a partir da apreensão, assimilação e interiorização dos
                valores e das normas éticas, que são princípios e guias de
                acção. editado na formação.
              </p>
              <Button className="mt-6 text-center lg:text-left">
                Saber Mais
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <div id="cursos" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nossos Cursos
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Oferecemos uma variedade de cursos para atender às suas
              necessidades acadêmicas e profissionais.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
            {[
              {
                title: 'Curta Duração',
                description:
                  'Cursos rápidos e práticos para atualização profissional.',
                icon: '🎯',
                duration: '3-6 meses',
              },
              {
                title: 'Técnico Médio',
                description:
                  'Formação técnica com foco em habilidades práticas e mercado de trabalho.',
                icon: '🔧',
                duration: '2 anos',
              },
              {
                title: 'Licenciatura',
                description:
                  'Formação superior completa com base teórica e prática sólida.',
                icon: '🎓',
                duration: '4 anos',
              },
              {
                title: 'Mestrado',
                description:
                  'Especialização avançada em áreas específicas do conhecimento.',
                icon: '📚',
                duration: '2 anos',
              },
              {
                title: 'Religioso',
                description:
                  'Formação voltada para o contexto religioso e valores espirituais.',
                icon: '⛪',
                duration: 'Variável',
              },
            ].map(course => (
              <div
                key={course.title}
                className="flex flex-col justify-between rounded-2xl bg-white p-8 ring-1 ring-gray-200 xl:p-10 hover:ring-indigo-200 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3 className="text-lg font-semibold leading-8 text-gray-900">
                      {course.title}
                    </h3>
                    <span className="text-2xl">{course.icon}</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {course.description}
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-x-4">
                  <div className="text-sm font-medium leading-6 text-indigo-600">
                    Duração: {course.duration}
                  </div>
                  <div className="mt-4 flex items-center gap-x-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        switch (course.title) {
                          case 'Curta Duração':
                            navigate('/cursos/curta-duracao')
                            break
                          case 'Técnico Médio':
                            navigate('/cursos/tecnico-medio')
                            break
                          case 'Licenciatura':
                            navigate('/cursos/licenciatura')
                            break
                          case 'Mestrado':
                            navigate('/cursos/mestrado')
                            break
                          case 'Religioso':
                            navigate('/cursos/religioso')
                            break
                          default:
                            navigate('/cursos')
                        }
                      }}
                    >
                      Saiba mais
                      <svg
                        className="-mr-0.5 h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      {/* <section className="bg-amber-400 py-24 text-center text-white">
        <h2 className="text-3xl font-semibold">
          Pronto para começar sua jornada?
        </h2>
        <p className="mt-4 text-lg">
          Junte-se ao ISMMA e comece sua trajetória para o sucesso. Inscreva-se
          hoje mesmo!
        </p>
        <a
          href="#"
          className="mt-6 inline-block rounded-md bg-white px-6 py-3 text-indigo-600 text-lg font-semibold hover:bg-indigo-200"
        >
          Inscreva-se agora
        </a>
      </section> */}

      {/* Partners Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nossos Parceiros
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Trabalhamos em conjunto com instituições renomadas para oferecer a
              melhor experiência educacional.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:gap-12 lg:mt-20 lg:max-w-none lg:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 ring-1 ring-gray-200 xl:p-10">
              <img
                src={municipioMaputoLogo}
                alt="Município de Maputo"
                className="h-24 w-auto object-contain"
              />
              <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">
                Município de Maputo
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Parceria estratégica para desenvolvimento local
              </p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white p-8 ring-1 ring-gray-200 xl:p-10">
              <img
                src={pucprLogo}
                alt="PUC-PR"
                className="h-24 w-auto object-contain"
              />
              <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">
                Pontifícia Universidade Católica do Paraná
              </h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                Cooperação acadêmica e intercâmbio de conhecimento
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <a
              href="https://www.facebook.com/ismma.vc"
              className="text-gray-400 hover:text-gray-300"
            >
              <span className="sr-only">Facebook</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="https://www.instagram.com/ismma.vc"
              className="text-gray-400 hover:text-gray-300"
            >
              <span className="sr-only">Instagram</span>
              <svg
                className="h-6 w-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-400">
              &copy; 2024 ISMMA - Instituto Superior Maria Mãe de África. Todos
              os direitos reservados.
            </p>
            <div className="mt-4 text-center text-xs leading-5 text-gray-400">
              <p>
                Av. Vladimir Lenine, Nº3261, Paragem Saul, próximo à Praça da
                OMM
              </p>
              <p className="mt-1">
                Email: contato@ismma.com | Telefone: 86 666 9593 / 87 960 0960
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
