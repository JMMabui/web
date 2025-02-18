type Course = {
  courseName: string;
  courseDescription: string;
  courseDuration: number;
  levelCourse: 'CURTA_DURACAO' | 'TECNICO_MEDIO' | 'LICENCIATURA' | 'MESTRADO' | 'RELIGIOSO';
  period: 'LABORAL' | 'POS_LABORAL';
  totalVacancies: number;
  availableVacancies: number;
};

const API_URL = 'http://localhost:3333'; // Pode ser substituída com variáveis de ambiente

export async function getCourses() {
  const response = await fetch(`${API_URL}/course`);
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Erro ao buscar os dados: ${errorMessage}`);
  }
  const result = await response.json();
  console.log('Resposta da API:', result);
  return result;
}

export async function addCourse(course: Course) {
  const response = await fetch(`${API_URL}/courses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(course),
  });
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`Erro ao adicionar o curso: ${errorMessage}`);
  }
  const result = await response.json();
  console.log('Resposta da API:', result);
  return result;
}
