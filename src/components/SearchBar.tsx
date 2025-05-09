interface SearchBarProps {
  searchTerm: string
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SearchBar({ searchTerm, onSearch }: SearchBarProps) {
  return (
    <div className="mb-6 flex justify-end">
      <input
        type="text"
        placeholder="Pesquisar Estudante..."
        className="w-full max-w-xs border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        value={searchTerm}
        onChange={onSearch}
      />
    </div>
  )
}
