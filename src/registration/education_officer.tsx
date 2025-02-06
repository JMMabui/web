export function Education_Officer() {
  return (
    <div>
      <h2 className="mt-5 text-lg font-semibold mb-6">
        Encarregado de Educação
      </h2>
      <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {/* Campos para Encarregado de Educação */}
        <div className="sm:col-span-3">
          <label
            htmlFor="education_name"
            className="block text-sm font-medium text-gray-900"
          >
            Nome Completo
          </label>
          <input
            id="education_name"
            name="education_name"
            type="text"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            placeholder="Nome do encarregado de educação"
          />
        </div>

        <div className="sm:col-span-3">
          <label
            htmlFor="profession"
            className="block text-sm font-medium text-gray-900"
          >
            Profissão
          </label>
          <input
            id="profession"
            name="profession"
            type="text"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            placeholder="Profissão do encarregado"
          />
        </div>

        <div className="sm:col-span-2">
          <label
            htmlFor="dateBirth"
            className="block text-sm font-medium text-gray-900"
          >
            Data de Nascimento
          </label>
          <input
            id="dateBirth"
            name="dateBirth"
            type="date"
            className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 outline-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
          />
        </div>
      </div>
    </div>
  )
}
