import { useState } from 'react'
import { Personal_data } from './person_data'
import { Pre_Instituto } from './pre_institutos'
import { Inscricao } from './course'
import { Invoice } from './invoice'
import { Toaster } from 'react-hot-toast'
import { CheckIcon } from '@heroicons/react/24/solid'

const steps = [
  {
    id: 'personal_data',
    label: 'Dados Pessoais',
    description: 'Informações básicas do estudante',
  },
  {
    id: 'pre_instituto',
    label: 'Pré-escola',
    description: 'Formação pré-universitária',
  },
  {
    id: 'inscricao',
    label: 'Curso',
    description: 'Seleção do curso e opções',
  },
  {
    id: 'invoice',
    label: 'Fatura',
    description: 'Pagamento e confirmação',
  },
]

export function Signup() {
  const [activeForm, setActiveForm] = useState('personal_data')
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => [...prev, stepId])
    const currentIndex = steps.findIndex(step => step.id === stepId)
    if (currentIndex < steps.length - 1) {
      setActiveForm(steps[currentIndex + 1].id)
    }
  }

  const handleBack = () => {
    const currentIndex = steps.findIndex(step => step.id === activeForm)
    if (currentIndex > 0) {
      setActiveForm(steps[currentIndex - 1].id)
      setCompletedSteps(prev => prev.filter(step => step !== activeForm))
    }
  }

  const renderForm = () => {
    switch (activeForm) {
      case 'personal_data':
        return (
          <Personal_data
            onComplete={() => handleStepComplete('personal_data')}
            onBack={handleBack}
          />
        )
      case 'pre_instituto':
        return (
          <Pre_Instituto
            onComplete={() => handleStepComplete('pre_instituto')}
            onBack={handleBack}
          />
        )
      case 'inscricao':
        return (
          <Inscricao
            onComplete={() => handleStepComplete('inscricao')}
            onBack={handleBack}
          />
        )
      case 'invoice':
        return (
          <Invoice
            onComplete={() => handleStepComplete('invoice')}
            onBack={handleBack}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <nav aria-label="Progress" className="mb-8">
          <ol role="list" className="flex items-center">
            {steps.map((step, stepIdx) => {
              const isCompleted = completedSteps.includes(step.id)
              const isActive = activeForm === step.id
              const isUpcoming = !isCompleted && !isActive

              return (
                <li
                  key={step.id}
                  className={`relative ${
                    stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                        isCompleted
                          ? 'bg-green-600'
                          : isActive
                            ? 'bg-indigo-600 ring-2 ring-indigo-600 ring-offset-2'
                            : 'bg-gray-200'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckIcon
                          className="h-5 w-5 text-white"
                          aria-hidden="true"
                        />
                      ) : (
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            isActive ? 'bg-white' : 'bg-gray-400'
                          }`}
                        />
                      )}
                    </div>
                    {stepIdx !== steps.length - 1 && (
                      <div
                        className={`absolute top-4 left-8 -ml-px h-0.5 w-full ${
                          isCompleted ? 'bg-green-600' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>
                  <div className="mt-2">
                    <span
                      className={`text-sm font-medium ${
                        isActive
                          ? 'text-indigo-600'
                          : isCompleted
                            ? 'text-green-600'
                            : 'text-gray-500'
                      }`}
                    >
                      {step.label}
                    </span>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </nav>

        {/* Form Content */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">{renderForm()}</div>
        </div>
      </div>
    </div>
  )
}
