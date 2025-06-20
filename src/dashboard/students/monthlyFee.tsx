import { useState } from 'react'
import Button from '@/components/Button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getInvoicesByStudentId,
  createInvoice,
  type invoiceExtendedResponse,
} from '../../http/finances/invoices'
import { LoadingSkeleton } from '@/components/LoadingSkeleton'
import { ErrorComponent } from '@/components/ErrorComponent'
import { 
  CreditCard, 
  History, 
  Bell, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Calendar,
  Receipt,
  CreditCard as CreditCardIcon,
  Wallet,
  AlertTriangle,
  Upload,
} from 'lucide-react'

// Extend the invoiceExtendedResponse type
type ExtendedInvoice = invoiceExtendedResponse & {
  paymentDate?: string | Date;
  paymentMethod?: string;
  paymentHistory?: PaymentRecord[];
  reminderSent?: boolean;
}

interface PaymentRecord {
  id: string;
  date: Date;
  amount: number;
  method: string;
  status: 'success' | 'pending' | 'failed';
  receipt?: string;
}

interface LateFees {
  daysLate: number;
  lateFeePercentage: number;
  lateFee: number;
  totalWithLateFee: number;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
}

interface PaymentFormData {
  bankName?: string;
  accountNumber?: string;
  reference?: string;
  depositDate?: string;
  mobileNumber?: string;
  mobileProvider?: string;
  receiptFile?: File;
}

// interface Invoice {
//   id: string
//   month: string
//   date: string
//   status: string
//   amount: number
//   dueDate: string
//   paymentDate?: string
//   paymentMethod?: string
//   courseId: string
// }

