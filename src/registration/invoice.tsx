import { getRegistration } from '@/http/registration'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'

type Registration = {
  course_id: string
  student_id: string
  registrationStatus:
    | 'PENDENTE'
    | 'CONFIRMADO'
    | 'CANCELADO'
    | 'TRANCADO'
    | 'INSCRITO'
    | 'NAO_INSCRITO'
  student: {
    surname: string
    name: string
  }
  course: {
    courseName: string
    levelCourse:
      | 'CURTA_DURACAO'
      | 'TECNICO_MEDIO'
      | 'LICENCIATURA'
      | 'RELIGIOSO'
      | 'MESTRADO'
    period: 'LABORAL' | 'POS_LABORAL'
  }
}

type registrationResponse = {
  registration: Registration[]
}

export function Invoice() {
  const [paymentMethod, setPaymentMethod] = useState<string>('')
  const [studentId, setStudentId] = useState<string | null>(null)

  const {
    data: dataRegistration,
    error: RegistrationError,
    isLoading: isLoadingRegistration,
  } = useQuery<registrationResponse>({
    queryKey: ['Registration_data'],
    queryFn: getRegistration,
  })

  useEffect(() => {
    // Recupera o 'student_id' armazenado no localStorage
    const id = localStorage.getItem('student_id')
    setStudentId(id)
  }, [])

  if (isLoadingRegistration) return <div>Carregando cursos...</div>
  if (RegistrationError instanceof Error)
    return <div>Erro: {RegistrationError.message}</div>

  if (!dataRegistration) {
    return <div>Não há dados disponíveis no momento.</div>
  }

  // Filtra a inscrição para o aluno específico com base no 'student_id'
  const studentRegistration = dataRegistration.registration.find(
    registration => registration.student_id === studentId
  )

  if (!studentRegistration) {
    return <div>Aluno não encontrado.</div>
  }

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">Resumo da Inscrição</h2>

      {/* Dados Pessoais do Aluno */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Dados Pessoais:</h3>
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            <tr>
              <td className="p-2 font-medium text-gray-700">Nome:</td>
              <td className="p-2">{studentRegistration.student.name}</td>
            </tr>
            <tr>
              <td className="p-2 font-medium text-gray-700">Sobrenome:</td>
              <td className="p-2">{studentRegistration.student.surname}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Curso do Aluno */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Curso:</h3>
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            <tr className="border">
              <td className="p-2 font-medium text-gray-700">Curso:</td>
              <td className="p-2">{studentRegistration.course.courseName}</td>
            </tr>
            <tr className="border">
              <td className="p-2 font-medium text-gray-700">Nível:</td>
              <td className="p-2">{studentRegistration.course.levelCourse}</td>
            </tr>
            <tr className="border">
              <td className="p-2 font-medium text-gray-700">Período:</td>
              <td className="p-2">{studentRegistration.course.period}</td>
            </tr>
            <tr className="border">
              <td className="p-2 font-medium text-gray-700">
                Status de Inscrição:
              </td>
              <td className="p-2">{studentRegistration.registrationStatus}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Método de Pagamento */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Método de Pagamento:</h3>
        <select
          className="block w-full p-2 rounded-md border border-gray-300"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
        >
          <option value="">-- Selecione um método --</option>
          <option value="transferencia">Transferência Bancária</option>
          <option value="dinheiro">Depósito Bancário</option>
          <option value="cartao">Pagamento com Cartão de Crédito</option>
        </select>

        {paymentMethod && (
          <p className="mt-2 text-sm text-gray-700">
            Você escolheu: <span className="font-bold">{paymentMethod}</span>
          </p>
        )}
      </div>
    </div>
  )
}
