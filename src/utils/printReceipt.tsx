import { useRef } from 'react'
import { useReactToPrint } from 'react-to-print'
import { PaymentReceipt } from '../components/PaymentReceipt'
import { createRoot } from 'react-dom/client'

interface Payment {
  id: string
  studentName: string
  amount: number
  paymentDate: string
  method: string
  reference?: string
  status: string
}

interface SchoolInfo {
  name: string
  address: string
  phone: string
  email: string
}

export const usePrintReceipt = (schoolInfo: SchoolInfo) => {
  const receiptRef = useRef<HTMLDivElement>(null)

  const handlePrint = useReactToPrint({
    content: () => receiptRef.current,
    documentTitle: 'Recibo de Pagamento',
    removeAfterPrint: true,
  })

  const printReceipt = (payment: Payment) => {
    const tempDiv = document.createElement('div')
    tempDiv.style.display = 'none'
    document.body.appendChild(tempDiv)

    const root = createRoot(tempDiv)
    root.render(
      <PaymentReceipt
        ref={receiptRef}
        payment={payment}
        schoolInfo={schoolInfo}
      />
    )

    handlePrint()

    setTimeout(() => {
      root.unmount()
      document.body.removeChild(tempDiv)
    }, 100)
  }

  return { printReceipt }
}
