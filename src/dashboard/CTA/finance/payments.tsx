import { useQuery } from '@tanstack/react-query'
import { getAllInvoice, invoiceExtendedResponse } from '@/http/finances/invoices'
import { Table } from '@/components/Table'
import { Column } from 'react-table'
import { useState } from 'react'
import { PaymentForm } from '../../../components/paymentForm' // componente do formulário de pagamento

const capitalizeWithAccents = (text: string) => {
  if (!text) return ''
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toLocaleUpperCase('pt-BR') + word.slice(1))
    .join(' ')
}


export function PaymentsFinances() {
  const { data: faturas, isLoading, isError } = useQuery({
    queryKey: ['invoice'],
    queryFn: getAllInvoice,
  })


  const [selectedInvoice, setSelectedInvoice] = useState<invoiceExtendedResponse | null>(null)

  const columns: Column<invoiceExtendedResponse>[] = [
    {
      Header: 'Nome do Estudante',
      accessor: row => capitalizeWithAccents(`${row.student.name} ${row.student.surname}`),
    },
    {
      Header: 'Valor',
      accessor: 'amount',
      Cell: ({ value }: { value: number }) => `${value.toFixed(2)} MT`,
    },
    {
  Header: 'Mês',
  accessor: row => capitalizeWithAccents(row.month),
},
   {
  Header: 'Status',
  accessor: row => capitalizeWithAccents(row.status),
},
   {
  Header: 'Multa',
  accessor: row =>
    row.LateFee && row.LateFee.length > 0
      ? row.LateFee.reduce((total, late) => total + late.amount, 0)
      : 0,
  Cell: ({ value }:{value: number}) => `${value.toFixed(2)} MT`,
}
,
    {
      Header: 'Ação',
      id: 'acao',
      Cell: ({ row }) => (
        <button
          onClick={() => setSelectedInvoice(row.original)}
          className="px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Pagamento
        </button>
      ),
    },
  ]

  if (isLoading) return <p>Carregando...</p>
  if (isError) return <p>Erro ao carregar faturas</p>

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-semibold text-gray-800">📄 Faturas</h2>

      <Table columns={columns} data={faturas ?? []} title="Lista de Faturas" />

      {selectedInvoice && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Registrar Pagamento</h3>
          <PaymentForm invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
        </div>
      )}
    </div>
  )
}
