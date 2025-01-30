import React from 'react'

export function Invoice({ formData }: { formData: any }) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Resumo da Inscrição</h2>

      <div>
        <h3 className="font-semibold">Dados Pessoais:</h3>
        <pre>{JSON.stringify(formData.dadosPessoais, null, 2)}</pre>
      </div>

      <div>
        <h3 className="font-semibold">Pré-escola:</h3>
        <pre>{JSON.stringify(formData.preescola, null, 2)}</pre>
      </div>

      <div>
        <h3 className="font-semibold">Curso:</h3>
        <pre>{JSON.stringify(formData.curso, null, 2)}</pre>
      </div>

      <div>
        <h3 className="font-semibold">Método de Pagamento:</h3>
        <select className="block w-full rounded-md">
          <option value="transferencia">Transferência Bancária</option>
          <option value="dinheiro">Deposito Bancario</option>
          <option value="cartao">Pagamento com Cartão de Crédito</option>
        </select>
      </div>
    </div>
  )
}
