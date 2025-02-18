export async function getStudents() {
    const response = await fetch('http://localhost:3333/students')
      if (!response.ok) {
        throw new Error('Erro ao buscar os dados')
      }
      const result = await response.json()
      console.log('Resposta da API:', result) // Verificando o conteúdo da resposta
      return result
}

export async function getStudent(id: string|null) {
    const response = await fetch(`http://localhost:3333/students/${id}`)
      if (!response.ok) {
        throw new Error('Erro ao buscar os dados')
      }
      const result = await response.json()
    //  console.log('Resposta da API:', result) // Verificando o conteúdo da resposta
      return result
    }