export function MonthlyFee() {
  const [showForm, setShowForm] = useState(false)
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [selectedInvoice, setSelectedInvoice] = useState<ExtendedInvoice | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'TODOS' | 'PAGO' | 'PENDENTE'>('TODOS')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState('')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [showReminderModal, setShowReminderModal] = useState(false)
  const studentId = localStorage.getItem('student_login_id')
  const queryClient = useQueryClient()
  const [paymentFormData, setPaymentFormData] = useState<PaymentFormData>({})
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null)

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'transfer',
      name: 'Transferência Bancária',
      icon: <CreditCardIcon className="w-6 h-6" />,
      description: 'Realize o pagamento via transferência bancária'
    },
    {
      id: 'deposit',
      name: 'Depósito',
      icon: <Wallet className="w-6 h-6" />,
      description: 'Faça um depósito em qualquer agência bancária'
    },
    {
      id: 'mobile_wallet',
      name: 'Carteira Móvel',
      icon: <Receipt className="w-6 h-6" />,
      description: 'Pague usando sua carteira móvel (M-Pesa, E-Mola, etc)'
    }
  ]

  // Fetch invoices
  const {
    data: invoices,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['invoices', studentId],
    queryFn: () => getInvoicesByStudentId(studentId!),
    enabled: !!studentId,
  })

  // Filter and sort invoices
  const filteredInvoices = invoices?.filter((invoice: ExtendedInvoice) => {
    const matchesSearch = invoice.month.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'TODOS' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  }).sort((a: ExtendedInvoice, b: ExtendedInvoice) => {
    const dateA = new Date(a.dueDate).getTime()
    const dateB = new Date(b.dueDate).getTime()
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
  })

  // Calculate summary statistics
  const totalAmount = filteredInvoices?.reduce((sum: number, invoice: ExtendedInvoice) => sum + invoice.amount, 0) || 0
  const paidInvoices = filteredInvoices?.filter((invoice: ExtendedInvoice) => invoice.status === 'PAGO').length || 0
  const pendingInvoices = filteredInvoices?.filter((invoice: ExtendedInvoice) => invoice.status === 'PENDENTE').length || 0
  const overdueInvoices = filteredInvoices?.filter((invoice: ExtendedInvoice) => {
    const dueDate = new Date(invoice.dueDate)
    return invoice.status === 'PENDENTE' && dueDate < new Date()
  }).length || 0

  const courseId = localStorage.getItem('course_id')

  // Create invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      setNotificationMessage('Mensalidade criada com sucesso!')
      setShowNotification(true)
      setShowForm(false)
      setSelectedMonths([])
      queryClient.invalidateQueries({ queryKey: ['invoices', studentId] })
      setTimeout(() => setShowNotification(false), 3000)
    },
    onError: (error: any) => {
      setNotificationMessage(
        error?.response?.status === 409
          ? 'Já existe uma fatura para este estudante e mês(es).'
          : 'Erro ao criar fatura. Tente novamente.'
      )
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    },
  })

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const getDueDate = (month: string): string => {
    const now = new Date()
    const currentYear = now.getFullYear()
    const monthIndex = months.indexOf(month)
    const dueDate = new Date(currentYear, monthIndex, 5)
    return dueDate.toISOString()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentId || selectedMonths.length === 0) return

    try {
      await createInvoiceMutation.mutateAsync({
        studentId,
        courseId,
        months: selectedMonths.map(month => month.toUpperCase()),
        type: 'MENSALIDADE',
        dueDate: getDueDate(selectedMonths[selectedMonths.length - 1]),
      })
    } catch (error) {
      console.error('Erro ao criar fatura:', error)
    }
  }

  // Função para calcular multas
  const calculateLateFees = (dueDate: string | Date, amount: number): LateFees | null => {
    const today = new Date()
    const due = new Date(dueDate)
    
    if (today <= due) return null

    const daysLate = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
    const lateFeePercentage = 0.02 // 2% por dia de atraso
    const lateFee = amount * (lateFeePercentage * daysLate)
    const totalWithLateFee = amount + lateFee

    return {
      daysLate,
      lateFeePercentage: lateFeePercentage * 100,
      lateFee,
      totalWithLateFee
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPaymentFormData(prev => ({ ...prev, receiptFile: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setReceiptPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInvoice) return

    try {
      // Simular processamento de pagamento
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Atualizar status da fatura
      const updatedInvoice = {
        ...selectedInvoice,
        status: 'PAGO',
        paymentDate: new Date().toISOString(),
        paymentMethod: selectedPaymentMethod,
        paymentHistory: [
          ...(selectedInvoice.paymentHistory || []),
          {
            id: Math.random().toString(),
            date: new Date(),
            amount: selectedInvoice.amount,
            method: selectedPaymentMethod,
            status: 'success',
            receipt: receiptPreview || undefined,
            paymentDetails: paymentFormData
          }
        ]
      }

      // Atualizar cache do React Query
      queryClient.setQueryData(['invoices', studentId], (old: any) => {
        return old.map((invoice: ExtendedInvoice) =>
          invoice.id === selectedInvoice.id ? updatedInvoice : invoice
        )
      })

      setShowPaymentModal(false)
      setPaymentFormData({})
      setReceiptPreview(null)
      setNotificationMessage('Pagamento registrado com sucesso!')
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    } catch (error) {
      setNotificationMessage('Erro ao processar pagamento. Tente novamente.')
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }
  }

  // Função para configurar lembretes
  const handleSetReminder = async (invoice: ExtendedInvoice) => {
    try {
      // Simular envio de lembrete
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedInvoice = {
        ...invoice,
        reminderSent: true
      }

      // Atualizar cache do React Query
      queryClient.setQueryData(['invoices', studentId], (old: any) => {
        return old.map((inv: ExtendedInvoice) =>
          inv.id === invoice.id ? updatedInvoice : inv
        )
      })

      setShowReminderModal(false)
      setNotificationMessage('Lembrete configurado com sucesso!')
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    } catch (error) {
      setNotificationMessage('Erro ao configurar lembrete. Tente novamente.')
      setShowNotification(true)
      setTimeout(() => setShowNotification(false), 3000)
    }
  }

  if (isLoading) return <LoadingSkeleton />
  if (isError) return <ErrorComponent />

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 p-6">
      {/* Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`px-6 py-4 rounded-xl shadow-lg ${
            notificationMessage.includes('sucesso')
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center space-x-3">
              {notificationMessage.includes('sucesso') ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <AlertCircle className="w-6 h-6" />
              )}
              <p>{notificationMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold mb-2">Mensalidades</h1>
          <p className="text-amber-100">Gerencie suas mensalidades e pagamentos</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Receipt className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Total</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {totalAmount.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })} MT
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pagas</h3>
                <p className="text-2xl font-bold text-gray-900">{paidInvoices}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pendentes</h3>
                <p className="text-2xl font-bold text-gray-900">{pendingInvoices}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Atrasadas</h3>
                <p className="text-2xl font-bold text-gray-900">{overdueInvoices}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="TODOS">Todos os status</option>
              <option value="PAGO">Pagas</option>
              <option value="PENDENTE">Pendentes</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="desc">Mais recentes</option>
              <option value="asc">Mais antigas</option>
            </select>
          </div>
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Buscar mensalidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Button
              onClick={() => setShowForm(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Nova Mensalidade
            </Button>
          </div>
        </div>

        {/* Invoices List */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mês
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredInvoices?.map((invoice: ExtendedInvoice) => {
                  const lateFees = calculateLateFees(invoice.dueDate, invoice.amount)
                  const isOverdue = new Date(invoice.dueDate) < new Date() && invoice.status === 'PENDENTE'
                  
                  return (
                    <tr key={invoice.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {invoice.month}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {invoice.amount.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })} MT
                          {lateFees && (
                            <div className="text-xs text-red-600 mt-1">
                              + {lateFees.lateFee.toLocaleString('pt-BR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })} MT de multa
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className={`w-5 h-5 mr-2 ${
                            isOverdue ? 'text-red-500' : 'text-gray-400'
                          }`} />
                          <span className={`text-sm ${
                            isOverdue ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'PAGO'
                            ? 'bg-green-100 text-green-800'
                            : isOverdue
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {invoice.status === 'PAGO'
                            ? 'Pago'
                            : isOverdue
                            ? 'Atrasado'
                            : 'Pendente'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-3">
                          {invoice.status === 'PENDENTE' && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedInvoice(invoice)
                                  setShowPaymentModal(true)
                                }}
                                className="text-amber-600 hover:text-amber-700"
                              >
                                <CreditCard className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedInvoice(invoice)
                                  setShowReminderModal(true)
                                }}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Bell className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          {invoice.paymentHistory && invoice.paymentHistory.length > 0 && (
                            <button
                              onClick={() => {
                                setSelectedInvoice(invoice)
                                // Mostrar histórico de pagamentos
                              }}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              <History className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Realizar Pagamento</h2>
            
            {!selectedPaymentMethod ? (
              <div className="space-y-4">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className="w-full p-4 rounded-xl border border-gray-200 hover:border-amber-500 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-gray-100">
                        {method.icon}
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="font-medium text-gray-900">{method.name}</h3>
                        <p className="text-sm text-gray-500">{method.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-600">
                    Valor a pagar: {selectedInvoice.amount.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} MT
                  </p>
                </div>

                {selectedPaymentMethod === 'transfer' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Banco
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentFormData.bankName || ''}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, bankName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Ex: BCI, Millennium BIM, etc"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número da Conta
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentFormData.accountNumber || ''}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Número da conta bancária"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Referência
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentFormData.reference || ''}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, reference: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Número de referência da transferência"
                      />
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'deposit' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Banco
                      </label>
                      <input
                        type="text"
                        required
                        value={paymentFormData.bankName || ''}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, bankName: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Ex: BCI, Millennium BIM, etc"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data do Depósito
                      </label>
                      <input
                        type="date"
                        required
                        value={paymentFormData.depositDate || ''}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, depositDate: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'mobile_wallet' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Operadora
                      </label>
                      <select
                        required
                        value={paymentFormData.mobileProvider || ''}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, mobileProvider: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="">Selecione a operadora</option>
                        <option value="m-pesa">M-Pesa</option>
                        <option value="e-mola">E-Mola</option>
                        <option value="emola">Emola</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número do Celular
                      </label>
                      <input
                        type="tel"
                        required
                        value={paymentFormData.mobileNumber || ''}
                        onChange={(e) => setPaymentFormData(prev => ({ ...prev, mobileNumber: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="Número do celular"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Comprovativo de Pagamento
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Clique para fazer upload</span> ou arraste o arquivo
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG ou PDF (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept=".png,.jpg,.jpeg,.pdf"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {receiptPreview && (
                    <div className="mt-2">
                      <p className="text-sm text-green-600">Comprovativo carregado com sucesso!</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPaymentModal(false)
                      setSelectedPaymentMethod('')
                      setPaymentFormData({})
                      setReceiptPreview(null)
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-700"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600"
                  >
                    Confirmar Pagamento
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurar Lembrete</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-xl">
                <p className="text-sm text-blue-800">
                  Você receberá lembretes por email e SMS sobre o vencimento desta mensalidade.
                </p>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Dias antes do vencimento
                </label>
                <select className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500">
                  <option value="1">1 dia antes</option>
                  <option value="3">3 dias antes</option>
                  <option value="5">5 dias antes</option>
                  <option value="7">7 dias antes</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-700"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSetReminder(selectedInvoice)}
                className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600"
              >
                Confirmar Lembrete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Invoice Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Nova Mensalidade</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecione os meses
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {months.map(month => (
                    <button
                      key={month}
                      type="button"
                      onClick={() => {
                        if (selectedMonths.includes(month)) {
                          setSelectedMonths(selectedMonths.filter(m => m !== month))
                        } else {
                          setSelectedMonths([...selectedMonths, month])
                        }
                      }}
                      className={`p-2 rounded-lg text-sm ${
                        selectedMonths.includes(month)
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={selectedMonths.length === 0}
                  className="px-4 py-2 bg-amber-500 text-white rounded-xl hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Criar Mensalidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// Add this to your global CSS or create a new CSS module
const styles = `
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
`
