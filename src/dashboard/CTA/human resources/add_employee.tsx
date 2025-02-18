export function AddEmployee() {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Adicionar Funcionário</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-gray-600">Nome</label>
            <input type="text" id="name" className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="department" className="block text-gray-600">Departamento</label>
            <input type="text" id="department" className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="position" className="block text-gray-600">Cargo</label>
            <input type="text" id="position" className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label htmlFor="status" className="block text-gray-600">Status</label>
            <select id="status" className="w-full p-2 border rounded-lg">
              <option>Ativo</option>
              <option>Inativo</option>
            </select>
          </div>
          <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded-md">Adicionar</button>
        </form>
      </div>
    );
  }
  