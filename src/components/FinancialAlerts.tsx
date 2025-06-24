import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Bell, AlertCircle } from 'lucide-react'
import {
  getAllInvoice,
  type invoiceExtendedResponse,
} from '../http/finances/invoices'
import { Link } from 'react-router-dom'
import Button from './Button'

type Alert = {
  id: string
  studentName: string
  message: string
  studentId: string
}

export function FinancialAlerts() {
  const [isOpen, setIsOpen] = useState(false)

  const { data: invoices } = useQuery<invoiceExtendedResponse[]>({
    queryKey: ['invoicesForAlerts'],
    queryFn: getAllInvoice,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const alerts = useMemo((): Alert[] => {
    if (!invoices) return []

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const alertsList: Alert[] = []

    invoices.forEach(inv => {
      if (inv.status !== 'PAGO') {
        const dueDate = new Date(Number(inv.year), Number(inv.month), 0) // Last day of the month
        const diffTime = dueDate.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        let message = ''
        if (diffDays <= 0) {
          message = `Fatura de ${inv.month}/${inv.year} está vencida.`
        } else if (diffDays <= 7) {
          message = `Fatura de ${inv.month}/${inv.year} vence em ${diffDays} dias.`
        }

        if (message) {
          alertsList.push({
            id: inv.id,
            studentName: `${inv.student.name} ${inv.student.surname}`,
            message,
            studentId: inv.student.id,
          })
        }
      }
    })

    return alertsList
  }, [invoices])

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-200"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {alerts.length > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-white text-xs items-center justify-center">
              {alerts.length}
            </span>
          </span>
        )}
      </Button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-20"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="p-4 font-bold border-b">Notificações</div>
          <div className="max-h-96 overflow-y-auto">
            {alerts.length > 0 ? (
              alerts.map(alert => (
                <Link
                  key={alert.id}
                  to="/finances/late-fees" // Could also link to a specific student history
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-3 p-4 hover:bg-gray-100"
                >
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">{alert.studentName}</p>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="p-4 text-sm text-center text-gray-500">
                Nenhuma notificação nova.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
