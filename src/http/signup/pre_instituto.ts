type dataSchema = {
  schoolLevel: 'CLASSE_10' | 'CLASSE_12' | 'LICENCIATURA'
  schoolName: string
  schoolProvincy:
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
  student_id: string
}

export async function createPreInstituto({
  schoolLevel,
  schoolName,
  schoolProvincy,
  student_id,
}: dataSchema) {
  const response = await fetch('http://localhost:3333/pre-instituto', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      schoolLevel,
      schoolName,
      schoolProvincy,
      student_id,
    }),
  })

  if (!response.ok) {
    throw new Error('Erro ao buscar os dados')
  }
  const data = await response.json()
  console.log('Resposta da API:', data)

  return data.student
}

export async function getPreInstituto() {
  const response = await fetch('http://localhost:3333/pre-instituto')
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados')
  }
  const data = await response.json()
  console.log('Resposta da API:', data)
  return data
}
