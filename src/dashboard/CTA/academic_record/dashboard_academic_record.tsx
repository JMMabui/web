import { useState } from 'react';
import {
  User,
  CheckCircle,
  BookOpen,
  Clipboard,
  AlertCircle,
} from 'lucide-react'; // Ícones de exemplo
import { useQuery } from '@tanstack/react-query';
import { getRegistration } from '@/http/registration';
import { getCourses } from '@/http/courses';
import { getStudents } from '@/http/students';

type Course = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  courseName: string;
  courseDescription: string | null;
  courseDuration: number;
  levelCourse:
    | 'CURTA_DURACAO'
    | 'TECNICO_MEDIO'
    | 'LICENCIATURA'
    | 'MESTRADO'
    | 'RELIGIOSO';
  period: 'LABORAL' | 'POS_LABORAL';
  totalVacancies: number;
  availableVacancies: number | null;
};

type CourseResponse = {
  course: Course[];
};

type StudentsSchema = {
  id: string;
  surname: string;
  name: string;
  dataOfBirth: Date;
  placeOfBirth: string;
  gender: 'MASCULINO' | 'FEMININO';
  maritalStatus: 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO';
  provincyAddress:
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
    | 'NIASSA';
  address: string;
  fatherName: string;
  motherName: string;
  documentType: 'BI' | 'PASSAPORTE';
  documentNumber: string;
  documentIssuedAt: Date;
  documentExpiredAt: Date;
  nuit: number;
};

type StudentsResponse = {
  students: StudentsSchema[];
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

export function AcademicRecord() {
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLevelCourse, setSelectedLevelCourse] = useState<
    | 'CURTA_DURACAO'
    | 'TECNICO_MEDIO'
    | 'LICENCIATURA'
    | 'MESTRADO'
    | 'RELIGIOSO'
    | ''
  >('');
  const [selectedPeriod, setSelectedPeriod] = useState<'LABORAL' | 'POS_LABORAL' | ''>('');

  const { data: dataCourses, error: coursesError, isLoading: isLoadingCourse } = useQuery<CourseResponse>({
    queryKey: ['course_data'],
    queryFn: getCourses,
  });

  const { data: dataStudents, error: studentError, isLoading: isLoadingStudents } = useQuery<StudentsResponse>({
    queryKey: ['students_data'],
    queryFn: getStudents,
  });

  const { data: dataRegistration, error: errorRegistration, isLoading: isLoadingRegistration } = useQuery<RegistrationResponse>({
    queryKey: ['matricula'],
    queryFn: getRegistration,
  });

  if (isLoadingCourse || isLoadingStudents || isLoadingRegistration) return <div>Carregando...</div>;
  if (coursesError instanceof Error || studentError instanceof Error || errorRegistration instanceof Error) {
    return <div>Erro: {coursesError?.message || studentError?.message || errorRegistration?.message}</div>;
  }

  if (!dataCourses || !dataCourses.course.length || !dataStudents || !dataStudents.students.length) {
    return <div>Dados não encontrados.</div>;
  }

  const totalStudents = dataStudents.students.length;
  const studentsRegistered = dataRegistration?.registration.filter(student => student.registrationStatus === 'CONFIRMADO').length || 0;
  const studentsPending = dataRegistration?.registration.filter(student => student.registrationStatus === 'PENDENTE').length;
  const totalCourses = dataCourses.course.length;

  const totalAvailableSlots = dataCourses.course.reduce(
    (acc, course) => acc + course.totalVacancies,
    0
  );
  const totalEnrolledSlots = dataRegistration?.registration.filter(student => student.registrationStatus).length || 0;
  const availableSlots = totalAvailableSlots - totalEnrolledSlots;

  const filteredCourses = dataCourses.course.filter(
    course =>
      (selectedLevelCourse ? course.levelCourse === selectedLevelCourse : true) &&
      (selectedPeriod ? course.period === selectedPeriod : true)
  );

  const groupedByCourse = dataRegistration?.registration.reduce<Record<string, RegistrationSchema[]>>(
    (acc, student) => {
      const courseName = student.course.courseName;
      if (!acc[courseName]) acc[courseName] = [];
      acc[courseName].push(student);
      return acc;
    },
    {}
  );

  const studentsInSelectedCourse = groupedByCourse?.[selectedCourse] || [];

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Resumo do Dashboard</h2>

      {/* Cartões de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Total de Alunos', value: totalStudents, icon: <User className="text-yellow-600" /> },
          { label: 'Alunos Inscritos', value: studentsRegistered, icon: <CheckCircle className="text-green-600" /> },
          { label: 'Matrículas Pendentes', value: studentsPending, icon: <AlertCircle className="text-orange-600" /> },
          { label: 'Total de Cursos', value: totalCourses, icon: <BookOpen className="text-blue-600" /> },
          { label: 'Vagas Disponíveis', value: availableSlots, icon: <Clipboard className="text-red-600" /> },
        ].map(({ label, value, icon }, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{label}</h3>
              <p className="text-xl font-bold">{value}</p>
            </div>
            <div className="w-12 h-12">{icon}</div>
          </div>
        ))}
      </div>

      {/* Filtros de Seleção de Curso e Período */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-6">Filtros</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-lg font-medium">Nível do Curso</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={selectedLevelCourse}
              onChange={e => setSelectedLevelCourse(e.target.value as any)}
            >
              <option value="">Selecione o Nível</option>
              <option value="LICENCIATURA">Licenciatura</option>
              <option value="MESTRADO">Mestrado</option>
              <option value="CURTA_DURACAO">Curta Duração</option>
              <option value="TECNICO_MEDIO">Técnico Médio</option>
              <option value="RELIGIOSO">Religioso</option>
            </select>
          </div>

          <div>
            <label className="block text-lg font-medium mb-2">Período</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value as any)}
            >
              <option value="">Selecione o Período</option>
              <option value="LABORAL">Laboral</option>
              <option value="POS_LABORAL">Pós-Laboral</option>
            </select>
          </div>
        </div>
      </div>

      {/* Seleção de Curso */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Selecione um Curso</h3>
        <select
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
        >
          <option value="">Selecione um curso</option>
          {filteredCourses.map(course => (
            <option key={course.id} value={course.courseName}>
              {course.levelCourse} em {course.courseName} - {course.period}
            </option>
          ))}
        </select>
      </div>

      {/* Detalhes dos Alunos por Curso */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-4">Detalhes dos Alunos - {selectedCourse}</h3>
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-yellow-600 text-white">
                <th className="px-4 py-2 border border-gray-300">Nome do Aluno</th>
                <th className="px-4 py-2 border border-gray-300">Curso</th>
                <th className="px-4 py-2 border border-gray-300">Inscrição Concluída</th>
              </tr>
            </thead>
            <tbody>
              {studentsInSelectedCourse.map((student, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border border-gray-300">{student.student.name}</td>
                  <td className="px-4 py-2 border border-gray-300">{student.course.courseName}</td>
                  <td className="px-4 py-2 border border-gray-300">{student.registrationStatus === 'CONFIRMADO' ? 'Sim' : 'Não'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
