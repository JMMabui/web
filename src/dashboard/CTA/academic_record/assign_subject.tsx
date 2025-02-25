import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getTeachers } from '@/http/teacher' // Função para pegar os docentes
import { getSubjects } from '@/http/subjects' // Função para pegar as disciplinas
import {
  DeleteAllocation,
  getAllocations,
  PostAllocation,
} from '@/http/teacher_student'

type Teacher = {
  id: string
  fullName: string
  email: string
}

type Subject = {
  codigo: string
  credits: number
  disciplineName: string
  disciplineType: 'NUCLEAR' | 'COMPLEMENTAR'
  hcs: number
  semester: 'PRIMEIRO_SEMESTRE' | 'SEGUNDO_SEMESTRE'
  year_study: 'PRIMEIRO_ANO' | 'SEGUNDO_ANO' | 'TERCEIRO_ANO' | 'QUARTO_ANO'
  courseId: string
}

type Allocation = {
  id: string
  teacher_id: string
  disciplineId: string
  teacher: {
    fullName: string
    email: string
    contact: string
    profession: string
    type: 'COORDENADOR' | 'DOCENTE' | 'AUXILIAR'
  }
  discipline: {
    codigo: string
    credits: number
    disciplineName: string
    disciplineType: 'NUCLEAR' | 'COMPLEMENTAR'
    hcs: number
    semester: 'PRIMEIRO_SEMESTRE' | 'SEGUNDO_SEMESTRE'
    year_study: 'PRIMEIRO_ANO' | 'SEGUNDO_ANO' | 'TERCEIRO_ANO' | 'QUARTO_ANO'
  }
}

type subjectResponse = {
  discipline: Subject[]
}

export function Assign_subject() {
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null)
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  // Consulta para obter os docentes
  const {
    data: teachers,
    isLoading: teachersLoading,
    error: teachersError,
  } = useQuery<Teacher[] | null>({
    queryKey: ['teachers'],
    queryFn: getTeachers,
  })

  // Consulta para obter as disciplinas
  const {
    data: subjects,
    isLoading: subjectsLoading,
    error: subjectsError,
  } = useQuery<subjectResponse>({
    queryKey: ['subjects'],
    queryFn: getSubjects,
  })

  // Consulta para obter as alocações
  const {
    data: allocationsData,
    isLoading: isLoadingAllocations,
    error: errorAllocations,
  } = useQuery<Allocation[]>({
    queryKey: ['allocations'],
    queryFn: getAllocations,
  })

  // Mutação para alocar a disciplina ao docente
  const assignSubjectMutation = useMutation({
    mutationFn: async () => {
      if (selectedTeacher && selectedSubject) {
        const newAllocation = {
          teacherId: selectedTeacher.id,
          subjectCode: selectedSubject.codigo,
          teacherName: selectedTeacher.fullName,
          subjectName: selectedSubject.disciplineName,
        }

        // Chamada de API para realizar a alocação
        const allocationData = await PostAllocation({
          teacher_id: selectedTeacher.id,
          disciplineId: selectedSubject.codigo,
        })

        console.log(
          `Alocando disciplina ${selectedSubject.disciplineName} a ${selectedTeacher.fullName}`
        )
      }
    },
    onSuccess: () => {
      alert('Disciplina alocada com sucesso!')
    },
    onError: error => {
      alert(`Erro ao alocar disciplina: ${error.message}`)
    },
  })

  // Mutação para remover a alocação
  const removeAllocationMutation = useMutation({
    mutationFn: async ({
      teacher_id,
      disciplineId,
    }: { teacher_id: string; disciplineId: string }) => {
      // Chamada de API para excluir a alocação da base de dados
      const result = await DeleteAllocation({ teacher_id, disciplineId })
      if (result.success) {
        console.log(
          `Alocação removida com sucesso para o docente ${teacher_id} e disciplina ${disciplineId}`
        )
      } else {
        console.log('Erro ao remover a alocação')
      }
    },
    onSuccess: () => {
      alert('Alocação removida com sucesso!')
    },
    onError: error => {
      alert(`Erro ao remover alocação: ${error.message}`)
    },
  })

  // Função para remover a alocação
  const handleRemoveAllocation = (teacherId: string, disciplineId: string) => {
    removeAllocationMutation.mutate({ teacher_id: teacherId, disciplineId })
  }

  // Função de alocação
  const handleAssignSubject = () => {
    assignSubjectMutation.mutate()
  }

  if (teachersLoading || subjectsLoading || isLoadingAllocations)
    return <div>Carregando...</div>
  if (teachersError || subjectsError || errorAllocations)
    return <div>Erro ao carregar dados</div>

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Alocar Disciplina a Docente
      </h1>

      {/* Seleção de Docente */}
      <div className="mb-4">
        <label className="block text-lg font-medium">
          Selecione um Docente
        </label>
        <select
          onChange={e =>
            setSelectedTeacher(
              teachers?.find(teacher => teacher.id === e.target.value) || null
            )
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <option value="">Selecione um docente</option>
          {teachers?.map(teacher => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Seleção de Disciplina */}
      <div className="mb-4">
        <label className="block text-lg font-medium">
          Selecione uma Disciplina
        </label>
        <select
          onChange={e =>
            setSelectedSubject(
              subjects?.discipline.find(
                subject => subject.codigo === e.target.value
              ) || null
            )
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        >
          <option value="">Selecione uma disciplina</option>
          {subjects?.discipline.map(subject => (
            <option key={subject.codigo} value={subject.codigo}>
              {subject.disciplineName}
            </option>
          ))}
        </select>
      </div>

      {/* Botão para alocar disciplina */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          onClick={handleAssignSubject}
          disabled={!selectedTeacher || !selectedSubject}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg disabled:opacity-50"
        >
          Alocar Disciplina
        </button>
      </div>

      {/* Exibindo as alocações atuais */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Alocações Atuais</h2>
        <ul>
          {allocationsData?.map(allocation => (
            <li
              key={`${allocation?.teacher.fullName}-${allocation.discipline.disciplineName}`}
              className="mb-2"
            >
              <span>
                {allocation.teacher.fullName} -{' '}
                {allocation.discipline.disciplineName}
              </span>
              <button
                type="button"
                onClick={() =>
                  handleRemoveAllocation(
                    allocation.teacher_id,
                    allocation.disciplineId
                  )
                }
                className="ml-4 text-red-600"
              >
                Remover
              </button>
              {/* Aqui você pode adicionar lógica para trocar a disciplina */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
