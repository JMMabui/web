import { useState } from 'react'

export function Invoice({ formData }: { formData: any }) {
  const [paymentMethod, setPaymentMethod] = useState<string>('')

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-4">resumo da inscrição</h2>

      {/* Dados Pessoais */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">dados pessoais:</h3>
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            {Object.entries(formData.dadosPessoais || {}).map(
              ([key, value]) => (
                <tr key={key} className="border">
                  <td className="p-2 font-medium text-gray-700">
                    {key.replace('_', ' ')}:
                  </td>
                  <td className="p-2">{String(value)}</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Pré-escola */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">pré-escola:</h3>
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            {Object.entries(formData.preescola || {}).map(([key, value]) => (
              <tr key={key} className="border">
                <td className="p-2 font-medium text-gray-700">
                  {key.replace('_', ' ')}:
                </td>
                <td className="p-2">{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Curso */}
      <div className="mb-4">
        <h3 className="font-semibold mb-2">curso:</h3>
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            {Object.entries(formData.curso || {}).map(([key, value]) => (
              <tr key={key} className="border">
                <td className="p-2 font-medium text-gray-700">
                  {key.replace('_', ' ')}:
                </td>
                <td className="p-2">{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Método de Pagamento */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">método de pagamento:</h3>
        <select
          className="block w-full p-2 rounded-md border border-gray-300"
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
        >
          <option value="">-- selecione um método --</option>
          <option value="transferencia">transferência bancária</option>
          <option value="dinheiro">depósito bancário</option>
          <option value="cartao">pagamento com cartão de crédito</option>
        </select>

        {paymentMethod && (
          <p className="mt-2 text-sm text-gray-700">
            Você escolheu: <span className="font-bold">{paymentMethod}</span>
          </p>
        )}
      </div>
    </div>
  )
}
