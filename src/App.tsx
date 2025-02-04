import logo from './assents/dark-logo.png'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LoginForm } from './Login/loginForm'
import { Dashboard_Empty } from './dashboard/dashboard-empty'
import { PreInstituto } from './registration/pre_instituto'
// import ConfirmationPage from './ConfirmationPage'; // Sua página de confirmação ou qualquer outra

// Definição do tipo para o curso

export function App() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {/* {header_primary()} */}

      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/registration" element={<PreInstituto />} />
          <Route
            path="/dashboard/dashboard-empty"
            element={<Dashboard_Empty />}
          />{' '}
          {/* Página do dashboard */}
        </Routes>
      </Router>
    </div>
  )
}

function header_primary() {
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
