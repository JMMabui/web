import ErrorMessage from "@/component/error-message"
import { addStudentData } from "@/http/signup/personal_data"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { z } from "zod"

const schema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  contact: z.string().min(1, { message: 'Contacto é obrigatório' }),
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


export function AddStudents() {

  type dataSchema = z.infer<typeof schema>
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<dataSchema>({
        resolver: zodResolver(schema),
        mode: 'onSubmit',
    })

    const onSubmit = async (data: dataSchema) => {
      // console.log('Dados Recebidos do formulario: ', data);
    
      try {
        // Enviar dados para a API
        const studentResponse = await addStudentData({
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
          documentExpiredAt: new Date(data.expiryDate), // Add documentExpiredAt property
          nuit: Number(data.nuit), // Convert nuit to number
          email: data.email,
          contact: data.contact,
        });
    
        console.log('Resposta da API de Dados Submetidos:', studentResponse.id);
        // Redirecionar para a próxima etapa
        navigate(`/academic_record/student_ar/add_student/addcourse/${studentResponse.id}`);
      } catch (error) {
        console.error('Erro ao criar estudante:', error);
        alert('Ocorreu um erro ao tentar criar o estudante. Tente novamente.');
      }
    
      // Validar se o formulário está correto antes de navegação
      if (!isValid) {
        // Mensagem de erro 
        alert('Por favor, corrija os erros no formulário antes de continuar.');

        // Se o formulário não está válido, não navegue
        return;
        
      }
    };
    
    // Função para renderizar campos de entrada
function renderInputField(id: keyof dataSchema, label: string, type: string, autoComplete: string, placeholder: string = '') {
  return (
    <div className="sm:col-span-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">{label}</label>
      <div className="mt-2">
        <input
          id={id}
          type={type}
          {...register(id)}
          autoComplete={autoComplete}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
          placeholder={placeholder}
        />
        {errors[id] && <ErrorMessage error={{ message: errors[id]?.message }} />}
      </div>
    </div>
  );
}

// Função para renderizar campos de seleção
function renderSelectField(id: keyof dataSchema, label: string, options: string[]) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">{label}</label>
      <div className="mt-2">
        <select
          id={id}
          {...register(id)}
          className="w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
        >
          <option value="">-- Selecione --</option>
          {options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        {errors[id] && (
          <p className="text-red-500 text-sm">{errors[id]?.message}</p>
        )}
      </div>
    </div>
  );
}


    return (
    <div className="mt-10 sm:mx-auto mx-auto sm:w-full sm:max-w-2xl text-left border-b border-gray-900/10 pb-12">
      <form onSubmit={handleSubmit(onSubmit)}>
          {/* Dados de Login */}
          <div className="mt-5">
            <h3 className="text-left text-lg font-semibold text-gray-900">Login</h3>
            <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              {renderInputField('email', 'Email', 'email', 'email', 'you@example.com')}
              {renderInputField('contact', 'Contacto', 'text', 'tel-country-code', '(+258) 8XX XXX XXX')}
            </div>
          </div>
      
          {/* Dados Pessoais */}
          <div className="mt-5">
            <h3 className="text-left text-lg font-semibold text-gray-900">Dados Pessoais</h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-4">
              {renderInputField('surname', 'Apelido', 'text', 'family-name')}
              {renderInputField('name', 'Nome (sem apelido)', 'text', 'given-name')}
              {renderInputField('data_birth', 'Data de Nascimento', 'date', 'billing bday-year')}
              {renderSelectField('gender', 'Gênero', ['MASCULINO', 'FEMININO'])}
              {renderSelectField('marital', 'Estado Civil', ['SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO'])}
              {renderInputField('place_birth', 'Naturalidade', 'text', 'place_birth')}
            </div>
          </div>
      
          {/* Documentos */}
          <div className="mt-5">
            <h3 className="text-left text-lg font-semibold text-gray-900">Documentos</h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-4">
              {renderSelectField('documentType', 'Tipo de Documento', ['BI', 'PASSAPORTE'])}
              {renderInputField('documentNumber', 'Número do Documento', 'text', 'document_number')}
              {renderInputField('issueDate', 'Data de Emissão', 'date', 'issue-date', '')}
              {renderInputField('expiryDate', 'Data de Expiração', 'date', 'expiry-date')}
              {renderInputField('nuit', 'NUIT', 'text', 'nuit')}
            </div>
          </div>
      
          {/* Endereço */}
          <div className="mt-5">
            <h3 className="text-left text-lg font-semibold text-gray-900">Endereço</h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-4">
              {renderSelectField('provincyAddress', 'Província', ['MAPUTO_CIDADE', 'MAPUTO_PROVINCIA', 'GAZA', 'INHAMBANE', 'SOFALA', 'MANICA', 'TETE', 'ZAMBEZIA', 'NAMPULA', 'CABO_DELGADO', 'NIASSA'])}
              {renderInputField('address', 'Endereço', 'text', 'address')}
            </div>
          </div>
      
          {/* Informações dos Pais */}
          <div className="mt-5">
            <h3 className="text-left text-lg font-semibold text-gray-900">Informações dos Pais</h3>
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-4">
              {renderInputField('fatherName', 'Nome do Pai', 'text', 'father-name')}
              {renderInputField('motherName', 'Nome da Mãe', 'text', 'mother-name')}
            </div>
          </div>
      
          {/* Botão de Submissão */}
          <div className="mt-5">
            <button
              type="submit"
              className="mt-4 w-full py-2 px-4 bg-blue-600 text-white rounded-md"
              disabled={!isValid || Object.keys(errors).length > 0}
            >
              Enviar
            </button>
          </div>
      </form>
    </div>
    
    )
}