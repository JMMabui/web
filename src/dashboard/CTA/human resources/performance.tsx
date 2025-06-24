import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  getAllEmployees,
  type employeeExtended,
} from '@/http/employee/employee'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { User, PlusCircle, Star, MessageSquare, Calendar } from 'lucide-react'
import Button from '@/components/Button'
import Modal from '@/components/Modal'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Input from '@/components/Input'

// Schema for the review form
const reviewSchema = z.object({
  date: z.string().min(1, 'A data é obrigatória.'),
  score: z.coerce
    .number()
    .min(1, 'A pontuação mínima é 1.')
    .max(5, 'A pontuação máxima é 5.'),
  comments: z.string().min(1, 'O comentário é obrigatório.'),
})

type ReviewFormData = z.infer<typeof reviewSchema>

// Mock data for performance reviews - using state to make it mutable
const initialReviews = [
  {
    id: '1',
    employeeId: 'clxrzapcr000010v0g5v3c15g',
    date: '2023-10-26',
    score: 4,
    comments:
      'Excelente trabalho no último projeto. Demonstrou grande liderança.',
  },
  {
    id: '2',
    employeeId: 'clxrzapcr000010v0g5v3c15g',
    date: '2023-04-15',
    score: 3,
    comments: 'Bom desempenho, mas pode melhorar a comunicação com a equipa.',
  },
  {
    id: '3',
    employeeId: 'clxrzapvr000210v0j3qofsk1',
    date: '2023-09-01',
    score: 5,
    comments: 'Superou todas as expectativas. Contribuição fantástica.',
  },
]

export function Performance() {
  const [selectedEmployee, setSelectedEmployee] =
    useState<employeeExtended | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [reviews, setReviews] = useState(initialReviews)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  })

  const {
    data: employeesData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['employees'],
    queryFn: getAllEmployees,
  })

  const handleSelectEmployee = (employee: employeeExtended) => {
    setSelectedEmployee(employee)
  }

  const handleOpenModal = () => {
    reset() // Reset form when opening
    if (selectedEmployee) {
      setIsModalOpen(true)
    } else {
      alert('Por favor, selecione um funcionário primeiro.')
    }
  }

  const handleAddReview = (data: ReviewFormData) => {
    if (!selectedEmployee) return

    const newReview = {
      id: Math.random().toString(), // Not a great ID, but fine for mock
      employeeId: selectedEmployee.id,
      ...data,
    }
    setReviews(prevReviews => [...prevReviews, newReview])
    setIsModalOpen(false)
    reset()
  }

  const employeeReviews = selectedEmployee
    ? reviews.filter(review => review.employeeId === selectedEmployee.id)
    : []

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return (
      <div className="p-6 text-red-500">Erro ao carregar funcionários.</div>
    )
  }

  const employees = employeesData?.data ?? []

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Avaliação de Desempenho
        </h1>
        <p className="mt-2 text-gray-600">
          Selecione um funcionário para ver ou adicionar avaliações de
          desempenho.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Employee List */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Funcionários</h2>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {employees.map(employee => (
              <li key={employee.id}>
                <button
                  type="button"
                  onClick={() => handleSelectEmployee(employee)}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                    selectedEmployee?.id === employee.id
                      ? 'bg-blue-100 text-blue-800'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <span>{`${employee.user.name} ${employee.user.surname}`}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Performance Details */}
        <div className="md:col-span-2">
          {selectedEmployee ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                  {`Avaliações de ${selectedEmployee.user.name}`}
                </h2>
                <Button onClick={handleOpenModal}>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Adicionar Avaliação
                </Button>
              </div>

              {employeeReviews.length > 0 ? (
                <div className="space-y-6">
                  {employeeReviews.map(review => (
                    <div
                      key={review.id}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.score
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                              fill="currentColor"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-2 flex items-start gap-3">
                        <MessageSquare className="h-5 w-5 mt-1 text-gray-400" />
                        <p className="text-gray-700">{review.comments}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>
                    Nenhuma avaliação de desempenho encontrada para este
                    funcionário.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center bg-white p-6 rounded-lg shadow-md h-full">
              <p className="text-gray-500">
                Selecione um funcionário para começar.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Review Modal */}
      {selectedEmployee && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Adicionar Avaliação para ${selectedEmployee.user.name}`}
        >
          <form onSubmit={handleSubmit(handleAddReview)} className="space-y-4">
            <Input
              id="date"
              type="date"
              label="Data"
              {...register('date')}
              error={errors.date?.message}
            />
            <Input
              id="score"
              type="number"
              label="Pontuação (1-5)"
              {...register('score')}
              error={errors.score?.message}
            />
            <div>
              <label
                htmlFor="comments"
                className="block text-sm font-medium text-gray-700"
              >
                Comentários
              </label>
              <textarea
                id="comments"
                rows={4}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                {...register('comments')}
              />
              {errors.comments && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.comments.message}
                </p>
              )}
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button type="submit">Salvar Avaliação</Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
