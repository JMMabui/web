import * as XLSX from 'xlsx'

/**
 * Exporta dados genéricos para um arquivo Excel com formatação.
 *
 * @param data Array de objetos a serem exportados
 * @param filename Nome do arquivo de saída (com ou sem extensão .xlsx)
 * @param columns (Opcional) Mapeamento de chaves para nomes visíveis no Excel
 * @param currencyFields (Opcional) Lista de chaves para campos monetários
 */
export function exportToExcel<T extends Record<string, any>>(
  data: T[],
  filename = 'export.xlsx',
  columns?: Record<keyof T, string>,
  currencyFields: (keyof T | string)[] = []
) {
  if (!data || data.length === 0) {
    console.warn('Não há dados para exportar.')
    return
  }

  const transformedData = columns
    ? data.map(row => {
        const newRow: Record<string, any> = {}
        for (const key in columns) {
          newRow[columns[key]] = row[key]
        }
        return newRow
      })
    : data

  const worksheet = XLSX.utils.json_to_sheet(transformedData)

  // ✅ Auto largura de colunas
  const columnWidths = Object.keys(transformedData[0]).map(key => {
    const maxLength = Math.max(
      key.length,
      ...transformedData.map(row => String(row[key] ?? '').length)
    )
    return { wch: maxLength + 2 }
  })
  worksheet['!cols'] = columnWidths

  // ✅ Negrito nos cabeçalhos
  const range = XLSX.utils.decode_range(worksheet['!ref']!)
  for (let C = range.s.c; C <= range.e.c; ++C) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C })
    const cell = worksheet[cellAddress]
    if (cell) {
      cell.s = {
        font: { bold: true },
        alignment: { horizontal: 'center' },
      }
    }
  }

  // ✅ Formatar campos monetários
  const headers = Object.keys(transformedData[0])
  if (!headers || headers.length === 0) return

  for (let colIndex = 0; colIndex < headers.length; colIndex++) {
    const header = headers[colIndex]
    const originalKey = Object.entries(columns ?? {}).find(
      ([_, v]) => v === header
    )?.[0]
    const isCurrencyField =
      currencyFields.includes(header) ||
      currencyFields.includes(originalKey ?? '')

    if (isCurrencyField) {
      for (let rowIndex = 1; rowIndex <= data.length; rowIndex++) {
        const cellAddr = XLSX.utils.encode_cell({ r: rowIndex, c: colIndex })
        const cell = worksheet[cellAddr]
        if (cell) {
          const numericValue = Number.parseFloat(
            String(cell.v).replace(/[^\d.-]/g, '')
          )
          cell.v = Number.isNaN(numericValue) ? 0 : numericValue
          cell.z = '"MT"#,##0.00'
        }
      }
    }
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Dados')

  const outputName = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`
  XLSX.writeFile(workbook, outputName)
}
