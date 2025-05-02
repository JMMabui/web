import type {
  Announcement,
  Priority,
  Category,
} from '@/dashboard/Teacher/announcements'

// Mock data for user

export const mockUser = {
  id: '1',
  name: 'Vasco Novele',
  role: 'TEACHER',
}

// Mock data for subjects
export const mockSubjects = [
  {
    id: '1',
    subjectId: 'MAT101',
    status: 'ATIVO',
    subject: {
      subjectName: 'Matemática I',
      description: 'Introdução à matemática',
      credits: 4,
    },
  },
  {
    id: '2',
    subjectId: 'FIS101',
    status: 'ATIVO',
    subject: {
      subjectName: 'Física I',
      description: 'Introdução à física',
      credits: 4,
    },
  },
  {
    id: '3',
    subjectId: 'QUI101',
    status: 'ATIVO',
    subject: {
      subjectName: 'Química I',
      description: 'Introdução à química',
      credits: 4,
    },
  },
]

// Mock data for students
export const mockStudents = [
  {
    id: '1',
    student: {
      id: '1',
      name: 'João',
      surname: 'Silva',
      email: 'joao.silva@example.com',
    },
    status: 'INSCRITO',
    result: 'EM_ANDAMENTO',
  },
  {
    id: '2',
    student: {
      id: '2',
      name: 'Maria',
      surname: 'Santos',
      email: 'maria.santos@example.com',
    },
    status: 'INSCRITO',
    result: 'EM_ANDAMENTO',
  },
  {
    id: '3',
    student: {
      id: '3',
      name: 'Pedro',
      surname: 'Oliveira',
      email: 'pedro.oliveira@example.com',
    },
    status: 'INSCRITO',
    result: 'EM_ANDAMENTO',
  },
]

// Mock data for assessments
export const mockAssessments = [
  {
    id: '1',
    name: 'Teste 1',
    type: 'TESTE_INDIVIDUAL',
    dateApplied: '2024-03-15',
    weight: 30,
    subjectId: 'MAT101',
    results: [
      {
        studentId: '1',
        grade: 15,
      },
      {
        studentId: '2',
        grade: 18,
      },
      {
        studentId: '3',
        grade: 12,
      },
    ],
  },
  {
    id: '2',
    name: 'Trabalho 1',
    type: 'TRABALHO_GRUPO',
    dateApplied: '2024-03-20',
    weight: 20,
    subjectId: 'MAT101',
    results: [
      {
        studentId: '1',
        grade: 16,
      },
      {
        studentId: '2',
        grade: 17,
      },
      {
        studentId: '3',
        grade: 14,
      },
    ],
  },
]

// Mock data for attendance
export const mockAttendance = [
  {
    id: '1',
    subjectId: 'MAT101',
    records: [
      {
        date: '2024-03-15',
        students: [
          {
            studentId: '1',
            present: true,
            justification: null,
          },
          {
            studentId: '2',
            present: false,
            justification: 'Doente',
          },
          {
            studentId: '3',
            present: true,
            justification: null,
          },
        ],
      },
    ],
  },
]

// Mock data for announcements
export const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    titulo: 'Reunião de Pais',
    data: '2024-03-22',
    conteudo: 'Não percam a reunião de pais.',
    prioridade: 'ALTA' as Priority,
    categoria: 'REUNIAO' as Category,
    anexos: [],
  },
  {
    id: '2',
    titulo: 'Entrega de Avaliações',
    data: '2024-03-25',
    conteudo: 'Entregar as avaliações até sexta-feira.',
    prioridade: 'MEDIA' as Priority,
    categoria: 'AVALIACAO' as Category,
    anexos: [],
  },
]

// Mock data for activity history
export const mockActivityHistory = [
  {
    id: '1',
    nome: 'Avaliação 1',
    data: '2024-03-15',
    status: 'Concluída',
    tipo: 'Avaliação',
    descricao: 'Avaliação sobre o conteúdo do primeiro bimestre',
    notas: 'Média da turma: 7.5',
    observacoes: 'Bom desempenho geral da turma',
  },
  {
    id: '2',
    nome: 'Avaliação 2',
    data: '2024-03-20',
    status: 'Em andamento',
    tipo: 'Avaliação',
    descricao: 'Avaliação sobre o conteúdo do segundo bimestre',
    notas: null,
    observacoes: null,
  },
]

// Helper functions
export const getStudentById = (studentId: string) => {
  return mockStudents.find(student => student.student.id === studentId)
}

export const getSubjectById = (subjectId: string) => {
  return mockSubjects.find(subject => subject.subjectId === subjectId)
}

export const getAssessmentsBySubject = (subjectId: string) => {
  return mockAssessments.filter(
    assessment => assessment.subjectId === subjectId
  )
}

export const getStudentAttendance = (studentId: string, subjectId: string) => {
  const subject = mockAttendance.find(a => a.subjectId === subjectId)
  if (!subject) return { attendance: [], absent: 0 }

  const attendance = subject.records.map(record => ({
    date: record.date,
    present: record.students.find(s => s.studentId === studentId)?.present,
    justification: record.students.find(s => s.studentId === studentId)
      ?.justification,
  }))

  return {
    attendance,
    absent: attendance.filter(a => !a.present).length,
  }
}

export const calculateStudentAverage = (
  studentId: string,
  subjectId: string
) => {
  const assessments = getAssessmentsBySubject(subjectId)
  const totalWeight = assessments.reduce(
    (acc, assessment) => acc + assessment.weight,
    0
  )
  const weightedSum = assessments.reduce((acc, assessment) => {
    const result = assessment.results.find(
      result => result.studentId === studentId
    )
    return acc + (result?.grade || 0) * assessment.weight
  }, 0)

  return totalWeight > 0 ? weightedSum / totalWeight : 0
}
