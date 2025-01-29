export function Personal_data() {
  return (
    <div className="mt-10 sm:mx-auto mx-auto sm:w-full sm:max-w-2xl text-left border-b border-gray-900/10 pb-12">
      <h2 className="text-left text-base font-semibold text-gray-900">
        Formulário de Inscrição
      </h2>

      {/* Dados Pessoais */}
      <div className="mt-5">
        <h3 className="text-left text-lg font-semibold text-gray-900">
          Dados Pessoais
        </h3>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-4">
          <div className="sm:col-span-2">
            <label
              htmlFor="surname"
              className="block text-sm font-medium text-gray-900"
            >
              Apelido
            </label>
            <div className="mt-2">
              <input
                id="surname"
                name="surname"
                type="text"
                autoComplete="family-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-900"
            >
              Nome (sem apelido)
            </label>
            <div className="mt-2">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="data_birth"
              className="block text-sm font-medium text-gray-900"
            >
              Data de Nascimento
            </label>
            <div className="mt-2">
              <input
                id="data_birth"
                name="data_birth"
                type="date"
                autoComplete="date"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2 sm:col-start-1">
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-900"
            >
              Gênero
            </label>
            <div className="mt-2">
              <select
                id="gender"
                name="gender"
                autoComplete="gender"
                className="w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              >
                <option value="default">-- Escolha Gênero --</option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="marital"
              className="block text-sm font-medium text-gray-900"
            >
              Estado Civil
            </label>
            <div className="mt-2">
              <select
                id="marital"
                name="marital"
                autoComplete="marital"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              >
                <option value="default">-- Selecione --</option>
                <option value="SOLTERIO">Solteiro(a)</option>
                <option value="CASADO">Casado(a)</option>
                <option value="DIVORCIADO">Divorciado(a)</option>
                <option value="VIUVO">Viúvo(a)</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="provincy-address"
              className="block text-sm font-medium text-gray-900"
            >
              Naturalidade
            </label>
            <div className="mt-2">
              <input
                id="provincy-address"
                name="provincy-address"
                type="text"
                autoComplete="provincy-address"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Documentos */}
      <div className="mt-5">
        <h3 className="text-left text-lg font-semibold text-gray-900">
          Documentos
        </h3>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-4">
          <div className="sm:col-span-2">
            <label
              htmlFor="document-type"
              className="block text-sm font-medium text-gray-900"
            >
              Tipo de Documento
            </label>
            <div className="mt-2">
              <select
                id="document-type"
                name="document-type"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              >
                <option value="BI">Bilhete de Identidade</option>
                <option value="PASSAPORTE">Passaporte</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="document-number"
              className="block text-sm font-medium text-gray-900"
            >
              Número do Documento
            </label>
            <div className="mt-2">
              <input
                id="document-number"
                name="document-number"
                type="text"
                autoComplete="document-number"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="issue-date"
              className="block text-sm font-medium text-gray-900"
            >
              Data de Emissão
            </label>
            <div className="mt-2">
              <input
                id="issue-date"
                name="issue-date"
                type="date"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="expiry-date"
              className="block text-sm font-medium text-gray-900"
            >
              Data de Expiração
            </label>
            <div className="mt-2">
              <input
                id="expiry-date"
                name="expiry-date"
                type="date"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="nuit"
              className="block text-sm font-medium text-gray-900"
            >
              NUIT
            </label>
            <div className="mt-2">
              <input
                id="nuit"
                name="nuit"
                type="text"
                autoComplete="nuit"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Endereço Atual */}
      <div className="mt-5">
        <h3 className="text-left text-lg font-semibold text-gray-900">
          Endereço Atual
        </h3>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-4">
          <div className="sm:col-span-2">
            <label
              htmlFor="provincy-address"
              className="block text-sm font-medium text-gray-900"
            >
              Província
            </label>
            <div className="mt-2">
              <select
                id="provincy-address"
                name="provincy-address"
                autoComplete="provincy-address"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              >
                <option value="MAPUTO_CIDADE">Maputo Cidade</option>
                <option value="MAPUTO_PROVINCIA">Maputo Provincia</option>
                <option value="GAZA">Gaza</option>
                <option value="INHAMBANE">Inhambane</option>
                <option value="SOFALA">Sofala</option>
                <option value="MANICA">Manica</option>
                <option value="TETE">Tete</option>
                <option value="ZAMBEZIA">Zambezia</option>
                <option value="NAMPULA">Nampula</option>
                <option value="CABO_DELGADO">Cabo Delgado</option>
                <option value="NIASSA">Niassa</option>
              </select>
            </div>
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-900"
            >
              Endereço
            </label>
            <div className="mt-2">
              <input
                id="address"
                name="address"
                type="text"
                autoComplete="address"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filiação */}
      <div className="mt-5">
        <h3 className="text-left text-lg font-semibold text-gray-900">
          Filiação
        </h3>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 mt-4">
          <div className="sm:col-span-3">
            <label
              htmlFor="father-name"
              className="block text-sm font-medium text-gray-900"
            >
              Nome do Pai
            </label>
            <div className="mt-2">
              <input
                id="father-name"
                name="father-name"
                type="text"
                autoComplete="father-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="mother-name"
              className="block text-sm font-medium text-gray-900"
            >
              Nome da Mãe
            </label>
            <div className="mt-2">
              <input
                id="mother-name"
                name="mother-name"
                type="text"
                autoComplete="mother-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
