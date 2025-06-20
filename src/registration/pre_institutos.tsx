import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createPreInstituto } from '@/http/signup/pre_instituto'
import { Education_Officer } from './education_officer'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { LoadingSpinner } from '@/components/LoadingSpinner'

// Validação com Zod
const schema = z.object({
  schoolLevel: z.enum(['CLASSE_10', 'CLASSE_12', 'LICENCIATURA'], {
    errorMap: () => ({ message: 'Selecione o nível acadêmico' }),
  }),
  schoolName: z
    .string()
    .min(1, { message: 'Nome da Escola é obrigatório' })
    .max(100, { message: 'Nome da escola deve ter no máximo 100 caracteres' })
    .transform(val => val.trim()),
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
type DataSchema = z.infer<typeof schema>

interface PreInstitutoProps {
  onComplete: () => void
  onBack: () => void
}

export function Pre_Instituto({ onComplete, onBack }: PreInstitutoProps) {
  const [nivelAcademico, setNivelAcademico] = useState('')
  const [provincia, setProvincia] = useState('')
  const [studentId, setStudentId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    setStudentId(localStorage.getItem('student_id'))

    // Carregar dados salvos se existirem
    const savedData = localStorage.getItem('pre_instituto_data')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setNivelAcademico(parsedData.schoolLevel || '')
      setProvincia(parsedData.schoolProvincy || '')
      setValue('schoolName', parsedData.schoolName || '')
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<DataSchema>({
    resolver: zodResolver(schema),
  })

  // Salvar dados no localStorage quando houver mudanças
  useEffect(() => {
    const subscription = watch(value => {
      if (value.schoolLevel || value.schoolName || value.schoolProvincy) {
        localStorage.setItem('pre_instituto_data', JSON.stringify(value))
        setHasUnsavedChanges(true)
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

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
        className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm ${
          errors[id] ? 'border-red-500' : ''
        }`}
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
        <p className="text-red-500 text-sm mt-1">
          {errors[id]?.message?.toString()}
        </p>
      )}
    </div>
  )

  // Função para submeter o formulário
  const createPre = async (data: DataSchema) => {
    if (!studentId) {
      toast.error(
        'ID do estudante não encontrado. Por favor, volte e preencha os dados pessoais.'
      )
      navigate('/registration/person-data')
      return
    }

    try {
      setIsLoading(true)
      await createPreInstituto({
        schoolLevel: data.schoolLevel,
        schoolName: data.schoolName,
        schoolProvincy: data.schoolProvincy,
        studentId,
      })

      localStorage.removeItem('pre_instituto_data')
      setHasUnsavedChanges(false)
      onComplete()
      toast.success('Dados da pré-escola salvos com sucesso!')
    } catch (error) {
      console.error('Erro ao criar pré-instituto', error)
      toast.error('Erro ao salvar os dados. Por favor, tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Pré-escola</h2>
        <p className="text-sm text-gray-600">
          Preencha os dados da sua formação pré-universitária
        </p>
      </div>

      <form onSubmit={handleSubmit(createPre)} className="space-y-6">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
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
              className={`block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm ${
                errors.schoolName ? 'border-red-500' : ''
              }`}
              placeholder="Nome da escola"
            />
            {errors.schoolName && (
              <p className="text-red-500 text-sm mt-1">
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
          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Voltar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner className="mr-2" />
                  Processando...
                </>
              ) : (
                'Salvar e Continuar'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
