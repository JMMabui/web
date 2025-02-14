import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LoginForm } from './Login/loginForm'
import { Dashboard_Empty } from './dashboard/students/dashboard-empty'
import { Signup } from './registration/signup'
import { Dashboard_cta } from './dashboard/CTA/dashboard'
import { Pre_Instituto } from './registration/pre_institutos'
import { Inscricao } from './registration/course'
import { Invoice } from './registration/invoice'
import { Academic_Record } from './dashboard/CTA/academic_record/dashboard_academic_record'
// import ConfirmationPage from './ConfirmationPage'; // Sua página de confirmação ou qualquer outra

// Definição do tipo para o curso

export function App() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {/* {header_primary()} */}

      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/registration" element={<Signup />} />
          <Route
            path="/registration/pre-instituto"
            element={<Pre_Instituto />}
          />
          <Route path="/registration/course" element={<Inscricao />} />
          <Route path="/registration/resume" element={<Invoice />} />
          <Route
            path="/dashboard/dashboard-empty"
            element={<Dashboard_Empty />}
          />{' '}
          <Route path="/dashboard_cta" element={<Dashboard_cta />} />
          <Route path='/academic_record' element={<Academic_Record/>} />
          {/* Página do dashboard */}
        </Routes>
      </Router>
    </div>
  )
}

// function header_primary() {
//   return (
//     <div className="sm:mx-auto sm:w-full sm:max-w-sm">
//       <img className="mx-auto h-10 w-auto" src={logo} alt="mma school" />
//       <h1 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
//         MMA SCHOOL
//       </h1>
//       <h2 className=" text-center text-xl font-semibold tracking-tight text-gray-500">
//         Sistema de Gestao Academico
//       </h2>
//     </div>
//   )
// }
