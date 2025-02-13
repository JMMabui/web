import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  createPreInstituto,
  getPreInstituto,
} from '@/http/signup/pre_instituto'
import { Education_Officer } from './education_officer'
import { Inscricao } from './course'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

// Validação com Zod
const schema = z.object({
  schoolLevel: z.enum(['CLASSE_10', 'CLASSE_12', 'LICENCIATURA'], {
    errorMap: () => ({ message: 'Selecione o nível acadêmico' }),
  }),
  schoolName: z.string().min(1, { message: 'Nome da Escola é obrigatório' }),
  schoolProvincy: z.enum(
    [
      'MAPUTO_CIDADE',
      'MAPUTO_PROVINCIA',
      'GAZA',
      'INHAMBANE',
      'MANICA',
      'SOFALA',
      'TETE',
      'ZAMBEZIA',
      'NAMPULA',
      'CABO_DELGADO',
      'NIASSA',
    ],
    {
      errorMap: () => ({
        message: 'Selecione a província onde a escola está localizada',
      }),
    }
  ),
})

type PreInstituto = {
  student_id: string
  id: string
  createdAt: Date
  updatedAt: Date
  schoolLevel: 'CLASSE_10' | 'CLASSE_12' | 'LICENCIATURA'
  schoolName: string
  schoolProvincy:
    | 'MAPUTO_CIDADE'
    | 'MAPUTO_PROVINCIA'
    | 'GAZA'
    | 'INHAMBANE'
    | 'MANICA'
    | 'SOFALA'
    | 'TETE'
    | 'ZAMBEZIA'
    | 'NAMPULA'
    | 'CABO_DELGADO'
    | 'NIASSA'
}
type PreInstitutoResponse = {
  preInstituto: PreInstituto[]
}

type DataSchema = z.infer<typeof schema>

// Função para obter o ID do estudante do localStorage
const getStudentIdFromStorage = () => {
  const studentId = localStorage.getItem('student_id')
  if (!studentId) {
    throw new Error('Estudante ID não encontrado no localStorage')
  }
  return studentId
}

function SuccessModal({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <Inscricao />
    </div>
  )
}

export function Pre_Instituto() {
  const [nivelAcademico, setNivelAcademico] = useState('')
  const [provincia, setProvincia] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isStudentRegistered, setIsStudentRegistered] = useState(false)

  const navigate = useNavigate()

  const studentId = getStudentIdFromStorage()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DataSchema>({
    resolver: zodResolver(schema), // Conecta o Zod com o React Hook Form
  })

  const { data: dataPreInstituto } = useQuery<PreInstitutoResponse>({
    queryKey: ['preInstituto_data'],
    queryFn: getPreInstituto,
  })

  // Função para renderizar os campos de formulário
  const renderSelectField = (
    label: string,
    id: keyof DataSchema,
    options: string[],
    value: string,
    onChange: React.ChangeEventHandler<HTMLSelectElement>
  ) => (
    <div className="sm:col-span-1">
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <select
        id={id}
        {...register(id)}
        className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
        value={value}
        onChange={onChange}
      >
        <option value="">-- Selecione --</option>
        {options.map(option => (
          <option key={option} value={option}>
            {option.replace('_', ' ').charAt(0).toUpperCase() +
              option.replace('_', ' ').slice(1).toLowerCase()}
          </option>
        ))}
      </select>
      {errors[id] && (
        <p className="text-red-500 text-sm">
          {errors[id]?.message?.toString()}
        </p>
      )}
    </div>
  )

  // Função para submeter o formulário
  const createPre = async (data: DataSchema) => {
    // Verifique se o estudante já está registrado
    // const isRegistered = dataPreInstituto?.preInstituto.find(
    //   student_id_pre => student_id_pre.student_id === studentId
    // )

    // if (isRegistered) {
    //   setIsStudentRegistered(true)
    //   navigate('/registration/course')
    //   return // Não continua com a submissão se o estudante já estiver registrado
    // }

    try {
      await createPreInstituto({
        schoolLevel: data.schoolLevel,
        schoolName: data.schoolName,
        schoolProvincy: data.schoolProvincy,
        student_id: studentId,
      })

      navigate('/registration/course')
    } catch (error) {
      console.error('Erro ao criar pré-instituto', error)
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Pré-escola</h2>
      {isStudentRegistered && (
        <p className="text-red-500">Estudante já registrado!</p>
      )}
      <form onSubmit={handleSubmit(createPre)}>
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {/* Nível Acadêmico */}
          {renderSelectField(
            'Nível Acadêmico',
            'schoolLevel',
            ['CLASSE_10', 'CLASSE_12', 'LICENCIATURA'],
            nivelAcademico,
            e => setNivelAcademico(e.target.value)
          )}

          {/* Nome da Escola */}
          <div className="sm:col-span-3">
            <label
              htmlFor="schoolName"
              className="block text-sm font-medium text-gray-900 capitalize"
            >
              Nome da Escola
            </label>
            <input
              id="schoolName"
              {...register('schoolName')}
              type="text"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              placeholder="Nome da escola"
            />
            {errors.schoolName && (
              <p className="text-red-500 text-sm">
                {errors.schoolName?.message?.toString()}
              </p>
            )}
          </div>

          {/* Província */}
          {renderSelectField(
            'Província',
            'schoolProvincy',
            [
              'MAPUTO_CIDADE',
              'MAPUTO_PROVINCIA',
              'GAZA',
              'INHAMBANE',
              'MANICA',
              'SOFALA',
              'TETE',
              'ZAMBEZIA',
              'NAMPULA',
              'CABO_DELGADO',
              'NIASSA',
            ],
            provincia,
            e => setProvincia(e.target.value)
          )}

          <div className="sm:col-span-6">
            {/* Exibe a parte do Encarregado de Educação se o nível acadêmico for "10 Classe" */}
            {nivelAcademico === 'CLASSE_10' && <Education_Officer />}
          </div>

          {/* Botão de submissão */}
          <div className="mt-5">
            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-1 rounded-md hover:bg-indigo-500"
              disabled={Object.keys(errors).length > 0}
            >
              Enviar
            </button>
          </div>
        </div>
      </form>

      {isModalOpen && <SuccessModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
