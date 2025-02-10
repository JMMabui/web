export async function getCourses() {
    const response = await fetch('http://localhost:3333/course')
      if (!response.ok) {
        throw new Error('Erro ao buscar os dados')
      }
      const result = await response.json()
      console.log('Resposta da API:', result) // Verificando o conteúdo da resposta
      return result
}