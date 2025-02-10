import { z } from 'zod'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createStudentData } from '@/http/signup/personal_data'

const schema = z.object({
  surname: z.string().min(1, { message: 'Apelido é obrigatório' }),
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  data_birth: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Data de nascimento inválida',
    }),
  place_birth: z.string(),
  gender: z.enum(['MASCULINO', 'FEMININO'], {
    errorMap: () => ({ message: 'Selecione um gênero' }),
  }),
  marital: z.enum(['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO'], {
    errorMap: () => ({ message: 'Selecione um estado civil' }),
  }),
  provincyAddress: z.enum(
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
    { errorMap: () => ({ message: 'Selecione uma província válida' }) }
  ),
  documentType: z.enum(['BI', 'PASSAPORTE'], {
    message: 'Selecione tipo de documento',
  }),
  documentNumber: z
    .string()
    .min(1, { message: 'Número do documento é obrigatório' }),
  issueDate: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Data de emissão inválida',
    }),
  expiryDate: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Data de expiração inválida',
    }),
  nuit: z.string().length(9, { message: 'NUIT deve ter exatamente 9 dígitos' }),
  address: z.string().min(1, { message: 'Endereço é obrigatório' }),
  fatherName: z.string().min(1, { message: 'Nome do pai é obrigatório' }),
  motherName: z.string().min(1, { message: 'Nome da mãe é obrigatório' }),
})

const getLoginIdFromStorage = () => {
  const loginId = localStorage.getItem('login_id')
  if (!loginId) {
    throw new Error('Login ID não encontrado no localStorage')
  }
  return loginId
}

