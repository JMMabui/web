import { z } from 'zod'
import dayjs from 'dayjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  surname: z.string().min(1, { message: 'Apelido é obrigatório' }),
  name: z.string().min(1, { message: 'Nome é obrigatório' }),
  data_birth: z
    .string()
    .refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
      message: 'Data de nascimento inválida',
    }),
  gender: z.enum(['MASCULINO', 'FEMININO'], {
    errorMap: () => ({ message: 'Selecione um gênero' }),
  }),
  marital: z.enum(['SOLTERIO', 'CASADO', 'DIVORCIADO', 'VIUVO'], {
    errorMap: () => ({ message: 'Selecione um estado civil' }),
  }),
  provincyAddress: z.string().min(1, { message: 'Naturalidade é obrigatória' }),
  documentType: z.enum(['BI', 'PASSAPORTE'], { message: 'Selecione tipo de documento' }),
  documentNumber: z.string().min(1, { message: 'Número do documento é obrigatório' }),
  issueDate: z.string().refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
    message: 'Data de emissão inválida',
  }),
  expiryDate: z.string().refine(date => dayjs(date, 'YYYY-MM-DD', true).isValid(), {
    message: 'Data de expiração inválida',
  }),
  nuit: z.string().length(9, { message: 'NUIT deve ter exatamente 9 dígitos' }),
  address: z.string().min(1, { message: 'Endereço é obrigatório' }),
  fatherName: z.string().min(1, { message: 'Nome do pai é obrigatório' }),
  motherName: z.string().min(1, { message: 'Nome da mãe é obrigatório' }),
});



export function Personal_data() {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema), // Conecta o Zod com o React Hook Form
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // Lógica de envio do formulário
  };

  return (
    <div className="mt-10 sm:mx-auto mx-auto sm:w-full sm:max-w-2xl text-left border-b border-gray-900/10 pb-12">
      <h2 className="text-left text-base font-semibold text-gray-900">
        Formulário de Inscrição
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
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
                  <p className="text-red-500 text-sm">{errors.surname?.message?.toString()}</p>
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
                  <p className="text-red-500 text-sm">{errors.name?.message?.toString()}</p>
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
                {...register("data_birth")}
                type="date"
                autoComplete="date"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
              {errors.data_birth && (
                  <p className="text-red-500 text-sm">{errors.data_birth?.message?.toString()}</p>
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
                {...register("gender")}
                autoComplete="gender"
                className="w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              >
                <option value="default">-- Escolha Gênero --</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
              </select>
              {errors.gender && (
                  <p className="text-red-500 text-sm">{errors.gender?.message?.toString()}</p>
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
                {...register("marital")}
                autoComplete="marital"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              >
                <option value="default">-- Selecione --</option>
                <option value="SOLTERIO">Solteiro(a)</option>
                <option value="CASADO">Casado(a)</option>
                <option value="DIVORCIADO">Divorciado(a)</option>
                <option value="VIUVO">Viúvo(a)</option>
              </select>
              {errors.marital && (
                  <p className="text-red-500 text-sm">{errors.marital?.message?.toString()}</p>
                )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="naturalite"
              className="block text-sm font-medium text-gray-900"
            >
              Naturalidade
            </label>
            <div className="mt-2">
              <input
                id="naturalite"
               {...register("naturalite")}
                type="text"
                autoComplete="naturalite"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
              {errors.naturalite && (
                  <p className="text-red-500 text-sm">{errors.naturalite?.message?.toString()}</p>
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
              htmlFor="document-type"
              className="block text-sm font-medium text-gray-900"
            >
              Tipo de Documento
            </label>
            <div className="mt-2">
              <select
                id="documentType"
                {...register("documentType")}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              >
                <option value="BI">Bilhete de Identidade</option>
                <option value="PASSAPORTE">Passaporte</option>
              </select>
              {errors.documentType && (
                  <p className="text-red-500 text-sm">{errors.documentType?.message?.toString()}</p>
                )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="document_number"
              className="block text-sm font-medium text-gray-900"
            >
              Número do Documento
            </label>
            <div className="mt-2">
              <input
                id="document_number"
               {...register("documentNumber")}
                type="text"
                autoComplete="document_number"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
              {errors.documentNumber && (
                  <p className="text-red-500 text-sm">{errors.documentNumber?.message?.toString()}</p>
                )}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="issue-date"
              className="block text-sm font-medium text-gray-900"
            >
              Data de Emissão
            </label>
            <div className="mt-2">
              <input
                id="issue_date"
                {...register("issue_date")}
                type="date"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
              
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="expiry-date"
              className="block text-sm font-medium text-gray-900"
            >
              Data de Expiração
            </label>
            <div className="mt-2">
              <input
                id="expiry-date"
                {...register("expiry-date")}
                type="date"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
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
                {...register("nuit")}
                type="text"
                autoComplete="nuit"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
              {errors.nuit && (
                  <p className="text-red-500 text-sm">{errors.nuit?.message?.toString()}</p>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Endereço Atual */}
      <div className="mt-5">
        <h3 className="text-left text-lg font-semibold text-gray-900">
          Endereço Atual
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
                {...register("provincyAddress")}
                autoComplete="provincy-address"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              >
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
                  <p className="text-red-500 text-sm">{errors.provincyAddress?.message?.toString()}</p>
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
                {...register("address")}
                type="text"
                autoComplete="address"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
              {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address?.message?.toString()}</p>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Filiação */}
      <div className="mt-5">
        <h3 className="text-left text-lg font-semibold text-gray-900">
          Filiação
        </h3>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-4">
          <div className="sm:col-span-3">
            <label
              htmlFor="father-name"
              className="block text-sm font-medium text-gray-900"
            >
              Nome do Pai
            </label>
            <div className="mt-2">
              <input
                id="father-name"
                {...register("fatherName")}
                type="text"
                autoComplete="father-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
              {errors.fatherName && (
                  <p className="text-red-500 text-sm">{errors.fatherName?.message?.toString()}</p>
                )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="mother-name"
              className="block text-sm font-medium text-gray-900"
            >
              Nome da Mãe
            </label>
            <div className="mt-2">
              <input
                id="mother-name"
                {...register("motherName")}
                type="text"
                autoComplete="mother-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
              {errors.motherName && (
                  <p className="text-red-500 text-sm">{errors.motherName?.message?.toString()}</p>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-md"
          >
            Enviar
          </button>
        </div>


      </form>

    </div>
  )
}
