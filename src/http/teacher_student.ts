type dataschema = {
  teacher_id: string
  disciplineId: string
}

const base_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333'

export async function PostAllocation({ teacher_id, disciplineId }: dataschema) {
  try {
    const response = await fetch(`${base_URL}/teacher_subject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teacher_id,
        disciplineId,
      }),
    })

    if (!response.ok) {
      // Se a resposta não for ok, captura o código de status para um erro mais detalhado
      const errorText = await response.text()
      throw new Error(`Erro ao enviar dados: ${response.status} - ${errorText}`)
    }

    const jsonResponse = await response.json()
    console.log('Resposta da API:', jsonResponse)
    return jsonResponse
  } catch (error) {
    console.error('Erro ao chamar a API:', error)
    throw error
  }
}

export async function getAllocations() {
  try {
    const response = await fetch(`${base_URL}/teacher_subject`)

    if (!response.ok) {
      // Se a resposta não for ok, captura o código de status para um erro mais detalhado
      const errorText = await response.text()
      throw new Error(`Erro ao enviar dados: ${response.status} - ${errorText}`)
    }

    const jsonResponse = await response.json()
    console.log('Resposta da API:', jsonResponse)
    return jsonResponse
  } catch (error) {
    console.error('Erro ao chamar a API:', error)
    throw error
  }
}

export async function DeleteAllocation({
  teacher_id,
  disciplineId,
}: dataschema) {
  try {
    const response = await fetch(`${base_URL}/teacher_subject`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teacher_id,
        disciplineId,
      }),
    })

    if (!response.ok) {
      // Se a resposta não for ok, captura o código de status para um erro mais detalhado
      const errorText = await response.text()
      throw new Error(`Erro ao enviar dados: ${response.status} - ${errorText}`)
    }

    const jsonResponse = await response.json()
    console.log('Resposta da API:', jsonResponse)
    return jsonResponse
  } catch (error) {
    console.error('Erro ao chamar a API:', error)
    throw error
  }
}
