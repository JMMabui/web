export function Footer() {
  return (
    <footer className="p-4 text-center border-t bg-gray-100 border-gray-200">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-sm text-gray-600">
          &copy; 2025 ISMMA - Todos os direitos reservados.
        </span>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-yellow-600 transition-colors"
          >
            Termos de Uso
          </a>
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-yellow-600 transition-colors"
          >
            Política de Privacidade
          </a>
          <a
            href="#"
            className="text-sm text-gray-600 hover:text-yellow-600 transition-colors"
          >
            Suporte
          </a>
        </div>
      </div>
    </footer>
  )
}
