import { employeeSchema } from './employee'
import { employeeBankSchema } from './employeeBank'
import { employeeEducationSchema } from './employeeEducation'
import { loginSchema } from './login'
import { userSchema } from './user'

export const combinedEmployeeSchema = userSchema
  .merge(employeeSchema)
  .merge(employeeBankSchema)
  .merge(employeeEducationSchema.innerType())
  .merge(loginSchema)
