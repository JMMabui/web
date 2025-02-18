import { getRegistration, getRegistrationByid } from '@/http/registration';
import { getStudent } from '@/http/students';
import { useQuery } from '@tanstack/react-query';
import { User, Info, BookOpen } from 'lucide-react';
import { useParams } from 'react-router-dom';

type Student = {
id: string;
  name: string;
  surname: string;
  address: string;
  birthDate: string;
  gender: 'MASCULINO' | 'FEMININO' | 'OUTRO';
  maritalStatus: 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO';
  fatherName: string
  motherName: string
  documentType: 'BI'| 'PASSAPORTE'
  documentNumber: string
  documentIssuedAt: Date
  documentExpiredAt: Date
  nuit: number
  login_id: string
};

type StudentResponse = {
  student: Student;
};

type RegistrationSchema = {
  course_id: string;
  student_id: string;
  id: string;
  registrationStatus:
    | 'PENDENTE'
    | 'CONFIRMADO'
    | 'CANCELADO'
    | 'TRANCADO'
    | 'INSCRITO'
    | 'NAO_INSCRITO';
  student: {
    surname: string;
    name: string;
  };
  course: {
    courseName: string;
    levelCourse:
      | 'CURTA_DURACAO'
      | 'TECNICO_MEDIO'
      | 'LICENCIATURA'
      | 'MESTRADO'
      | 'RELIGIOSO';
    period: 'LABORAL' | 'POS_LABORAL';
  };
  createdAt: Date;
  updatedAt: Date | null;
};

type RegistrationResponse = {
  registration: RegistrationSchema[];
};

export function StudentProfile() {
  const { id } = useParams<{ id: string }>(); // Pega o ID da URL
  console.log('ID do estudante:', id); // Verifique o valor do ID

  const { data: dataStudents, error: studentError, isLoading: isLoadingStudents } = useQuery<StudentResponse>({
    queryKey: ['student_data', id],
    queryFn: () => getStudent(id || ""),
  });

  const { data: dataRegistration, error: errorRegistration, isLoading: isLoadingRegistration } = useQuery<RegistrationResponse>({
    queryKey: ['matricula', id],
    queryFn: getRegistration,
  });

  console.log('Dados do estudante:', dataStudents);

  if (isLoadingStudents || isLoadingRegistration) {
    return <div>Carregando...</div>;
  }

  if (studentError) {
    console.error('Erro ao carregar os dados do estudante:', studentError);
    return <div>Erro: {studentError.message}</div>;
  }

  const studentData = dataStudents?.student; // Acessando diretamente o objeto `student`
  const registrationData = dataRegistration?.registration.find((reg) => reg.student_id === id);

  if (!studentData || !registrationData) {
    return <div>Estudante ou matrícula não encontrados</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg space-y-6">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">
        Perfil {studentData.name} {studentData.surname}
      </h2>

      {/* Informações Pessoais */}
      <div className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <User size={24} className="text-blue-500" />
          <span>Informações Pessoais</span>
        </h2>
        <p><strong>Nome:</strong> {studentData.name} {studentData.surname}</p>
        <p><strong>Data de Nascimento:</strong> {studentData.birthDate}</p>
        <p><strong>Gênero:</strong> {studentData.gender}</p>
        <p><strong>Endereço:</strong> {studentData.address}</p>
        <p><strong>Estado Civil:</strong> {studentData.maritalStatus}</p>
        <p><strong>Nome do Pai:</strong> {studentData.fatherName}</p>
        <p><strong>Nome da Mãe:</strong> {studentData.motherName}</p>
      </div>

      {/* Informações de Documentação */}
      <div className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <Info size={24} className="text-green-500" />
          <span>Informações de Documentação</span>
        </h2>
        <p><strong>Tipo de Documento:</strong> {studentData.documentType}</p>
        <p><strong>Número do Documento:</strong> {studentData.documentNumber}</p>
      </div>


      {/* Informações Acadêmicas */}
      <div className="mt-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
          <BookOpen size={24} className="text-red-500" />
          <span>Informações Acadêmicas</span>
        </h2>
        <p><strong>Curso:</strong> {registrationData.course.courseName}</p>
        <p><strong>Nível Acadêmico:</strong> {registrationData.course.levelCourse}</p>
        <p><strong>Período:</strong> {registrationData.course.period}</p>
        <p><strong>Status da Matrícula:</strong> {registrationData.registrationStatus}</p>
      </div>

      {/* Botão Voltar */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
