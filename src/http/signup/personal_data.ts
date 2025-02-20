
type dataSchema = {
  surname: string
  name: string
  dataOfBirth: Date
  placeOfBirth: string
  gender: 'MASCULINO' | 'FEMININO'
  maritalStatus: 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO'
  provincyAddress:
    | 'MAPUTO_CIDADE'
    | 'MAPUTO_PROVINCIA'
    | 'GAZA'
    | 'INHAMBANE'
    | 'MANICA'
    | 'SOFALA'
    | 'TETE'
    | 'ZAMBEZIA'
    | 'NAMPULA'
    | 'CABO_DELGADO'
    | 'NIASSA'
  address: string
  fatherName: string
  motherName: string
  documentType: 'BI' | 'PASSAPORTE'
  documentNumber: string
  documentIssuedAt: Date
  documentExpiredAt: Date
  nuit: number
  login_id: string,
}

type dataSchemaWithLogin = {
  surname: string
  name: string
  dataOfBirth: Date
  placeOfBirth: string
  gender: 'MASCULINO' | 'FEMININO'
  maritalStatus: 'SOLTEIRO' | 'CASADO' | 'DIVORCIADO' | 'VIUVO'
  provincyAddress:
    | 'MAPUTO_CIDADE'
    | 'MAPUTO_PROVINCIA'
    | 'GAZA'
    | 'INHAMBANE'
    | 'MANICA'
    | 'SOFALA'
    | 'TETE'
    | 'ZAMBEZIA'
    | 'NAMPULA'
    | 'CABO_DELGADO'
    | 'NIASSA'
  address: string
  fatherName: string
  motherName: string
  documentType: 'BI' | 'PASSAPORTE'
  documentNumber: string
  documentIssuedAt: Date
  documentExpiredAt: Date
  nuit: number
  email: string,
  contact: string,
}


export async function createStudentData({
  address,
  dataOfBirth,
  documentExpiredAt,
  documentIssuedAt,
  documentNumber,
  documentType,
  fatherName,
  gender,
  login_id,
  maritalStatus,
  motherName,
  name,
  nuit,
  placeOfBirth,
  provincyAddress,
  surname,
}: dataSchema) {
  const response = await fetch('http://localhost:3333/students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
      dataOfBirth,
      documentExpiredAt,
      documentIssuedAt,
      documentNumber,
      documentType,
      fatherName,
      gender,
      login_id,
      maritalStatus,
      motherName,
      name,
      nuit,
      placeOfBirth,
      provincyAddress,
      surname,
    }),
  })
  if (!response.ok) {
    throw new Error('Erro ao enviar dados')
  }
  const jsonResponse = await response.json()
  console.log('Resposta da API:', jsonResponse) // Verifique o que está sendo retornado
  const studentId = jsonResponse.student.id
  console.log('ID do estudante:', studentId) // Aqui você tem o id

  return studentId
}



export async function addStudentData({
  address,
  dataOfBirth,
  documentExpiredAt,
  documentIssuedAt,
  documentNumber,
  documentType,
  fatherName,
  gender,
  maritalStatus,
  motherName,
  name,
  nuit,
  placeOfBirth,
  provincyAddress,
  surname,
  email,
  contact,
}: dataSchemaWithLogin) {
  const response = await fetch('http://localhost:3333/login-students', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      address,
      dataOfBirth,
      documentExpiredAt,
      documentIssuedAt,
      documentNumber,
      documentType,
      fatherName,
      gender,
      maritalStatus,
      motherName,
      name,
      nuit,
      placeOfBirth,
      provincyAddress,
      surname,
      email,
      contact,
    }),
  })
  if (!response.ok) {
    throw new Error('Erro ao enviar dados')
  }
  const jsonResponse = await response.json()
  console.log('Resposta da API:', jsonResponse) // Verifique o que está sendo retornado
  const studentId = jsonResponse.student.id
  console.log('ID do estudante:', studentId) // Aqui você tem o id

  return jsonResponse.student
}


