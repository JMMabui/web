import { useState } from 'react'
import { Education_Officer } from './education_officer'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  schoolLevel: z.enum(['CLASSE_10', 'CLASSE_12', 'LICENCIATURA'], {
    errorMap: () => ({ message: 'Selecione o nivel academico' }),
  }),
  schoolName: z.string().min(1, { message: 'Nome da Escola em falta' }),
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
        message: 'Selecione a provincia onde localiza-se a escola',
      }),
    }
  ),
  //   student_id: z.string(),
})

export function Pre_Instituto() {
  const [nivelAcademico, setNivelAcademico] = useState('')

  const isNivelAcademicoValid = () =>
    nivelAcademico !== '' && nivelAcademico !== 'null'

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema), // Conecta o Zod com o React Hook Form
  })

  const renderEncarregadoEducacao = () => (
    <div>
      <Education_Officer />
    </div>
  )

  function createPre(data: any) {
    console.log(data)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Pré-escola</h2>
      <form onSubmit={handleSubmit(createPre)}>
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {/* Campos do formulário de Pré-escola */}
          <div className="sm:col-span-1">
            <label
              htmlFor="schoolLevel"
              className="block text-sm font-medium text-gray-900"
            >
              Nível Acadêmico
            </label>
            <select
              id="schoolLevel"
              {...register('schoolLevel')}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              value={nivelAcademico}
              onChange={e => setNivelAcademico(e.target.value)} // Atualiza o nível acadêmico
            >
              <option value="null">-- Ensino Geral (equivalente) --</option>
              <option value="CLASSE_10">10 Classe</option>
              <option value="CLASSE_12">12 Classe</option>
              <option value="LICENCIATURA">Licenciatura</option>
            </select>
            {errors.schoolLevel && (
              <p className="text-red-500 text-sm">
                {errors.schoolLevel?.message?.toString()}
              </p>
            )}
          </div>

          {/* Outros campos */}
          <div className="sm:col-span-3">
            <label
              htmlFor="schoolName"
              className="block text-sm font-medium text-gray-900"
            >
              Escola
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

          <div className="sm:col-span-2">
            <label
              htmlFor="schoolProvincy"
              className="block text-sm font-medium text-gray-900"
            >
              Província
            </label>
            <select
              id="schoolProvincy"
              {...register('schoolProvincy')}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            >
              <option value="">-- Escolher --</option>
              <option value="MAPUTO_CIDADE">Maputo Cidade</option>
              <option value="MAPUTO_PROVINCIA">Maputo Provincia</option>
              <option value="GAZA">Gaza</option>
              <option value="INHAMBANE">Inhambane</option>
              <option value="SOFALA">Sofala</option>
              <option value="MANICA">Manica</option>
              <option value="TETE">Tete</option>
              <option value="ZAMBEZIA">Zambezia</option>
              <option value="NAMPULA">Nampula</option>
              <option value="CABO_DELGADO">Cabo Delgado</option>
              <option value="NIASSA">Niassa</option>
            </select>
            {errors.school && (
              <p className="text-red-500 text-sm">
                {errors.school?.message?.toString()}
              </p>
            )}
          </div>

          <div className="mt-5">
            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-indigo-500"
              disabled={Object.keys(errors).length > 0}
            >
              guardar
            </button>
          </div>
        </div>
      </form>

      {/* Exibe a parte do Encarregado de Educação se o nível acadêmico for "10 Classe" */}
      {nivelAcademico === 'CLASSE_10' && renderEncarregadoEducacao()}
    </div>
  )
}
