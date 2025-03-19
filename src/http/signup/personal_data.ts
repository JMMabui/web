type PersonalDataSchema = {
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
  login_id: string
}

export type PersonaldataWithLoginSchema = {
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
  email: string
  contact: string
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

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
}: PersonalDataSchema) {
  console.log("enviando para api", login_id)

  const response = await fetch(`${base_URL}/students`, {
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
    // throw new Error('Erro ao enviar dados')
    const errorData = await response.json();
    console.error('Error:', errorData);
  }
  const jsonResponse = await response.json()
  console.log('Resposta da API:', jsonResponse) // Verifique o que está sendo retornado

  return jsonResponse.students
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
}: PersonaldataWithLoginSchema) {
  const response = await fetch(`${base_URL}/login-students`, {
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

  return jsonResponse
}
