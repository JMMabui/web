export type teacherResponse = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  email: string;
  contact: string;
  profession: string;
  type: 'DOCENTE' | 'COORDENADOR' | 'AUXILIAR';
}
const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function getTeachers(): Promise<teacherResponse[]> {
  const response = await fetch(`${base_URL}/teachers`)
  if (!response.ok) {
    throw new Error('Erro ao buscar os dados')
  }
  const data = await response.json()
  console.log('Resposta da API:', data)
  return data as teacherResponse[]
}
