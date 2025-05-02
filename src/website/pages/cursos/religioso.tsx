import { useNavigate } from 'react-router-dom'
import Button from '@/components/Button'

export function CursoReligioso() {
  const navigate = useNavigate()

  return (
    <div className="bg-white">
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-indigo-100/20">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <span className="rounded-full bg-indigo-600/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-600 ring-1 ring-inset ring-indigo-600/10">
                Curso Religioso
              </span>
            </div>
            <h1 className="mt-10 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Formação Teológica e Pastoral
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              O Instituto Superior Maria Mãe África oferece cursos religiosos
              para formação teológica e pastoral, preparando líderes e agentes
              de pastoral para atuarem em comunidades e instituições religiosas.
              Nossos cursos combinam formação espiritual, teológica e prática
              pastoral.
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

      {/* Cursos Disponíveis */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Nossos Cursos Religiosos
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Oferecemos cursos em diversas áreas da teologia e pastoral, com
              duração variada e foco na formação integral.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
            {[
              {
                title: 'Teologia Pastoral',
                description:
                  'Formação para liderança e serviço pastoral em comunidades.',
                duration: '3 anos',
                features: [
                  'Teologia Fundamental',
                  'Pastoral Comunitária',
                  'Liturgia e Sacramentos',
                  'Espiritualidade',
                ],
              },
              {
                title: 'Catequese',
                description: 'Formação de catequistas para o ensino da fé.',
                duration: '2 anos',
                features: [
                  'Metodologia Catequética',
                  'Doutrina Católica',
                  'Psicologia da Religião',
                  'Prática Catequética',
                ],
              },
              {
                title: 'Formação de Líderes',
                description:
                  'Preparação para liderança em comunidades religiosas.',
                duration: '1 ano',
                features: [
                  'Liderança Cristã',
                  'Gestão Pastoral',
                  'Comunicação Eficaz',
                  'Trabalho em Equipe',
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
              Benefícios dos Cursos Religiosos
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-6 sm:gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
            {[
              {
                title: 'Formação Integral',
                description:
                  'Desenvolvimento espiritual, intelectual e pastoral.',
                icon: '🙏',
              },
              {
                title: 'Serviço Pastoral',
                description:
                  'Preparação para atuação em comunidades e instituições.',
                icon: '⛪',
              },
              {
                title: 'Certificação',
                description: 'Diploma reconhecido pela Igreja Católica.',
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
