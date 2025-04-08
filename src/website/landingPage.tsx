import { useState, useEffect } from 'react'
import logo from '../assets/dark-logo.png'
import imagem1 from '../assets/imagen 1.jpeg'
import imagem2 from '../assets/imagen 2.png'
import imagem3 from '../assets/imagem 3.jpg'
import municipioMaputoLogo from '../assets/municipio de maputo.png'
import pucprLogo from '../assets/puc-pr-logo.png'
import padresImg from '../assets/padres-ismma.jpg'
import Button from '@/component/Button'
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

  const navegate = useNavigate()

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
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8 bg-gray-800 shadow-lg">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Logo ISMMA</span>
              <img alt="Logo ISMMA" src={logo} className="h-20 w-auto" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white hover:text-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map(item => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold text-white hover:text-indigo-500 transition-all duration-200"
              >
                {item.name}
              </a>
            ))}

            <button
              type="button"
              onClick={() => navegate('/login')}
              className="ml-4 text-white"
            >
              Login
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-amber-50 bg-opacity-80">
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-amber-100/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Logo ISMMA</span>
                <img alt="Logo ISMMA" src={logo} className="h-8 w-auto" />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
              >
                <span className="sr-only">Close menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-6">
              <div className="space-y-2">
                {navigation.map(item => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carrossel */}
      <div className="relative bg-gray-50 pt-24 sm:pt-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              {/* Usando a tag <img> para exibir a imagem */}
              <img
                src={images[currentIndex].src}
                alt={images[currentIndex].alt}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center ">
                <div className="text-center flex flex-col items-center w-200 text-black px-6 md:px-12">
                  <h2 className="text-3xl font-bold">
                    {images[currentIndex].title}
                  </h2>
                  <p className="mt-4 text-lg">
                    {images[currentIndex].description}
                  </p>
                </div>
              </div>
            </div>
            {/* Navegação do Carrossel */}
            <Button
              onClick={goToPrevious}
              className="absolute top-1/2 left-0 transform -translate-y-1/2 p-4 bg-gray-800 text-white rounded-full hover:bg-gray-700"
            >
              &#10094;
            </Button>
            <Button
              onClick={goToNext}
              className="absolute top-1/2 right-0 transform -translate-y-1/2 p-4 bg-gray-800 text-white rounded-full hover:bg-gray-700"
            >
              &#10095;
            </Button>
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

      {/* Courses Available Section */}
      <section className="py-24 bg-amber-400">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-semibold text-gray-900">Cursos</h2>
          <p className="mt-4 text-lg text-gray-600">
            Explore nossos cursos, projetados para lhe dar uma vantagem
            competitiva em sua carreira.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900">
                Curta Duração
              </h3>
              <p className="mt-2 text-gray-600">
                São perfeitos para profissionais que buscam uma atualização
                rápida e com foco em resultados práticos.
              </p>
              <a
                href="#"
                className="mt-4 text-indigo-600 hover:text-indigo-700"
              >
                Saiba mais
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900">
                Técnico Médio
              </h3>
              <p className="mt-2 text-gray-600">
                Esses cursos prepara você para atuar em diversos segmentos, com
                um aprendizado prático e direto, lecionado de forma modular.
              </p>
              <a
                href="#"
                className="mt-4 text-indigo-600 hover:text-indigo-700"
              >
                Saiba mais
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900">
                Licenciatura
              </h3>
              <p className="mt-2 text-gray-600">
                Cursos ideais para proporcionar ao estudante uma formação sólida
                teórica e prática.
              </p>
              <a
                href="#"
                className="mt-4 text-indigo-600 hover:text-indigo-700"
              >
                Saiba mais
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900">Mestrado</h3>
              <p className="mt-2 text-gray-600">
                Ideal para aprofundar conhecimentos em uma área especifica.
              </p>
              <a
                href="#"
                className="mt-4 text-indigo-600 hover:text-indigo-700"
              >
                Saiba mais
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-xl font-semibold text-gray-900">Religioso</h3>
              <p className="mt-2 text-gray-600">
                Cursos Voltados para quem busca um conhecimento no contextos
                religiosos.
              </p>
              <a
                href="#"
                className="mt-4 text-indigo-600 hover:text-indigo-700"
              >
                Saiba mais
              </a>
            </div>
          </div>
        </div>
      </section>

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

      <section id="parceiros" className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-8">
            Nossos Parceiros
          </h2>
          <div className="flex items-center justify-center gap-x-16 ">
            {/* Logo do Parceiro 1 */}
            <div className="flex justify-center items-center">
              <img
                src={municipioMaputoLogo}
                alt="Parceiro 1"
                className="max-h-xl object-contain"
              />
            </div>

            {/* Logo do Parceiro 2 */}
            <div className="flex justify-center items-center">
              <img
                src={pucprLogo}
                alt="Parceiro 2"
                className="max-h-xl object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-amber-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Links Rápidos */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Cursos
                  </a>
                </li>
                <li>
                  <a href="#sobre" className="text-gray-400 hover:text-white">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#contato" className="text-gray-400 hover:text-white">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Redes Sociais */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Siga-nos</h3>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com@ismma.vc"
                  className="text-gray-400 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                      d="M18 2a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2h12z"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com"
                  className="text-gray-400 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                      d="M4 5h16v14H4z"
                    />
                  </svg>
                </a>
                <a
                  href="https://www.linkedin.com"
                  className="text-gray-400 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
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
                      d="M4 4h16v16H4z"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Informações de Contato */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Localização</h3>

              <p className="text-gray-400">
                Av. Vladimir Lenine, Nº3261, Paragem Saul, próximo à Praça da
                OMM
              </p>
              <h3 className="text-xl font-semibold mb-4">Contato</h3>
              <p className="text-gray-400">
                Email:{' '}
                <a
                  href="mailto:contato@ismma.com"
                  className="text-gray-400 hover:text-white"
                >
                  contato@ismma.com
                </a>
              </p>
              <p className="text-gray-400">
                Telefone: 86 666 9593 / 87 960 0960
              </p>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2025 ISMMA - Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
