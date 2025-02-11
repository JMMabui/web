import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Lista de províncias
const provinces = [
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
] as const

const ProvinceEnum = z.enum(provinces)

const schema = z.object({
  fullName: z.string().min(1, { message: 'Nome é obrigatório' }),
  profession: z.string().min(1, { message: 'Profissão é obrigatória' }),
  dataOfBirth: z
    .string()
    .min(1, { message: 'Data de nascimento é obrigatória' })
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Formato de data inválido. Esperado: YYYY-MM-DD',
    }),
  email: z.string().email({ message: 'E-mail inválido' }).optional(), // Tornando o e-mail opcional
  contact: z.string().min(1, { message: 'Telefone é obrigatório' }),
  provincyAddress: ProvinceEnum.refine(value => value.length > 0, {
    message: 'Província é obrigatória',
  }),
  address: z.string().min(1, { message: 'Endereço é obrigatório' }),
})

export function Education_Officer() {
  type dataSchema = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<dataSchema>({
    resolver: zodResolver(schema), // Conecta o Zod com o React Hook Form
    mode: 'onBlur', // Validação ao sair do campo
  })

  const onSubmit = (data: dataSchema) => {
    console.log(data)
  }

  return (
    <div>
      <h2 className="mt-5 text-lg font-semibold mb-6">
        Encarregado de Educação
      </h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
      >
        {/* Campos para Encarregado de Educação */}
        <div className="sm:col-span-3">
          <label
            htmlFor="fullName"
            className="block text-sm font-medium text-gray-900"
          >
            Nome Completo
          </label>
          <input
            id="fullName"
            {...register('fullName')}
            type="text"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            placeholder="Nome do encarregado de educação"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="profession"
            className="block text-sm font-medium text-gray-900"
          >
            Profissão
          </label>
          <input
            id="profession"
            {...register('profession')}
            type="text"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            placeholder="Profissão do encarregado"
          />
          {errors.profession && (
            <p className="text-red-500 text-sm">{errors.profession.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="dataOfBirth"
            className="block text-sm font-medium text-gray-900"
          >
            Data de Nascimento
          </label>
          <input
            id="dataOfBirth"
            {...register('dataOfBirth')}
            type="date"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
          />
          {errors.dataOfBirth && (
            <p className="text-red-500 text-sm">{errors.dataOfBirth.message}</p>
          )}
        </div>

        {/* Campos de Contato */}
        <div className="sm:col-span-2">
          <label
            htmlFor="contact"
            className="block text-sm font-medium text-gray-900"
          >
            Telefone
          </label>
          <input
            id="contact"
            {...register('contact')}
            type="tel"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            placeholder="Telefone de contato"
          />
          {errors.contact && (
            <p className="text-red-500 text-sm">{errors.contact.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-900"
          >
            E-mail (opcional)
          </label>
          <input
            id="email"
            {...register('email')}
            type="email"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            placeholder="E-mail de contato (opcional)"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Campos de Endereço */}
        <div className="sm:col-span-3">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-900"
          >
            Endereço
          </label>
          <input
            id="address"
            {...register('address')}
            type="text"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            placeholder="Endereço completo"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="provincyAddress"
            className="block text-sm font-medium text-gray-900"
          >
            Província
          </label>
          <select
            id="provincyAddress"
            {...register('provincyAddress')}
            className="block w-full rounded-md bg-white px-3 py-2.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
          >
            <option value="">-- Escolher --</option>
            {provinces.map(province => (
              <option key={province} value={province}>
                {province.replace('_', ' ')}
              </option>
            ))}
          </select>
          {errors.provincyAddress && (
            <p className="text-red-500 text-sm">
              {errors.provincyAddress.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-6">
          <button
            type="button"
            className="w-40 bg-yellow-600 text-white py-2 rounded-md hover:bg-indigo-500"
            disabled={Object.keys(errors).length > 0} // desabilita se o formulário não for válido ou está sendo enviado
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  )
}
