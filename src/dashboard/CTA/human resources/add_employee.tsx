import { useState } from 'react'
import Input from '@/components/Input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import SelectField from '@/components/selectField'
import { combinedEmployeeSchema } from '@/validation/combinedEmployee'
import Button from '@/components/Button'
import { createUser } from '@/http/user/user'
import { createEmployee } from '@/http/employee/employee'
import { signupRequest } from '@/http/signup/login-signup'
import { createEmployeeEducation } from '@/http/employee/employeeEducation'
import { createEmployeeBank } from '@/http/employee/employeeBank'

export function AddEmployee() {
  const [currentStep, setCurrentStep] = useState(1)

  type dataSchema = z.infer<typeof combinedEmployeeSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<dataSchema>({
    resolver: zodResolver(combinedEmployeeSchema),
  })

  // console.log('erros de validacao: ', errors)

  const handleNext = async () => {
    // await sendStepData() // Enviar os dados da etapa atual
    setCurrentStep(prev => prev + 1)
  }

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1)
  }
  async function onSubmit(data: dataSchema) {
    try {
      console.log('Dados enviados:', data)

      const login = await signupRequest({
        email: data.email,
        password: data.email,
        contact: data.contact,
        jobPosition: data.jobPosition,
      })
      // console.log('login data', login)

      const loginId = login.id

      // console.log('login id', loginId)

      const user = await createUser({
        surname: data.surname,
        name: data.name,
        gender: data.gender,
        dateOfBirth: new Date(data.dateOfBirth),
        address: data.address,
        maritalStatus: data.maritalStatus,
        documentExpiredAt: data.documentExpiredAt,
        documentIssuedAt: data.documentIssuedAt,
        identificationDocument: data.identificationDocument,
        identificationNumber: data.identificationNumber,
        taxIdentificationNumber: Number(data.taxIdentificationNumber),
      })

      const userId = user.id

      // console.log('user data', user)
      // console.log('user id', userId)

      const employee = await createEmployee({
        userId,
        employeeType: data.employeeType,
        jobTitle: data.jobTitle,
        department: data.department,
        dateOfHire: new Date(data.dateOfHire),
        salary: Number(data.salary),
        loginId,
      })

      const employeerId = employee.id

      const employeeEducation = await createEmployeeEducation({
        employeerId,
        institutionName: data.institutionName,
        degree: data.degree,
        fieldOfStudy: data.fieldOfStudy,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
      })

      const employeeBank = await createEmployeeBank({
        employeerId,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        accountType: data.accountType,
        accountHolder: data.accountHolder,
      })

      alert('Funcionário adicionado com sucesso!')
      reset()
    } catch (error) {
      console.error('Erro ao enviar dados:', error)
      alert('Ocorreu um erro ao adicionar o funcionário.')
    }
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        Adicionar Funcionário
      </h2>
      <p className="text-gray-600 mb-4">
        Preencha os dados do novo funcionário abaixo:
      </p>

      <div className="relative flex justify-between items-center mb-10">
        {/* Linha de fundo completa */}
        <div className="absolute top-5 left-0 right-0 w-full h-1 bg-gray-200 z-0 transform -translate-y-1/2" />

        {/* Etapas */}
        {[
          'Dados Pessoais',
          'Dados de Acesso',
          'Formação e Contratação',
          'Dados Bancários',
        ].map((stepLabel, index) => {
          const isActive = currentStep === index + 1
          const isCompleted = currentStep > index + 1

          return (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center w-1/4"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : isActive
                      ? 'bg-white border-blue-600 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-400'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span
                className={`mt-2 text-sm ${
                  isActive || isCompleted
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-500'
                }`}
              >
                {stepLabel}
              </span>
            </div>
          )
        })}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {/* Dados Pessoais */}
        {currentStep === 1 && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
              Dados Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nome"
                id="name"
                placeholder="Nome do Funcionário"
                {...register('name')}
                error={errors.name?.message}
              />
              <Input
                label="Apelido"
                id="surname"
                placeholder="Apelido"
                {...register('surname')}
                error={errors.surname?.message}
              />
              <Input
                label="Data de Nascimento"
                id="dateOfBirth"
                type="date"
                {...register('dateOfBirth')}
                error={errors.dateOfBirth?.message}
              />
              <SelectField
                label="Gênero"
                id="gender"
                options={[
                  { value: 'MASCULINO', label: 'Masculino' },
                  { value: 'FEMININO', label: 'Feminino' },
                ]}
                {...register('gender')}
                error={errors.gender?.message}
              />
              <SelectField
                label="Estado Civil"
                id="maritalStatus"
                options={[
                  { value: 'SOLTEIRO', label: 'Solteiro(a)' },
                  { value: 'CASADO', label: 'Casado(a)' },
                  { value: 'DIVORCIADO', label: 'Divorciado(a)' },
                  { value: 'VIUVO', label: 'Viúvo(a)' },
                ]}
                {...register('maritalStatus')}
                error={errors.maritalStatus?.message}
              />
              <Input
                label="Endereço"
                id="address"
                placeholder="Endereço"
                {...register('address')}
                error={errors.address?.message}
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
              Documentos de Identificação
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField
                label="Tipo de Documento"
                id="identificationDocument"
                options={[
                  { value: 'BI', label: 'Bilhete de Identidade' },
                  { value: 'PASSAPORTE', label: 'Passaporte' },
                ]}
                {...register('identificationDocument')}
                error={errors.identificationDocument?.message}
              />
              <Input
                label="Número do Documento"
                id="identificationNumber"
                {...register('identificationNumber')}
                error={errors.identificationNumber?.message}
              />
              <Input
                label="Data de Emissão"
                id="documentIssuedAt"
                type="date"
                {...register('documentIssuedAt')}
                error={errors.documentIssuedAt?.message}
              />
              <Input
                label="Data de Validade"
                id="documentExpiryAt"
                type="date"
                {...register('documentExpiredAt')}
                error={errors.documentExpiredAt?.message}
              />
              <Input
                label="Número de Identificação Fiscal"
                id="taxIdentificationNumber"
                placeholder="NUIT"
                {...register('taxIdentificationNumber')}
                error={errors.taxIdentificationNumber?.message}
              />
            </div>
          </>
        )}

        {/* Dados de Acesso */}
        {currentStep === 2 && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
              Dados de Acesso
            </h2>
            <Input
              label="E-mail"
              id="email"
              type="email"
              {...register('email')}
              error={errors.email?.message}
            />
            <Input
              label="Contacto"
              id="contact"
              placeholder="+258 xx xxx xxx"
              {...register('contact')}
              error={errors.contact?.message}
            />
            <SelectField
              label="Posição Na Instituição"
              id="jobTitle"
              options={[
                { value: 'ADMIN_IT', label: 'Administrador de Informática' },
                {
                  value: 'CTA_ADMIN_FINANCEIRO',
                  label: 'Administrador de Finanças',
                },
                {
                  value: 'CTA_ADMIN_REG_ACADEMICO',
                  label: 'Administrador de Registo Académico',
                },
                {
                  value: 'CTA_ADMIN_RH',
                  label: 'Administrador de Recursos Humanos',
                },
                {
                  value: 'CTA_ADMIN_BIBLIOTECA',
                  label: 'Administrador de Biblioteca',
                },
                { value: 'CTA_FINANCEIRO', label: 'Funcionário de Finanças' },
                { value: 'CTA_BIBLIOTECA', label: 'Funcionário da Biblioteca' },
                { value: 'CTA_DOCENTE', label: 'Docente' },
                { value: 'CTA_RH', label: 'Funcionário de Recursos Humanos' },
                { value: 'CTA', label: 'Estagiário' },
              ]}
              {...register('jobPosition')}
              error={errors.jobPosition?.message}
            />
          </>
        )}

        {currentStep === 3 && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
              Formacao Academica
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Input
                label="Instituição de Ensino"
                id="institutionName"
                placeholder="Nome da Instituição de Ensino"
                {...register('institutionName')}
                error={errors.institutionName?.message}
              />
              <Input
                label="Grau Académico"
                id="degree"
                {...register('degree')}
                error={errors.degree?.message}
              />
              <Input
                label="Área de Estudo"
                id="fieldOfStudy"
                {...register('fieldOfStudy')}
                error={errors.fieldOfStudy?.message}
              />
              <Input
                label="Data de Início"
                id="startDate"
                type="date"
                {...register('startDate')}
                error={errors.startDate?.message}
              />
              <Input
                label="Data de Conclusão"
                id="endDate"
                type="date"
                {...register('endDate')}
                error={errors.endDate?.message}
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
              Contratacao
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectField
                label="Tipo de Funcionário"
                id="employeeType"
                options={[
                  { value: 'PERMANENT', label: 'Permanente' },
                  { value: 'FIXED_TERM', label: 'Contrato com Prazo Certo' },
                  {
                    value: 'UNCERTAIN_TERM',
                    label: 'Contrato com Prazo Incerto',
                  },
                  { value: 'PART_TIME', label: 'Meio Periodo' },
                  { value: 'INTERN', label: 'Estagiario' },
                  { value: 'APPRENTICE', label: 'Aprendiz' },
                ]}
                {...register('employeeType')}
                error={errors.employeeType?.message}
              />
              <Input
                label="Titulo do Trabalho"
                id="jobTitle"
                {...register('jobTitle')}
                error={errors.jobTitle?.message}
              />
              <SelectField
                label="Departamento"
                id="department"
                options={[
                  { value: 'ADMINISTRACAO', label: 'Administração' },
                  { value: 'FINANCEIRO', label: 'Financas' },
                  { value: 'RH', label: 'Recursos Humanos' },
                  { value: 'BIBLIOTECA', label: 'Biblioteca' },
                  { value: 'INFORMATICA', label: 'Informática' },
                  { value: 'ACADEMICO', label: 'Registo Academico' },
                  { value: 'DOCENCIA', label: 'Docência' },
                  { value: 'OUTROS', label: 'Outros' },
                ]}
                {...register('department')}
                error={errors.department?.message}
              />
              <Input
                label="data de admissão"
                id="dateOfHire"
                type="date"
                {...register('dateOfHire')}
                error={errors.dateOfHire?.message}
              />
              <Input
                label="Salário"
                id="salary"
                type="number"
                {...register('salary', {
                  setValueAs: value =>
                    value === '' ? undefined : Number.parseFloat(value), // Converte para número
                })}
                error={errors.salary?.message}
              />
            </div>
          </>
        )}
        {currentStep === 4 && (
          <>
            <h2 className="text-lg font-semibold text-gray-800 mt-6 mb-4">
              Dados Bancários
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Nome do Banco"
                id="bankName"
                placeholder="Nome do Banco"
                {...register('bankName')}
                error={errors.bankName?.message}
              />
              <Input
                label="Número da Conta"
                id="accountNumber"
                placeholder="Número da Conta"
                {...register('accountNumber')}
                error={errors.accountNumber?.message}
              />
              <SelectField
                label="Tipo de Conta"
                id="accountType"
                options={[
                  { value: 'CORRENTE', label: 'Corrente' },
                  { value: 'POUPANCA', label: 'Poupança' },
                  { value: 'OUTRO', label: 'Outro' },
                ]}
                {...register('accountType')}
                error={errors.accountType?.message}
              />
              <Input
                label="Titular da Conta"
                id="accountHolder"
                placeholder="Nome do Titular da Conta"
                {...register('accountHolder')}
                error={errors.accountHolder?.message}
              />
            </div>
          </>
        )}

        {/* Botões de navegação */}

        <div className="flex justify-between">
          {currentStep > 1 && (
            <Button
              type="button"
              onClick={handlePrevious}
              className="bg-gray-500 text-white py-2 px-6 rounded-md"
            >
              Anterior
            </Button>
          )}
          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={handleNext}
              className="bg-blue-600 text-white py-2 px-6 rounded-md"
            >
              Próximo
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-green-600 text-white py-2 px-6 rounded-md"
            >
              Finalizar
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
