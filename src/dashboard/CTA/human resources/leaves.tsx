import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getAllEmployees,
  type employeeExtended,
} from '@/http/employee/employee'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { PlusCircle, Filter, Check, X } from 'lucide-react'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '@/components/Input'
import SelectField from '@/components/selectField'

type LeaveStatus = 'PENDENTE' | 'APROVADO' | 'REJEITADO'
type LeaveType =
  | 'FÉRIAS'
  | 'LICENÇA MÉDICA'
  | 'LICENÇA SEM VENCIMENTO'
  | 'OUTRO'

interface LeaveRequest {
  id: string
  employeeId: string
  type: LeaveType
  startDate: string
  endDate: string
  status: LeaveStatus
  comments?: string
}

// Mock data for leave requests
const initialLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: 'clxrzapcr000010v0g5v3c15g',
    type: 'FÉRIAS',
    startDate: '2024-08-01',
    endDate: '2024-08-15',
    status: 'APROVADO',
  },
  {
    id: '2',
    employeeId: 'clxrzapvr000210v0j3qofsk1',
    type: 'LICENÇA MÉDICA',
    startDate: '2024-07-20',
    endDate: '2024-07-22',
    status: 'PENDENTE',
    comments: 'Consulta médica de rotina.',
  },
  {
    id: '3',
    employeeId: 'clxs1p40p000410v0i6hmflil',
    type: 'FÉRIAS',
    startDate: '2024-09-01',
    endDate: '2024-09-10',
    status: 'REJEITADO',
    comments: 'Período de alta demanda no departamento.',
  },
  {
    id: '4',
    employeeId: 'clxs1pck8000610v0g6g7irsz',
    type: 'FÉRIAS',
    startDate: '2024-07-25',
    endDate: '2024-07-30',
    status: 'PENDENTE',
  },
]

const leaveSchema = z
  .object({
    employeeId: z.string().min(1, 'É obrigatório selecionar um funcionário.'),
    type: z.enum([
      'FÉRIAS',
      'LICENÇA MÉDICA',
      'LICENÇA SEM VENCIMENTO',
      'OUTRO',
    ]),
    startDate: z.string().min(1, 'A data de início é obrigatória.'),
    endDate: z.string().min(1, 'A data de fim é obrigatória.'),
    comments: z.string().optional(),
  })
  .refine(data => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'A data de fim não pode ser anterior à data de início.',
    path: ['endDate'],
  })

type LeaveFormData = z.infer<typeof leaveSchema>

const statusStyles: { [key in LeaveStatus]: string } = {
  PENDENTE: 'bg-yellow-100 text-yellow-800',
  APROVADO: 'bg-green-100 text-green-800',
  REJEITADO: 'bg-red-100 text-red-800',
}

