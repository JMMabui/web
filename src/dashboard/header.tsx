import { UserCircle } from 'lucide-react'
import logo from '../assents/ismmalogo.png'

export const Header_Secondary = () => {
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
            <strong>Nome:</strong> Antonio Silvestre Banze
          </p>
          <p>
            <strong>Curso:</strong> Linc. Admin. Pub. e Aut.
          </p>
          <p>
            <strong>Nº Estudante:</strong> 20254567
          </p>
          <p>
            <strong>Período:</strong> Laboral
          </p>
          <p>
            <strong>Ano:</strong> 2025
          </p>
        </div>
      </div>
    </header>
  )
}
