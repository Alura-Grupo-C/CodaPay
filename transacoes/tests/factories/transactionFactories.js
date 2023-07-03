import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config()

const POST_CLIENT_API = process.env.NODE_ENV === 'test' ? 'http://localhost:3001/api/admin/clientes' : 'http://clientes:3001/api/admin/clientes'
const POST_TRANS_API = process.env.NODE_ENV === 'test' ? 'http://localhost:3002/api/admin/transactions' : 'http://transacoes:3002/api/admin/transactions'


export async function createClient() {
  const bodyClient = {
    dadosPessoais: {
      nome: 'John',
      cpf: '123.456.789-01',
      email: 'john@gmail.com',
      telefone: '21999999999',
      rendaMensal: 2000
  },
    endereco: {
      ruaDoEndereco: 'Rua Paris',
      numeroDoEndereco: '21',
      complementoDoEndereco: 'S/N',
      cepEndereco: '12345678',
      cidadeEndereco: 'RJ',
      estadoEndereco: 'RJ'
    },
    dadosCartao: {
      numeroCartao: '12345678901234',
      nomeCartao: 'John',
      validadeCartao: '10/2024',
      cvcCartao: '012',
      diaVencimentoFatura: '10/2023'
    }
  }

  let response = await fetch(POST_CLIENT_API, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyClient),
  })
  response = await response.json();

  return response;
}
export async function createTransaction() {
  const bodyTransaction = {
      numeroCartao: '12345678901234',
      nomeCartao: 'John',
      validadeCartao: '10/2024',
      cvcCartao: '012',
      valor:30000
    }
  

  let responseTransaction = await fetch(POST_TRANS_API, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyTransaction),
  })
  responseTransaction = await responseTransaction.json();

  return responseTransaction
}
