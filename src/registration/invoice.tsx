import { getRegistration } from '@/http/registration';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import logo from '../assents/ismmalogo.png';
import jsPDF from 'jspdf';

type Registration = {
  course_id: string;
  student_id: string;
  registrationStatus: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO' | 'TRANCADO' | 'INSCRITO' | 'NAO_INSCRITO';
  student: {
    surname: string;
    name: string;
  };
  course: {
    courseName: string;
    levelCourse: 'CURTA_DURACAO' | 'TECNICO_MEDIO' | 'LICENCIATURA' | 'RELIGIOSO' | 'MESTRADO';
    period: 'LABORAL' | 'POS_LABORAL';
  };
};

type RegistrationResponse = {
  registration: Registration[];
};

export function Invoice() {
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [studentId, setStudentId] = useState<string | null>(null);

  const { data: dataRegistration, error: registrationError, isLoading } = useQuery<RegistrationResponse>({
    queryKey: ['registration_data'],
    queryFn: getRegistration,
  });

  useEffect(() => {
    setStudentId(localStorage.getItem('student_id'));
  }, []);

  if (isLoading) return <div>Carregando cursos...</div>;
  if (registrationError instanceof Error) return <div>Erro: {registrationError.message}</div>;
  if (!dataRegistration) return <div>Não há dados disponíveis no momento.</div>;

  const studentRegistration = dataRegistration.registration.find(
    (registration) => registration.student_id === studentId
  );

  if (!studentRegistration) return <div>Aluno não encontrado.</div>;

  const getPaymentDetails = () => {
    const { levelCourse, period } = studentRegistration.course;
    
    const prices = {
      LICENCIATURA: {
        LABORAL: { inscriptionFee: 1850, monthlyFee: 4500 },
        POS_LABORAL: { inscriptionFee: 1850, monthlyFee: 5200 },
      },
      TECNICO_MEDIO: {
        LABORAL: { inscriptionFee: 1600, monthlyFee: 3000 },
        POS_LABORAL: { inscriptionFee: 1500, monthlyFee: 3500 },
      },
      CURTA_DURACAO: {
        LABORAL: { inscriptionFee: 1600, monthlyFee: 2000 },
        POS_LABORAL: { inscriptionFee: 0, monthlyFee: 0 },
      },
      MESTRADO: {
        LABORAL: { inscriptionFee: 8500, monthlyFee: 10500 },
        POS_LABORAL: { inscriptionFee: 8500, monthlyFee: 10500 },
      },
    } as const;

    return prices[levelCourse as keyof typeof prices]?.[period] || { inscriptionFee: 0, monthlyFee: 0 };
  };

  const { inscriptionFee, monthlyFee } = getPaymentDetails();
  const totalPayment = inscriptionFee + monthlyFee;

  // Números das contas bancárias baseados no nível de curso e método de pagamento
  const bankAccounts = {
    LICENCIATURA: {
      transferencia: '51941267',
      deposito: '51941267',
      movel: '1234567890',
    },
    TECNICO_MEDIO: {
      transferencia: '2345-6789-01',
      deposito: '8765-4321-20',
      movel: '2345678901',
    },
    CURTA_DURACAO: {
      transferencia: '3456-7890-12',
      deposito: '7654-3210-30',
      movel: '3456789012',
    },
    MESTRADO: {
      transferencia: '519447514',
      deposito: '519447514',
      movel: '4567890123',
    },
  };

  const selectedAccount = bankAccounts[studentRegistration.course.levelCourse as keyof typeof bankAccounts]?.[paymentMethod as 'transferencia' | 'deposito' | 'movel'] || 'Método de pagamento inválido';

  function downloadInvoice() {
    if (!studentRegistration) return;
    const doc = new jsPDF();

    doc.addImage(logo, 'PNG', 14, 10, 30, 30);
    doc.setFontSize(16);
    doc.text('Resumo da Inscrição', 50, 20);
    doc.setFontSize(12);
    doc.text(`Nome: ${studentRegistration.student.name} ${studentRegistration.student.surname}`, 14, 50);
    doc.text(`Número de Estudante: ${studentRegistration.student_id}`, 14, 60);
    doc.text(`Curso: ${studentRegistration.course.courseName}`, 14, 70);
    doc.text(`Nível: ${studentRegistration.course.levelCourse}`, 14, 80);
    doc.text(`Período: ${studentRegistration.course.period}`, 14, 90);
    doc.text(`Status: ${studentRegistration.registrationStatus}`, 14, 100);
    doc.text('Método de Pagamento:', 14, 110);
    doc.text(paymentMethod, 14, 120);
    doc.text(`Inscrição & Matrícula: ${inscriptionFee} MT`, 14, 130);
    doc.text(`Mensalidade: ${monthlyFee} MT`, 14, 140);
    doc.text(`Total a depositar: ${totalPayment} MT`, 14, 150);
    doc.text(`Número da Conta: ${selectedAccount}`, 14, 160);

    doc.save('resumo_inscricao.pdf');
  }

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <div className="flex items-center justify-center space-x-4 mt-5">
        <img className="w-16 h-16" src={logo} alt="MMA School" />
        <div>
          <h1 className="text-2xl font-bold">MMA SCHOOL</h1>
          <h2 className="text-xl font-semibold text-gray-500">Sistema de Gestão Acadêmico</h2>
        </div>
      </div>

      <h2 className="text-lg font-semibold mt-4 mb-4">Resumo da Inscrição</h2>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Dados Pessoais:</h3>
        <p>Nome: {studentRegistration.student.name} {studentRegistration.student.surname}</p>
        <p>Número de Estudante: {studentRegistration.student_id}</p>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Curso:</h3>
        <p>Curso: {studentRegistration.course.courseName}</p>
        <p>Nível: {studentRegistration.course.levelCourse}</p>
        <p>Período: {studentRegistration.course.period}</p>
        <p>Status: {studentRegistration.registrationStatus}</p>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Método de Pagamento:</h3>
        <select className="block w-full p-2 rounded-md border" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="">-- Selecione um método --</option>
          <option value="transferencia">Transferência Bancária</option>
          <option value="deposito">Depósito Bancário</option>
          <option value="conta">Carteira Móvel</option>
        </select>

        <div className="mt-2 p-4 border bg-white">
          
          {paymentMethod && (
            <div>
              <p>Inscrição & Matrícula: {inscriptionFee} MT</p>
              <p>Mensalidade: {monthlyFee} MT</p>
              <p>Total a depositar: {totalPayment}</p>
              <p>Número da Conta: {selectedAccount}</p>
            </div>
          )}
        </div>
      </div>

      <button className="mt-4 p-2 bg-blue-600 text-white rounded-md" onClick={downloadInvoice}>Baixar Resumo</button>
    </div>
  );
}

