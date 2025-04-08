// src/components/Dashboard.jsx
import { useState } from 'react' // Importar useState
import { getStudentsSubjects } from '@/http/students-subjects'
import {
  getTeacherSubjectByTeacherId,
  type teacherSubjectResponse,
} from '@/http/teacherSubjects'
import { useQuery } from '@tanstack/react-query'

export function DashboardTeachers() {
  // Estado para armazenar a disciplina selecionada
  const [selectedSubject, setSelectedSubject] =
    useState<teacherSubjectResponse | null>(null)

  // Busca os dados das disciplinas do professor
  const {
    data: dataTeacherSubjects,
    isLoading: isLoadingTeacherSubject,
    error: errorTeacherSubject,
  } = useQuery({
    queryKey: ['teacherSubjects'],
    queryFn: () =>
      getTeacherSubjectByTeacherId('cc6bb5df-bc97-429a-95cd-9fa4a8dc5454'),
  })

  // Busca os dados dos alunos das disciplinas
  const {
    data: studentsSubjects,
    isLoading: isLoadingStudentsSubjects,
    error: errorStudentsSubjects,
  } = useQuery({
    queryKey: ['studentsSubjects'],
    queryFn: getStudentsSubjects,
  })

  // Verifica se está carregando os dados
  if (isLoadingTeacherSubject || isLoadingStudentsSubjects) {
    return <div>Carregando...</div>
  }

  // Verifica se ocorreu um erro ao buscar os dados
  if (errorTeacherSubject || errorStudentsSubjects) {
    return <div>Erro ao carregar os dados </div>
  }

  // Converte os dados para o tipo teacher
  const teacherSubjects = dataTeacherSubjects as teacherSubjectResponse[]

  // Para cada disciplina do professor, filtra os alunos correspondentes
  const getTotalAlunos = (disciplineId: string) => {
    return studentsSubjects?.filter(
      student => student.disciplineId === disciplineId
    )
  }

  // Função para lidar com o clique no card e exibir o resumo
  const handleCardClick = (subject: teacherSubjectResponse) => {
    setSelectedSubject(subject)
  }

  // Função para formatar o semestre e o ano de estudo
  const formatPeriodo = (yearStudy: string, semester: string) => {
    const semestreFormatado = formSemester(semester)
    const anoFormatado = formatYear(yearStudy)
    return `${anoFormatado} - ${semestreFormatado}`
  }

  const formSemester = (semester: string) => {
    switch (semester) {
      case 'PRIMEIRO_SEMESTRE':
        return '1º Semestre'
      case 'SEGUNDO_SEMESTRE':
        return '2º Semestre'
      default:
        return semester // Caso o semestre não esteja mapeado, retorna o valor original
    }
  }

  // Função para formatar o ano de estudo
  const formatYear = (yearStudy: string) => {
    switch (yearStudy) {
      case 'PRIMEIRO_ANO':
        return '1º Ano'
      case 'SEGUNDO_ANO':
        return '2º Ano'
      case 'TERCEIRO_ANO':
        return '3º Ano'
      case 'QUARTO_ANO':
        return '4º Ano'
      default:
        return yearStudy // Caso o ano não esteja mapeado, retorna o valor original
    }
  }

  return (
    <div className="p-8 w-full bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cards das turmas */}
          {teacherSubjects
            .sort((a, b) =>
              a.discipline.disciplineName.localeCompare(
                b.discipline.disciplineName
              )
            )
            .map((subject, index) => {
              const totalAlunos = getTotalAlunos(subject.discipline.codigo) // Filtra e conta os alunos dessa disciplina
              return (
                <div
                  key={index}
                  className="p-6 bg-blue-200 rounded-md shadow-md hover:bg-blue-300 transition-colors cursor-pointer"
                  onClick={() => handleCardClick(subject)} // Lida com o clique no card
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      handleCardClick(subject)
                    }
                  }}
                >
                  <h3 className="text-xl font-medium mb-2">
                    {subject.discipline.disciplineName}
                  </h3>
                  <p className="text-sm text-gray-700">
                    Estado:{' '}
                    {subject.status.charAt(0).toUpperCase() +
                      subject.status.slice(1).toLocaleLowerCase()}
                  </p>
                  <p className="text-sm text-gray-700">
                    Total de Alunos: {totalAlunos?.length}
                  </p>
                </div>
              )
            })}
        </div>

        {/* Exibir resumo da turma selecionada */}
        {selectedSubject && (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">
              {selectedSubject.discipline.disciplineName}
            </h2>
            <p className="text-lg mb-2">
              <strong>Código: </strong>
              {selectedSubject.discipline.codigo}
            </p>
            <p className="text-lg mb-2">
              <strong>Estado:</strong>{' '}
              {selectedSubject.status.charAt(0).toUpperCase() +
                selectedSubject.status.slice(1).toLocaleLowerCase()}
            </p>
            <p className="text-lg mb-2">
              <strong>Total de Alunos:</strong>{' '}
              {getTotalAlunos(selectedSubject?.discipline.codigo)?.length}
            </p>
            <p className="text-lg mb-2">
              <strong>Período:</strong>{' '}
              {formatPeriodo(
                selectedSubject.discipline.year_study,
                selectedSubject.discipline.semester
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
