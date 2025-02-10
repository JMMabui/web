import logo from './assents/dark-logo.png'

export function header_primary() {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img className="mx-auto h-10 w-auto" src={logo} alt="mma school" />
      <h1 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
        MMA SCHOOL
      </h1>
      <h2 className=" text-center text-xl font-semibold tracking-tight text-gray-500">
        Sistema de Gestao Academico
      </h2>
    </div>
  )
}