export function Leaves() {
  const [requests, setRequests] = useState(initialLeaveRequests)
  const [filter, setFilter] = useState<LeaveStatus | 'TODOS'>('TODOS')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
  })

  const { data: employeesData, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: getAllEmployees,
  })

  const getEmployeeName = (employeeId: string) => {
    const employee = employeesData?.data?.find(emp => emp.id === employeeId)
    return employee
      ? `${employee.user.name} ${employee.user.surname}`
      : 'Desconhecido'
  }

  const handleAddRequest = (data: LeaveFormData) => {
    const newRequest: LeaveRequest = {
      id: Math.random().toString(),
      status: 'PENDENTE',
      ...data,
    }
    setRequests(prev => [newRequest, ...prev])
    setIsModalOpen(false)
    reset()
  }

  const handleUpdateRequestStatus = (id: string, status: LeaveStatus) => {
    setRequests(prev =>
      prev.map(req => (req.id === id ? { ...req, status } : req))
    )
  }

  const filteredRequests =
    filter === 'TODOS'
      ? requests
      : requests.filter(req => req.status === filter)

  if (isLoadingEmployees) {
    return <LoadingSpinner />
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Gestão de Férias e Licenças
          </h1>
          <p className="mt-2 text-gray-600">
            Aprove ou rejeite os pedidos de férias e licenças dos funcionários.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <PlusCircle className="mr-2 h-5 w-5" />
          Novo Pedido
        </Button>
      </header>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <Filter className="h-5 w-5 text-gray-500" />
        <div className="flex gap-2">
          {(['TODOS', 'PENDENTE', 'APROVADO', 'REJEITADO'] as const).map(
            status => (
              <button
                key={status}
                type="button"
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  filter === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            )
          )}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left font-semibold text-gray-600">
                Funcionário
              </th>
              <th className="p-4 text-left font-semibold text-gray-600">
                Tipo
              </th>
              <th className="p-4 text-left font-semibold text-gray-600">
                Período
              </th>
              <th className="p-4 text-center font-semibold text-gray-600">
                Status
              </th>
              <th className="p-4 text-center font-semibold text-gray-600">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map(req => (
              <tr
                key={req.id}
                className="border-b last:border-none hover:bg-gray-50"
              >
                <td className="p-4">{getEmployeeName(req.employeeId)}</td>
                <td className="p-4">{req.type}</td>
                <td className="p-4">{`${new Date(req.startDate).toLocaleDateString()} - ${new Date(req.endDate).toLocaleDateString()}`}</td>
                <td className="p-4 text-center">
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full ${statusStyles[req.status]}`}
                  >
                    {req.status}
                  </span>
                </td>
                <td className="p-4">
                  {req.status === 'PENDENTE' && (
                    <div className="flex justify-center gap-2">
                      <Button
                        onClick={() =>
                          handleUpdateRequestStatus(req.id, 'APROVADO')
                        }
                        variant="outline"
                        size="sm"
                        className="border-green-500 text-green-600 hover:bg-green-50"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() =>
                          handleUpdateRequestStatus(req.id, 'REJEITADO')
                        }
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-600 hover:bg-red-50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredRequests.length === 0 && (
          <div className="text-center p-8 text-gray-500">
            Nenhum pedido encontrado para o filtro selecionado.
          </div>
        )}
      </div>

      {/* Add Leave Request Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Criar Novo Pedido de Licença"
      >
        <form onSubmit={handleSubmit(handleAddRequest)} className="space-y-4">
          <SelectField
            id="employeeId"
            label="Funcionário"
            {...register('employeeId')}
            error={errors.employeeId?.message}
            options={
              employeesData?.data?.map(emp => ({
                value: emp.id,
                label: `${emp.user.name} ${emp.user.surname}`,
              })) ?? []
            }
          >
            <option value="">Selecione um funcionário</option>
          </SelectField>

          <SelectField
            id="type"
            label="Tipo de Licença"
            {...register('type')}
            error={errors.type?.message}
            options={[
              { value: 'FÉRIAS', label: 'Férias' },
              { value: 'LICENÇA MÉDICA', label: 'Licença Médica' },
              {
                value: 'LICENÇA SEM VENCIMENTO',
                label: 'Licença sem Vencimento',
              },
              { value: 'OUTRO', label: 'Outro' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="startDate"
              type="date"
              label="Data de Início"
              {...register('startDate')}
              error={errors.startDate?.message}
            />
            <Input
              id="endDate"
              type="date"
              label="Data de Fim"
              {...register('endDate')}
              error={errors.endDate?.message}
            />
          </div>
          {errors.endDate && (
            <p className="text-sm text-red-500">{errors.endDate.message}</p>
          )}

          <div>
            <label
              htmlFor="comments"
              className="block text-sm font-medium text-gray-700"
            >
              Comentários
            </label>
            <textarea
              id="comments"
              rows={3}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              {...register('comments')}
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              onClick={() => setIsModalOpen(false)}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button type="submit">Criar Pedido</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