export function Personal_data() {
  type dataSchema = z.infer<typeof schema>

  const loginId = getLoginIdFromStorage()
  console.log('login_id: ', loginId)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<dataSchema>({
    resolver: zodResolver(schema), // Conecta o Zod com o React Hook Form
  })

  console.log('Erros de Validacao: ', errors)

  async function handlerCreateStudent(data: dataSchema) {
    try {
      console.log('Formulário enviado', data)

      // Enviar dados para a API
      const studentResponse = await createStudentData({
        surname: data.surname,
        name: data.name,
        dataOfBirth: new Date(data.data_birth),
        placeOfBirth: data.place_birth,
        gender: data.gender,
        maritalStatus: data.marital,
        provincyAddress: data.provincyAddress,
        address: data.address,
        fatherName: data.fatherName,
        motherName: data.motherName,
        documentType: data.documentType,
        documentNumber: data.documentNumber,
        documentIssuedAt: new Date(data.issueDate),
        documentExpiredAt: new Date(data.expiryDate),
        nuit: Number(data.nuit),
        login_id: loginId, // Certifique-se de que loginId esteja disponível no seu escopo
      })

      console.log('Dados enviados com sucesso', studentResponse)

      // Agora você pode armazenar o ID no localStorage ou fazer qualquer outra ação necessária
      localStorage.setItem('student_id', studentResponse.toString())
    } catch (error) {
      console.error('Erro ao enviar os dados:', error)
    }
  }

  // const studentId = localStorage.getItem('student_id')
  // console.log('Student id: ', studentId)

  return (
    <div className="mt-10 sm:mx-auto mx-auto sm:w-full sm:max-w-2xl text-left border-b border-gray-900/10 pb-12">
      <form onSubmit={handleSubmit(handlerCreateStudent)}>
        {/* Dados Pessoais */}
        <div className="mt-5">
          <h3 className="text-left text-lg font-semibold text-gray-900">
            Dados Pessoais
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="surname"
                className="block text-sm font-medium text-gray-900"
              >
                Apelido
              </label>
              <div className="mt-2">
                <input
                  id="surname"
                  type="text"
                  {...register('surname')}
                  autoComplete="family-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
                {errors.surname && (
                  <p className="text-red-500 text-sm">
                    {errors.surname?.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-900"
              >
                Nome (sem apelido)
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  autoComplete="given-name"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">
                    {errors.name?.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="data_birth"
                className="block text-sm font-medium text-gray-900"
              >
                Data de Nascimento
              </label>
              <div className="mt-2">
                <input
                  id="data_birth"
                  {...register('data_birth')}
                  type="date"
                  autoComplete="date"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
                {errors.data_birth && (
                  <p className="text-red-500 text-sm">
                    {errors.data_birth?.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2 sm:col-start-1">
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-900"
              >
                Gênero
              </label>
              <div className="mt-2">
                <select
                  id="gender"
                  {...register('gender')}
                  autoComplete="gender"
                  className="w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                >
                  <option value="">-- Escolha Gênero --</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMININO">Feminino</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-sm">
                    {errors.gender?.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="marital"
                className="block text-sm font-medium text-gray-900"
              >
                Estado Civil
              </label>
              <div className="mt-2">
                <select
                  id="marital"
                  {...register('marital')}
                  autoComplete="marital"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                >
                  <option value="">-- Selecione --</option>
                  <option value="SOLTEIRO">Solteiro(a)</option>
                  <option value="CASADO">Casado(a)</option>
                  <option value="DIVORCIADO">Divorciado(a)</option>
                  <option value="VIUVO">Viúvo(a)</option>
                </select>
                {errors.marital && (
                  <p className="text-red-500 text-sm">
                    {errors.marital?.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="place_birth"
                className="block text-sm font-medium text-gray-900"
              >
                Naturalidade
              </label>
              <div className="mt-2">
                <input
                  id="place_birth"
                  {...register('place_birth')}
                  type="text"
                  autoComplete="place_birth"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
                {errors.place_birth && (
                  <p className="text-red-500 text-sm">
                    {errors.place_birth?.message?.toString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Documentos */}
        <div className="mt-5">
          <h3 className="text-left text-lg font-semibold text-gray-900">
            Documentos
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="documentType"
                className="block text-sm font-medium text-gray-900"
              >
                Tipo de Documento
              </label>
              <div className="mt-2">
                <select
                  id="documentType"
                  {...register('documentType')}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                >
                  <option value="BI">Bilhete de Identidade</option>
                  <option value="PASSAPORTE">Passaporte</option>
                </select>
                {errors.documentType && (
                  <p className="text-red-500 text-sm">
                    {errors.documentType?.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="documentNumber"
                className="block text-sm font-medium text-gray-900"
              >
                Número do Documento
              </label>
              <div className="mt-2">
                <input
                  id="documentNumber"
                  {...register('documentNumber')}
                  type="text"
                  autoComplete="document_number"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
                {errors.documentNumber && (
                  <p className="text-red-500 text-sm">
                    {errors.documentNumber?.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="issueDate"
                className="block text-sm font-medium text-gray-900"
              >
                Data de Emissão
              </label>
              <div className="mt-2">
                <input
                  id="issueDate"
                  {...register('issueDate')}
                  type="date"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
                {errors.issueDate && (
                  <p className="text-red-500 text-sm">
                    {errors.issueDate?.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="expiryDate"
                className="block text-sm font-medium text-gray-900"
              >
                Data de Expiração
              </label>
              <div className="mt-2">
                <input
                  id="expiryDate"
                  {...register('expiryDate')}
                  type="date"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-sm">
                    {errors.expiryDate?.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="nuit"
                className="block text-sm font-medium text-gray-900"
              >
                NUIT
              </label>
              <div className="mt-2">
                <input
                  id="nuit"
                  {...register('nuit')}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
                {errors.nuit && (
                  <p className="text-red-500 text-sm">
                    {errors.nuit?.message?.toString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="mt-5">
          <h3 className="text-left text-lg font-semibold text-gray-900">
            Endereço
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-4">
            <div className="sm:col-span-2">
              <label
                htmlFor="provincy-address"
                className="block text-sm font-medium text-gray-900"
              >
                Província
              </label>
              <div className="mt-2">
                <select
                  id="provincy-address"
                  {...register('provincyAddress')}
                  autoComplete="provincy-address"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
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
                {errors.provincyAddress && (
                  <p className="text-red-500 text-sm">
                    {errors.provincyAddress?.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-900"
              >
                Endereço
              </label>
              <div className="mt-2">
                <input
                  id="address"
                  {...register('address')}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
                {errors.address && (
                  <p className="text-red-500 text-sm">
                    {errors.address?.message?.toString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Informações dos Pais */}
        <div className="mt-5">
          <h3 className="text-left text-lg font-semibold text-gray-900">
            Informações dos Pais
          </h3>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-4">
            <div className="sm:col-span-3">
              <label
                htmlFor="fatherName"
                className="block text-sm font-medium text-gray-900"
              >
                Nome do Pai
              </label>
              <div className="mt-2">
                <input
                  id="fatherName"
                  {...register('fatherName')}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
                {errors.fatherName && (
                  <p className="text-red-500 text-sm">
                    {errors.fatherName?.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="motherName"
                className="block text-sm font-medium text-gray-900"
              >
                Nome da Mãe
              </label>
              <div className="mt-2">
                <input
                  id="motherName"
                  {...register('motherName')}
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
                {errors.motherName && (
                  <p className="text-red-500 text-sm">
                    {errors.motherName?.message?.toString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* {Botao para submeter os dados} */}
        <div className="mt-5">
          <button
            type="submit"
            className="w-full bg-yellow-600 text-white py-2 rounded-md hover:bg-indigo-500"
            disabled={Object.keys(errors).length > 0}
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  )
}
