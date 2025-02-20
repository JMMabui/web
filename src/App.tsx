import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LoginForm } from './Login/loginForm'
import { Dashboard_Empty } from './dashboard/students/dashboard-empty'
import { Signup } from './registration/signup'
import { Dashboard_cta } from './dashboard/CTA/dashboard'
import { Pre_Instituto } from './registration/pre_institutos'
import { Inscricao } from './registration/course'
import { Invoice } from './registration/invoice'
import { DashboardLayout2 } from './dashboard/CTA/academic_record/dashboardLayout'
import { StudentProfile } from './dashboard/CTA/academic_record/student_profile'
import { Dashboard_Human_Resourses } from './dashboard/CTA/human resources/dashboard_human_resourses'
import { AddEmployee } from './dashboard/CTA/human resources/add_employee'
import { EmployeeList } from './dashboard/CTA/human resources/list_employee'
import { DashboardLayout } from './dashboard/CTA/human resources/dashboardLayout'
import { AcademicRecord } from './dashboard/CTA/academic_record/dashboard_academic_record'
import { CoursesDashboard } from './dashboard/CTA/academic_record/course_AR'
import { Enrollment_Academic_Record } from './dashboard/CTA/academic_record/registration_academic_record'
import { StudentsFiticios } from './dashboard/CTA/academic_record/student_ar'
import { TeachersFiticios } from './dashboard/CTA/academic_record/teacherFiticios'
import { Reports } from './dashboard/CTA/human resources/reports'
import { AddStudents } from './dashboard/CTA/academic_record/addStudent'
import { AddPreInstituto_addCourse } from './dashboard/CTA/academic_record/addPreInstituto_addCourse'
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

          {/* Pagina do dashboard para o departamento de registro academico */}
          <Route path="/academic_record" element={<DashboardLayout2 />}>
            <Route index element={<AcademicRecord />} />
            <Route path="dashboard" element={<AcademicRecord />} />
            <Route path="courses" element={<CoursesDashboard />} />
            <Route path="students" element={<StudentsFiticios />}>
              <Route path=":id" element={<StudentProfile />} />
              {/* <Route path="/academic_record/student_ar/add_student" element={<AddStudents />} /> */}

            </Route>
            <Route path="/academic_record/student_ar/add_student" element={<AddStudents />} /> 
            <Route path='/academic_record/student_ar/add_student/addcourse/:id' element={<AddPreInstituto_addCourse />} />
           
            <Route path="enrollment" element={<Enrollment_Academic_Record />} />
            <Route path="teachers" element={<TeachersFiticios />} />
            <Route path="documents" element={<div>Emissão de Documentos Content</div>} />
          </Route>
          
          <Route path="/student_profile/:id" element={<StudentProfile />} />
          {/* Página do dashboard para o departamento de recursos humanos */}
          <Route path="/human_resources" element={<DashboardLayout />}>
            <Route index element={<Dashboard_Human_Resourses />} />
            <Route path='dashboard' element={<Dashboard_Human_Resourses />} />
            <Route path="employee" element={<EmployeeList />} />
            <Route path="reports" element={<Reports  />} />
            <Route path="add_employee" element={<AddEmployee />} />
          </Route>
          {/* Página do dashboard */}
        </Routes>
      </Router>
    </div>
  )
}
