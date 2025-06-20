export function sanitizeInput(input: string): string {
  if (!input) return input

  // Remove caracteres especiais e tags HTML
  return input
    .replace(/[<>]/g, '') // Remove < e >
    .replace(/&/g, '&amp;') // Converte & para &amp;
    .replace(/"/g, '&quot;') // Converte " para &quot;
    .replace(/'/g, '&#x27;') // Converte ' para &#x27;
    .replace(/\//g, '&#x2F;') // Converte / para &#x2F;
    .trim() // Remove espaços em branco no início e fim
}
