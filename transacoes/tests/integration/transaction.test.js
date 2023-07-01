import app from '../../src/app.js'
import Transaction from '../../src/models/Transaction.js';
import request from 'supertest'
import { createClient } from '../factories/transactionFactories.js';
import mongoose from 'mongoose';

let server;

beforeAll(() => {
  server = app.listen(4000);
});

beforeEach(async () => {
  await Transaction.deleteMany();
});

afterAll(async () => {
  await server.close();
});

const cases = [
    {
        numeroCartao: '12345678901234',
        nomeCartao: 'John',
        validadeCartao: '02/2024',
        cvcCartao: '012'
    },
    {
        valor: 200,
        nomeCartao: 'John',
        validadeCartao: '02/2024',
        cvcCartao: '012'
    },
    {
        valor: 200,
        numeroCartao: '12345678901234',
        validadeCartao: '02/2024',
        cvcCartao: '012'
    },
    {
        valor: 200,
        numeroCartao: '12345678901234',
        nomeCartao: 'John',
        cvcCartao: '012'
    },
    {
        valor: 200,
        numeroCartao: '12345678901234',
        nomeCartao: 'John',
        validadeCartao: '02/2024'
    }
]

describe('POST /api/admin/transactions', () => {
  it('it shouldnt create a transaction if theres no body', async () => {
    const transaction = await request(app).post('/api/admin/transactions').send({});

    expect(transaction.status).toBe(422);
  });

  test.each(cases)('it shouldnt create a transaction if the card data isnt valid', async () => {
    const transaction = await request(app).post('/api/admin/transactions').send(cases);

    expect(transaction.status).toBe(422);
  })

  it('it should create a reproved transaction if the card data doesnt match a real data on clients database', async () => {
    const transactionData = {
      valor: 200,
      numeroCartao: '12345678901234',
      nomeCartao: 'John',
      validadeCartao: '02/2024',
      cvcCartao: '012'
    }

    const transaction = await request(app).post('/api/admin/transactions').send(transactionData);

    expect(transaction.status).toBe(400);
  })

  it('it should create an approved transaction if the card data matches a real data on clients database and its value is less than 50% of the clients income', async () => {
    const client = await createClient();

    const transactionData = {
      valor: client.dadosPessoais.rendaMensal * 0.2,
      numeroCartao: client.dadosCartao.numeroCartao,
      nomeCartao: client.dadosCartao.nomeCartao,
      validadeCartao: client.dadosCartao.validadeCartao,
      cvcCartao: client.dadosCartao.cvcCartao
    }

    const transaction = await request(app).post('/api/admin/transactions').send(transactionData);

    expect(transaction.status).toBe(201);
    expect(transaction.body).toEqual(
      expect.objectContaining({
        status: 'Aprovada',
        transactionId: expect.any(String)
    })
    );
})

it('it should create an \'under analysis\' transaction if the card data matches a real data on clients database and its value is more than or equal to 50% of the clients income', async () => {
    const client = await createClient();
    
    const transactionData = {
        valor: client.dadosPessoais.rendaMensal,
        numeroCartao: client.dadosCartao.numeroCartao,
        nomeCartao: client.dadosCartao.nomeCartao,
        validadeCartao: client.dadosCartao.validadeCartao,
        cvcCartao: client.dadosCartao.cvcCartao
    }
    
    const transaction = await request(app).post('/api/admin/transactions').send(transactionData);
    
    expect(transaction.status).toBe(303);
    expect(transaction.body).toEqual(
      expect.objectContaining({
        status: 'Em análise',
        transactionId: expect.any(String)
      })
    );
  })
})