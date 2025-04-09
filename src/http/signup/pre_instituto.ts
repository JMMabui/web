export type PreInstitutoSchema = {
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
  studentId: string
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function createPreInstituto({
  schoolLevel,
  schoolName,
  schoolProvincy,
  studentId,
}: PreInstitutoSchema) {
  const response = await fetch(`${base_URL}/pre-instituto`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      schoolLevel,
      schoolName,
      schoolProvincy,
      studentId,
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
  const response = await fetch(`${base_URL}/pre-instituto`)
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados')
  }
  const data = await response.json()
  console.log('Resposta da API:', data)
  return data
}
