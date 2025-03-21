import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { LoginForm } from './Login/loginForm'
import { LayoutStudents } from './dashboard/students/layoutStudent'
import { Signup } from './registration/signup'
import { Dashboard_cta } from './dashboard/CTA/dashboard'
import { Pre_Instituto } from './registration/pre_institutos'
import { Inscricao } from './registration/course'
import { Invoice } from './registration/invoice'
import { DashboardLayout2 } from './dashboard/CTA/academic_record/dashboardLayout'
import { Dashboard_Human_Resourses } from './dashboard/CTA/human resources/dashboard_human_resourses'
import { AddEmployee } from './dashboard/CTA/human resources/add_employee'
import { EmployeeList } from './dashboard/CTA/human resources/list_employee'
import { DashboardLayout } from './dashboard/CTA/human resources/dashboardLayout'
import { AcademicRecord } from './dashboard/CTA/academic_record/dashboard_academic_record'
import { CoursesDashboard } from './dashboard/CTA/academic_record/course_AR'
import { Enrollment_Academic_Record } from './dashboard/CTA/academic_record/registration_academic_record'
import { Students_ar } from './dashboard/CTA/academic_record/student_ar'
import { Reports } from './dashboard/CTA/human resources/reports'
import { AddStudents } from './dashboard/CTA/academic_record/addStudent'
import { AddCourse } from './dashboard/CTA/academic_record/addCourse'
import { AddSubject } from './dashboard/CTA/academic_record/addSubject'
import { Classes } from './dashboard/CTA/academic_record/classes'
import { Teachers_ar } from './dashboard/CTA/academic_record/teacher_AR'
import { Diploma } from './dashboard/CTA/academic_record/documents/diploma'
import { Certificate } from './dashboard/CTA/academic_record/documents/certificado'
import { AddEnrollments } from './dashboard/CTA/academic_record/addEnrollment'
import { Teachers } from './dashboard/Teacher/dashboard'
import { DashboardLayoutFinances } from './dashboard/CTA/finance/layout'
import { DashboardFinances } from './dashboard/CTA/finance/dashboard'
import { InvoicesFinances } from './dashboard/CTA/finance/invoices'
import { PaymentsFinances } from './dashboard/CTA/finance/payments'
import { DashboardStudents } from './dashboard/students/dashboard'
import { Assessments } from './dashboard/students/assessments'
import { MonthlyFee } from './dashboard/students/monthlyFee'
import { Enrollments } from './dashboard/students/enrollments'
import { LandingPage } from './website/landingPage'
// import ConfirmationPage from './ConfirmationPage'; // Sua página de confirmação ou qualquer outra

// Definição do tipo para o curso

export function App() {
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      {/* {header_primary()} */}

      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/registration" element={<Signup />} />
          <Route
            path="/registration/pre-instituto"
            element={<Pre_Instituto />}
          />

          <Route path="/registration/course" element={<Inscricao />} />
          <Route path="/registration/resume" element={<Invoice />} />
          <Route path="/student" element={<LayoutStudents />}>
            <Route path="dashboard" element={<DashboardStudents />} />
            <Route path="assentiments" element={<Assessments />} />
            <Route path="monthly-fee" element={<MonthlyFee />} />
            <Route path="enrollment" element={<Enrollments />} />
          </Route>
          <Route path="/dashboard_cta" element={<Dashboard_cta />} />
          {/* Pagina do dashboard para o departamento de registro academico */}
          <Route path="/academic_record" element={<DashboardLayout2 />}>
            <Route path="dashboard" element={<AcademicRecord />} />
            <Route path="courses" element={<CoursesDashboard />} />
            <Route path="courses/add-course" element={<AddCourse />} />
            <Route path="courses/add-subject/:id?" element={<AddSubject />} />
            <Route path="courses/classes" element={<Classes />} />
            <Route path="students" element={<Students_ar />} />
            <Route path="students/new-student" element={<AddStudents />} />
            <Route path="teachers" element={<Teachers_ar />} />
            {/* <Route path="teachers/add-teacher" element={<AddTeacher />} /> */}
            <Route path="enrollment" element={<Enrollment_Academic_Record />} />
            <Route path="enrollment/relation" element={<AddEnrollments />} />
            {/* <Route path="documents" element={<Documents />} /> */}
            <Route path="certificate" element={<Certificate />} />
            <Route path="diploma" element={<Diploma />} />
          </Route>
          {/* Página do dashboard para o departamento de recursos humanos */}
          <Route path="/human_resources" element={<DashboardLayout />}>
            <Route index element={<Dashboard_Human_Resourses />} />
            <Route path="dashboard" element={<Dashboard_Human_Resourses />} />
            <Route path="employee" element={<EmployeeList />} />
            <Route path="reports" element={<Reports />} />
            <Route path="add_employee" element={<AddEmployee />} />
          </Route>
          <Route path="/teacher" element={<Teachers />} />
          {/* Página do dashboard */}
          {/* Pagina do dashboard para o departamento de finanças */}
          <Route path="/finances" element={<DashboardLayoutFinances />}>
            <Route path="dashboard" element={<DashboardFinances />} />
            <Route path="invoices" element={<InvoicesFinances />} />
            <Route path="payments" element={<PaymentsFinances />} />
          </Route>
        </Routes>
      </Router>
    </div>
  )
}
