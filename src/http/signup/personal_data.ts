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
  login_id: string
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
  return response.json()
}
