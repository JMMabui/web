import { createBrowserRouter } from 'react-router-dom'
import { LandingPage } from './website/landingPage'
import { CursoTecnico } from './website/pages/cursos/tecnico'
import { Licenciatura } from './website/pages/cursos/licenciatura'
import { Mestrado } from './website/pages/cursos/mestrado'
import { CursoReligioso } from './website/pages/cursos/religioso'
import { CurtaDuracao } from './website/pages/cursos/curtaDuracao'
import { LoginForm } from './Login/loginForm'
import { LayoutStudents } from './dashboard/students/layoutStudent'
import { Signup } from './registration/signup'
import { Dashboard_cta } from './dashboard/CTA/dashboard'
import { DashboardLayout2 } from './dashboard/CTA/academic_record/dashboardLayout'
import { Dashboard_Human_Resourses } from './dashboard/CTA/human resources/dashboard_human_resourses'
import { AddEmployee } from './dashboard/CTA/human resources/add_employee'
import { EmployeeList } from './dashboard/CTA/human resources/list_employee'
import { DashboardLayout } from './dashboard/CTA/human resources/dashboardLayout'
import { AcademicRecord } from './dashboard/CTA/academic_record/dashboard_academic_record'
import { CoursesDashboard } from './dashboard/CTA/academic_record/course_AR'
import { Enrollment_Academic_Record } from './dashboard/CTA/academic_record/registration_academic_record'
import { Students_ar } from './dashboard/CTA/academic_record/student_ar'
import TeacherReports from './dashboard/Teacher/reports'
import { Reports as HRReports } from './dashboard/CTA/human resources/reports'
import { AddStudents } from './dashboard/CTA/academic_record/addStudent'
import { AddCourse } from './dashboard/CTA/academic_record/addCourse'
import { AddSubject } from './dashboard/CTA/academic_record/addSubject'
import { Classes } from './dashboard/CTA/academic_record/classes'
import { Teachers_ar } from './dashboard/CTA/academic_record/teacher_AR'
import { Diploma } from './dashboard/CTA/academic_record/documents/diploma'
import { Certificate } from './dashboard/CTA/academic_record/documents/certificado'
import { AddEnrollments } from './dashboard/CTA/academic_record/addEnrollment'
import { LayoutTeachers } from './dashboard/Teacher/layoutTeacher'
import { DashboardLayoutFinances } from './dashboard/CTA/finance/layout'
import { DashboardFinances } from './dashboard/CTA/finance/dashboard'
import { InvoicesFinances } from './dashboard/CTA/finance/invoices'
import { PaymentsFinances } from './dashboard/CTA/finance/payments'
import { FinancialReports } from './dashboard/CTA/finance/reports'
import { LateFeesManagement } from './dashboard/CTA/finance/lateFees'
import { DashboardStudents } from './dashboard/students/dashboard'
import { Assessments } from './dashboard/students/assessments'
import { MonthlyFee } from './dashboard/students/monthlyFee'
import { Enrollments } from './dashboard/students/enrollments'
import { DashboardTeachers } from './dashboard/Teacher/dashboard'
import { ClassManagement } from './dashboard/Teacher/classManagement'
import { Evaluations } from './dashboard/Teacher/evaluations'
import { AddPreInstituto_addCourse } from './dashboard/CTA/academic_record/addPreInstituto_addCourse'
import { Announcements } from './dashboard/Teacher/announcements'
import { ActivityHistory } from './dashboard/Teacher/activityHistory'
import { Attendance } from './dashboard/CTA/human resources/attendance'
import { LessonPlanning } from './dashboard/Teacher/lessonPlanning'
import { Syllabus } from './dashboard/Teacher/syllabus'
import { Recovery } from './dashboard/Teacher/recovery'
import { Competencies } from './dashboard/Teacher/competencies'
import { PerformanceAnalysis } from './dashboard/Teacher/performanceAnalysis'
import { Feedback } from './dashboard/Teacher/feedback'
import { Communication } from './dashboard/Teacher/communication'
import { Portfolio } from './dashboard/Teacher/portfolio'
import { DigitalLibrary } from './dashboard/Teacher/digitalLibrary'
import { StudentTranscript } from './dashboard/CTA/academic_record/StudentTranscript'
import { ReportCard } from './dashboard/CTA/academic_record/ReportCard'
import { StudentTransfer } from './dashboard/CTA/academic_record/StudentTransfer'
import { AttendanceControl } from './dashboard/CTA/academic_record/AttendanceControl'
import { FinancialIntegration } from './dashboard/CTA/academic_record/FinancialIntegration'
import { AcademicNotifications } from './dashboard/CTA/academic_record/AcademicNotifications'
import { AcademicRequests } from './dashboard/CTA/academic_record/AcademicRequests'
import { AcademicStatistics } from './dashboard/CTA/academic_record/AcademicStatistics'
import { ParentDashboard } from './dashboard/CTA/academic_record/ParentDashboard'
import { GradesManagement } from './dashboard/CTA/academic_record/GradesManagement'
import { Leaves } from './dashboard/CTA/human resources/leaves'
import { Performance } from './dashboard/CTA/human resources/performance'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/cursos/curta-duracao',
    element: <CurtaDuracao />,
  },
  {
    path: '/cursos/tecnico-medio',
    element: <CursoTecnico />,
  },
  {
    path: '/cursos/licenciatura',
    element: <Licenciatura />,
  },
  {
    path: '/cursos/mestrado',
    element: <Mestrado />,
  },
  {
    path: '/cursos/religioso',
    element: <CursoReligioso />,
  },
  {
    path: '/login',
    element: <LoginForm />,
  },
  {
    path: '/registration',
    element: <Signup />,
  },
  // {
  //   path: '/registration/pre-instituto',
  //   element: <Pre_Instituto />,
  // },
  // {
  //   path: '/registration/course',
  //   element: <Inscricao />,
  // },
  // {
  //   path: '/registration/resume',
  //   element: <Invoice />,
  // },
  {
    path: '/student',
    element: <LayoutStudents />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardStudents />,
      },
      {
        path: 'assessments',
        element: <Assessments />,
      },
      {
        path: 'monthly-fee',
        element: <MonthlyFee />,
      },
      {
        path: 'enrollment',
        element: <Enrollments />,
      },
    ],
  },
  {
    path: '/admin',
    element: <Dashboard_cta />,
  },
  {
    path: '/academic_record',
    element: <DashboardLayout2 />,
    children: [
      {
        path: 'dashboard',
        element: <AcademicRecord />,
      },
      {
        path: 'courses',
        element: <CoursesDashboard />,
      },
      {
        path: 'courses/add-course',
        element: <AddCourse />,
      },
      {
        path: 'courses/add-subject/:id?',
        element: <AddSubject />,
      },
      {
        path: 'courses/classes',
        element: <Classes />,
      },
      {
        path: 'students',
        element: <Students_ar />,
      },
      {
        path: 'students/new-student',
        element: <AddStudents />,
      },
      {
        path: 'student_ar/add_student/addcourse/:id',
        element: <AddPreInstituto_addCourse />,
      },
      {
        path: 'teachers',
        element: <Teachers_ar />,
      },
      {
        path: 'enrollment',
        element: <Enrollment_Academic_Record />,
      },
      {
        path: 'enrollment/relation',
        element: <AddEnrollments />,
      },
      {
        path: 'certificate',
        element: <Certificate />,
      },
      {
        path: 'diploma',
        element: <Diploma />,
      },
      {
        path: 'student-transcript',
        element: <StudentTranscript />,
      },
      {
        path: 'student-transcript/export',
        element: <StudentTranscript />,
      },
      {
        path: 'report-card',
        element: <ReportCard />,
      },
      {
        path: 'report-card/generate',
        element: <ReportCard />,
      },
      {
        path: 'student-transfer',
        element: <StudentTransfer />,
      },
      {
        path: 'attendance',
        element: <AttendanceControl />,
      },
      {
        path: 'financial',
        element: <FinancialIntegration />,
      },
      {
        path: 'notifications',
        element: <AcademicNotifications />,
      },
      {
        path: 'requests',
        element: <AcademicRequests />,
      },
      {
        path: 'statistics',
        element: <AcademicStatistics />,
      },
      {
        path: 'parent-dashboard',
        element: <ParentDashboard />,
      },
      {
        path: 'grades',
        element: <GradesManagement />,
      },
    ],
  },
  {
    path: '/human_resources',
    element: <DashboardLayout />,
    children: [
      {
        path: 'dashboard',
        element: <Dashboard_Human_Resourses />,
      },
      {
        path: 'add_employee',
        element: <AddEmployee />,
      },
      {
        path: 'list_employee',
        element: <EmployeeList />,
      },
      {
        path: 'reports',
        element: <HRReports />,
      },
      {
        path: 'attendance',
        element: <Attendance />,
      },
      {
        path: 'leaves',
        element: <Leaves />,
      },
      {
        path: 'performance',
        element: <Performance />,
      },
    ],
  },
  {
    path: '/finances',
    element: <DashboardLayoutFinances />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardFinances />,
      },
      {
        path: 'invoices',
        element: <InvoicesFinances />,
      },
      {
        path: 'payments',
        element: <PaymentsFinances />,
      },
      {
        path: 'reports',
        element: <FinancialReports />,
      },
      {
        path: 'late-fees',
        element: <LateFeesManagement />,
      },
    ],
  },
  {
    path: '/teacher',
    element: <LayoutTeachers />,
    children: [
      {
        path: 'dashboard',
        element: <DashboardTeachers />,
      },
      {
        path: 'class-management',
        element: <ClassManagement />,
      },
      {
        path: 'activity-history',
        element: <ActivityHistory />,
      },
      {
        path: 'announcements',
        element: <Announcements />,
      },
      {
        path: 'attendance',
        element: <Attendance />,
      },
      {
        path: 'lesson-planning',
        element: <LessonPlanning />,
      },
      {
        path: 'syllabus',
        element: <Syllabus />,
      },
      {
        path: 'evaluations',
        element: <Evaluations />,
      },
      {
        path: 'recovery',
        element: <Recovery />,
      },
      {
        path: 'competencies',
        element: <Competencies />,
      },
      {
        path: 'performance-analysis',
        element: <PerformanceAnalysis />,
      },
      {
        path: 'reports',
        element: <TeacherReports />,
      },
      {
        path: 'feedback',
        element: <Feedback />,
      },
      {
        path: 'communication',
        element: <Communication />,
      },
      {
        path: 'portfolio',
        element: <Portfolio />,
      },
      // {
      //   path: 'projects',
      //   element: <Projects />,
      // },
      {
        path: 'digital-library',
        element: <DigitalLibrary />,
      },
    ],
  },
])
