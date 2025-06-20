import { getRegistration, type RegistrationResponse } from '@/http/registration'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import logo from '../assets/ismmalogo.png'
import jsPDF from 'jspdf'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { formatCurrency } from '@/utils/format'
import Button from '@/components/Button'

// Validação com Zod
const schema = z.object({
  paymentMethod: z.enum(['TRANSFERENCIA', 'DEPOSITO', 'MBWAY'], {
    errorMap: () => ({ message: 'Selecione o método de pagamento' }),
  }),
  reference: z
    .string()
    .min(1, { message: 'Referência é obrigatória' })
    .max(50, { message: 'Referência deve ter no máximo 50 caracteres' })
    .transform(val => val.trim()),
  amount: z
    .string()
    .min(1, { message: 'Valor é obrigatório' })
    .regex(/^\d+(\.\d{1,2})?$/, { message: 'Valor inválido' }),
  date: z
    .string()
    .min(1, { message: 'Data é obrigatória' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, { message: 'Data inválida' }),
})

type DataSchema = z.infer<typeof schema>

interface InvoiceProps {
  onComplete: () => void
  onBack: () => void
}

type ExtendedRegistrationResponse = RegistrationResponse & {
  student: {
    email: string
    phone: string
  }
}

export function Invoice({ onComplete, onBack }: InvoiceProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DataSchema>({
    resolver: zodResolver(schema),
  })

  const {
    data: dataRegistration,
    error: registrationError,
    isLoading: isLoadingRegistration,
  } = useQuery<ExtendedRegistrationResponse[]>({
    queryKey: ['registration_data'],
    queryFn: getRegistration,
  })

  useEffect(() => {
    const savedData = localStorage.getItem('invoice_data')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setValue('paymentMethod', parsedData.paymentMethod || '')
      setValue('reference', parsedData.reference || '')
      setValue('amount', parsedData.amount || '')
      setValue('date', parsedData.date || '')
    }
  }, [setValue])

  useEffect(() => {
    const subscription = watch(value => {
      if (
        value.paymentMethod ||
        value.reference ||
        value.amount ||
        value.date
      ) {
        localStorage.setItem('invoice_data', JSON.stringify(value))
        setHasUnsavedChanges(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  if (isLoadingRegistration) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    )
  }

  if (registrationError instanceof Error) {
    return (
      <div className="text-red-600 text-center p-4">
        Erro: {registrationError.message}
      </div>
    )
  }

  if (!dataRegistration) {
    return (
      <div className="text-gray-600 text-center p-4">
        Não há dados disponíveis no momento.
      </div>
    )
  }

  const studentRegistration = dataRegistration.find(
    registration =>
      registration.studentId === localStorage.getItem('student_id')
  )

  if (!studentRegistration) {
    return (
      <div className="text-gray-600 text-center p-4">Aluno não encontrado.</div>
    )
  }

  const getPaymentDetails = () => {
    const { levelCourse, period } = studentRegistration.course

    const prices = {
      LICENCIATURA: {
        LABORAL: { inscriptionFee: 1850, monthlyFee: 4500 },
        POS_LABORAL: { inscriptionFee: 1850, monthlyFee: 5200 },
      },
      TECNICO_MEDIO: {
        LABORAL: { inscriptionFee: 1600, monthlyFee: 3000 },
        POS_LABORAL: { inscriptionFee: 1500, monthlyFee: 3500 },
      },
      CURTA_DURACAO: {
        LABORAL: { inscriptionFee: 1600, monthlyFee: 2000 },
        POS_LABORAL: { inscriptionFee: 0, monthlyFee: 0 },
      },
      MESTRADO: {
        LABORAL: { inscriptionFee: 8500, monthlyFee: 10500 },
        POS_LABORAL: { inscriptionFee: 8500, monthlyFee: 10500 },
      },
    } as const

    return (
      prices[levelCourse as keyof typeof prices]?.[period] || {
        inscriptionFee: 0,
        monthlyFee: 0,
      }
    )
  }

  const { inscriptionFee, monthlyFee } = getPaymentDetails()
  const totalPayment = inscriptionFee + monthlyFee

  const bankAccounts = {
    LICENCIATURA: {
      TRANSFERENCIA: '51941267',
      DEPOSITO: '51941267',
      MPESA: '847898017',
    },
    TECNICO_MEDIO: {
      TRANSFERENCIA: '2345-6789-01',
      DEPOSITO: '8765-4321-20',
      MPESA: '847898017',
    },
    CURTA_DURACAO: {
      TRANSFERENCIA: '3456-7890-12',
      DEPOSITO: '7654-3210-30',
      MPESA: '847898017',
    },
    MESTRADO: {
      TRANSFERENCIA: '519447514',
      DEPOSITO: '519447514',
      MPESA: '847898017',
    },
  }

  const selectedAccount =
    bankAccounts[
      studentRegistration.course.levelCourse as keyof typeof bankAccounts
    ]?.[watch('paymentMethod') as 'TRANSFERENCIA' | 'DEPOSITO' | 'MPESA'] ||
    'Método de pagamento inválido'

  function downloadInvoice() {
    if (!studentRegistration) return
    const doc = new jsPDF()

    // Header
    doc.addImage(logo, 'PNG', 14, 10, 30, 30)
    doc.setFontSize(20)
    doc.setTextColor(44, 62, 80)
    doc.text('Comprovativo de Inscrição', 50, 25)
    doc.setFontSize(10)
    doc.setTextColor(149, 165, 166)
    doc.text('Instituto Superior Maria Mãe de África', 50, 35)
    doc.text('Maputo, Moçambique', 50, 40)
    doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 50, 45)

    // Line separator
    doc.setDrawColor(200, 200, 200)
    doc.line(14, 50, 196, 50)

    // Student Information
    doc.setFontSize(14)
    doc.setTextColor(44, 62, 80)
    doc.text('Informações do Estudante', 14, 65)
    doc.setFontSize(10)
    doc.setTextColor(52, 73, 94)
    doc.text(
      `Nome: ${studentRegistration.student.name} ${studentRegistration.student.surname}`,
      14,
      75
    )
    doc.text(`Número de Estudante: ${studentRegistration.studentId}`, 14, 80)
    doc.text(
      `Email: ${studentRegistration.student.email || 'Não informado'}`,
      14,
      85
    )
    doc.text(
      `Telefone: ${studentRegistration.student.phone || 'Não informado'}`,
      14,
      90
    )

    // Line separator
    doc.line(14, 95, 196, 95)

    // Course Information
    doc.setFontSize(14)
    doc.setTextColor(44, 62, 80)
    doc.text('Informações do Curso', 14, 110)
    doc.setFontSize(10)
    doc.setTextColor(52, 73, 94)
    doc.text(`Curso: ${studentRegistration.course.courseName}`, 14, 120)
    doc.text(
      `Nível: ${studentRegistration.course.levelCourse.replace(/_/g, ' ')}`,
      14,
      125
    )
    doc.text(
      `Período: ${studentRegistration.course.period === 'LABORAL' ? 'Laboral' : 'Pós-laboral'}`,
      14,
      130
    )
    doc.text(`Status: ${studentRegistration.registrationStatus}`, 14, 135)

    // Line separator
    doc.line(14, 140, 196, 140)

    // Payment Information
    doc.setFontSize(14)
    doc.setTextColor(44, 62, 80)
    doc.text('Informações de Pagamento', 14, 155)
    doc.setFontSize(10)
    doc.setTextColor(52, 73, 94)
    const paymentMethod = watch('paymentMethod') || 'Não informado'
    const reference = watch('reference') || 'Não informado'
    const date = watch('date') || 'Não informado'
    doc.text(`Método: ${paymentMethod}`, 14, 165)
    doc.text(`Referência: ${reference}`, 14, 170)
    doc.text(`Data: ${date}`, 14, 175)

    // Payment Details
    doc.setFontSize(14)
    doc.setTextColor(44, 62, 80)
    doc.text('Detalhes do Pagamento', 14, 190)
    doc.setFontSize(10)
    doc.setTextColor(52, 73, 94)
    doc.text(`Taxa de Inscrição: ${formatCurrency(inscriptionFee)}`, 14, 200)
    doc.text(`Mensalidade: ${formatCurrency(monthlyFee)}`, 14, 205)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(231, 76, 60)
    doc.text(`Total a Pagar: ${formatCurrency(totalPayment)}`, 14, 210)

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(149, 165, 166)
    doc.text('Este documento serve como comprovativo de inscrição.', 14, 220)
    doc.text(
      'Por favor, mantenha este documento para referência futura.',
      14,
      225
    )

    // Save the PDF
    doc.save('comprovativo_inscricao.pdf')
  }

  const onSubmit = async (data: DataSchema) => {
    try {
      setIsLoading(true)
      // Aqui você implementaria a chamada à API para salvar os dados
      // await createInvoice(data)

      localStorage.removeItem('invoice_data')
      setHasUnsavedChanges(false)
      onComplete()
      toast.success('Fatura registrada com sucesso!')
      navigate('/registration/success')
    } catch (error) {
      console.error('Erro ao registrar fatura:', error)
      toast.error('Erro ao registrar fatura. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Resumo da Inscrição
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Revise os detalhes da sua inscrição e faça o pagamento
        </p>
      </div>

      {/* Resumo da Inscrição */}
      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {/* Informações do Estudante */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informações do Estudante
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Nome Completo
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {studentRegistration.student.name}{' '}
                    {studentRegistration.student.surname}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Número de Estudante
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">
                    {studentRegistration.studentId}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {studentRegistration.student.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Telefone
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {studentRegistration.student.phone}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Tipo de Documento
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {studentRegistration.student.documentType}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Número do Documento
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">
                    {studentRegistration.student.documentNumber}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Informações do Curso */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Informações do Curso
              </h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Curso</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {studentRegistration.course.courseName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Nível Académico
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {studentRegistration.course.levelCourse.replace(/_/g, ' ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Período</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {studentRegistration.course.period === 'LABORAL'
                      ? 'Laboral'
                      : 'Pós-laboral'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Status da Inscrição
                  </dt>
                  <dd className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        studentRegistration.registrationStatus === 'PENDENTE'
                          ? 'bg-yellow-100 text-yellow-800'
                          : studentRegistration.registrationStatus ===
                              'CONFIRMADO'
                            ? 'bg-green-100 text-green-800'
                            : studentRegistration.registrationStatus ===
                                'INSCRITO'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {studentRegistration.registrationStatus}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Data de Inscrição
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(studentRegistration.createdAt).toLocaleDateString(
                      'pt-MZ',
                      {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      }
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Detalhes do Pagamento */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Detalhes do Pagamento
            </h3>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">
                  Taxa de Inscrição
                </dt>
                <dd className="text-sm text-gray-900">
                  {formatCurrency(inscriptionFee)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm font-medium text-gray-500">
                  Mensalidade
                </dt>
                <dd className="text-sm text-gray-900">
                  {formatCurrency(monthlyFee)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3">
                <dt className="text-base font-medium text-gray-900">Total</dt>
                <dd className="text-base font-medium text-gray-900">
                  {formatCurrency(totalPayment)}
                </dd>
              </div>
            </dl>

            {/* Métodos de Pagamento */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Métodos de Pagamento Disponíveis
              </h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {/* Transferência Bancária */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">
                    Transferência Bancária
                  </h4>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-gray-500">Banco</dt>
                      <dd className="text-gray-900">
                        Banco Internacional de Moçambique (Millennium Bim)
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Número da Conta</dt>
                      <dd className="text-gray-900 font-mono">
                        {
                          bankAccounts[
                            studentRegistration.course
                              .levelCourse as keyof typeof bankAccounts
                          ]?.TRANSFERENCIA
                        }
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">NIB</dt>
                      <dd className="text-gray-900 font-mono">
                        000800000519412670101
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Depósito */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Depósito</h4>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-gray-500">Banco</dt>
                      <dd className="text-gray-900">
                        Banco Internacional de Moçambique (Millennium Bim)
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Número da Conta</dt>
                      <dd className="text-gray-900 font-mono">
                        {
                          bankAccounts[
                            studentRegistration.course
                              .levelCourse as keyof typeof bankAccounts
                          ]?.DEPOSITO
                        }
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Titular</dt>
                      <dd className="text-gray-900">
                        Instituto Superior Maria Mãe de África
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* MPESA */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">MPESA</h4>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="text-gray-500">Número</dt>
                      <dd className="text-gray-900 font-mono">
                        {
                          bankAccounts[
                            studentRegistration.course
                              .levelCourse as keyof typeof bankAccounts
                          ]?.MPESA
                        }
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Titular</dt>
                      <dd className="text-gray-900">
                        Instituto Superior Maria Mãe de África
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-500">
                <p className="font-medium text-gray-900">Instruções:</p>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Após efetuar o pagamento, guarde o comprovante</li>
                  <li>Faça o login com o email e a palavra passe </li>
                  <li>Baixe o PDF com o resumo da inscrição</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Botões de Ação */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={downloadInvoice}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Baixar PDF
        </button>
        <Button
          onClick={() => navigate('/login')}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Finalizar
        </Button>
      </div>
    </div>
  )
}
