
import {
  useTable,
  useSortBy,
  Column,
  TableOptions,
  Row,
} from 'react-table'

type TableProps<T extends object> = {
  columns: Column<T>[]
  data: T[]
  title?: string
  emptyMessage?: string
}

export function Table<T extends object>({
  columns,
  data,
  title = '',
  emptyMessage = 'Nenhum dado disponível.',
}: TableProps<T>) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<T>(
    {
      columns,
      data,
    } as TableOptions<T>,
    useSortBy
  )

  return (
    <div className="w-full overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
      {title && (
        <h3 className="text-lg font-semibold text-blue-700 px-4 py-2 border-b">
          {title}
        </h3>
      )}

      <table {...getTableProps()} className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(
                    // @ts-ignore
                    column.getSortByToggleProps?.()
                  )}
                  key={column.id}
                  className="px-4 py-3 text-left font-medium text-gray-600 tracking-wider"
                >
                  {column.render('Header')}
                  <span>
                    {/* @ts-ignore */}
                    {column.isSorted
                      ? (column as any).isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-100">
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-4 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row: Row<T>) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()} key={row.id} className="hover:bg-blue-50 transition">
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      key={cell.column.id}
                      className="px-4 py-2 text-gray-700"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
