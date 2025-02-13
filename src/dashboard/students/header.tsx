import { UserCircle } from 'lucide-react'
import logo from '../../assents/ismmalogo.png'
import { useQuery } from '@tanstack/react-query'
import { getStudentData } from '@/http/signup/header'

export const Header_Secondary = () => {
  const id = localStorage.getItem('student_login_id')
  console.log('Header', id)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['header'],
    queryFn: () => getStudentData(id),
  })

  if (isLoading)
    return (
      <header className="flex justify-center items-center h-32 bg-blue-500 text-white">
        <p>Carregando...</p>
      </header>
    )
  if (isError)
    return (
      <header className="flex justify-center items-center h-32 bg-blue-500 text-white">
        <p>Ocorreu um erro ao carregar os dados.</p>
      </header>
    )

  const student = data
  const course = student?.Registration[0].course

  return (
    <header className="flex flex-col md:flex-row max-w-auto h-auto justify-between items-center p-3.5 bg-blue-500 text-white">
      <div className="flex items-center mb-4 md:mb-0">
        <img
          src={logo}
          alt="Logo do Sistema"
          className="w-16 h-16 md:w-20 md:h-20 mr-3"
        />
        <h1 className="text-center md:text-left">
          <span className="text-2xl md:text-3xl font-semibold">MMA SCHOOL</span>
          <p>
            <span className="mt-2 text-sm md:text-base font-light">
              Sistema De Gestão Integração Acadêmica
            </span>
          </p>
        </h1>
      </div>
      <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-3">
        <UserCircle className="w-16 h-16 md:w-20 md:h-20" />
        <div className="text-center md:text-right">
          <p>
            <strong>Nome: </strong>{' '}
            {student?.name
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
            ,{' '}
            {student?.surname
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </p>
          <p>
            <strong>Nº Estudante:</strong> {student?.id}
          </p>
          <p>
            <strong>Curso:</strong>{' '}
            {course ? (
              <>
                {course?.levelCourse
                  .toLowerCase()
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ') || 'Nível de curso não disponível'}{' '}
                <br />{' '}
                {course?.courseName
                  .toLowerCase()
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ') || 'Curso não disponível'}{' '}
                <br />{' '}
                {course?.period
                  .toLowerCase()
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ') || 'Período não disponível'}
              </>
            ) : (
              'Nenhum curso encontrado.'
            )}
          </p>
          <p>
            <strong>Ano:</strong> 2025
          </p>
        </div>
      </div>
    </header>
  )
}
