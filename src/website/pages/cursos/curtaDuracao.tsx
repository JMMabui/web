import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'

export function CurtaDuracao() {
  const navigate = useNavigate()

  return (
    <div className="bg-white">
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                Curta Duração
              </span>
            </div>
            <h1 className="mt-10 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Cursos de Formação Profissional
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              O Instituto Superior Maria Mãe África oferece cursos de curta
              duração focados em capacitação profissional e desenvolvimento de
              competências essenciais para o mercado de trabalho. Nossos cursos
              são ministrados por profissionais experientes e oferecem
              certificação reconhecida.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/registration')}
              >
                Inscreva-se Agora
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Detalhes do Curso */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nossos Cursos de Curta Duração
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Oferecemos uma variedade de cursos práticos e objetivos, com foco
              em áreas essenciais para o desenvolvimento profissional.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
            {[
              {
                title: 'Informática Básica',
                description:
                  'Curso essencial para quem deseja dominar os fundamentos da informática.',
                duration: '3 meses',
                features: [
                  'Windows e Linux',
                  'Pacote Office',
                  'Internet e Email',
                  'Segurança Digital',
                ],
              },
              {
                title: 'Gestão de Projetos',
                description:
                  'Aprenda as técnicas essenciais para gerenciar projetos de forma eficiente.',
                duration: '4 meses',
                features: [
                  'Metodologias Ágeis',
                  'Planejamento de Projetos',
                  'Gestão de Equipes',
                  'Ferramentas de Gestão',
                ],
              },
              {
                title: 'Marketing Digital',
                description:
                  'Domine as estratégias de marketing digital para impulsionar negócios.',
                duration: '6 meses',
                features: [
                  'Redes Sociais',
                  'SEO e SEM',
                  'E-mail Marketing',
                  'Análise de Dados',
                ],
              },
            ].map(course => (
              <div
                key={course.title}
                className="flex flex-col justify-between rounded-2xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
              >
                <div>
                  <h3 className="text-lg font-semibold leading-8 text-gray-900">
                    {course.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {course.description}
                  </p>
                  <ul className="mt-6 space-y-3 text-sm leading-6 text-gray-600">
                    {course.features.map((feature, index) => (
                      <li key={index} className="flex gap-x-3">
                        <svg
                          className="h-6 w-5 flex-none text-indigo-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-8 flex items-center gap-x-4">
                  <div className="text-sm font-medium leading-6 text-gray-900">
                    Duração: {course.duration}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/registration')}
                  >
                    Inscreva-se
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Benefícios */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Benefícios dos Nossos Cursos
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
            {[
              {
                title: 'Duração Flexível',
                description:
                  'Cursos com duração de 3 a 6 meses, permitindo rápida inserção no mercado de trabalho.',
                icon: '⏱️',
              },
              {
                title: 'Foco Prático',
                description:
                  'Conteúdo direcionado para aplicação imediata no ambiente profissional.',
                icon: '💼',
              },
              {
                title: 'Certificação Reconhecida',
                description:
                  'Certificados válidos e reconhecidos pelo mercado de trabalho.',
                icon: '📜',
              },
            ].map(feature => (
              <div
                key={feature.title}
                className="flex flex-col justify-between rounded-2xl bg-white p-8 ring-1 ring-gray-200 xl:p-10"
              >
                <div>
                  <div className="flex items-center justify-between gap-x-4">
                    <h3 className="text-lg font-semibold leading-8 text-gray-900">
                      {feature.title}
                    </h3>
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const features = [
  {
    name: 'Duração Flexível',
    description:
      'Cursos com duração de 3 a 6 meses, permitindo rápida inserção no mercado de trabalho.',
    icon: ClockIcon,
  },
  {
    name: 'Foco Prático',
    description:
      'Conteúdo direcionado para aplicação imediata no ambiente profissional.',
    icon: AcademicCapIcon,
  },
  {
    name: 'Certificação Reconhecida',
    description:
      'Certificados válidos e reconhecidos pelo mercado de trabalho.',
    icon: DocumentCheckIcon,
  },
]

const courses = [
  {
    name: 'Informática Básica',
    description:
      'Curso essencial para quem deseja dominar os fundamentos da informática.',
    duration: '3 meses',
    features: [
      'Windows e Linux',
      'Pacote Office',
      'Internet e Email',
      'Segurança Digital',
    ],
  },
  {
    name: 'Gestão de Projetos',
    description:
      'Aprenda as técnicas essenciais para gerenciar projetos de forma eficiente.',
    duration: '4 meses',
    features: [
      'Metodologias Ágeis',
      'Planejamento de Projetos',
      'Gestão de Equipes',
      'Ferramentas de Gestão',
    ],
  },
  {
    name: 'Marketing Digital',
    description:
      'Domine as estratégias de marketing digital para impulsionar negócios.',
    duration: '6 meses',
    features: [
      'Redes Sociais',
      'SEO e SEM',
      'E-mail Marketing',
      'Análise de Dados',
    ],
  },
]

function ClockIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  )
}

function AcademicCapIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
      />
    </svg>
  )
}

function DocumentCheckIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12"
      />
    </svg>
  )
}
