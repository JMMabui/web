export function EmployeeList() {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Lista de Funcionários</h2>
        <table className="w-full table-auto">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-4 text-left text-gray-600">Nome</th>
              <th className="py-2 px-4 text-left text-gray-600">Departamento</th>
              <th className="py-2 px-4 text-left text-gray-600">Cargo</th>
              <th className="py-2 px-4 text-left text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Aqui você pode mapear os dados de funcionários */}
          </tbody>
        </table>
      </div>
    );
  }
  