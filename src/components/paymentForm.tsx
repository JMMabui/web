import {
  getInvoiceById,
  updateInvoiceStatus,
  type invoiceExtendedResponse,
} from '@/http/finances/invoices'
import { useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import Input from './Input'
import { paymentSchema } from '@/validation/payments'
import type { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import SelectField from './selectField'
import { LoadingSkeleton } from './LoadingSkeleton'
import dayjs from 'dayjs'
import { createPayments } from '@/http/finances/payments'

type PaymentFormProps = {
  invoiceId: string
}

type dataSchema = z.infer<typeof paymentSchema>

export function PaymentForm({ invoiceId }: PaymentFormProps) {
  // console.log('invoiceId:', invoiceId)

  const [paymentMethod, setPaymentMethod] = useState<string>('') // Estado para armazenar o método de pagamento

  const {
    data: invoice,
    isLoading,
    isError,
  } = useQuery<invoiceExtendedResponse>({
    queryKey: ['invoice', invoiceId],
    queryFn: () => getInvoiceById(invoiceId),
    enabled: !!invoiceId,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  // console.log('invoice:', invoice)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<dataSchema>({
    resolver: zodResolver(paymentSchema),
  })

  if (isLoading) {
    return <LoadingSkeleton />
  }
  if (isError) {
    return <div>Erro ao carregar os dados</div>
  }
  if (!invoice) {
    return <div>Nenhum dado encontrado</div>
  }

  // console.log('Erros:', errors)

  // Função para atualizar o estado 'paymentMethod' e definir o valor no formulário
  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const method = e.target.value
    setPaymentMethod(method)
    setValue(
      'paymentMethod',
      method as
        | 'DINHEIRO'
        | 'TRANSFERENCIA'
        | 'DEPOSITO'
        | 'CARTAO_CREDITO'
        | 'CARTAO_DEBITO'
        | 'OUTROS'
    ) // Atualiza o valor no formulário
  }

  const studentName = invoice.student.name
    ? `${invoice.student.name} ${invoice.student.surname}`
    : 'Nome não disponível'
  // console.log('studentName:', studentName)

  const amountfee = invoice.LateFee[0] ? invoice.LateFee[0].amount : 0
  const formattedAmount = invoice.amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'MZN',
  })
  const formattedDate = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const totalAmount = invoice.amount + amountfee

  const formattedStatus =
    invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)
  const formattedMonth =
    invoice.month.charAt(0).toUpperCase() + invoice.month.slice(1)
  const formattedStudentName = studentName
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  const formattedStudent = `Estudante ${formattedStudentName}`
  const formattedAmountValue = `Valor ${formattedAmount}`
  const formattedMonthValue = `Mês ${formattedMonth}`
  const formattedStatusValue = `Status ${formattedStatus}`
  const formattedDateValue = `Data ${formattedDate}`
  const formattedLateFee = `Multa ${amountfee.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'MZN',
  })}`

  console.log('errors:', errors)
  useEffect(() => {
    if (invoice) {
      reset({
        invoiceId: invoice.id,
        amount: totalAmount,
        // paymentDate: new Date(),
        // Adicione outros campos do esquema aqui, se houver
      })
    }
  }, [invoice, reset])

  async function onSubmit(data: dataSchema) {
    console.log('Dados do pagamento:', data)
    // Aqui você pode fazer a chamada para a API para registrar o pagamento
    // Exemplo:
    // registerPayment(data)
    try {
      const payment = await createPayments({
        invoiceId: data.invoiceId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentDate: dayjs(data.paymentDate).toDate(),
        reference: data.reference ?? null,
        description: data.description ?? null,
      })
      // Aqui você pode fazer algo com a resposta da API, como mostrar uma mensagem de sucesso

      console.log('Pagamento registrado:', payment.sucess)
      if (!payment.error) {
        const invoiceStatus = await updateInvoiceStatus(data.invoiceId, 'PAGO')
        console.log('Status da fatura atualizado:', invoiceStatus)
      }
      console.log('Pagamento registrado com sucesso:', payment)
      alert('Pagamento registrado com sucesso!')
      reset(
        {
          invoiceId: '',
          amount: 0,
          reference: '',
          description: '',
        } // Limpa o formulário após o envio
      ) // Limpa o formulário após o envio

      setPaymentMethod('') // Reseta o método de pagamento
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error)
      alert('Erro ao registrar pagamento. Tente novamente.')
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Pagamento</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            {/* <label className="text-sm font-semibold">{formattedInvoice}</label> */}
            <label className="text-sm font-semibold">{formattedStudent}</label>
            <label className="text-sm font-semibold">
              {formattedAmountValue}
            </label>
            <label className="text-sm font-semibold">
              {formattedMonthValue}
            </label>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold">
              {formattedStatusValue}
            </label>
            <label className="text-sm font-semibold">
              {formattedDateValue}
            </label>
            <label className="text-sm font-semibold">{formattedLateFee}</label>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Total a pagar:{' '}
          {totalAmount.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'MZN',
          })}
        </div>
        <Input
          label="Valor"
          id="amount"
          {...register('amount')}
          error={errors.amount?.message}
        />
        <Input
          label="Data de pagamento"
          id="paymentDate"
          type="date"
          {...register('paymentDate')}
          error={errors.paymentDate?.message}
        />

        {/* Método de pagamento */}
        <SelectField
          label="Método de pagamento"
          id="paymentMethod"
          {...register('paymentMethod')}
          value={paymentMethod}
          onChange={handlePaymentMethodChange} // Atualiza o método de pagamento selecionado
          options={[
            { value: 'DINHEIRO', label: 'Dinheiro' },
            { value: 'TRANSFERENCIA', label: 'Transferência' },
            { value: 'DEPOSITO', label: 'Depósito' },
            { value: 'CARTAO_CREDITO', label: 'Cartão de Crédito' },
            { value: 'CARTAO_DEBITO', label: 'Cartão de Débito' },
            { value: 'OUTROS', label: 'Outros' },
          ]}
          error={errors.paymentMethod?.message}
        />

        {/* Mostrar o campo de "Referência" apenas se o método não for 'DINHEIRO' */}
        {paymentMethod !== 'DINHEIRO' && (
          <Input
            label="Referência"
            id="reference"
            {...register('reference')}
            error={errors.reference?.message}
          />
        )}
        <Input
          label="Descrição"
          id="description"
          placeholder="Descrição do pagamento ex: Pagamento de fatura completa"
          {...register('description')}
          error={errors.description?.message}
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Registrar Pagamento
        </button>
      </form>
    </div>
  )
}
