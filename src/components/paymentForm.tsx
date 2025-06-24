import {
  getInvoiceById,
  updateInvoiceStatus,
  type invoiceExtendedResponse,
} from '@/http/finances/invoices'
import { useQuery, useQueryClient } from '@tanstack/react-query'
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
import toast from 'react-hot-toast'
import Button from './Button'

type PaymentFormProps = {
  invoiceId: string
  onPaymentSuccess: () => void
  onCancel: () => void
}

type dataSchema = z.infer<typeof paymentSchema>

export function PaymentForm({
  invoiceId,
  onPaymentSuccess,
  onCancel,
}: PaymentFormProps) {
  const queryClient = useQueryClient()
  const [paymentMethod, setPaymentMethod] = useState<string>('')

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<dataSchema>({
    resolver: zodResolver(paymentSchema),
  })

  const getLateFee = (inv: invoiceExtendedResponse | undefined) => {
    if (!inv) return 0
    return inv.LateFee?.reduce((sum, fee) => sum + fee.amount, 0) || 0
  }

  useEffect(() => {
    if (invoice) {
      const totalAmount = invoice.amount + getLateFee(invoice)
      reset({
        invoiceId: invoice.id,
        amount: totalAmount,
        paymentDate: dayjs().format('YYYY-MM-DD'),
      })
    }
  }, [invoice, reset])

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
    )
  }

  async function onSubmit(data: dataSchema) {
    if (!invoice) {
      toast.error('Fatura não encontrada para processar o pagamento.')
      return
    }

    try {
      const payment = await createPayments({
        invoiceId: data.invoiceId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentDate: dayjs(data.paymentDate).toDate(),
        reference: data.reference ?? null,
        description: data.description ?? null,
      })

      if (payment.error) {
        throw new Error(payment.error.message || 'Erro do servidor')
      }

      const totalAmountDue = invoice.amount + getLateFee(invoice)
      const newStatus =
        data.amount >= totalAmountDue ? 'PAGO' : 'PARCIALMENTE_PAGO'

      await updateInvoiceStatus(data.invoiceId, newStatus)

      toast.success('Pagamento registrado com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['invoice'] })
      onPaymentSuccess()
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Não foi possível registrar o pagamento.'
      )
    }
  }

  if (isLoading) {
    return <LoadingSkeleton />
  }
  if (isError) {
    return <div>Erro ao carregar os dados da fatura.</div>
  }
  if (!invoice) {
    return <div>Fatura não encontrada.</div>
  }

  const studentName = `${invoice.student.name} ${invoice.student.surname}`
  const totalAmount = invoice.amount + getLateFee(invoice)

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Pagamento de Fatura</h2>
      <div className="p-4 border rounded-lg bg-gray-50 text-sm space-y-1">
        <div>
          <strong>Estudante:</strong> {studentName}
        </div>
        <div>
          <strong>Mês/Ano:</strong> {invoice.month}/{invoice.year}
        </div>
        <div>
          <strong>Total (com multas):</strong>{' '}
          {totalAmount.toLocaleString('pt-MZ', {
            style: 'currency',
            currency: 'MZN',
          })}
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Valor a Pagar"
          id="amount"
          type="number"
          step="0.01"
          {...register('amount', { valueAsNumber: true })}
          error={errors.amount?.message}
        />
        <Input
          label="Data de pagamento"
          id="paymentDate"
          type="date"
          {...register('paymentDate')}
          error={errors.paymentDate?.message}
        />
        <SelectField
          label="Método de pagamento"
          id="paymentMethod"
          {...register('paymentMethod')}
          value={paymentMethod}
          onChange={handlePaymentMethodChange}
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
        {paymentMethod !== 'DINHEIRO' && paymentMethod && (
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
          placeholder="Ex: Pagamento da mensalidade"
          {...register('description')}
          error={errors.description?.message}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Registrar Pagamento
          </Button>
        </div>
      </form>
    </div>
  )
}
