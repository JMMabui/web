import React, { useState, useMemo } from 'react'
import ReactPaginate from 'react-paginate'
import classNames from 'classnames'
import type { employeeExtended } from '@/http/employee/employee'

type Props = {
  employees: employeeExtended[]
}

export function TabelaFuncionarios({ employees }: Props) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'salary' | 'status'>('name')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(0)

  const itemsPerPage = 8

  const filtered = useMemo(() => {
    const searchLower = search.toLowerCase()
    return employees.filter(e =>
      e.user.name.toLowerCase().includes(searchLower)
    )
  }, [employees, search])

  const sorted = useMemo(() => {
    const sortedList = [...filtered].sort((a, b) => {
      const valA =
        sortBy === 'name'
          ? a.user.name
          : sortBy === 'salary'
            ? a.salary
            : a.status
      const valB =
        sortBy === 'name'
          ? b.user.name
          : sortBy === 'salary'
            ? b.salary
            : b.status
      if (typeof valA === 'string') {
        return sortDir === 'asc'
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA))
      }
      if (typeof valA === 'number') {
        return sortDir === 'asc'
          ? valA - (valB as number)
          : (valB as number) - valA
      }
      return 0
    })
    return sortedList
  }, [filtered, sortBy, sortDir])

  const pageCount = Math.ceil(sorted.length / itemsPerPage)
  const paginated = sorted.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )

  const handleSort = (column: 'name' | 'salary' | 'status') => {
    if (sortBy === column) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortDir('asc')
    }
  }

  return (
    <div className="mt-8 bg-white rounded-lg shadow p-4">
      {/* Barra de busca */}
      <input
        type="text"
        placeholder="Buscar por nome..."
        value={search}
        onChange={e => {
          setSearch(e.target.value)
          setCurrentPage(0)
        }}
        className="mb-4 p-2 border rounded w-full md:w-1/2"
      />

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700">
          <thead className="bg-gray-100 text-xs uppercase">
            <tr>
              {['name', 'department', 'status', 'salary'].map(col => (
                <th key={col} className="px-4 py-2">
                  <button
                    type="button"
                    className="w-full text-left cursor-pointer select-none flex items-center justify-between"
                    onClick={() => handleSort(col as any)}
                  >
                    {col === 'name' && 'Nome'}
                    {col === 'department' && 'Departamento'}
                    {col === 'status' && 'Status'}
                    {col === 'salary' && 'Salário'}
                    {sortBy === col && (
                      <span>{sortDir === 'asc' ? '▲' : '▼'}</span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map(emp => (
              <tr key={emp.id} className="border-t">
                <td className="px-4 py-2">
                  {emp.user.name} {emp.user.surname}
                </td>
                <td className="px-4 py-2">{emp.department}</td>
                <td className="px-4 py-2">
                  <span
                    className={classNames(
                      'px-2 py-1 rounded-full text-xs font-semibold',
                      emp.status === 'ATIVO'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    )}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {emp.salary.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {pageCount > 1 && (
        <div className="mt-4">
          <ReactPaginate
            previousLabel="←"
            nextLabel="→"
            breakLabel="..."
            pageCount={pageCount}
            onPageChange={({ selected }) => setCurrentPage(selected)}
            containerClassName="flex items-center justify-center gap-2 text-sm"
            activeClassName="font-bold text-blue-600"
            pageLinkClassName="px-2 py-1 border rounded hover:bg-blue-50"
            previousLinkClassName="px-2 py-1 border rounded"
            nextLinkClassName="px-2 py-1 border rounded"
            forcePage={currentPage}
          />
        </div>
      )}
    </div>
  )
}
